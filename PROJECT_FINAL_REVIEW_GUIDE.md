# VIRTUALHERD+ Final Review Preparation Document

Prepared on: 2026-07-09  
Project root: D:/VIRTUALHERD_PRODUCTION

## 1. Project in One View

VirtualHerd+ is a smart livestock monitoring and virtual fencing system with:

- A Flask backend that handles cattle state, simulation, health prediction, paddock management, scheduling, persistence, and real-time events.
- A mobile app (mobile2) for operations: add/remove cattle, draw paddocks, assign cattle, view health, and schedule pasture moves.
- A web dashboard for live monitoring and visualization.
- A machine learning training script that builds and stores the behavior/health classifier artifacts.
- A CSV dataset used to initialize cattle telemetry and train ML features.

Core idea: the system simulates herd movement in a 0-100 coordinate field, checks whether cattle remain inside farmer-defined polygon fences, generates alerts on fence breach/health issues, and streams updates over WebSocket.

## 2. Repository Structure and What Matters in Viva

Top-level folders and role:

- [backend/app.py](backend/app.py): Main backend server, REST API, Socket.IO events, simulation loop, scheduler loop, DB setup.
- [backend/models/cattle.py](backend/models/cattle.py): Cattle domain model and per-cattle update methods.
- [backend/services/cattle_service.py](backend/services/cattle_service.py): Business logic layer for herd operations.
- [backend/services/data_loader.py](backend/services/data_loader.py): Dataset loading and cattle initialization from CSV.
- [backend/Phase1_ML_Training.py](backend/Phase1_ML_Training.py): Model training and artifact generation.
- [backend/requirements.txt](backend/requirements.txt): Python dependencies.
- [backend/data/combined_virtual_fencing_dataset.csv](backend/data/combined_virtual_fencing_dataset.csv): Main CSV used by backend.
- [backend/ml_models](backend/ml_models): Trained model artifacts.
- [mobile2/App.js](mobile2/App.js): Main production mobile UI and all tabs.
- [mobile2/index.js](mobile2/index.js): Expo root registration.
- [web/dashboard.html](web/dashboard.html): Browser dashboard, rendering and socket listeners.
- [run.txt](run.txt): Manual run sequence.
- [mobile/src](mobile/src): Expo starter/template code (secondary, not the production app flow).

## 3. End-to-End Architecture

### 3.1 Runtime Components

- Backend API server: Flask + Flask-SocketIO + CORS.
- Local persistence: SQLite database file virtualherd.db with paddocks, active cattle, schedules.
- Real-time transport: Socket.IO between backend and clients.
- Clients:
  - Mobile operations app on React Native Expo (mobile2).
  - Web monitoring dashboard in plain HTML/CSS/JS.
- ML model loaded at backend startup from joblib artifacts.

### 3.2 Data Flow

1. Backend starts, initializes DB schema, migrates schedules table, restores active cattle IDs from DB.
2. Backend loads dataset and list of unique cow IDs.
3. Mobile user adds cattle by ID.
4. Backend creates Cattle object using first matching CSV row.
5. Simulation loop updates position + vitals every second.
6. Backend predicts health status (ML model or fallback rules).
7. Fence logic checks point-in-polygon and creates breach alerts.
8. Backend emits cattle_update and alert events by Socket.IO.
9. Mobile and web clients redraw UI from incoming state.
10. Scheduler loop checks due schedules every 2 seconds and moves herd to target paddock.

## 4. Backend Deep Explanation (Line-by-Line Style by Function Block)

Primary file: [backend/app.py](backend/app.py)

### 4.1 Startup and Global State

- Imports Flask, SocketIO, CORS, threading/time, sqlite3/json/math/random, datetime, services, joblib, numpy, Path.
- Creates Flask app and SocketIO object.
- Creates global service instances:
  - cattle_service from service singleton.
  - data_loader from loader singleton.
- Tries loading ML artifacts from backend/ml_models:
  - behavior_classifier.pkl
  - label_encoder.pkl
  - feature_list.pkl
- If loading fails, system switches to rule-based prediction fallback.
- Global simulation variables:
  - simulation_running
  - simulation_thread
  - training_day
  - alerts list

### 4.2 Database Layer in app.py

DB path is virtualherd.db.

Functions:

- get_db()
  - Creates sqlite connection.
  - Sets row_factory to sqlite3.Row for dict-like rows.

- init_db()
  - Creates tables if not existing:
    - farmer_paddocks
    - active_cattle
    - schedules
  - Uses TEXT columns for JSON-like fields (points, cattle_ids).
  - Commits and closes.

- migrate_db()
  - Adds activated column to schedules if missing.
  - Uses try/except on OperationalError so migration is idempotent.

- restore_cattle()
  - Reads active_cattle table and re-adds each cattle ID into in-memory service.

Important viva point: DB stores only identifiers and paddock/schedule state. Live telemetry is in memory and recalculated in simulation.

### 4.3 Geometry and Fence Utilities

Functions:

- point_in_polygon(x, y, polygon)
  - Uses ray casting algorithm.
  - If polygon has fewer than 3 points, returns True (no enforced boundary).

- get_polygon_center(polygon)
  - Computes centroid by averaging x/y points.

- random_point_in_polygon(polygon)
  - Samples random points in polygon bounding box.
  - Returns first valid point up to max_tries.
  - Falls back to polygon center.

- get_active_paddock()
  - Prefers occupied paddock with valid polygon.
  - If none, picks any paddock with valid polygon.

### 4.4 ML Prediction Section

Functions:

- predict_health_status(cattle_obj)
  - If no model loaded, delegates to fallback rules.
  - Builds numeric feature vector from cattle attributes.
  - Pads or truncates to 45 features.
  - Predicts class and probabilities.
  - Decodes class with label encoder and returns status + confidence.
  - On exception, falls back to rules.

- predict_health_rule_based(cattle_obj)
  - temp > 39.5 => FEVER
  - heart rate > 100 => STRESS
  - temp < 37.5 => HYPOTHERMIA
  - else HEALTHY

Viva note: The app status endpoint claims ensemble model metadata, but training script currently trains RandomForestClassifier. Mention this as known mismatch and roadmap item.

### 4.5 Cattle REST API

- GET /api/cattle
  - Returns cattle list, count, training_day, timestamp.

- GET /api/cattle/<id>
  - Returns one cattle dict or 404.

- POST /api/cattle
  - Requires cattle_id in JSON.
  - Adds cattle via service.
  - Spawns inside active paddock 80% of time, outside 20% intentionally (for breach demo).
  - Predicts health, then forces FENCE_BREACH if spawned outside.
  - Inserts into active_cattle table.
  - Emits cattle_added socket event.

- DELETE /api/cattle/<id>
  - Removes from service and DB active_cattle.
  - Emits cattle_removed.

- GET /api/cattle/available
  - Returns IDs available in dataset but not currently active in memory.

### 4.6 Health and Alerts API

- GET /api/health
  - Returns herd health summary from service.
  - Adds alerts count and last 10 global alerts.
  - Includes model_accuracy string depending on model load state.

- GET /api/alerts
  - Returns current service alerts.

### 4.7 Farmer Paddock API

- GET /api/farmer/paddocks
  - Reads all paddocks and JSON-decodes points/cattle_ids.

- POST /api/farmer/paddocks
  - Generates ID FP<count+1>.
  - Saves paddock name + points.
  - Default status available, grass_quality 80.
  - Emits paddock_created.

- POST /api/farmer/paddocks/<id>/assign
  - Replaces paddock cattle_ids.
  - Sets status occupied if any cattle assigned, else available.
  - Emits paddock_updated.

- DELETE /api/farmer/paddocks/<id>
  - Deletes paddock.
  - Emits paddock_deleted.

### 4.8 Schedule API

- GET /api/farmer/schedules
  - Returns all schedules sorted by start_time.

- POST /api/farmer/schedules
  - Generates ID SCH<count+1>.
  - Stores paddock target, cattle list, start/end, notes.
  - activated defaults to 0.
  - Emits schedule_created.

- DELETE /api/farmer/schedules/<id>
  - Deletes schedule and emits schedule_deleted.

### 4.9 System Status and Metadata API

- GET /api/status
  - Returns server/simulation state, cattle counts, paddock count, alerts, training day, and model metadata block.

- GET /api/ml/info
  - Returns model summary metadata.

- GET /api/dataset
  - Returns loader summary + ml_features_used.

### 4.10 Socket.IO Events in app.py

Server receives:

- start_simulation
- stop_simulation

Server emits:

- response
- simulation_status
- cattle_update
- fence_breach
- cattle_added
- cattle_removed
- paddock_created
- paddock_updated
- paddock_deleted
- schedule_created
- schedule_deleted
- schedule_activated

### 4.11 Simulation Loop Logic

Function: simulation_loop()

Per second cycle:

1. Increments step.
2. Gets active paddock polygon.
3. For each cattle:
  - Randomly perturbs heading.
  - If already outside polygon:
    - Reorients toward centroid.
    - Moves with damped speed.
    - If still outside, emits critical FENCE_BREACH alert and sets status.
  - Else normal move attempt:
    - Computes next x/y.
    - If next step crosses boundary, redirect heading and create breach alert.
    - Else commit move.
  - Updates vitals with bounded random variation.
  - If not fence breach, updates health status by ML/rules.
4. Emits cattle_update with merged alerts.
5. Emits fence_breach event if any breaches happened in this tick.
6. Sleeps 1 second.

### 4.12 Schedule Checker Loop Logic

Function: schedule_checker_loop()

Every 2 seconds:

1. Selects due schedules where activated=0 and start_time <= now.
2. For each due schedule:
  - Clears cattle assignments in all non-target paddocks.
  - Assigns target paddock either:
    - scheduled cattle IDs, or
    - all currently active cattle if schedule list empty.
  - Marks schedule activated=1.
  - Emits schedule_activated and paddock_updated.
3. Sleeps 2 seconds.

### 4.13 Error Handlers and Main

- 404 and 500 return JSON errors.
- Main block prints startup capability summary.
- Starts schedule checker daemon thread.
- Runs SocketIO server at 0.0.0.0:5000.

## 5. Domain Model Explanation

File: [backend/models/cattle.py](backend/models/cattle.py)

Class Cattle:

- __init__(cattle_id, csv_row=None)
  - Initializes identity, random position/heading/speed.
  - Sets behavior/confidence placeholder.
  - If csv_row present, maps temperature, heart rate, heat stress, milk, pulse/sound metrics.
  - Sets status fields (health_status, lameness, lying, etc).
  - Sets timestamps.

- update_position()
  - Adds random heading variation.
  - Computes new x/y via cosine/sine.
  - Constrains movement to map bounds and reflects direction at edges.

- update_health()
  - Applies random bounded drift to temperature, heart rate, milk.
  - Sets status by simple thresholds + random lameness chance.
  - Randomly toggles lying state at small probability.
  - Updates last_updated timestamp.

- to_dict()
  - Formats all exposed fields for API responses.
  - Rounds numeric outputs for UI readability.

## 6. Service Layer Explanation

File: [backend/services/cattle_service.py](backend/services/cattle_service.py)

Class CattleService:

- Maintains thread-safe in-memory dictionary of cattle with lock.
- add_cattle(cattle_id)
  - Rejects duplicates.
  - Creates cattle from DataLoader CSV row.
- remove_cattle(cattle_id)
  - Deletes from dict.
- get_cattle / get_all_cattle / get_cattle_count / get_all_cattle_dict
  - Retrieval helpers.
- update_all_cattle()
  - Calls per-cattle movement and health updates.
- get_cattle_list_for_api()
  - Converts all objects to JSON-safe dict list.
- get_available_cattle_ids()
  - Dataset IDs minus currently active IDs.
- get_health_summary()
  - Aggregates counts by health buckets.
- get_alerts()
  - Generates alert list from non-healthy cattle.

Singleton provider:

- get_cattle_service() returns one shared service instance.

File: [backend/services/data_loader.py](backend/services/data_loader.py)

Class DataLoader:

- __init__(csv_path=None)
  - Defaults to backend/data/combined_virtual_fencing_dataset.csv.
- load_csv()
  - Reads CSV into pandas DataFrame.
- get_unique_cows()
  - Extracts and sorts unique training_cow_id values.
- get_cow_data(cow_id)
  - Returns first matching row as dict.
- create_cattle_from_csv(cattle_id)
  - Creates Cattle object with row data.
- initialize_cattle_dict(cattle_ids)
  - Batch creates Cattle objects.
- get_available_cows()
  - Returns unique IDs.
- get_dataset_summary()
  - Returns rows, unique cows, columns, date range.

Singleton provider:

- get_data_loader() lazily initializes loader, loads CSV, precomputes unique cows.

## 7. ML Training Pipeline Explanation

File: [backend/Phase1_ML_Training.py](backend/Phase1_ML_Training.py)

Training flow:

1. Loads CSV at backend/data/combined_virtual_fencing_dataset.csv.
2. Defines behavior classes list.
3. create_features(row):
  - Reads telemetry and training columns.
  - Derives engineered features like temp deviation, stress ratios, interactions.
4. assign_behavior(row):
  - Rule-based pseudo-label assignment using thresholds on HR/temp/activity/milk.
5. Builds X, y arrays over all rows.
6. Label-encodes behavior labels.
7. Splits train/test with stratification (80/20, random_state 42).
8. Trains RandomForestClassifier with:
  - n_estimators 200
  - max_depth 15
  - min_samples_split 5
  - min_samples_leaf 2
  - n_jobs -1
9. Evaluates train and test accuracy.
10. Prints classification report and top feature importances.
11. Saves artifacts to backend/ml_models:
  - behavior_classifier.pkl
  - label_encoder.pkl
  - feature_list.pkl

Important viva points:

- Pseudo-labeling approach is heuristic, not fully human-annotated ground truth.
- Excellent reported accuracy may reflect label generation rules matching model inputs closely.
- Risk of leakage/overfitting should be discussed honestly.

## 8. Dataset Explanation

Main CSV: [backend/data/combined_virtual_fencing_dataset.csv](backend/data/combined_virtual_fencing_dataset.csv)

Observed line count: 96703 total lines (header + 96702 data rows).  
Therefore training_samples in status endpoint (96702) aligns with dataset size.

Column families visible in header:

- collars_*: collar sensor telemetry (battery, humidity, pressure, temperature, GPS quality, fence status, mode, activity).
- gps_*: GPS timestamp, cattle ID, location and activity fields.
- training_*: experiment/training features (cow id, period, day, milk, paddock pulse/sound, transition metrics, speed, etc).
- health_*: physiological variables (heat stress, skin temperature, heart rate).

Duplicated dataset location also exists:

- [HUMAN LESS FARMING PROJECT DATASETS/combined_virtual_fencing_dataset.csv](HUMAN%20LESS%20FARMING%20PROJECT%20DATASETS/combined_virtual_fencing_dataset.csv)

Research references in same folder:

- [HUMAN LESS FARMING PROJECT DATASETS/PIIS0022030224007616-Halter Project.pdf](HUMAN%20LESS%20FARMING%20PROJECT%20DATASETS/PIIS0022030224007616-Halter%20Project.pdf)
- [HUMAN LESS FARMING PROJECT DATASETS/US11937578-Halter Project Patent.pdf](HUMAN%20LESS%20FARMING%20PROJECT%20DATASETS/US11937578-Halter%20Project%20Patent.pdf)

## 9. Mobile2 App Explanation (Production Mobile App)

Primary file: [mobile2/App.js](mobile2/App.js)

High-level design:

- Single-file React Native app with multiple in-app tabs controlled by local state.
- Uses axios for REST and socket.io-client for real-time updates.
- Uses hardcoded backend URL currently set to local LAN IP.

Top-level pieces:

- Constants:
  - BACKEND URL and color system C.
- Utility:
  - healthColor(status): maps status strings to UI color.

UI tab components:

- MapTab
  - Draws active paddock fence lines and cattle markers in normalized map view.
  - Shows live status and simulation toggle.
  - Displays legend.

- CattleTab
  - Displays active herd list.
  - Search and add from available dataset IDs.
  - Remove cattle action.

- DrawFenceTab
  - Interactive tap-based fence point collection on grid.
  - Saves paddock with name.
  - Optional scheduling using date-time input.
  - Assign cattle modal for a paddock.
  - Delete paddock action.

- PaddocksTab
  - Summarizes paddock status, counts, assigned cattle chips.

- ScheduleTab
  - Read-only schedule list with ACTIVE/DONE/PENDING tags.

- HealthTab
  - Card view for each cattle with vitals and status color coding.

Main App component responsibilities:

- Holds global state:
  - activeTab, cattle dictionary, available IDs, paddocks, schedules, connection, loading, simulation state.
- Opens socket connection on mount.
- Registers listeners for:
  - connect/disconnect
  - cattle_update
  - cattle_added / cattle_removed
  - paddock and schedule lifecycle events
  - simulation_status
- Fetch functions:
  - fetchCattle
  - fetchAvailable
  - fetchFarmerPaddocks
  - fetchSchedules
- Actions:
  - handleAdd
  - handleRemove
  - toggleSim
- Renders tab bar and selected tab panel.

Styling section:

- Uses StyleSheet with dark farming dashboard style and color-coded statuses.

## 10. Web Dashboard Explanation

File: [web/dashboard.html](web/dashboard.html)

Structure:

- HTML shell with header, tab navigation, and 4 tab content regions.
- Embedded CSS for dark dashboard theme.
- Embedded JavaScript for rendering and socket integration.

Key JavaScript modules in file:

- State variables: cattle, alerts, paddocksData, scheduleData.
- Canvas renderer:
  - resizeCanvas()
  - draw() animation loop
  - getCattleColor(c)
- UI update functions:
  - updateMapUI()
  - updateHealthTab()
  - updatePaddocksTab()
  - updateScheduleTab()
  - updateAllUI()
- Data fetchers:
  - fetchPaddocks()
  - fetchSchedule()
- Socket handlers:
  - connect/disconnect
  - cattle_update
  - cattle_added/cattle_removed
  - paddock and schedule update events
- Initial API load for cattle and 30-second safety polling for paddocks/schedule.

## 11. Mobile Template Folder Explanation (Secondary)

Folder: [mobile/src](mobile/src)

This appears to be Expo starter/template app, separate from production mobile2 flow.

Important files:

- [mobile/src/app/_layout.tsx](mobile/src/app/_layout.tsx): theme provider + splash overlay + tabs.
- [mobile/src/app/index.tsx](mobile/src/app/index.tsx): starter home page and hints.
- [mobile/src/app/explore.tsx](mobile/src/app/explore.tsx): starter educational examples.
- [mobile/src/components/app-tabs.tsx](mobile/src/components/app-tabs.tsx): native tabs configuration.
- [mobile/src/components/app-tabs.web.tsx](mobile/src/components/app-tabs.web.tsx): web tabs variant.
- [mobile/src/components/animated-icon.tsx](mobile/src/components/animated-icon.tsx): splash/logo animations.
- [mobile/src/components/ui/collapsible.tsx](mobile/src/components/ui/collapsible.tsx): expandable hint component.
- [mobile/src/constants/theme.ts](mobile/src/constants/theme.ts): color/font/spacing tokens.
- [mobile/src/hooks/use-theme.ts](mobile/src/hooks/use-theme.ts): returns active theme.
- [mobile/src/hooks/use-color-scheme.ts](mobile/src/hooks/use-color-scheme.ts): native scheme passthrough.
- [mobile/src/hooks/use-color-scheme.web.ts](mobile/src/hooks/use-color-scheme.web.ts): hydration-safe web scheme hook.

Viva suggestion: clarify that mobile2 is the operational app for this project demo, while mobile appears to be template/starter code kept in repo.

## 12. API Catalog for Quick Revision

Base URL example: http://localhost:5000

Cattle:

- GET /api/cattle
- POST /api/cattle
- GET /api/cattle/<id>
- DELETE /api/cattle/<id>
- GET /api/cattle/available

Health and alerts:

- GET /api/health
- GET /api/alerts

Paddocks:

- GET /api/farmer/paddocks
- POST /api/farmer/paddocks
- POST /api/farmer/paddocks/<id>/assign
- DELETE /api/farmer/paddocks/<id>

Schedules:

- GET /api/farmer/schedules
- POST /api/farmer/schedules
- DELETE /api/farmer/schedules/<id>

System metadata:

- GET /api/status
- GET /api/ml/info
- GET /api/dataset

## 13. Database Schema for Review

Database: virtualherd.db

Table farmer_paddocks:

- id TEXT PRIMARY KEY
- name TEXT
- points TEXT (JSON array)
- cattle_ids TEXT (JSON array)
- status TEXT
- grass_quality INTEGER
- created TEXT

Table active_cattle:

- cattle_id INTEGER PRIMARY KEY
- added_at TEXT

Table schedules:

- id TEXT PRIMARY KEY
- paddock_id TEXT
- paddock_name TEXT
- cattle_ids TEXT (JSON array)
- start_time TEXT
- end_time TEXT
- notes TEXT
- created TEXT
- activated INTEGER (migration-added)

## 14. ML Artifacts Present in Repo

Directory: [backend/ml_models](backend/ml_models)

- behavior_classifier.pkl (about 2.0 MB)
- feature_list.pkl
- label_encoder.pkl

These are loaded at backend startup.

## 15. Exact Run Procedure (from project file)

Reference: [run.txt](run.txt)

1. Start backend:
  - cd D:/VIRTUALHERD_PRODUCTION/backend
  - venv/Scripts/activate
  - python app.py
2. Start web dashboard static server:
  - cd D:/VIRTUALHERD_PRODUCTION/web
  - python -m http.server 8080
3. Start mobile app:
  - cd D:/VIRTUALHERD_PRODUCTION/mobile2
  - npx expo start
4. Open web:
  - http://localhost:8080/dashboard.html
5. Optional test add cattle:
  - curl POST to /api/cattle with cattle_id JSON.

## 16. Potential Reviewer Questions and Strong Answers

### 16.1 Architecture and Design

1. Why did you use Socket.IO along with REST?
- REST is used for CRUD operations (add/remove cattle, create paddock, create schedule).
- Socket.IO is used for live telemetry stream and event-driven updates (simulation ticks, alerts, schedule activations).
- This separation keeps writes explicit and reads reactive.

2. Why SQLite for this project?
- Lightweight, zero-configuration, perfect for local demo and internship prototype.
- Persists core entities (paddocks, active cattle IDs, schedules) across restarts.
- Can be migrated to PostgreSQL later with repository/service abstraction.

3. How is concurrency handled?
- CattleService uses threading.Lock for safe access to in-memory cattle dictionary.
- Background threads run simulation and schedule checker.
- DB operations use short-lived sqlite connections.

### 16.2 Algorithm and Logic

4. How does fence breach detection work?
- Point-in-polygon ray casting checks if cattle position is inside paddock polygon.
- If outside, system redirects heading toward centroid and generates FENCE_BREACH alert until re-entry.

5. Why normalized map coordinates 0-100?
- UI-independent coordinate system.
- Easy to project to any screen/canvas size by scaling.
- Keeps logic simple across mobile and web.

6. How do schedules activate?
- schedule_checker_loop polls every 2 seconds.
- If start_time <= now and activated=0, target paddock gets assigned herd and schedule marked activated.

### 16.3 ML and Data

7. What model is currently trained?
- Current training script trains RandomForestClassifier and stores model artifacts in backend/ml_models.

8. Why does backend status mention Ensemble?
- Metadata string in app.py currently says Ensemble for intended roadmap.
- Actual loaded artifact appears RandomForest from Phase1 script.
- This is a known consistency issue and should be aligned.

9. How are labels generated?
- Labels are pseudo-labeled by rule thresholds in assign_behavior, then used for supervised training.
- This enables quick prototype but must be improved with expert-annotated labels for production.

10. What is dataset size?
- 96,703 total lines including header, therefore 96,702 samples.

### 16.4 Product and Improvement

11. What are current limitations?
- Hardcoded backend IP in mobile2.
- Health status naming mismatch risk between lowercase and uppercase statuses.
- Polling scheduler and simulation loops are simple and not distributed.
- Minimal auth/security around API and socket.

12. If you had 2 more weeks, what would you do?
- Centralize status enums and validate schema at API boundary.
- Move config to env variables.
- Add automated tests for geometry, scheduling, API, and socket events.
- Add model versioning and calibration metrics.
- Add proper auth and role-based access.

## 17. High-Value Risks You Should Mention Proactively

1. Status naming mismatch risk:
- CattleService health summary checks lowercase keys (healthy, fever, stressed), while ML path can assign uppercase statuses (HEALTHY, FEVER, STRESS, HYPOTHERMIA).
- This can affect aggregate counts.

2. Model metadata inconsistency:
- App status says Ensemble while training script uses RandomForest.

3. Hardcoded backend endpoint in mobile2:
- BACKEND uses local LAN IP, which may fail on other networks.

Mentioning these shows engineering maturity in review.

## 18. Quick 5-Minute Review Pitch Script

Use this structure during final review:

1. Problem
- Farmers need low-cost, real-time herd and boundary monitoring.

2. Solution
- VirtualHerd+ combines telemetry-driven cattle simulation, geofence breach detection, and real-time monitoring on mobile/web.

3. Backend
- Flask + Socket.IO + SQLite.
- Core modules: app.py, cattle_service.py, data_loader.py, cattle.py.

4. Intelligence
- ML model trained from 96k+ records.
- Fallback rule engine for resilience.

5. Features
- Add/remove cattle from dataset IDs.
- Draw custom polygon paddocks.
- Assign herd to paddocks.
- Schedule timed herd movement.
- Real-time alerts and health dashboard.

6. Impact
- Demonstrates practical architecture for smart, human-less farming monitoring.

## 19. File-by-File Checklist (What to Read Before Viva)

Must-read first:

- [backend/app.py](backend/app.py)
- [backend/services/cattle_service.py](backend/services/cattle_service.py)
- [backend/services/data_loader.py](backend/services/data_loader.py)
- [backend/models/cattle.py](backend/models/cattle.py)
- [backend/Phase1_ML_Training.py](backend/Phase1_ML_Training.py)
- [mobile2/App.js](mobile2/App.js)
- [web/dashboard.html](web/dashboard.html)

Then read quickly:

- [run.txt](run.txt)
- [backend/requirements.txt](backend/requirements.txt)
- [mobile2/package.json](mobile2/package.json)
- [mobile/package.json](mobile/package.json)
- [mobile/src/constants/theme.ts](mobile/src/constants/theme.ts)

## 20. Final Advice for Your Review Day

- Draw architecture first, then show live demo.
- Explain one complete flow: add cattle -> simulation -> breach alert -> schedule activation.
- Be transparent about known mismatches and how you will fix them.
- Keep answers structured: design choice, reason, trade-off, improvement.

You now have enough technical depth to handle architecture, code-level, and ML/data questions confidently.
