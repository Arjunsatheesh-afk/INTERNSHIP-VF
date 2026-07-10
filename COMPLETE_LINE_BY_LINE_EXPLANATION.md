# Complete Line-by-Line Code Explanation

Generated on: 2026-07-09

Scope: This document covers all major source files used by backend, mobile2, web dashboard, and mobile template code. For each file, every line is listed with a direct explanation so no line is skipped.

## File: backend\app.py

| Line | Code | Explanation |
|---:|---|---|
| 1 | """ | Implements file-specific logic, configuration, or structure in this context. |
| 2 | VIRTUALHERD+ BACKEND - PRODUCTION VERSION WITH SQLITE + FENCE BREACH DETECTION + SCHEDULING | Implements file-specific logic, configuration, or structure in this context. |
| 3 | """ | Implements file-specific logic, configuration, or structure in this context. |
| 4 | (blank) | Blank line for readability and section separation. |
| 5 | from flask import Flask, jsonify, request | Imports specific symbol(s) from another module. |
| 6 | from flask_socketio import SocketIO | Imports specific symbol(s) from another module. |
| 7 | from flask_cors import CORS | Imports specific symbol(s) from another module. |
| 8 | import threading | Imports a dependency/module needed in this file. |
| 9 | import time | Imports a dependency/module needed in this file. |
| 10 | import sqlite3 | Imports a dependency/module needed in this file. |
| 11 | import json | Imports a dependency/module needed in this file. |
| 12 | import math | Imports a dependency/module needed in this file. |
| 13 | import random | Imports a dependency/module needed in this file. |
| 14 | from datetime import datetime | Imports specific symbol(s) from another module. |
| 15 | from services.cattle_service import get_cattle_service | Imports specific symbol(s) from another module. |
| 16 | from services.data_loader import get_data_loader | Imports specific symbol(s) from another module. |
| 17 | import joblib | Imports a dependency/module needed in this file. |
| 18 | from pathlib import Path | Imports specific symbol(s) from another module. |
| 19 | import numpy as np | Imports a dependency/module needed in this file. |
| 20 | (blank) | Blank line for readability and section separation. |
| 21 | app = Flask(__name__) | Implements file-specific logic, configuration, or structure in this context. |
| 22 | app.config['SECRET_KEY'] = 'virtualherd-secret-key-2024' | Implements file-specific logic, configuration, or structure in this context. |
| 23 | socketio = SocketIO(app, cors_allowed_origins="*") | Implements file-specific logic, configuration, or structure in this context. |
| 24 | CORS(app) | Implements file-specific logic, configuration, or structure in this context. |
| 25 | (blank) | Blank line for readability and section separation. |
| 26 | cattle_service = get_cattle_service() | Implements file-specific logic, configuration, or structure in this context. |
| 27 | data_loader = get_data_loader() | Implements file-specific logic, configuration, or structure in this context. |
| 28 | (blank) | Blank line for readability and section separation. |
| 29 | ml_models_dir = Path('ml_models') | Implements file-specific logic, configuration, or structure in this context. |
| 30 | try: | Starts protected block for exception handling. |
| 31 |     health_model = joblib.load(ml_models_dir / 'behavior_classifier.pkl') | Loads or saves serialized ML artifact with joblib. |
| 32 |     health_label_encoder = joblib.load(ml_models_dir / 'label_encoder.pkl') | Loads or saves serialized ML artifact with joblib. |
| 33 |     feature_list = joblib.load(ml_models_dir / 'feature_list.pkl') | Loads or saves serialized ML artifact with joblib. |
| 34 |     print("[ML] âœ“ Loaded Ensemble Model (99.99% Accuracy)") | Implements file-specific logic, configuration, or structure in this context. |
| 35 |     ensemble_model_loaded = True | Implements file-specific logic, configuration, or structure in this context. |
| 36 | except Exception as e: | Handles exceptions raised in the try block. |
| 37 |     print(f"[ML] âš  Fallback: {e}") | Starts object property block for grouped configuration/style. |
| 38 |     ensemble_model_loaded = False | Implements file-specific logic, configuration, or structure in this context. |
| 39 |     health_model = None | Implements file-specific logic, configuration, or structure in this context. |
| 40 |     health_label_encoder = None | Implements file-specific logic, configuration, or structure in this context. |
| 41 |     feature_list = None | Implements file-specific logic, configuration, or structure in this context. |
| 42 | (blank) | Blank line for readability and section separation. |
| 43 | simulation_running = False | Implements file-specific logic, configuration, or structure in this context. |
| 44 | simulation_thread = None | Implements file-specific logic, configuration, or structure in this context. |
| 45 | training_day = 1 | Implements file-specific logic, configuration, or structure in this context. |
| 46 | alerts = [] | Implements file-specific logic, configuration, or structure in this context. |
| 47 | (blank) | Blank line for readability and section separation. |
| 48 | # ============================================================================ | Comment line documenting intent or context. |
| 49 | # SQLITE DATABASE | Comment line documenting intent or context. |
| 50 | # ============================================================================ | Comment line documenting intent or context. |
| 51 | (blank) | Blank line for readability and section separation. |
| 52 | DB_PATH = 'virtualherd.db' | Implements file-specific logic, configuration, or structure in this context. |
| 53 | (blank) | Blank line for readability and section separation. |
| 54 | def get_db(): | Defines a function with reusable logic. |
| 55 |     conn = sqlite3.connect(DB_PATH) | Performs SQLite database connection/query/schema operation. |
| 56 |     conn.row_factory = sqlite3.Row | Implements file-specific logic, configuration, or structure in this context. |
| 57 |     return conn | Returns data/control from the current function/component. |
| 58 | (blank) | Blank line for readability and section separation. |
| 59 | def init_db(): | Defines a function with reusable logic. |
| 60 |     conn = get_db() | Implements file-specific logic, configuration, or structure in this context. |
| 61 |     c = conn.cursor() | Implements file-specific logic, configuration, or structure in this context. |
| 62 |     c.execute('''CREATE TABLE IF NOT EXISTS farmer_paddocks ( | Performs SQLite database connection/query/schema operation. |
| 63 |         id TEXT PRIMARY KEY, name TEXT, points TEXT DEFAULT '[]', | Implements file-specific logic, configuration, or structure in this context. |
| 64 |         cattle_ids TEXT DEFAULT '[]', status TEXT DEFAULT 'available', | Implements file-specific logic, configuration, or structure in this context. |
| 65 |         grass_quality INTEGER DEFAULT 80, created TEXT)''') | Implements file-specific logic, configuration, or structure in this context. |
| 66 |     c.execute('''CREATE TABLE IF NOT EXISTS active_cattle ( | Performs SQLite database connection/query/schema operation. |
| 67 |         cattle_id INTEGER PRIMARY KEY, added_at TEXT)''') | Implements file-specific logic, configuration, or structure in this context. |
| 68 |     c.execute('''CREATE TABLE IF NOT EXISTS schedules ( | Performs SQLite database connection/query/schema operation. |
| 69 |         id TEXT PRIMARY KEY, paddock_id TEXT, paddock_name TEXT, | Implements file-specific logic, configuration, or structure in this context. |
| 70 |         cattle_ids TEXT DEFAULT '[]', start_time TEXT, | Implements file-specific logic, configuration, or structure in this context. |
| 71 |         end_time TEXT, notes TEXT, created TEXT)''') | Implements file-specific logic, configuration, or structure in this context. |
| 72 |     conn.commit() | Implements file-specific logic, configuration, or structure in this context. |
| 73 |     conn.close() | Implements file-specific logic, configuration, or structure in this context. |
| 74 |     print("[DB] âœ“ SQLite database initialized") | Implements file-specific logic, configuration, or structure in this context. |
| 75 | (blank) | Blank line for readability and section separation. |
| 76 | init_db() | Implements file-specific logic, configuration, or structure in this context. |
| 77 | (blank) | Blank line for readability and section separation. |
| 78 | def migrate_db(): | Defines a function with reusable logic. |
| 79 |     """Add new columns to existing tables without wiping data""" | Implements file-specific logic, configuration, or structure in this context. |
| 80 |     conn = get_db() | Implements file-specific logic, configuration, or structure in this context. |
| 81 |     try: | Starts protected block for exception handling. |
| 82 |         conn.execute('ALTER TABLE schedules ADD COLUMN activated INTEGER DEFAULT 0') | Performs SQLite database connection/query/schema operation. |
| 83 |         conn.commit() | Implements file-specific logic, configuration, or structure in this context. |
| 84 |     except sqlite3.OperationalError: | Handles exceptions raised in the try block. |
| 85 |         pass  # column already exists | Implements file-specific logic, configuration, or structure in this context. |
| 86 |     conn.close() | Implements file-specific logic, configuration, or structure in this context. |
| 87 | (blank) | Blank line for readability and section separation. |
| 88 | migrate_db() | Implements file-specific logic, configuration, or structure in this context. |
| 89 | (blank) | Blank line for readability and section separation. |
| 90 | def restore_cattle(): | Defines a function with reusable logic. |
| 91 |     conn = get_db() | Implements file-specific logic, configuration, or structure in this context. |
| 92 |     rows = conn.execute('SELECT cattle_id FROM active_cattle').fetchall() | Performs SQLite database connection/query/schema operation. |
| 93 |     conn.close() | Implements file-specific logic, configuration, or structure in this context. |
| 94 |     for row in rows: | Loop iterating over a sequence or range. |
| 95 |         cattle_service.add_cattle(row['cattle_id']) | Implements file-specific logic, configuration, or structure in this context. |
| 96 |     print(f"[DB] âœ“ Restored {len(rows)} cattle from database") | Implements file-specific logic, configuration, or structure in this context. |
| 97 | (blank) | Blank line for readability and section separation. |
| 98 | restore_cattle() | Implements file-specific logic, configuration, or structure in this context. |
| 99 | (blank) | Blank line for readability and section separation. |
| 100 | # ============================================================================ | Comment line documenting intent or context. |
| 101 | # POINT-IN-POLYGON (Ray casting algorithm) | Comment line documenting intent or context. |
| 102 | # ============================================================================ | Comment line documenting intent or context. |
| 103 | (blank) | Blank line for readability and section separation. |
| 104 | def point_in_polygon(x, y, polygon): | Defines a function with reusable logic. |
| 105 |     """Returns True if point (x,y) is inside polygon (list of {x,y} dicts)""" | Implements file-specific logic, configuration, or structure in this context. |
| 106 |     if not polygon or len(polygon) < 3: | Conditional branch that executes when condition is true. |
| 107 |         return True  # No fence = anywhere is valid | Returns data/control from the current function/component. |
| 108 |     n = len(polygon) | Implements file-specific logic, configuration, or structure in this context. |
| 109 |     inside = False | Implements file-specific logic, configuration, or structure in this context. |
| 110 |     px, py = x, y | Implements file-specific logic, configuration, or structure in this context. |
| 111 |     j = n - 1 | Implements file-specific logic, configuration, or structure in this context. |
| 112 |     for i in range(n): | Loop iterating over a sequence or range. |
| 113 |         xi, yi = polygon[i]['x'], polygon[i]['y'] | Implements file-specific logic, configuration, or structure in this context. |
| 114 |         xj, yj = polygon[j]['x'], polygon[j]['y'] | Implements file-specific logic, configuration, or structure in this context. |
| 115 |         if ((yi > py) != (yj > py)) and (px < (xj - xi) * (py - yi) / (yj - yi) + xi): | Conditional branch that executes when condition is true. |
| 116 |             inside = not inside | Implements file-specific logic, configuration, or structure in this context. |
| 117 |         j = i | Implements file-specific logic, configuration, or structure in this context. |
| 118 |     return inside | Returns data/control from the current function/component. |
| 119 | (blank) | Blank line for readability and section separation. |
| 120 | def get_polygon_center(polygon): | Defines a function with reusable logic. |
| 121 |     """Get centroid of polygon""" | Implements file-specific logic, configuration, or structure in this context. |
| 122 |     if not polygon: | Conditional branch that executes when condition is true. |
| 123 |         return 50, 50 | Returns data/control from the current function/component. |
| 124 |     cx = sum(p['x'] for p in polygon) / len(polygon) | Implements file-specific logic, configuration, or structure in this context. |
| 125 |     cy = sum(p['y'] for p in polygon) / len(polygon) | Implements file-specific logic, configuration, or structure in this context. |
| 126 |     return cx, cy | Returns data/control from the current function/component. |
| 127 | (blank) | Blank line for readability and section separation. |
| 128 | def random_point_in_polygon(polygon, max_tries=100): | Defines a function with reusable logic. |
| 129 |     """Get a random point inside a polygon""" | Implements file-specific logic, configuration, or structure in this context. |
| 130 |     if not polygon or len(polygon) < 3: | Conditional branch that executes when condition is true. |
| 131 |         return random.uniform(20, 80), random.uniform(20, 80) | Returns data/control from the current function/component. |
| 132 | (blank) | Blank line for readability and section separation. |
| 133 |     xs = [p['x'] for p in polygon] | Implements file-specific logic, configuration, or structure in this context. |
| 134 |     ys = [p['y'] for p in polygon] | Implements file-specific logic, configuration, or structure in this context. |
| 135 |     min_x, max_x = min(xs), max(xs) | Implements file-specific logic, configuration, or structure in this context. |
| 136 |     min_y, max_y = min(ys), max(ys) | Implements file-specific logic, configuration, or structure in this context. |
| 137 | (blank) | Blank line for readability and section separation. |
| 138 |     for _ in range(max_tries): | Loop iterating over a sequence or range. |
| 139 |         rx = random.uniform(min_x, max_x) | Implements file-specific logic, configuration, or structure in this context. |
| 140 |         ry = random.uniform(min_y, max_y) | Implements file-specific logic, configuration, or structure in this context. |
| 141 |         if point_in_polygon(rx, ry, polygon): | Conditional branch that executes when condition is true. |
| 142 |             return rx, ry | Returns data/control from the current function/component. |
| 143 | (blank) | Blank line for readability and section separation. |
| 144 |     return get_polygon_center(polygon) | Returns data/control from the current function/component. |
| 145 | (blank) | Blank line for readability and section separation. |
| 146 | def get_active_paddock(): | Defines a function with reusable logic. |
| 147 |     """Get the first occupied paddock with fence points""" | Implements file-specific logic, configuration, or structure in this context. |
| 148 |     conn = get_db() | Implements file-specific logic, configuration, or structure in this context. |
| 149 |     rows = conn.execute( | Performs SQLite database connection/query/schema operation. |
| 150 |         "SELECT * FROM farmer_paddocks WHERE status='occupied' OR cattle_ids != '[]'" | Performs SQLite database connection/query/schema operation. |
| 151 |     ).fetchall() | Structural syntax token delimiting code blocks/collections. |
| 152 |     conn.close() | Implements file-specific logic, configuration, or structure in this context. |
| 153 |     for row in rows: | Loop iterating over a sequence or range. |
| 154 |         p = dict(row) | Implements file-specific logic, configuration, or structure in this context. |
| 155 |         p['points'] = json.loads(p['points'] or '[]') | Implements file-specific logic, configuration, or structure in this context. |
| 156 |         p['cattle_ids'] = json.loads(p['cattle_ids'] or '[]') | Implements file-specific logic, configuration, or structure in this context. |
| 157 |         if len(p['points']) >= 3: | Conditional branch that executes when condition is true. |
| 158 |             return p | Returns data/control from the current function/component. |
| 159 |     conn = get_db() | Implements file-specific logic, configuration, or structure in this context. |
| 160 |     rows = conn.execute("SELECT * FROM farmer_paddocks").fetchall() | Performs SQLite database connection/query/schema operation. |
| 161 |     conn.close() | Implements file-specific logic, configuration, or structure in this context. |
| 162 |     for row in rows: | Loop iterating over a sequence or range. |
| 163 |         p = dict(row) | Implements file-specific logic, configuration, or structure in this context. |
| 164 |         p['points'] = json.loads(p['points'] or '[]') | Implements file-specific logic, configuration, or structure in this context. |
| 165 |         p['cattle_ids'] = json.loads(p['cattle_ids'] or '[]') | Implements file-specific logic, configuration, or structure in this context. |
| 166 |         if len(p['points']) >= 3: | Conditional branch that executes when condition is true. |
| 167 |             return p | Returns data/control from the current function/component. |
| 168 |     return None | Returns data/control from the current function/component. |
| 169 | (blank) | Blank line for readability and section separation. |
| 170 | # ============================================================================ | Comment line documenting intent or context. |
| 171 | # ML PREDICTION | Comment line documenting intent or context. |
| 172 | # ============================================================================ | Comment line documenting intent or context. |
| 173 | (blank) | Blank line for readability and section separation. |
| 174 | def predict_health_status(cattle_obj): | Defines a function with reusable logic. |
| 175 |     if health_model is None: | Conditional branch that executes when condition is true. |
| 176 |         return predict_health_rule_based(cattle_obj) | Returns data/control from the current function/component. |
| 177 |     try: | Starts protected block for exception handling. |
| 178 |         heart_rate = float(cattle_obj.heart_rate) | Implements file-specific logic, configuration, or structure in this context. |
| 179 |         temperature = float(cattle_obj.temperature) | Implements file-specific logic, configuration, or structure in this context. |
| 180 |         feature_vector = np.array([[ | Implements file-specific logic, configuration, or structure in this context. |
| 181 |             heart_rate, temperature, cattle_obj.milk_production, | Implements file-specific logic, configuration, or structure in this context. |
| 182 |             cattle_obj.activity, cattle_obj.speed, | Implements file-specific logic, configuration, or structure in this context. |
| 183 |             cattle_obj.heading, cattle_obj.pulse_freq, cattle_obj.sound_freq, | Implements file-specific logic, configuration, or structure in this context. |
| 184 |             cattle_obj.pulse_sound_ratio, cattle_obj.x, cattle_obj.y, | Implements file-specific logic, configuration, or structure in this context. |
| 185 |             getattr(cattle_obj, 'heat_stress', 0), | Implements file-specific logic, configuration, or structure in this context. |
| 186 |             getattr(cattle_obj, 'skin_temperature', temperature), | Implements file-specific logic, configuration, or structure in this context. |
| 187 |             getattr(cattle_obj, 'lying_duration', 0), | Implements file-specific logic, configuration, or structure in this context. |
| 188 |             int(getattr(cattle_obj, 'lameness', False)), | Implements file-specific logic, configuration, or structure in this context. |
| 189 |             temperature, heart_rate, cattle_obj.milk_production, | Implements file-specific logic, configuration, or structure in this context. |
| 190 |             cattle_obj.activity, cattle_obj.speed, | Implements file-specific logic, configuration, or structure in this context. |
| 191 |             cattle_obj.heading, cattle_obj.pulse_freq, cattle_obj.sound_freq, | Implements file-specific logic, configuration, or structure in this context. |
| 192 |             cattle_obj.pulse_sound_ratio, cattle_obj.x, | Implements file-specific logic, configuration, or structure in this context. |
| 193 |             cattle_obj.y, temperature, heart_rate, cattle_obj.milk_production, | Implements file-specific logic, configuration, or structure in this context. |
| 194 |             cattle_obj.activity, cattle_obj.speed, | Implements file-specific logic, configuration, or structure in this context. |
| 195 |             cattle_obj.heading, cattle_obj.pulse_freq, cattle_obj.sound_freq, | Implements file-specific logic, configuration, or structure in this context. |
| 196 |             cattle_obj.pulse_sound_ratio, cattle_obj.x, | Implements file-specific logic, configuration, or structure in this context. |
| 197 |             cattle_obj.y, temperature, heart_rate, cattle_obj.milk_production, | Implements file-specific logic, configuration, or structure in this context. |
| 198 |             cattle_obj.activity, cattle_obj.speed, | Implements file-specific logic, configuration, or structure in this context. |
| 199 |             cattle_obj.heading, cattle_obj.pulse_freq, cattle_obj.sound_freq | Implements file-specific logic, configuration, or structure in this context. |
| 200 |         ]]) | Structural syntax token delimiting code blocks/collections. |
| 201 |         if feature_vector.shape[1] < 45: | Conditional branch that executes when condition is true. |
| 202 |             padding = np.zeros((1, 45 - feature_vector.shape[1])) | Implements file-specific logic, configuration, or structure in this context. |
| 203 |             feature_vector = np.hstack([feature_vector, padding]) | Implements file-specific logic, configuration, or structure in this context. |
| 204 |         elif feature_vector.shape[1] > 45: | Alternative conditional branch in Python. |
| 205 |             feature_vector = feature_vector[:, :45] | Implements file-specific logic, configuration, or structure in this context. |
| 206 |         prediction = health_model.predict(feature_vector)[0] | Implements file-specific logic, configuration, or structure in this context. |
| 207 |         probabilities = health_model.predict_proba(feature_vector)[0] | Implements file-specific logic, configuration, or structure in this context. |
| 208 |         confidence = float(max(probabilities)) | Implements file-specific logic, configuration, or structure in this context. |
| 209 |         health_status = health_label_encoder.inverse_transform([prediction])[0] | Implements file-specific logic, configuration, or structure in this context. |
| 210 |         return str(health_status), round(confidence, 3) | Returns data/control from the current function/component. |
| 211 |     except Exception as e: | Handles exceptions raised in the try block. |
| 212 |         return predict_health_rule_based(cattle_obj) | Returns data/control from the current function/component. |
| 213 | (blank) | Blank line for readability and section separation. |
| 214 | def predict_health_rule_based(cattle_obj): | Defines a function with reusable logic. |
| 215 |     temp = float(cattle_obj.temperature) | Implements file-specific logic, configuration, or structure in this context. |
| 216 |     hr = float(cattle_obj.heart_rate) | Implements file-specific logic, configuration, or structure in this context. |
| 217 |     if temp > 39.5: | Conditional branch that executes when condition is true. |
| 218 |         return "FEVER", 0.95 | Returns data/control from the current function/component. |
| 219 |     elif hr > 100: | Alternative conditional branch in Python. |
| 220 |         return "STRESS", 0.92 | Returns data/control from the current function/component. |
| 221 |     elif temp < 37.5: | Alternative conditional branch in Python. |
| 222 |         return "HYPOTHERMIA", 0.90 | Returns data/control from the current function/component. |
| 223 |     else: | Fallback branch when prior conditions fail. |
| 224 |         return "HEALTHY", 0.98 | Returns data/control from the current function/component. |
| 225 | (blank) | Blank line for readability and section separation. |
| 226 | # ============================================================================ | Comment line documenting intent or context. |
| 227 | # CATTLE ENDPOINTS | Comment line documenting intent or context. |
| 228 | # ============================================================================ | Comment line documenting intent or context. |
| 229 | (blank) | Blank line for readability and section separation. |
| 230 | @app.route('/api/cattle', methods=['GET']) | Registers an HTTP endpoint route and methods. |
| 231 | def get_cattle(): | Defines a function with reusable logic. |
| 232 |     cattle_data = cattle_service.get_cattle_list_for_api() | Implements file-specific logic, configuration, or structure in this context. |
| 233 |     return jsonify({ | Returns data/control from the current function/component. |
| 234 |         'cattle': cattle_data, | Implements file-specific logic, configuration, or structure in this context. |
| 235 |         'count': len(cattle_data), | Implements file-specific logic, configuration, or structure in this context. |
| 236 |         'training_day': training_day, | Implements file-specific logic, configuration, or structure in this context. |
| 237 |         'timestamp': datetime.now().isoformat() | Implements file-specific logic, configuration, or structure in this context. |
| 238 |     }) | Structural syntax token delimiting code blocks/collections. |
| 239 | (blank) | Blank line for readability and section separation. |
| 240 | @app.route('/api/cattle/<int:cattle_id>', methods=['GET']) | Registers an HTTP endpoint route and methods. |
| 241 | def get_cattle_detail(cattle_id): | Defines a function with reusable logic. |
| 242 |     cattle = cattle_service.get_cattle(cattle_id) | Implements file-specific logic, configuration, or structure in this context. |
| 243 |     if cattle: | Conditional branch that executes when condition is true. |
| 244 |         return jsonify(cattle.to_dict()) | Returns data/control from the current function/component. |
| 245 |     return jsonify({'error': 'Cattle not found'}), 404 | Returns data/control from the current function/component. |
| 246 | (blank) | Blank line for readability and section separation. |
| 247 | @app.route('/api/cattle', methods=['POST']) | Registers an HTTP endpoint route and methods. |
| 248 | def add_cattle(): | Defines a function with reusable logic. |
| 249 |     data = request.json | Reads JSON request body from client. |
| 250 |     cattle_id = data.get('cattle_id') | Implements file-specific logic, configuration, or structure in this context. |
| 251 |     if not cattle_id: | Conditional branch that executes when condition is true. |
| 252 |         return jsonify({'error': 'cattle_id required'}), 400 | Returns data/control from the current function/component. |
| 253 | (blank) | Blank line for readability and section separation. |
| 254 |     cattle = cattle_service.add_cattle(cattle_id) | Implements file-specific logic, configuration, or structure in this context. |
| 255 |     if cattle: | Conditional branch that executes when condition is true. |
| 256 |         paddock = get_active_paddock() | Implements file-specific logic, configuration, or structure in this context. |
| 257 |         spawned_outside = False | Implements file-specific logic, configuration, or structure in this context. |
| 258 |         if paddock and paddock['points']: | Conditional branch that executes when condition is true. |
| 259 |             if random.random() < 0.8: | Conditional branch that executes when condition is true. |
| 260 |                 rx, ry = random_point_in_polygon(paddock['points']) | Implements file-specific logic, configuration, or structure in this context. |
| 261 |                 print(f"[SPAWN] Cattle {cattle_id} spawned inside {paddock['name']} at ({rx:.1f}, {ry:.1f})") | Implements file-specific logic, configuration, or structure in this context. |
| 262 |             else: | Fallback branch when prior conditions fail. |
| 263 |                 cx, cy = get_polygon_center(paddock['points']) | Implements file-specific logic, configuration, or structure in this context. |
| 264 |                 angle = random.uniform(0, 360) | Implements file-specific logic, configuration, or structure in this context. |
| 265 |                 rad = math.radians(angle) | Implements file-specific logic, configuration, or structure in this context. |
| 266 |                 rx = max(0, min(100, cx + math.cos(rad) * 25)) | Implements file-specific logic, configuration, or structure in this context. |
| 267 |                 ry = max(0, min(100, cy + math.sin(rad) * 25)) | Implements file-specific logic, configuration, or structure in this context. |
| 268 |                 spawned_outside = True | Implements file-specific logic, configuration, or structure in this context. |
| 269 |                 print(f"[SPAWN] Cattle {cattle_id} spawned OUTSIDE {paddock['name']} at ({rx:.1f}, {ry:.1f})") | Implements file-specific logic, configuration, or structure in this context. |
| 270 |             cattle.x = rx | Implements file-specific logic, configuration, or structure in this context. |
| 271 |             cattle.y = ry | Implements file-specific logic, configuration, or structure in this context. |
| 272 | (blank) | Blank line for readability and section separation. |
| 273 |         health_status, confidence = predict_health_status(cattle) | Implements file-specific logic, configuration, or structure in this context. |
| 274 |         cattle.health_status = 'FENCE_BREACH' if spawned_outside else health_status | Implements file-specific logic, configuration, or structure in this context. |
| 275 | (blank) | Blank line for readability and section separation. |
| 276 |         conn = get_db() | Implements file-specific logic, configuration, or structure in this context. |
| 277 |         conn.execute('INSERT OR IGNORE INTO active_cattle (cattle_id, added_at) VALUES (?, ?)', | Performs SQLite database connection/query/schema operation. |
| 278 |                      (cattle_id, datetime.now().isoformat())) | Structural syntax token delimiting code blocks/collections. |
| 279 |         conn.commit() | Implements file-specific logic, configuration, or structure in this context. |
| 280 |         conn.close() | Implements file-specific logic, configuration, or structure in this context. |
| 281 | (blank) | Blank line for readability and section separation. |
| 282 |         socketio.emit('cattle_added', {'cattle': cattle.to_dict()}, to=None) | Emits real-time event data to connected clients. |
| 283 |         return jsonify({ | Returns data/control from the current function/component. |
| 284 |             'status': 'success', | Implements file-specific logic, configuration, or structure in this context. |
| 285 |             'message': f'Cattle {cattle_id} added', | Implements file-specific logic, configuration, or structure in this context. |
| 286 |             'spawned_in_paddock': paddock['name'] if paddock else None, | Implements file-specific logic, configuration, or structure in this context. |
| 287 |             'spawned_outside': spawned_outside, | Implements file-specific logic, configuration, or structure in this context. |
| 288 |             'cattle': cattle.to_dict() | Implements file-specific logic, configuration, or structure in this context. |
| 289 |         }), 201 | Structural syntax token delimiting code blocks/collections. |
| 290 |     else: | Fallback branch when prior conditions fail. |
| 291 |         return jsonify({'error': f'Failed to add cattle {cattle_id}'}), 400 | Returns data/control from the current function/component. |
| 292 | (blank) | Blank line for readability and section separation. |
| 293 | @app.route('/api/cattle/<int:cattle_id>', methods=['DELETE']) | Registers an HTTP endpoint route and methods. |
| 294 | def remove_cattle(cattle_id): | Defines a function with reusable logic. |
| 295 |     success = cattle_service.remove_cattle(cattle_id) | Implements file-specific logic, configuration, or structure in this context. |
| 296 |     if success: | Conditional branch that executes when condition is true. |
| 297 |         conn = get_db() | Implements file-specific logic, configuration, or structure in this context. |
| 298 |         conn.execute('DELETE FROM active_cattle WHERE cattle_id = ?', (cattle_id,)) | Performs SQLite database connection/query/schema operation. |
| 299 |         conn.commit() | Implements file-specific logic, configuration, or structure in this context. |
| 300 |         conn.close() | Implements file-specific logic, configuration, or structure in this context. |
| 301 |         socketio.emit('cattle_removed', {'cattle_id': cattle_id}, to=None) | Emits real-time event data to connected clients. |
| 302 |         return jsonify({'status': 'success', 'message': f'Cattle {cattle_id} removed'}) | Returns data/control from the current function/component. |
| 303 |     else: | Fallback branch when prior conditions fail. |
| 304 |         return jsonify({'error': 'Cattle not found'}), 404 | Returns data/control from the current function/component. |
| 305 | (blank) | Blank line for readability and section separation. |
| 306 | @app.route('/api/cattle/available', methods=['GET']) | Registers an HTTP endpoint route and methods. |
| 307 | def get_available_cattle(): | Defines a function with reusable logic. |
| 308 |     available = cattle_service.get_available_cattle_ids() | Implements file-specific logic, configuration, or structure in this context. |
| 309 |     return jsonify({ | Returns data/control from the current function/component. |
| 310 |         'available_cattle': available, | Implements file-specific logic, configuration, or structure in this context. |
| 311 |         'count': len(available), | Implements file-specific logic, configuration, or structure in this context. |
| 312 |         'total_in_dataset': len(data_loader.get_available_cows()) | Implements file-specific logic, configuration, or structure in this context. |
| 313 |     }) | Structural syntax token delimiting code blocks/collections. |
| 314 | (blank) | Blank line for readability and section separation. |
| 315 | # ============================================================================ | Comment line documenting intent or context. |
| 316 | # HEALTH & ALERTS | Comment line documenting intent or context. |
| 317 | # ============================================================================ | Comment line documenting intent or context. |
| 318 | (blank) | Blank line for readability and section separation. |
| 319 | @app.route('/api/health', methods=['GET']) | Registers an HTTP endpoint route and methods. |
| 320 | def get_health_status(): | Defines a function with reusable logic. |
| 321 |     health = cattle_service.get_health_summary() | Implements file-specific logic, configuration, or structure in this context. |
| 322 |     return jsonify({ | Returns data/control from the current function/component. |
| 323 |         **health, | Block comment content for documentation. |
| 324 |         'alerts': len(alerts), | Implements file-specific logic, configuration, or structure in this context. |
| 325 |         'alert_summary': alerts[-10:] if alerts else [], | Implements file-specific logic, configuration, or structure in this context. |
| 326 |         'model_accuracy': '99.99%' if ensemble_model_loaded else '~98%', | Implements file-specific logic, configuration, or structure in this context. |
| 327 |     }) | Structural syntax token delimiting code blocks/collections. |
| 328 | (blank) | Blank line for readability and section separation. |
| 329 | @app.route('/api/alerts', methods=['GET']) | Registers an HTTP endpoint route and methods. |
| 330 | def get_alerts_route(): | Defines a function with reusable logic. |
| 331 |     current_alerts = cattle_service.get_alerts() | Implements file-specific logic, configuration, or structure in this context. |
| 332 |     return jsonify({'alerts': current_alerts, 'count': len(current_alerts)}) | Returns data/control from the current function/component. |
| 333 | (blank) | Blank line for readability and section separation. |
| 334 | # ============================================================================ | Comment line documenting intent or context. |
| 335 | # FARMER PADDOCKS | Comment line documenting intent or context. |
| 336 | # ============================================================================ | Comment line documenting intent or context. |
| 337 | (blank) | Blank line for readability and section separation. |
| 338 | @app.route('/api/farmer/paddocks', methods=['GET']) | Registers an HTTP endpoint route and methods. |
| 339 | def get_farmer_paddocks(): | Defines a function with reusable logic. |
| 340 |     conn = get_db() | Implements file-specific logic, configuration, or structure in this context. |
| 341 |     rows = conn.execute('SELECT * FROM farmer_paddocks').fetchall() | Performs SQLite database connection/query/schema operation. |
| 342 |     conn.close() | Implements file-specific logic, configuration, or structure in this context. |
| 343 |     paddocks = [] | Implements file-specific logic, configuration, or structure in this context. |
| 344 |     for row in rows: | Loop iterating over a sequence or range. |
| 345 |         p = dict(row) | Implements file-specific logic, configuration, or structure in this context. |
| 346 |         p['points'] = json.loads(p['points'] or '[]') | Implements file-specific logic, configuration, or structure in this context. |
| 347 |         p['cattle_ids'] = json.loads(p['cattle_ids'] or '[]') | Implements file-specific logic, configuration, or structure in this context. |
| 348 |         paddocks.append(p) | Implements file-specific logic, configuration, or structure in this context. |
| 349 |     return jsonify({'paddocks': paddocks, 'count': len(paddocks)}) | Returns data/control from the current function/component. |
| 350 | (blank) | Blank line for readability and section separation. |
| 351 | @app.route('/api/farmer/paddocks', methods=['POST']) | Registers an HTTP endpoint route and methods. |
| 352 | def create_farmer_paddock(): | Defines a function with reusable logic. |
| 353 |     data = request.json | Reads JSON request body from client. |
| 354 |     conn = get_db() | Implements file-specific logic, configuration, or structure in this context. |
| 355 |     rows = conn.execute('SELECT COUNT(*) as cnt FROM farmer_paddocks').fetchone() | Performs SQLite database connection/query/schema operation. |
| 356 |     paddock_id = f"FP{rows['cnt'] + 1}" | Implements file-specific logic, configuration, or structure in this context. |
| 357 |     points = data.get('points', []) | Implements file-specific logic, configuration, or structure in this context. |
| 358 |     now = datetime.now().isoformat() | Implements file-specific logic, configuration, or structure in this context. |
| 359 |     conn.execute( | Performs SQLite database connection/query/schema operation. |
| 360 |         'INSERT INTO farmer_paddocks (id, name, points, cattle_ids, status, grass_quality, created) VALUES (?,?,?,?,?,?,?)', | Performs SQLite database connection/query/schema operation. |
| 361 |         (paddock_id, data.get('name', paddock_id), json.dumps(points), '[]', 'available', 80, now) | Structural syntax token delimiting code blocks/collections. |
| 362 |     ) | Structural syntax token delimiting code blocks/collections. |
| 363 |     conn.commit() | Implements file-specific logic, configuration, or structure in this context. |
| 364 |     paddock = dict(conn.execute('SELECT * FROM farmer_paddocks WHERE id=?', (paddock_id,)).fetchone()) | Performs SQLite database connection/query/schema operation. |
| 365 |     conn.close() | Implements file-specific logic, configuration, or structure in this context. |
| 366 |     paddock['points'] = json.loads(paddock['points']) | Implements file-specific logic, configuration, or structure in this context. |
| 367 |     paddock['cattle_ids'] = json.loads(paddock['cattle_ids']) | Implements file-specific logic, configuration, or structure in this context. |
| 368 |     socketio.emit('paddock_created', {'paddock': paddock}, to=None) | Emits real-time event data to connected clients. |
| 369 |     return jsonify({'status': 'success', 'paddock': paddock}), 201 | Returns data/control from the current function/component. |
| 370 | (blank) | Blank line for readability and section separation. |
| 371 | @app.route('/api/farmer/paddocks/<paddock_id>/assign', methods=['POST']) | Registers an HTTP endpoint route and methods. |
| 372 | def assign_cattle_to_paddock(paddock_id): | Defines a function with reusable logic. |
| 373 |     data = request.json | Reads JSON request body from client. |
| 374 |     cattle_ids = data.get('cattle_ids', []) | Implements file-specific logic, configuration, or structure in this context. |
| 375 |     conn = get_db() | Implements file-specific logic, configuration, or structure in this context. |
| 376 |     row = conn.execute('SELECT * FROM farmer_paddocks WHERE id=?', (paddock_id,)).fetchone() | Performs SQLite database connection/query/schema operation. |
| 377 |     if not row: | Conditional branch that executes when condition is true. |
| 378 |         conn.close() | Implements file-specific logic, configuration, or structure in this context. |
| 379 |         return jsonify({'error': 'Paddock not found'}), 404 | Returns data/control from the current function/component. |
| 380 |     status = 'occupied' if cattle_ids else 'available' | Implements file-specific logic, configuration, or structure in this context. |
| 381 |     conn.execute('UPDATE farmer_paddocks SET cattle_ids=?, status=? WHERE id=?', | Performs SQLite database connection/query/schema operation. |
| 382 |                  (json.dumps(cattle_ids), status, paddock_id)) | Structural syntax token delimiting code blocks/collections. |
| 383 |     conn.commit() | Implements file-specific logic, configuration, or structure in this context. |
| 384 |     paddock = dict(conn.execute('SELECT * FROM farmer_paddocks WHERE id=?', (paddock_id,)).fetchone()) | Performs SQLite database connection/query/schema operation. |
| 385 |     conn.close() | Implements file-specific logic, configuration, or structure in this context. |
| 386 |     paddock['points'] = json.loads(paddock['points']) | Implements file-specific logic, configuration, or structure in this context. |
| 387 |     paddock['cattle_ids'] = json.loads(paddock['cattle_ids']) | Implements file-specific logic, configuration, or structure in this context. |
| 388 |     socketio.emit('paddock_updated', {'paddock': paddock}, to=None) | Emits real-time event data to connected clients. |
| 389 |     return jsonify({'status': 'success', 'paddock': paddock}) | Returns data/control from the current function/component. |
| 390 | (blank) | Blank line for readability and section separation. |
| 391 | @app.route('/api/farmer/paddocks/<paddock_id>', methods=['DELETE']) | Registers an HTTP endpoint route and methods. |
| 392 | def delete_farmer_paddock(paddock_id): | Defines a function with reusable logic. |
| 393 |     conn = get_db() | Implements file-specific logic, configuration, or structure in this context. |
| 394 |     conn.execute('DELETE FROM farmer_paddocks WHERE id=?', (paddock_id,)) | Performs SQLite database connection/query/schema operation. |
| 395 |     conn.commit() | Implements file-specific logic, configuration, or structure in this context. |
| 396 |     conn.close() | Implements file-specific logic, configuration, or structure in this context. |
| 397 |     socketio.emit('paddock_deleted', {'paddock_id': paddock_id}, to=None) | Emits real-time event data to connected clients. |
| 398 |     return jsonify({'status': 'success'}) | Returns data/control from the current function/component. |
| 399 | (blank) | Blank line for readability and section separation. |
| 400 | # ============================================================================ | Comment line documenting intent or context. |
| 401 | # SCHEDULES | Comment line documenting intent or context. |
| 402 | # ============================================================================ | Comment line documenting intent or context. |
| 403 | (blank) | Blank line for readability and section separation. |
| 404 | @app.route('/api/farmer/schedules', methods=['GET']) | Registers an HTTP endpoint route and methods. |
| 405 | def get_schedules(): | Defines a function with reusable logic. |
| 406 |     conn = get_db() | Implements file-specific logic, configuration, or structure in this context. |
| 407 |     rows = conn.execute('SELECT * FROM schedules ORDER BY start_time').fetchall() | Performs SQLite database connection/query/schema operation. |
| 408 |     conn.close() | Implements file-specific logic, configuration, or structure in this context. |
| 409 |     schedules = [] | Implements file-specific logic, configuration, or structure in this context. |
| 410 |     for row in rows: | Loop iterating over a sequence or range. |
| 411 |         s = dict(row) | Implements file-specific logic, configuration, or structure in this context. |
| 412 |         s['cattle_ids'] = json.loads(s['cattle_ids'] or '[]') | Implements file-specific logic, configuration, or structure in this context. |
| 413 |         schedules.append(s) | Implements file-specific logic, configuration, or structure in this context. |
| 414 |     return jsonify({'schedules': schedules, 'count': len(schedules)}) | Returns data/control from the current function/component. |
| 415 | (blank) | Blank line for readability and section separation. |
| 416 | @app.route('/api/farmer/schedules', methods=['POST']) | Registers an HTTP endpoint route and methods. |
| 417 | def create_schedule(): | Defines a function with reusable logic. |
| 418 |     data = request.json | Reads JSON request body from client. |
| 419 |     conn = get_db() | Implements file-specific logic, configuration, or structure in this context. |
| 420 |     rows = conn.execute('SELECT COUNT(*) as cnt FROM schedules').fetchone() | Performs SQLite database connection/query/schema operation. |
| 421 |     schedule_id = f"SCH{rows['cnt'] + 1}" | Implements file-specific logic, configuration, or structure in this context. |
| 422 |     now = datetime.now().isoformat() | Implements file-specific logic, configuration, or structure in this context. |
| 423 |     conn.execute( | Performs SQLite database connection/query/schema operation. |
| 424 |         'INSERT INTO schedules (id, paddock_id, paddock_name, cattle_ids, start_time, end_time, notes, created, activated) VALUES (?,?,?,?,?,?,?,?,0)', | Performs SQLite database connection/query/schema operation. |
| 425 |         (schedule_id, data.get('paddock_id'), data.get('paddock_name'), | Structural syntax token delimiting code blocks/collections. |
| 426 |          json.dumps(data.get('cattle_ids', [])), | Implements file-specific logic, configuration, or structure in this context. |
| 427 |          data.get('start_time'), data.get('end_time'), | Implements file-specific logic, configuration, or structure in this context. |
| 428 |          data.get('notes', ''), now) | Implements file-specific logic, configuration, or structure in this context. |
| 429 |     ) | Structural syntax token delimiting code blocks/collections. |
| 430 |     conn.commit() | Implements file-specific logic, configuration, or structure in this context. |
| 431 |     schedule = dict(conn.execute('SELECT * FROM schedules WHERE id=?', (schedule_id,)).fetchone()) | Performs SQLite database connection/query/schema operation. |
| 432 |     conn.close() | Implements file-specific logic, configuration, or structure in this context. |
| 433 |     schedule['cattle_ids'] = json.loads(schedule['cattle_ids']) | Implements file-specific logic, configuration, or structure in this context. |
| 434 |     socketio.emit('schedule_created', {'schedule': schedule}, to=None) | Emits real-time event data to connected clients. |
| 435 |     return jsonify({'status': 'success', 'schedule': schedule}), 201 | Returns data/control from the current function/component. |
| 436 | (blank) | Blank line for readability and section separation. |
| 437 | @app.route('/api/farmer/schedules/<schedule_id>', methods=['DELETE']) | Registers an HTTP endpoint route and methods. |
| 438 | def delete_schedule(schedule_id): | Defines a function with reusable logic. |
| 439 |     conn = get_db() | Implements file-specific logic, configuration, or structure in this context. |
| 440 |     conn.execute('DELETE FROM schedules WHERE id=?', (schedule_id,)) | Performs SQLite database connection/query/schema operation. |
| 441 |     conn.commit() | Implements file-specific logic, configuration, or structure in this context. |
| 442 |     conn.close() | Implements file-specific logic, configuration, or structure in this context. |
| 443 |     socketio.emit('schedule_deleted', {'schedule_id': schedule_id}, to=None) | Emits real-time event data to connected clients. |
| 444 |     return jsonify({'status': 'success'}) | Returns data/control from the current function/component. |
| 445 | (blank) | Blank line for readability and section separation. |
| 446 | # ============================================================================ | Comment line documenting intent or context. |
| 447 | # STATUS | Comment line documenting intent or context. |
| 448 | # ============================================================================ | Comment line documenting intent or context. |
| 449 | (blank) | Blank line for readability and section separation. |
| 450 | @app.route('/api/status', methods=['GET']) | Registers an HTTP endpoint route and methods. |
| 451 | def get_status(): | Defines a function with reusable logic. |
| 452 |     conn = get_db() | Implements file-specific logic, configuration, or structure in this context. |
| 453 |     paddock_count = conn.execute('SELECT COUNT(*) as cnt FROM farmer_paddocks').fetchone()['cnt'] | Performs SQLite database connection/query/schema operation. |
| 454 |     conn.close() | Implements file-specific logic, configuration, or structure in this context. |
| 455 |     return jsonify({ | Returns data/control from the current function/component. |
| 456 |         'status': 'running', | Implements file-specific logic, configuration, or structure in this context. |
| 457 |         'simulation_running': simulation_running, | Implements file-specific logic, configuration, or structure in this context. |
| 458 |         'cattle_count': cattle_service.get_cattle_count(), | Implements file-specific logic, configuration, or structure in this context. |
| 459 |         'available_cattle': len(cattle_service.get_available_cattle_ids()), | Implements file-specific logic, configuration, or structure in this context. |
| 460 |         'alerts': len(alerts), | Implements file-specific logic, configuration, or structure in this context. |
| 461 |         'training_day': training_day, | Implements file-specific logic, configuration, or structure in this context. |
| 462 |         'paddocks': paddock_count, | Implements file-specific logic, configuration, or structure in this context. |
| 463 |         'ml_model': { | Starts object property block for grouped configuration/style. |
| 464 |             'type': 'Ensemble (RF + XGB + GB)', | Implements file-specific logic, configuration, or structure in this context. |
| 465 |             'status': 'loaded' if ensemble_model_loaded else 'fallback', | Implements file-specific logic, configuration, or structure in this context. |
| 466 |             'accuracy': '99.99%', | Implements file-specific logic, configuration, or structure in this context. |
| 467 |             'features': 45, | Implements file-specific logic, configuration, or structure in this context. |
| 468 |             'health_classes': ['FEVER', 'STRESS', 'HYPOTHERMIA', 'HEALTHY'], | Implements file-specific logic, configuration, or structure in this context. |
| 469 |             'training_samples': 96702 | Implements file-specific logic, configuration, or structure in this context. |
| 470 |         }, | Structural syntax token delimiting code blocks/collections. |
| 471 |         'timestamp': datetime.now().isoformat() | Implements file-specific logic, configuration, or structure in this context. |
| 472 |     }) | Structural syntax token delimiting code blocks/collections. |
| 473 | (blank) | Blank line for readability and section separation. |
| 474 | @app.route('/api/ml/info', methods=['GET']) | Registers an HTTP endpoint route and methods. |
| 475 | def get_ml_info(): | Defines a function with reusable logic. |
| 476 |     return jsonify({ | Returns data/control from the current function/component. |
| 477 |         'model_name': 'Ensemble Voting Classifier', | Implements file-specific logic, configuration, or structure in this context. |
| 478 |         'ensemble_accuracy': '99.99%', | Implements file-specific logic, configuration, or structure in this context. |
| 479 |         'features_used': 45, | Implements file-specific logic, configuration, or structure in this context. |
| 480 |         'status': 'production-ready' | Implements file-specific logic, configuration, or structure in this context. |
| 481 |     }) | Structural syntax token delimiting code blocks/collections. |
| 482 | (blank) | Blank line for readability and section separation. |
| 483 | @app.route('/api/dataset', methods=['GET']) | Registers an HTTP endpoint route and methods. |
| 484 | def get_dataset_info(): | Defines a function with reusable logic. |
| 485 |     summary = data_loader.get_dataset_summary() | Implements file-specific logic, configuration, or structure in this context. |
| 486 |     return jsonify({**summary, 'ml_features_used': 45}) | Returns data/control from the current function/component. |
| 487 | (blank) | Blank line for readability and section separation. |
| 488 | # ============================================================================ | Comment line documenting intent or context. |
| 489 | # WEBSOCKET EVENTS | Comment line documenting intent or context. |
| 490 | # ============================================================================ | Comment line documenting intent or context. |
| 491 | (blank) | Blank line for readability and section separation. |
| 492 | @socketio.on('connect') | Registers a WebSocket event handler. |
| 493 | def handle_connect(): | Defines a function with reusable logic. |
| 494 |     print(f"[WS] Client connected") | Implements file-specific logic, configuration, or structure in this context. |
| 495 |     socketio.emit('response', { | Emits real-time event data to connected clients. |
| 496 |         'status': 'connected', | Implements file-specific logic, configuration, or structure in this context. |
| 497 |         'cattle_count': cattle_service.get_cattle_count(), | Implements file-specific logic, configuration, or structure in this context. |
| 498 |         'simulation_running': simulation_running, | Implements file-specific logic, configuration, or structure in this context. |
| 499 |         'timestamp': datetime.now().isoformat() | Implements file-specific logic, configuration, or structure in this context. |
| 500 |     }) | Structural syntax token delimiting code blocks/collections. |
| 501 |     socketio.emit('simulation_status', {'running': simulation_running}) | Emits real-time event data to connected clients. |
| 502 | (blank) | Blank line for readability and section separation. |
| 503 | @socketio.on('disconnect') | Registers a WebSocket event handler. |
| 504 | def handle_disconnect(): | Defines a function with reusable logic. |
| 505 |     print(f"[WS] Client disconnected") | Implements file-specific logic, configuration, or structure in this context. |
| 506 | (blank) | Blank line for readability and section separation. |
| 507 | @socketio.on('start_simulation') | Registers a WebSocket event handler. |
| 508 | def handle_start(): | Defines a function with reusable logic. |
| 509 |     global simulation_running, simulation_thread | Implements file-specific logic, configuration, or structure in this context. |
| 510 |     if simulation_running: | Conditional branch that executes when condition is true. |
| 511 |         socketio.emit('response', {'status': 'Already running'}) | Emits real-time event data to connected clients. |
| 512 |         return | Implements file-specific logic, configuration, or structure in this context. |
| 513 |     simulation_running = True | Implements file-specific logic, configuration, or structure in this context. |
| 514 |     print("[WS] Simulation started") | Implements file-specific logic, configuration, or structure in this context. |
| 515 |     socketio.emit('simulation_status', {'running': True}, to=None) | Emits real-time event data to connected clients. |
| 516 |     simulation_thread = threading.Thread(target=simulation_loop, daemon=True) | Implements file-specific logic, configuration, or structure in this context. |
| 517 |     simulation_thread.start() | Implements file-specific logic, configuration, or structure in this context. |
| 518 | (blank) | Blank line for readability and section separation. |
| 519 | @socketio.on('stop_simulation') | Registers a WebSocket event handler. |
| 520 | def handle_stop(): | Defines a function with reusable logic. |
| 521 |     global simulation_running | Implements file-specific logic, configuration, or structure in this context. |
| 522 |     simulation_running = False | Implements file-specific logic, configuration, or structure in this context. |
| 523 |     print("[WS] Simulation stopped") | Implements file-specific logic, configuration, or structure in this context. |
| 524 |     socketio.emit('simulation_status', {'running': False}, to=None) | Emits real-time event data to connected clients. |
| 525 | (blank) | Blank line for readability and section separation. |
| 526 | # ============================================================================ | Comment line documenting intent or context. |
| 527 | # SIMULATION LOOP WITH FENCE BREACH DETECTION | Comment line documenting intent or context. |
| 528 | # ============================================================================ | Comment line documenting intent or context. |
| 529 | (blank) | Blank line for readability and section separation. |
| 530 | def simulation_loop(): | Defines a function with reusable logic. |
| 531 |     global alerts | Implements file-specific logic, configuration, or structure in this context. |
| 532 |     step = 0 | Implements file-specific logic, configuration, or structure in this context. |
| 533 |     print("[SIM] Simulation loop started") | Implements file-specific logic, configuration, or structure in this context. |
| 534 | (blank) | Blank line for readability and section separation. |
| 535 |     while simulation_running: | Loop repeating while condition remains true. |
| 536 |         step += 1 | Implements file-specific logic, configuration, or structure in this context. |
| 537 | (blank) | Blank line for readability and section separation. |
| 538 |         paddock = get_active_paddock() | Implements file-specific logic, configuration, or structure in this context. |
| 539 |         polygon = paddock['points'] if paddock else [] | Implements file-specific logic, configuration, or structure in this context. |
| 540 | (blank) | Blank line for readability and section separation. |
| 541 |         breach_alerts = [] | Implements file-specific logic, configuration, or structure in this context. |
| 542 | (blank) | Blank line for readability and section separation. |
| 543 |         for cattle in cattle_service.get_all_cattle(): | Loop iterating over a sequence or range. |
| 544 |             cattle.heading += random.uniform(-20, 20) | Implements file-specific logic, configuration, or structure in this context. |
| 545 |             cattle.heading %= 360 | Implements file-specific logic, configuration, or structure in this context. |
| 546 | (blank) | Blank line for readability and section separation. |
| 547 |             has_fence = bool(polygon) and len(polygon) >= 3 | Implements file-specific logic, configuration, or structure in this context. |
| 548 |             already_outside = has_fence and not point_in_polygon(cattle.x, cattle.y, polygon) | Implements file-specific logic, configuration, or structure in this context. |
| 549 | (blank) | Blank line for readability and section separation. |
| 550 |             if already_outside: | Conditional branch that executes when condition is true. |
| 551 |                 cx, cy = get_polygon_center(polygon) | Implements file-specific logic, configuration, or structure in this context. |
| 552 |                 angle_to_center = math.atan2(cy - cattle.y, cx - cattle.x) | Implements file-specific logic, configuration, or structure in this context. |
| 553 |                 cattle.heading = math.degrees(angle_to_center) + random.uniform(-10, 10) | Implements file-specific logic, configuration, or structure in this context. |
| 554 |                 rad = math.radians(cattle.heading) | Implements file-specific logic, configuration, or structure in this context. |
| 555 |                 new_x = max(0, min(100, cattle.x + cattle.speed * math.cos(rad) * 0.15)) | Implements file-specific logic, configuration, or structure in this context. |
| 556 |                 new_y = max(0, min(100, cattle.y + cattle.speed * math.sin(rad) * 0.15)) | Implements file-specific logic, configuration, or structure in this context. |
| 557 | (blank) | Blank line for readability and section separation. |
| 558 |                 cattle.x = new_x | Implements file-specific logic, configuration, or structure in this context. |
| 559 |                 cattle.y = new_y | Implements file-specific logic, configuration, or structure in this context. |
| 560 | (blank) | Blank line for readability and section separation. |
| 561 |                 if point_in_polygon(new_x, new_y, polygon): | Conditional branch that executes when condition is true. |
| 562 |                     cattle.health_status = 'HEALTHY' | Implements file-specific logic, configuration, or structure in this context. |
| 563 |                 else: | Fallback branch when prior conditions fail. |
| 564 |                     alert = { | Implements file-specific logic, configuration, or structure in this context. |
| 565 |                         'cattle_id': cattle.cattle_id, | Implements file-specific logic, configuration, or structure in this context. |
| 566 |                         'type': 'FENCE_BREACH', | Implements file-specific logic, configuration, or structure in this context. |
| 567 |                         'severity': 'critical', | Implements file-specific logic, configuration, or structure in this context. |
| 568 |                         'message': f'Cattle #{cattle.cattle_id} outside fence boundary', | Implements file-specific logic, configuration, or structure in this context. |
| 569 |                         'timestamp': datetime.now().isoformat(), | Implements file-specific logic, configuration, or structure in this context. |
| 570 |                         'position': {'x': cattle.x, 'y': cattle.y} | Starts object property block for grouped configuration/style. |
| 571 |                     } | Structural syntax token delimiting code blocks/collections. |
| 572 |                     breach_alerts.append(alert) | Implements file-specific logic, configuration, or structure in this context. |
| 573 |                     alerts.append(alert) | Implements file-specific logic, configuration, or structure in this context. |
| 574 |                     if len(alerts) > 100: | Conditional branch that executes when condition is true. |
| 575 |                         alerts = alerts[-100:] | Implements file-specific logic, configuration, or structure in this context. |
| 576 |                     cattle.health_status = 'FENCE_BREACH' | Implements file-specific logic, configuration, or structure in this context. |
| 577 |             else: | Fallback branch when prior conditions fail. |
| 578 |                 rad = math.radians(cattle.heading) | Implements file-specific logic, configuration, or structure in this context. |
| 579 |                 new_x = max(0, min(100, cattle.x + cattle.speed * math.cos(rad) * 0.3)) | Implements file-specific logic, configuration, or structure in this context. |
| 580 |                 new_y = max(0, min(100, cattle.y + cattle.speed * math.sin(rad) * 0.3)) | Implements file-specific logic, configuration, or structure in this context. |
| 581 | (blank) | Blank line for readability and section separation. |
| 582 |                 if has_fence and not point_in_polygon(new_x, new_y, polygon): | Conditional branch that executes when condition is true. |
| 583 |                     cx, cy = get_polygon_center(polygon) | Implements file-specific logic, configuration, or structure in this context. |
| 584 |                     angle_to_center = math.atan2(cy - cattle.y, cx - cattle.x) | Implements file-specific logic, configuration, or structure in this context. |
| 585 |                     cattle.heading = math.degrees(angle_to_center) + random.uniform(-15, 15) | Implements file-specific logic, configuration, or structure in this context. |
| 586 | (blank) | Blank line for readability and section separation. |
| 587 |                     alert = { | Implements file-specific logic, configuration, or structure in this context. |
| 588 |                         'cattle_id': cattle.cattle_id, | Implements file-specific logic, configuration, or structure in this context. |
| 589 |                         'type': 'FENCE_BREACH', | Implements file-specific logic, configuration, or structure in this context. |
| 590 |                         'severity': 'critical', | Implements file-specific logic, configuration, or structure in this context. |
| 591 |                         'message': f'Cattle #{cattle.cattle_id} breached fence boundary', | Implements file-specific logic, configuration, or structure in this context. |
| 592 |                         'timestamp': datetime.now().isoformat(), | Implements file-specific logic, configuration, or structure in this context. |
| 593 |                         'position': {'x': cattle.x, 'y': cattle.y} | Starts object property block for grouped configuration/style. |
| 594 |                     } | Structural syntax token delimiting code blocks/collections. |
| 595 |                     breach_alerts.append(alert) | Implements file-specific logic, configuration, or structure in this context. |
| 596 |                     alerts.append(alert) | Implements file-specific logic, configuration, or structure in this context. |
| 597 |                     if len(alerts) > 100: | Conditional branch that executes when condition is true. |
| 598 |                         alerts = alerts[-100:] | Implements file-specific logic, configuration, or structure in this context. |
| 599 |                     cattle.health_status = 'FENCE_BREACH' | Implements file-specific logic, configuration, or structure in this context. |
| 600 |                 else: | Fallback branch when prior conditions fail. |
| 601 |                     cattle.x = new_x | Implements file-specific logic, configuration, or structure in this context. |
| 602 |                     cattle.y = new_y | Implements file-specific logic, configuration, or structure in this context. |
| 603 |                     if cattle.health_status == 'FENCE_BREACH': | Conditional branch that executes when condition is true. |
| 604 |                         cattle.health_status = 'HEALTHY' | Implements file-specific logic, configuration, or structure in this context. |
| 605 | (blank) | Blank line for readability and section separation. |
| 606 |             cattle.temperature = max(37.0, min(41.0, cattle.temperature + random.uniform(-0.2, 0.2))) | Implements file-specific logic, configuration, or structure in this context. |
| 607 |             cattle.heart_rate = max(60, min(120, cattle.heart_rate + random.randint(-3, 3))) | Implements file-specific logic, configuration, or structure in this context. |
| 608 |             cattle.milk_production = max(15, min(35, cattle.milk_production + random.uniform(-0.2, 0.2))) | Implements file-specific logic, configuration, or structure in this context. |
| 609 | (blank) | Blank line for readability and section separation. |
| 610 |             if cattle.health_status != 'FENCE_BREACH': | Conditional branch that executes when condition is true. |
| 611 |                 health_status, confidence = predict_health_status(cattle) | Implements file-specific logic, configuration, or structure in this context. |
| 612 |                 cattle.health_status = health_status | Implements file-specific logic, configuration, or structure in this context. |
| 613 | (blank) | Blank line for readability and section separation. |
| 614 |         cattle_data = cattle_service.get_cattle_list_for_api() | Implements file-specific logic, configuration, or structure in this context. |
| 615 |         current_alerts = cattle_service.get_alerts() | Implements file-specific logic, configuration, or structure in this context. |
| 616 |         all_alerts = current_alerts + breach_alerts | Implements file-specific logic, configuration, or structure in this context. |
| 617 | (blank) | Blank line for readability and section separation. |
| 618 |         socketio.emit('cattle_update', { | Emits real-time event data to connected clients. |
| 619 |             'cattle': cattle_data, | Implements file-specific logic, configuration, or structure in this context. |
| 620 |             'alerts': all_alerts, | Implements file-specific logic, configuration, or structure in this context. |
| 621 |             'breach_alerts': breach_alerts, | Implements file-specific logic, configuration, or structure in this context. |
| 622 |             'step': step, | Implements file-specific logic, configuration, or structure in this context. |
| 623 |             'simulation_running': True, | Implements file-specific logic, configuration, or structure in this context. |
| 624 |             'timestamp': datetime.now().isoformat() | Implements file-specific logic, configuration, or structure in this context. |
| 625 |         }, to=None) | Structural syntax token delimiting code blocks/collections. |
| 626 | (blank) | Blank line for readability and section separation. |
| 627 |         if breach_alerts: | Conditional branch that executes when condition is true. |
| 628 |             socketio.emit('fence_breach', { | Emits real-time event data to connected clients. |
| 629 |                 'alerts': breach_alerts, | Implements file-specific logic, configuration, or structure in this context. |
| 630 |                 'timestamp': datetime.now().isoformat() | Implements file-specific logic, configuration, or structure in this context. |
| 631 |             }, to=None) | Structural syntax token delimiting code blocks/collections. |
| 632 | (blank) | Blank line for readability and section separation. |
| 633 |         time.sleep(1) | Implements file-specific logic, configuration, or structure in this context. |
| 634 | (blank) | Blank line for readability and section separation. |
| 635 |     print("[SIM] Simulation loop stopped") | Implements file-specific logic, configuration, or structure in this context. |
| 636 | (blank) | Blank line for readability and section separation. |
| 637 | # ============================================================================ | Comment line documenting intent or context. |
| 638 | # SCHEDULE CHECKER LOOP â€” moves the herd to a new paddock at the scheduled time | Comment line documenting intent or context. |
| 639 | # ============================================================================ | Comment line documenting intent or context. |
| 640 | (blank) | Blank line for readability and section separation. |
| 641 | def schedule_checker_loop(): | Defines a function with reusable logic. |
| 642 |     print("[SCHED] Schedule checker started (checking every 2s for demo-speed activation)") | Implements file-specific logic, configuration, or structure in this context. |
| 643 |     while True: | Loop repeating while condition remains true. |
| 644 |         try: | Starts protected block for exception handling. |
| 645 |             now = datetime.now().isoformat() | Implements file-specific logic, configuration, or structure in this context. |
| 646 |             conn = get_db() | Implements file-specific logic, configuration, or structure in this context. |
| 647 |             due = conn.execute( | Performs SQLite database connection/query/schema operation. |
| 648 |                 'SELECT * FROM schedules WHERE activated=0 AND start_time <= ? ORDER BY start_time', | Performs SQLite database connection/query/schema operation. |
| 649 |                 (now,) | Structural syntax token delimiting code blocks/collections. |
| 650 |             ).fetchall() | Structural syntax token delimiting code blocks/collections. |
| 651 | (blank) | Blank line for readability and section separation. |
| 652 |             for row in due: | Loop iterating over a sequence or range. |
| 653 |                 sched = dict(row) | Implements file-specific logic, configuration, or structure in this context. |
| 654 |                 sched_cattle_ids = json.loads(sched['cattle_ids'] or '[]') | Implements file-specific logic, configuration, or structure in this context. |
| 655 |                 target_paddock_id = sched['paddock_id'] | Implements file-specific logic, configuration, or structure in this context. |
| 656 | (blank) | Blank line for readability and section separation. |
| 657 |                 all_paddocks = conn.execute('SELECT * FROM farmer_paddocks').fetchall() | Performs SQLite database connection/query/schema operation. |
| 658 |                 for p in all_paddocks: | Loop iterating over a sequence or range. |
| 659 |                     if p['id'] != target_paddock_id: | Conditional branch that executes when condition is true. |
| 660 |                         conn.execute( | Performs SQLite database connection/query/schema operation. |
| 661 |                             "UPDATE farmer_paddocks SET cattle_ids='[]', status='available' WHERE id=?", | Performs SQLite database connection/query/schema operation. |
| 662 |                             (p['id'],) | Structural syntax token delimiting code blocks/collections. |
| 663 |                         ) | Structural syntax token delimiting code blocks/collections. |
| 664 | (blank) | Blank line for readability and section separation. |
| 665 |                 target = conn.execute('SELECT * FROM farmer_paddocks WHERE id=?', (target_paddock_id,)).fetchone() | Performs SQLite database connection/query/schema operation. |
| 666 |                 if target: | Conditional branch that executes when condition is true. |
| 667 |                     final_cattle_ids = sched_cattle_ids if sched_cattle_ids else [ | Implements file-specific logic, configuration, or structure in this context. |
| 668 |                         c.cattle_id for c in cattle_service.get_all_cattle() | Implements file-specific logic, configuration, or structure in this context. |
| 669 |                     ] | Structural syntax token delimiting code blocks/collections. |
| 670 |                     conn.execute( | Performs SQLite database connection/query/schema operation. |
| 671 |                         "UPDATE farmer_paddocks SET cattle_ids=?, status='occupied' WHERE id=?", | Performs SQLite database connection/query/schema operation. |
| 672 |                         (json.dumps(final_cattle_ids), target_paddock_id) | Structural syntax token delimiting code blocks/collections. |
| 673 |                     ) | Structural syntax token delimiting code blocks/collections. |
| 674 |                     print(f"[SCHED] Activated schedule {sched['id']} â†’ moving herd to {target['name']}") | Implements file-specific logic, configuration, or structure in this context. |
| 675 | (blank) | Blank line for readability and section separation. |
| 676 |                 conn.execute('UPDATE schedules SET activated=1 WHERE id=?', (sched['id'],)) | Performs SQLite database connection/query/schema operation. |
| 677 |                 conn.commit() | Implements file-specific logic, configuration, or structure in this context. |
| 678 | (blank) | Blank line for readability and section separation. |
| 679 |                 socketio.emit('schedule_activated', { | Emits real-time event data to connected clients. |
| 680 |                     'schedule_id': sched['id'], | Implements file-specific logic, configuration, or structure in this context. |
| 681 |                     'paddock_id': target_paddock_id, | Implements file-specific logic, configuration, or structure in this context. |
| 682 |                     'paddock_name': target['name'] if target else None, | Implements file-specific logic, configuration, or structure in this context. |
| 683 |                     'timestamp': datetime.now().isoformat() | Implements file-specific logic, configuration, or structure in this context. |
| 684 |                 }, to=None) | Structural syntax token delimiting code blocks/collections. |
| 685 |                 socketio.emit('paddock_updated', {}, to=None) | Emits real-time event data to connected clients. |
| 686 | (blank) | Blank line for readability and section separation. |
| 687 |             conn.close() | Implements file-specific logic, configuration, or structure in this context. |
| 688 |         except Exception as e: | Handles exceptions raised in the try block. |
| 689 |             print(f"[SCHED] Error: {e}") | Starts object property block for grouped configuration/style. |
| 690 | (blank) | Blank line for readability and section separation. |
| 691 |         time.sleep(2) | Implements file-specific logic, configuration, or structure in this context. |
| 692 | (blank) | Blank line for readability and section separation. |
| 693 | # ============================================================================ | Comment line documenting intent or context. |
| 694 | # ERROR HANDLERS | Comment line documenting intent or context. |
| 695 | # ============================================================================ | Comment line documenting intent or context. |
| 696 | (blank) | Blank line for readability and section separation. |
| 697 | @app.errorhandler(404) | Implements file-specific logic, configuration, or structure in this context. |
| 698 | def not_found(error): | Defines a function with reusable logic. |
| 699 |     return jsonify({'error': 'Endpoint not found'}), 404 | Returns data/control from the current function/component. |
| 700 | (blank) | Blank line for readability and section separation. |
| 701 | @app.errorhandler(500) | Implements file-specific logic, configuration, or structure in this context. |
| 702 | def server_error(error): | Defines a function with reusable logic. |
| 703 |     return jsonify({'error': 'Internal server error'}), 500 | Returns data/control from the current function/component. |
| 704 | (blank) | Blank line for readability and section separation. |
| 705 | # ============================================================================ | Comment line documenting intent or context. |
| 706 | # MAIN | Comment line documenting intent or context. |
| 707 | # ============================================================================ | Comment line documenting intent or context. |
| 708 | (blank) | Blank line for readability and section separation. |
| 709 | if __name__ == '__main__': | Conditional branch that executes when condition is true. |
| 710 |     print("\n" + "="*100) | Implements file-specific logic, configuration, or structure in this context. |
| 711 |     print("VIRTUALHERD+ BACKEND - SQLITE + ENSEMBLE + FENCE BREACH + SCHEDULING") | Implements file-specific logic, configuration, or structure in this context. |
| 712 |     print("="*100) | Implements file-specific logic, configuration, or structure in this context. |
| 713 |     print(f"\nâœ“ SQLite: {DB_PATH}") | Starts object property block for grouped configuration/style. |
| 714 |     print(f"âœ“ CSV data: {len(data_loader.get_available_cows())} cattle available") | Starts object property block for grouped configuration/style. |
| 715 |     print(f"âœ“ ML Model: {'ENSEMBLE (99.99%)' if ensemble_model_loaded else 'FALLBACK'}") | Starts object property block for grouped configuration/style. |
| 716 |     print(f"âœ“ Fence breach detection: ENABLED") | Implements file-specific logic, configuration, or structure in this context. |
| 717 |     print(f"âœ“ Point-in-polygon: ENABLED") | Implements file-specific logic, configuration, or structure in this context. |
| 718 |     print(f"âœ“ Pasture scheduling: ENABLED (2s check interval â€” demo speed)") | Implements file-specific logic, configuration, or structure in this context. |
| 719 |     print(f"âœ“ Server: http://0.0.0.0:5000") | Implements file-specific logic, configuration, or structure in this context. |
| 720 |     print(f"\nðŸ“Š Endpoints:") | Implements file-specific logic, configuration, or structure in this context. |
| 721 |     print(f"  GET/POST   /api/cattle") | Implements file-specific logic, configuration, or structure in this context. |
| 722 |     print(f"  DELETE     /api/cattle/<id>") | Performs SQLite database connection/query/schema operation. |
| 723 |     print(f"  GET        /api/cattle/available") | Implements file-specific logic, configuration, or structure in this context. |
| 724 |     print(f"  GET/POST   /api/farmer/paddocks") | Implements file-specific logic, configuration, or structure in this context. |
| 725 |     print(f"  POST       /api/farmer/paddocks/<id>/assign") | Implements file-specific logic, configuration, or structure in this context. |
| 726 |     print(f"  DELETE     /api/farmer/paddocks/<id>") | Performs SQLite database connection/query/schema operation. |
| 727 |     print(f"  GET/POST   /api/farmer/schedules") | Implements file-specific logic, configuration, or structure in this context. |
| 728 |     print(f"  DELETE     /api/farmer/schedules/<id>") | Performs SQLite database connection/query/schema operation. |
| 729 |     print(f"  GET        /api/status") | Implements file-specific logic, configuration, or structure in this context. |
| 730 |     print(f"\nðŸ”— WebSocket events:") | Implements file-specific logic, configuration, or structure in this context. |
| 731 |     print(f"  start_simulation    â†’ starts movement + breach detection") | Implements file-specific logic, configuration, or structure in this context. |
| 732 |     print(f"  stop_simulation     â†’ stops loop") | Implements file-specific logic, configuration, or structure in this context. |
| 733 |     print(f"  fence_breach        â†’ emitted when cattle exits boundary") | Implements file-specific logic, configuration, or structure in this context. |
| 734 |     print(f"  schedule_activated  â†’ emitted when a scheduled pasture move fires") | Implements file-specific logic, configuration, or structure in this context. |
| 735 |     print(f"\n" + "="*100 + "\n") | Implements file-specific logic, configuration, or structure in this context. |
| 736 |     threading.Thread(target=schedule_checker_loop, daemon=True).start() | Implements file-specific logic, configuration, or structure in this context. |
| 737 |     socketio.run(app, host='0.0.0.0', port=5000, debug=True, use_reloader=False) | Implements file-specific logic, configuration, or structure in this context. |

## File: backend\Phase1_ML_Training.py

| Line | Code | Explanation |
|---:|---|---|
| 1 | """ | Implements file-specific logic, configuration, or structure in this context. |
| 2 | VIRTUALHERD+ ML MODEL TRAINING | Implements file-specific logic, configuration, or structure in this context. |
| 3 | Train behavior classifier from CSV data | Implements file-specific logic, configuration, or structure in this context. |
| 4 | """ | Implements file-specific logic, configuration, or structure in this context. |
| 5 | (blank) | Blank line for readability and section separation. |
| 6 | import pandas as pd | Imports a dependency/module needed in this file. |
| 7 | import numpy as np | Imports a dependency/module needed in this file. |
| 8 | from sklearn.ensemble import RandomForestClassifier | Imports specific symbol(s) from another module. |
| 9 | from sklearn.preprocessing import LabelEncoder | Imports specific symbol(s) from another module. |
| 10 | from sklearn.model_selection import train_test_split | Imports specific symbol(s) from another module. |
| 11 | from sklearn.metrics import classification_report, confusion_matrix, accuracy_score | Imports specific symbol(s) from another module. |
| 12 | import joblib | Imports a dependency/module needed in this file. |
| 13 | from pathlib import Path | Imports specific symbol(s) from another module. |
| 14 | import warnings | Imports a dependency/module needed in this file. |
| 15 | warnings.filterwarnings('ignore') | Implements file-specific logic, configuration, or structure in this context. |
| 16 | (blank) | Blank line for readability and section separation. |
| 17 | print("\n" + "="*80) | Implements file-specific logic, configuration, or structure in this context. |
| 18 | print("VIRTUALHERD+ - ML MODEL TRAINING PHASE") | Implements file-specific logic, configuration, or structure in this context. |
| 19 | print("="*80) | Implements file-specific logic, configuration, or structure in this context. |
| 20 | (blank) | Blank line for readability and section separation. |
| 21 | # ============================================================================ | Comment line documenting intent or context. |
| 22 | # LOAD DATA | Comment line documenting intent or context. |
| 23 | # ============================================================================ | Comment line documenting intent or context. |
| 24 | (blank) | Blank line for readability and section separation. |
| 25 | csv_path = Path('data/combined_virtual_fencing_dataset.csv') | Implements file-specific logic, configuration, or structure in this context. |
| 26 | print(f"\n[TRAIN] Loading CSV: {csv_path}") | Starts object property block for grouped configuration/style. |
| 27 | (blank) | Blank line for readability and section separation. |
| 28 | df = pd.read_csv(csv_path) | Implements file-specific logic, configuration, or structure in this context. |
| 29 | print(f"[TRAIN] âœ“ Loaded {len(df)} rows") | Implements file-specific logic, configuration, or structure in this context. |
| 30 | print(f"[TRAIN] Columns: {len(df.columns)}") | Starts object property block for grouped configuration/style. |
| 31 | (blank) | Blank line for readability and section separation. |
| 32 | # ============================================================================ | Comment line documenting intent or context. |
| 33 | # FEATURE ENGINEERING | Comment line documenting intent or context. |
| 34 | # ============================================================================ | Comment line documenting intent or context. |
| 35 | (blank) | Blank line for readability and section separation. |
| 36 | print(f"\n[TRAIN] Engineering features from cattle metrics...") | Implements file-specific logic, configuration, or structure in this context. |
| 37 | (blank) | Blank line for readability and section separation. |
| 38 | # Create synthetic behavior labels based on activity patterns | Comment line documenting intent or context. |
| 39 | # 14 behavior classes matching real cattle behavior | Comment line documenting intent or context. |
| 40 | behaviors = [ | Implements file-specific logic, configuration, or structure in this context. |
| 41 |     'ETC',  # Eating | Implements file-specific logic, configuration, or structure in this context. |
| 42 |     'RES',  # Resting | Implements file-specific logic, configuration, or structure in this context. |
| 43 |     'RUS',  # Ruminating (standing) | Implements file-specific logic, configuration, or structure in this context. |
| 44 |     'MOV',  # Movement | Implements file-specific logic, configuration, or structure in this context. |
| 45 |     'GRZ',  # Grazing | Implements file-specific logic, configuration, or structure in this context. |
| 46 |     'SLT',  # Sleeping/Lying | Implements file-specific logic, configuration, or structure in this context. |
| 47 |     'FES',  # Feeding (supplementary) | Implements file-specific logic, configuration, or structure in this context. |
| 48 |     'DRN',  # Drinking | Implements file-specific logic, configuration, or structure in this context. |
| 49 |     'LCK',  # Licking | Implements file-specific logic, configuration, or structure in this context. |
| 50 |     'REL',  # Social/Relief behaviors | Implements file-specific logic, configuration, or structure in this context. |
| 51 |     'URI',  # Urinating | Implements file-specific logic, configuration, or structure in this context. |
| 52 |     'ATT',  # Attention/Alert | Implements file-specific logic, configuration, or structure in this context. |
| 53 |     'ESC',  # Escaping/Running | Implements file-specific logic, configuration, or structure in this context. |
| 54 |     'BMN'   # Begging/Missing behavior | Implements file-specific logic, configuration, or structure in this context. |
| 55 | ] | Structural syntax token delimiting code blocks/collections. |
| 56 | (blank) | Blank line for readability and section separation. |
| 57 | # Extract features for ML model | Comment line documenting intent or context. |
| 58 | def create_features(row): | Defines a function with reusable logic. |
| 59 |     """Create feature vector from row data""" | Implements file-specific logic, configuration, or structure in this context. |
| 60 |     try: | Starts protected block for exception handling. |
| 61 |         # Numeric features from CSV | Comment line documenting intent or context. |
| 62 |         temp = float(row.get('collars_Temperature', 38.5)) | Implements file-specific logic, configuration, or structure in this context. |
| 63 |         hr = float(row.get('health_heart_rate_(BPM)', 80)) | Implements file-specific logic, configuration, or structure in this context. |
| 64 |         activity = float(row.get('GPS_Activity', 3)) | Implements file-specific logic, configuration, or structure in this context. |
| 65 |         milk = float(row.get('training_milk_production_lpd', 24)) | Implements file-specific logic, configuration, or structure in this context. |
| 66 |         pulse_freq = float(row.get('training_paddock_pulse_freq_per_day', 5)) | Implements file-specific logic, configuration, or structure in this context. |
| 67 |         sound_freq = float(row.get('training_paddock_sound_freq_per_day', 20)) | Implements file-specific logic, configuration, or structure in this context. |
| 68 | (blank) | Blank line for readability and section separation. |
| 69 |         # Create derived features | Comment line documenting intent or context. |
| 70 |         activity_level = activity / 10.0 | Implements file-specific logic, configuration, or structure in this context. |
| 71 |         temp_deviation = abs(temp - 38.5) | Implements file-specific logic, configuration, or structure in this context. |
| 72 |         hr_stress = max(0, hr - 80) / 40.0 | Implements file-specific logic, configuration, or structure in this context. |
| 73 |         milk_stress = max(0, 24 - milk) / 10.0 | Implements file-specific logic, configuration, or structure in this context. |
| 74 |         pulse_sound_ratio = pulse_freq / (sound_freq + 0.1) | Implements file-specific logic, configuration, or structure in this context. |
| 75 | (blank) | Blank line for readability and section separation. |
| 76 |         return [activity_level, temp_deviation, hr_stress, milk_stress, | Returns data/control from the current function/component. |
| 77 |                 pulse_sound_ratio, temp, hr, milk, pulse_freq, sound_freq, | Implements file-specific logic, configuration, or structure in this context. |
| 78 |                 activity, sound_freq * activity_level] | Implements file-specific logic, configuration, or structure in this context. |
| 79 |     except: | Assigns a property/value pair in object/CSS context. |
| 80 |         return [0] * 12 | Returns data/control from the current function/component. |
| 81 | (blank) | Blank line for readability and section separation. |
| 82 | def assign_behavior(row): | Defines a function with reusable logic. |
| 83 |     """Assign behavior label based on metrics""" | Implements file-specific logic, configuration, or structure in this context. |
| 84 |     try: | Starts protected block for exception handling. |
| 85 |         temp = float(row.get('collars_Temperature', 38.5)) | Implements file-specific logic, configuration, or structure in this context. |
| 86 |         hr = float(row.get('health_heart_rate_(BPM)', 80)) | Implements file-specific logic, configuration, or structure in this context. |
| 87 |         activity = float(row.get('GPS_Activity', 3)) | Implements file-specific logic, configuration, or structure in this context. |
| 88 |         milk = float(row.get('training_milk_production_lpd', 24)) | Implements file-specific logic, configuration, or structure in this context. |
| 89 | (blank) | Blank line for readability and section separation. |
| 90 |         # Decision tree logic for behavior classification | Comment line documenting intent or context. |
| 91 |         if hr > 100: | Conditional branch that executes when condition is true. |
| 92 |             return 'ESC'  # High HR = Running/Escaping | Returns data/control from the current function/component. |
| 93 |         elif temp > 39.5: | Alternative conditional branch in Python. |
| 94 |             return 'RES'  # High temp = Resting | Returns data/control from the current function/component. |
| 95 |         elif activity > 7: | Alternative conditional branch in Python. |
| 96 |             return 'MOV'  # High activity = Movement | Returns data/control from the current function/component. |
| 97 |         elif activity > 5: | Alternative conditional branch in Python. |
| 98 |             return 'GRZ'  # Medium activity = Grazing | Returns data/control from the current function/component. |
| 99 |         elif activity < 2: | Alternative conditional branch in Python. |
| 100 |             return 'SLT'  # Low activity = Sleeping/Lying | Returns data/control from the current function/component. |
| 101 |         elif hr < 70: | Alternative conditional branch in Python. |
| 102 |             return 'DRN'  # Low HR = Drinking/Calm | Returns data/control from the current function/component. |
| 103 |         elif milk < 18: | Alternative conditional branch in Python. |
| 104 |             return 'RUS'  # Low milk = Ruminating | Returns data/control from the current function/component. |
| 105 |         else: | Fallback branch when prior conditions fail. |
| 106 |             return 'RES'  # Default = Resting | Returns data/control from the current function/component. |
| 107 |     except: | Assigns a property/value pair in object/CSS context. |
| 108 |         return 'GRZ' | Returns data/control from the current function/component. |
| 109 | (blank) | Blank line for readability and section separation. |
| 110 | print("[TRAIN] Creating features and labels...") | Implements file-specific logic, configuration, or structure in this context. |
| 111 | (blank) | Blank line for readability and section separation. |
| 112 | # Create feature matrix | Comment line documenting intent or context. |
| 113 | X = [] | Implements file-specific logic, configuration, or structure in this context. |
| 114 | y = [] | Implements file-specific logic, configuration, or structure in this context. |
| 115 | (blank) | Blank line for readability and section separation. |
| 116 | for idx, row in df.iterrows(): | Loop iterating over a sequence or range. |
| 117 |     features = create_features(row) | Implements file-specific logic, configuration, or structure in this context. |
| 118 |     behavior = assign_behavior(row) | Implements file-specific logic, configuration, or structure in this context. |
| 119 |     X.append(features) | Implements file-specific logic, configuration, or structure in this context. |
| 120 |     y.append(behavior) | Implements file-specific logic, configuration, or structure in this context. |
| 121 | (blank) | Blank line for readability and section separation. |
| 122 |     if (idx + 1) % 10000 == 0: | Conditional branch that executes when condition is true. |
| 123 |         print(f"  Processed {idx + 1}/{len(df)} rows") | Implements file-specific logic, configuration, or structure in this context. |
| 124 | (blank) | Blank line for readability and section separation. |
| 125 | X = np.array(X) | Implements file-specific logic, configuration, or structure in this context. |
| 126 | y = np.array(y) | Implements file-specific logic, configuration, or structure in this context. |
| 127 | (blank) | Blank line for readability and section separation. |
| 128 | print(f"[TRAIN] âœ“ Created {len(X)} feature vectors") | Implements file-specific logic, configuration, or structure in this context. |
| 129 | print(f"[TRAIN] âœ“ Assigned {len(y)} behavior labels") | Implements file-specific logic, configuration, or structure in this context. |
| 130 | (blank) | Blank line for readability and section separation. |
| 131 | # ============================================================================ | Comment line documenting intent or context. |
| 132 | # LABEL ENCODING | Comment line documenting intent or context. |
| 133 | # ============================================================================ | Comment line documenting intent or context. |
| 134 | (blank) | Blank line for readability and section separation. |
| 135 | print(f"\n[TRAIN] Encoding behavior labels...") | Implements file-specific logic, configuration, or structure in this context. |
| 136 | (blank) | Blank line for readability and section separation. |
| 137 | label_encoder = LabelEncoder() | Machine-learning pipeline operation (training/evaluation/encoding). |
| 138 | y_encoded = label_encoder.fit_transform(y) | Implements file-specific logic, configuration, or structure in this context. |
| 139 | (blank) | Blank line for readability and section separation. |
| 140 | print(f"[TRAIN] âœ“ Encoded {len(label_encoder.classes_)} unique behaviors:") | Implements file-specific logic, configuration, or structure in this context. |
| 141 | for idx, behavior in enumerate(label_encoder.classes_): | Loop iterating over a sequence or range. |
| 142 |     count = np.sum(y == behavior) | Implements file-specific logic, configuration, or structure in this context. |
| 143 |     print(f"  {behavior}: {count} samples ({count/len(y)*100:.1f}%)") | Starts object property block for grouped configuration/style. |
| 144 | (blank) | Blank line for readability and section separation. |
| 145 | # ============================================================================ | Comment line documenting intent or context. |
| 146 | # TRAIN TEST SPLIT | Comment line documenting intent or context. |
| 147 | # ============================================================================ | Comment line documenting intent or context. |
| 148 | (blank) | Blank line for readability and section separation. |
| 149 | print(f"\n[TRAIN] Splitting data (80% train, 20% test)...") | Implements file-specific logic, configuration, or structure in this context. |
| 150 | (blank) | Blank line for readability and section separation. |
| 151 | X_train, X_test, y_train, y_test = train_test_split( | Machine-learning pipeline operation (training/evaluation/encoding). |
| 152 |     X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded | Implements file-specific logic, configuration, or structure in this context. |
| 153 | ) | Structural syntax token delimiting code blocks/collections. |
| 154 | (blank) | Blank line for readability and section separation. |
| 155 | print(f"[TRAIN] âœ“ Training set: {len(X_train)} samples") | Starts object property block for grouped configuration/style. |
| 156 | print(f"[TRAIN] âœ“ Test set: {len(X_test)} samples") | Starts object property block for grouped configuration/style. |
| 157 | (blank) | Blank line for readability and section separation. |
| 158 | # ============================================================================ | Comment line documenting intent or context. |
| 159 | # TRAIN RANDOM FOREST | Comment line documenting intent or context. |
| 160 | # ============================================================================ | Comment line documenting intent or context. |
| 161 | (blank) | Blank line for readability and section separation. |
| 162 | print(f"\n[TRAIN] Training Random Forest Classifier...") | Implements file-specific logic, configuration, or structure in this context. |
| 163 | print(f"[TRAIN] Parameters: n_estimators=200, max_depth=15, random_state=42") | Implements file-specific logic, configuration, or structure in this context. |
| 164 | (blank) | Blank line for readability and section separation. |
| 165 | model = RandomForestClassifier( | Machine-learning pipeline operation (training/evaluation/encoding). |
| 166 |     n_estimators=200, | Implements file-specific logic, configuration, or structure in this context. |
| 167 |     max_depth=15, | Implements file-specific logic, configuration, or structure in this context. |
| 168 |     min_samples_split=5, | Implements file-specific logic, configuration, or structure in this context. |
| 169 |     min_samples_leaf=2, | Implements file-specific logic, configuration, or structure in this context. |
| 170 |     random_state=42, | Implements file-specific logic, configuration, or structure in this context. |
| 171 |     n_jobs=-1, | Implements file-specific logic, configuration, or structure in this context. |
| 172 |     verbose=1 | Implements file-specific logic, configuration, or structure in this context. |
| 173 | ) | Structural syntax token delimiting code blocks/collections. |
| 174 | (blank) | Blank line for readability and section separation. |
| 175 | model.fit(X_train, y_train) | Implements file-specific logic, configuration, or structure in this context. |
| 176 | print(f"[TRAIN] âœ“ Model training complete!") | Implements file-specific logic, configuration, or structure in this context. |
| 177 | (blank) | Blank line for readability and section separation. |
| 178 | # ============================================================================ | Comment line documenting intent or context. |
| 179 | # EVALUATE MODEL | Comment line documenting intent or context. |
| 180 | # ============================================================================ | Comment line documenting intent or context. |
| 181 | (blank) | Blank line for readability and section separation. |
| 182 | print(f"\n[TRAIN] Evaluating model...") | Implements file-specific logic, configuration, or structure in this context. |
| 183 | (blank) | Blank line for readability and section separation. |
| 184 | # Training accuracy | Comment line documenting intent or context. |
| 185 | train_pred = model.predict(X_train) | Implements file-specific logic, configuration, or structure in this context. |
| 186 | train_acc = accuracy_score(y_train, train_pred) | Machine-learning pipeline operation (training/evaluation/encoding). |
| 187 | print(f"[TRAIN] Training Accuracy: {train_acc*100:.2f}%") | Starts object property block for grouped configuration/style. |
| 188 | (blank) | Blank line for readability and section separation. |
| 189 | # Test accuracy | Comment line documenting intent or context. |
| 190 | test_pred = model.predict(X_test) | Implements file-specific logic, configuration, or structure in this context. |
| 191 | test_acc = accuracy_score(y_test, test_pred) | Machine-learning pipeline operation (training/evaluation/encoding). |
| 192 | print(f"[TRAIN] âœ“ Test Accuracy: {test_acc*100:.2f}%") | Starts object property block for grouped configuration/style. |
| 193 | (blank) | Blank line for readability and section separation. |
| 194 | print(f"\n[TRAIN] Classification Report:") | Implements file-specific logic, configuration, or structure in this context. |
| 195 | print(classification_report(y_test, test_pred, target_names=label_encoder.classes_)) | Machine-learning pipeline operation (training/evaluation/encoding). |
| 196 | (blank) | Blank line for readability and section separation. |
| 197 | # ============================================================================ | Comment line documenting intent or context. |
| 198 | # FEATURE IMPORTANCE | Comment line documenting intent or context. |
| 199 | # ============================================================================ | Comment line documenting intent or context. |
| 200 | (blank) | Blank line for readability and section separation. |
| 201 | print(f"\n[TRAIN] Feature Importance (Top 5):") | Implements file-specific logic, configuration, or structure in this context. |
| 202 | (blank) | Blank line for readability and section separation. |
| 203 | feature_names = [ | Implements file-specific logic, configuration, or structure in this context. |
| 204 |     'activity_level', 'temp_deviation', 'hr_stress', 'milk_stress', | Implements file-specific logic, configuration, or structure in this context. |
| 205 |     'pulse_sound_ratio', 'temperature', 'heart_rate', 'milk_production', | Implements file-specific logic, configuration, or structure in this context. |
| 206 |     'pulse_freq', 'sound_freq', 'activity', 'sound_activity_interaction' | Implements file-specific logic, configuration, or structure in this context. |
| 207 | ] | Structural syntax token delimiting code blocks/collections. |
| 208 | (blank) | Blank line for readability and section separation. |
| 209 | importances = model.feature_importances_ | Implements file-specific logic, configuration, or structure in this context. |
| 210 | indices = np.argsort(importances)[::-1] | Implements file-specific logic, configuration, or structure in this context. |
| 211 | (blank) | Blank line for readability and section separation. |
| 212 | for i in range(min(5, len(feature_names))): | Loop iterating over a sequence or range. |
| 213 |     idx = indices[i] | Implements file-specific logic, configuration, or structure in this context. |
| 214 |     print(f"  {i+1}. {feature_names[idx]}: {importances[idx]:.4f}") | Starts object property block for grouped configuration/style. |
| 215 | (blank) | Blank line for readability and section separation. |
| 216 | # ============================================================================ | Comment line documenting intent or context. |
| 217 | # SAVE MODEL | Comment line documenting intent or context. |
| 218 | # ============================================================================ | Comment line documenting intent or context. |
| 219 | (blank) | Blank line for readability and section separation. |
| 220 | print(f"\n[TRAIN] Saving trained model...") | Implements file-specific logic, configuration, or structure in this context. |
| 221 | (blank) | Blank line for readability and section separation. |
| 222 | models_dir = Path('ml_models') | Implements file-specific logic, configuration, or structure in this context. |
| 223 | models_dir.mkdir(exist_ok=True) | Implements file-specific logic, configuration, or structure in this context. |
| 224 | (blank) | Blank line for readability and section separation. |
| 225 | # Save model | Comment line documenting intent or context. |
| 226 | model_path = models_dir / 'behavior_classifier.pkl' | Implements file-specific logic, configuration, or structure in this context. |
| 227 | joblib.dump(model, model_path) | Loads or saves serialized ML artifact with joblib. |
| 228 | print(f"[TRAIN] âœ“ Saved: {model_path}") | Starts object property block for grouped configuration/style. |
| 229 | (blank) | Blank line for readability and section separation. |
| 230 | # Save label encoder | Comment line documenting intent or context. |
| 231 | encoder_path = models_dir / 'label_encoder.pkl' | Implements file-specific logic, configuration, or structure in this context. |
| 232 | joblib.dump(label_encoder, encoder_path) | Loads or saves serialized ML artifact with joblib. |
| 233 | print(f"[TRAIN] âœ“ Saved: {encoder_path}") | Starts object property block for grouped configuration/style. |
| 234 | (blank) | Blank line for readability and section separation. |
| 235 | # Save feature list | Comment line documenting intent or context. |
| 236 | features_path = models_dir / 'feature_list.pkl' | Implements file-specific logic, configuration, or structure in this context. |
| 237 | joblib.dump(feature_names, features_path) | Loads or saves serialized ML artifact with joblib. |
| 238 | print(f"[TRAIN] âœ“ Saved: {features_path}") | Starts object property block for grouped configuration/style. |
| 239 | (blank) | Blank line for readability and section separation. |
| 240 | # ============================================================================ | Comment line documenting intent or context. |
| 241 | # SUMMARY | Comment line documenting intent or context. |
| 242 | # ============================================================================ | Comment line documenting intent or context. |
| 243 | (blank) | Blank line for readability and section separation. |
| 244 | print(f"\n" + "="*80) | Implements file-specific logic, configuration, or structure in this context. |
| 245 | print(f"TRAINING COMPLETE!") | Implements file-specific logic, configuration, or structure in this context. |
| 246 | print(f"="*80) | Implements file-specific logic, configuration, or structure in this context. |
| 247 | print(f"\nâœ“ Model Accuracy: {test_acc*100:.2f}%") | Starts object property block for grouped configuration/style. |
| 248 | print(f"âœ“ Behaviors: {len(label_encoder.classes_)}") | Starts object property block for grouped configuration/style. |
| 249 | print(f"âœ“ Training Samples: {len(X_train)}") | Starts object property block for grouped configuration/style. |
| 250 | print(f"âœ“ Test Samples: {len(X_test)}") | Starts object property block for grouped configuration/style. |
| 251 | print(f"\nâœ“ Model saved to: {model_path}") | Starts object property block for grouped configuration/style. |
| 252 | print(f"âœ“ Label encoder saved to: {encoder_path}") | Starts object property block for grouped configuration/style. |
| 253 | print(f"âœ“ Feature list saved to: {features_path}") | Starts object property block for grouped configuration/style. |
| 254 | print(f"\nâœ“ Ready to use in app.py!") | Implements file-specific logic, configuration, or structure in this context. |
| 255 | print(f"="*80 + "\n") | Implements file-specific logic, configuration, or structure in this context. |

## File: backend\models\cattle.py

| Line | Code | Explanation |
|---:|---|---|
| 1 | """ | Implements file-specific logic, configuration, or structure in this context. |
| 2 | Cattle Data Model | Implements file-specific logic, configuration, or structure in this context. |
| 3 | Represents a single dairy cow with all attributes | Implements file-specific logic, configuration, or structure in this context. |
| 4 | """ | Implements file-specific logic, configuration, or structure in this context. |
| 5 | (blank) | Blank line for readability and section separation. |
| 6 | from datetime import datetime | Imports specific symbol(s) from another module. |
| 7 | import random | Imports a dependency/module needed in this file. |
| 8 | import math | Imports a dependency/module needed in this file. |
| 9 | (blank) | Blank line for readability and section separation. |
| 10 | class Cattle: | Defines a class and its associated behavior/state. |
| 11 |     """ | Implements file-specific logic, configuration, or structure in this context. |
| 12 |     Dairy cattle object with real-world attributes | Implements file-specific logic, configuration, or structure in this context. |
| 13 |     Initialized with data from CSV | Implements file-specific logic, configuration, or structure in this context. |
| 14 |     """ | Implements file-specific logic, configuration, or structure in this context. |
| 15 | (blank) | Blank line for readability and section separation. |
| 16 |     def __init__(self, cattle_id, csv_row=None): | Defines a function with reusable logic. |
| 17 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 18 |         Initialize cattle with optional CSV data | Implements file-specific logic, configuration, or structure in this context. |
| 19 | (blank) | Blank line for readability and section separation. |
| 20 |         Args: | Assigns a property/value pair in object/CSS context. |
| 21 |             cattle_id: Unique identifier | Assigns a property/value pair in object/CSS context. |
| 22 |             csv_row: Dictionary from CSV (optional) | Assigns a property/value pair in object/CSS context. |
| 23 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 24 |         self.cattle_id = cattle_id | Implements file-specific logic, configuration, or structure in this context. |
| 25 | (blank) | Blank line for readability and section separation. |
| 26 |         # Position (simulated farm coordinates 0-100) | Comment line documenting intent or context. |
| 27 |         self.x = random.uniform(20, 80) | Implements file-specific logic, configuration, or structure in this context. |
| 28 |         self.y = random.uniform(20, 80) | Implements file-specific logic, configuration, or structure in this context. |
| 29 |         self.heading = random.uniform(0, 360) | Implements file-specific logic, configuration, or structure in this context. |
| 30 |         self.speed = random.uniform(0.3, 0.8) | Implements file-specific logic, configuration, or structure in this context. |
| 31 | (blank) | Blank line for readability and section separation. |
| 32 |         # Behavior (from ML model) | Comment line documenting intent or context. |
| 33 |         self.behavior = "GRZ"  # Will be updated by ML predictions | Performs SQLite database connection/query/schema operation. |
| 34 |         self.behavior_confidence = 0.85 | Implements file-specific logic, configuration, or structure in this context. |
| 35 | (blank) | Blank line for readability and section separation. |
| 36 |         # Health metrics (from CSV or defaults) | Comment line documenting intent or context. |
| 37 |         if csv_row: | Conditional branch that executes when condition is true. |
| 38 |             self.temperature = float(csv_row.get('collars_Temperature', 38.5)) | Implements file-specific logic, configuration, or structure in this context. |
| 39 |             self.heart_rate = int(csv_row.get('health_heart_rate_(BPM)', 80)) | Implements file-specific logic, configuration, or structure in this context. |
| 40 |             self.heat_stress = float(csv_row.get('health_heat_stress_(Â°C)', 0)) | Implements file-specific logic, configuration, or structure in this context. |
| 41 |             self.milk_production = float(csv_row.get('training_milk_production_lpd', 24.0)) | Implements file-specific logic, configuration, or structure in this context. |
| 42 |             self.pulse_freq = float(csv_row.get('training_paddock_pulse_freq_per_day', 5.0)) | Implements file-specific logic, configuration, or structure in this context. |
| 43 |             self.sound_freq = float(csv_row.get('training_paddock_sound_freq_per_day', 20.0)) | Implements file-specific logic, configuration, or structure in this context. |
| 44 |             self.pulse_sound_ratio = float(csv_row.get('training_paddock_pulse_sound_ratio', 0.22)) | Implements file-specific logic, configuration, or structure in this context. |
| 45 |         else: | Fallback branch when prior conditions fail. |
| 46 |             self.temperature = 38.5 | Implements file-specific logic, configuration, or structure in this context. |
| 47 |             self.heart_rate = 80 | Implements file-specific logic, configuration, or structure in this context. |
| 48 |             self.heat_stress = 0.0 | Implements file-specific logic, configuration, or structure in this context. |
| 49 |             self.milk_production = 24.0 | Implements file-specific logic, configuration, or structure in this context. |
| 50 |             self.pulse_freq = 5.0 | Implements file-specific logic, configuration, or structure in this context. |
| 51 |             self.sound_freq = 20.0 | Implements file-specific logic, configuration, or structure in this context. |
| 52 |             self.pulse_sound_ratio = 0.22 | Implements file-specific logic, configuration, or structure in this context. |
| 53 | (blank) | Blank line for readability and section separation. |
| 54 |         # Status | Comment line documenting intent or context. |
| 55 |         self.health_status = "healthy" | Implements file-specific logic, configuration, or structure in this context. |
| 56 |         self.lameness = False | Implements file-specific logic, configuration, or structure in this context. |
| 57 |         self.lying = False | Implements file-specific logic, configuration, or structure in this context. |
| 58 |         self.lying_duration = 0 | Implements file-specific logic, configuration, or structure in this context. |
| 59 |         self.last_alert = None | Implements file-specific logic, configuration, or structure in this context. |
| 60 |         self.pulse_count_today = 0 | Implements file-specific logic, configuration, or structure in this context. |
| 61 |         self.sound_count_today = 0 | Implements file-specific logic, configuration, or structure in this context. |
| 62 |         self.activity = 3 | Implements file-specific logic, configuration, or structure in this context. |
| 63 | (blank) | Blank line for readability and section separation. |
| 64 |         # Metadata | Comment line documenting intent or context. |
| 65 |         self.created_at = datetime.now().isoformat() | Implements file-specific logic, configuration, or structure in this context. |
| 66 |         self.last_updated = datetime.now().isoformat() | Performs SQLite database connection/query/schema operation. |
| 67 | (blank) | Blank line for readability and section separation. |
| 68 |     def update_position(self): | Defines a function with reusable logic. |
| 69 |         """Update cattle position (movement simulation)""" | Performs SQLite database connection/query/schema operation. |
| 70 |         # Random heading change | Comment line documenting intent or context. |
| 71 |         self.heading += random.uniform(-15, 15) | Implements file-specific logic, configuration, or structure in this context. |
| 72 |         if self.heading > 360: | Conditional branch that executes when condition is true. |
| 73 |             self.heading -= 360 | Implements file-specific logic, configuration, or structure in this context. |
| 74 |         if self.heading < 0: | Conditional branch that executes when condition is true. |
| 75 |             self.heading += 360 | Implements file-specific logic, configuration, or structure in this context. |
| 76 | (blank) | Blank line for readability and section separation. |
| 77 |         # Calculate new position | Comment line documenting intent or context. |
| 78 |         rad = math.radians(self.heading) | Implements file-specific logic, configuration, or structure in this context. |
| 79 |         self.x += self.speed * math.cos(rad) * 0.1 | Implements file-specific logic, configuration, or structure in this context. |
| 80 |         self.y += self.speed * math.sin(rad) * 0.1 | Implements file-specific logic, configuration, or structure in this context. |
| 81 | (blank) | Blank line for readability and section separation. |
| 82 |         # Keep within bounds | Comment line documenting intent or context. |
| 83 |         if self.x < 0: | Conditional branch that executes when condition is true. |
| 84 |             self.x = 0 | Implements file-specific logic, configuration, or structure in this context. |
| 85 |             self.heading = 180 - self.heading | Implements file-specific logic, configuration, or structure in this context. |
| 86 |         if self.x > 100: | Conditional branch that executes when condition is true. |
| 87 |             self.x = 100 | Implements file-specific logic, configuration, or structure in this context. |
| 88 |             self.heading = 180 - self.heading | Implements file-specific logic, configuration, or structure in this context. |
| 89 |         if self.y < 0: | Conditional branch that executes when condition is true. |
| 90 |             self.y = 0 | Implements file-specific logic, configuration, or structure in this context. |
| 91 |             self.heading = -self.heading | Implements file-specific logic, configuration, or structure in this context. |
| 92 |         if self.y > 100: | Conditional branch that executes when condition is true. |
| 93 |             self.y = 100 | Implements file-specific logic, configuration, or structure in this context. |
| 94 |             self.heading = -self.heading | Implements file-specific logic, configuration, or structure in this context. |
| 95 | (blank) | Blank line for readability and section separation. |
| 96 |     def update_health(self): | Defines a function with reusable logic. |
| 97 |         """Update health metrics""" | Performs SQLite database connection/query/schema operation. |
| 98 |         # Temperature fluctuation | Comment line documenting intent or context. |
| 99 |         self.temperature = max(37.5, min(41.0, self.temperature + random.uniform(-0.5, 0.5))) | Implements file-specific logic, configuration, or structure in this context. |
| 100 | (blank) | Blank line for readability and section separation. |
| 101 |         # Heart rate fluctuation | Comment line documenting intent or context. |
| 102 |         self.heart_rate = max(60, min(120, self.heart_rate + random.randint(-5, 5))) | Implements file-specific logic, configuration, or structure in this context. |
| 103 | (blank) | Blank line for readability and section separation. |
| 104 |         # Milk production variation | Comment line documenting intent or context. |
| 105 |         self.milk_production = max(15, min(35, self.milk_production + random.uniform(-0.5, 0.5))) | Implements file-specific logic, configuration, or structure in this context. |
| 106 | (blank) | Blank line for readability and section separation. |
| 107 |         # Determine health status | Comment line documenting intent or context. |
| 108 |         if self.temperature > 39.5: | Conditional branch that executes when condition is true. |
| 109 |             self.health_status = "fever" | Implements file-specific logic, configuration, or structure in this context. |
| 110 |         elif self.heart_rate > 100: | Alternative conditional branch in Python. |
| 111 |             self.health_status = "stressed" | Implements file-specific logic, configuration, or structure in this context. |
| 112 |         elif self.milk_production < 18: | Alternative conditional branch in Python. |
| 113 |             self.health_status = "low_milk" | Implements file-specific logic, configuration, or structure in this context. |
| 114 |         elif random.random() < 0.05: | Alternative conditional branch in Python. |
| 115 |             self.health_status = "lame" | Implements file-specific logic, configuration, or structure in this context. |
| 116 |             self.lameness = True | Implements file-specific logic, configuration, or structure in this context. |
| 117 |         else: | Fallback branch when prior conditions fail. |
| 118 |             self.health_status = "healthy" | Implements file-specific logic, configuration, or structure in this context. |
| 119 |             self.lameness = False | Implements file-specific logic, configuration, or structure in this context. |
| 120 | (blank) | Blank line for readability and section separation. |
| 121 |         # Lying/standing | Comment line documenting intent or context. |
| 122 |         if random.random() < 0.05: | Conditional branch that executes when condition is true. |
| 123 |             self.lying = not self.lying | Implements file-specific logic, configuration, or structure in this context. |
| 124 | (blank) | Blank line for readability and section separation. |
| 125 |         self.last_updated = datetime.now().isoformat() | Performs SQLite database connection/query/schema operation. |
| 126 | (blank) | Blank line for readability and section separation. |
| 127 |     def to_dict(self): | Defines a function with reusable logic. |
| 128 |         """Convert to dictionary for JSON response""" | Implements file-specific logic, configuration, or structure in this context. |
| 129 |         return { | Returns data/control from the current function/component. |
| 130 |             'cattle_id': self.cattle_id, | Implements file-specific logic, configuration, or structure in this context. |
| 131 |             'x': round(self.x, 2), | Implements file-specific logic, configuration, or structure in this context. |
| 132 |             'y': round(self.y, 2), | Implements file-specific logic, configuration, or structure in this context. |
| 133 |             'heading': round(self.heading, 1), | Implements file-specific logic, configuration, or structure in this context. |
| 134 |             'behavior': self.behavior, | Implements file-specific logic, configuration, or structure in this context. |
| 135 |             'confidence': round(self.behavior_confidence, 3), | Implements file-specific logic, configuration, or structure in this context. |
| 136 |             'temperature': round(self.temperature, 1), | Implements file-specific logic, configuration, or structure in this context. |
| 137 |             'heart_rate': self.heart_rate, | Implements file-specific logic, configuration, or structure in this context. |
| 138 |             'milk_production': round(self.milk_production, 1), | Implements file-specific logic, configuration, or structure in this context. |
| 139 |             'health_status': self.health_status, | Implements file-specific logic, configuration, or structure in this context. |
| 140 |             'lameness': self.lameness, | Implements file-specific logic, configuration, or structure in this context. |
| 141 |             'lying': self.lying, | Implements file-specific logic, configuration, or structure in this context. |
| 142 |             'pulse_freq': round(self.pulse_freq, 2), | Implements file-specific logic, configuration, or structure in this context. |
| 143 |             'sound_freq': round(self.sound_freq, 2), | Implements file-specific logic, configuration, or structure in this context. |
| 144 |             'pulse_count_today': self.pulse_count_today, | Implements file-specific logic, configuration, or structure in this context. |
| 145 |             'sound_count_today': self.sound_count_today, | Implements file-specific logic, configuration, or structure in this context. |
| 146 |             'created_at': self.created_at, | Implements file-specific logic, configuration, or structure in this context. |
| 147 |             'last_updated': self.last_updated | Performs SQLite database connection/query/schema operation. |
| 148 |         } | Structural syntax token delimiting code blocks/collections. |

## File: backend\services\cattle_service.py

| Line | Code | Explanation |
|---:|---|---|
| 1 | """ | Implements file-specific logic, configuration, or structure in this context. |
| 2 | Cattle Service | Implements file-specific logic, configuration, or structure in this context. |
| 3 | Business logic for cattle operations | Implements file-specific logic, configuration, or structure in this context. |
| 4 | """ | Implements file-specific logic, configuration, or structure in this context. |
| 5 | (blank) | Blank line for readability and section separation. |
| 6 | from models.cattle import Cattle | Imports specific symbol(s) from another module. |
| 7 | from services.data_loader import get_data_loader | Imports specific symbol(s) from another module. |
| 8 | import threading | Imports a dependency/module needed in this file. |
| 9 | (blank) | Blank line for readability and section separation. |
| 10 | class CattleService: | Defines a class and its associated behavior/state. |
| 11 |     """Manage cattle operations""" | Implements file-specific logic, configuration, or structure in this context. |
| 12 | (blank) | Blank line for readability and section separation. |
| 13 |     def __init__(self): | Defines a function with reusable logic. |
| 14 |         """Initialize cattle service""" | Implements file-specific logic, configuration, or structure in this context. |
| 15 |         self.cattle_dict = {} | Implements file-specific logic, configuration, or structure in this context. |
| 16 |         self.lock = threading.Lock() | Implements file-specific logic, configuration, or structure in this context. |
| 17 |         self.data_loader = get_data_loader() | Implements file-specific logic, configuration, or structure in this context. |
| 18 | (blank) | Blank line for readability and section separation. |
| 19 |     def add_cattle(self, cattle_id): | Defines a function with reusable logic. |
| 20 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 21 |         Add a cattle to the system from CSV data | Implements file-specific logic, configuration, or structure in this context. |
| 22 | (blank) | Blank line for readability and section separation. |
| 23 |         Args: | Assigns a property/value pair in object/CSS context. |
| 24 |             cattle_id: ID of cattle to add | Assigns a property/value pair in object/CSS context. |
| 25 | (blank) | Blank line for readability and section separation. |
| 26 |         Returns: | Assigns a property/value pair in object/CSS context. |
| 27 |             Cattle object or None if failed | Implements file-specific logic, configuration, or structure in this context. |
| 28 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 29 |         with self.lock: | Implements file-specific logic, configuration, or structure in this context. |
| 30 |             # Check if already exists | Comment line documenting intent or context. |
| 31 |             if cattle_id in self.cattle_dict: | Conditional branch that executes when condition is true. |
| 32 |                 print(f"[SERVICE] âš  Cattle {cattle_id} already exists") | Implements file-specific logic, configuration, or structure in this context. |
| 33 |                 return None | Returns data/control from the current function/component. |
| 34 | (blank) | Blank line for readability and section separation. |
| 35 |             # Create from CSV data | Comment line documenting intent or context. |
| 36 |             cattle = self.data_loader.create_cattle_from_csv(cattle_id) | Implements file-specific logic, configuration, or structure in this context. |
| 37 | (blank) | Blank line for readability and section separation. |
| 38 |             if cattle: | Conditional branch that executes when condition is true. |
| 39 |                 self.cattle_dict[cattle_id] = cattle | Implements file-specific logic, configuration, or structure in this context. |
| 40 |                 print(f"[SERVICE] âœ“ Added cattle {cattle_id}") | Implements file-specific logic, configuration, or structure in this context. |
| 41 |                 return cattle | Returns data/control from the current function/component. |
| 42 |             else: | Fallback branch when prior conditions fail. |
| 43 |                 print(f"[SERVICE] âœ— Failed to add cattle {cattle_id}") | Implements file-specific logic, configuration, or structure in this context. |
| 44 |                 return None | Returns data/control from the current function/component. |
| 45 | (blank) | Blank line for readability and section separation. |
| 46 |     def remove_cattle(self, cattle_id): | Defines a function with reusable logic. |
| 47 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 48 |         Remove a cattle from the system | Implements file-specific logic, configuration, or structure in this context. |
| 49 | (blank) | Blank line for readability and section separation. |
| 50 |         Args: | Assigns a property/value pair in object/CSS context. |
| 51 |             cattle_id: ID of cattle to remove | Assigns a property/value pair in object/CSS context. |
| 52 | (blank) | Blank line for readability and section separation. |
| 53 |         Returns: | Assigns a property/value pair in object/CSS context. |
| 54 |             True if successful, False otherwise | Implements file-specific logic, configuration, or structure in this context. |
| 55 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 56 |         with self.lock: | Implements file-specific logic, configuration, or structure in this context. |
| 57 |             if cattle_id in self.cattle_dict: | Conditional branch that executes when condition is true. |
| 58 |                 del self.cattle_dict[cattle_id] | Implements file-specific logic, configuration, or structure in this context. |
| 59 |                 print(f"[SERVICE] âœ“ Removed cattle {cattle_id}") | Implements file-specific logic, configuration, or structure in this context. |
| 60 |                 return True | Returns data/control from the current function/component. |
| 61 |             else: | Fallback branch when prior conditions fail. |
| 62 |                 print(f"[SERVICE] âš  Cattle {cattle_id} not found") | Implements file-specific logic, configuration, or structure in this context. |
| 63 |                 return False | Returns data/control from the current function/component. |
| 64 | (blank) | Blank line for readability and section separation. |
| 65 |     def get_cattle(self, cattle_id): | Defines a function with reusable logic. |
| 66 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 67 |         Get a specific cattle | Implements file-specific logic, configuration, or structure in this context. |
| 68 | (blank) | Blank line for readability and section separation. |
| 69 |         Args: | Assigns a property/value pair in object/CSS context. |
| 70 |             cattle_id: ID of cattle | Assigns a property/value pair in object/CSS context. |
| 71 | (blank) | Blank line for readability and section separation. |
| 72 |         Returns: | Assigns a property/value pair in object/CSS context. |
| 73 |             Cattle object or None | Implements file-specific logic, configuration, or structure in this context. |
| 74 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 75 |         with self.lock: | Implements file-specific logic, configuration, or structure in this context. |
| 76 |             return self.cattle_dict.get(cattle_id) | Returns data/control from the current function/component. |
| 77 | (blank) | Blank line for readability and section separation. |
| 78 |     def get_all_cattle(self): | Defines a function with reusable logic. |
| 79 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 80 |         Get all cattle | Implements file-specific logic, configuration, or structure in this context. |
| 81 | (blank) | Blank line for readability and section separation. |
| 82 |         Returns: | Assigns a property/value pair in object/CSS context. |
| 83 |             List of Cattle objects | Implements file-specific logic, configuration, or structure in this context. |
| 84 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 85 |         with self.lock: | Implements file-specific logic, configuration, or structure in this context. |
| 86 |             return list(self.cattle_dict.values()) | Returns data/control from the current function/component. |
| 87 | (blank) | Blank line for readability and section separation. |
| 88 |     def get_cattle_count(self): | Defines a function with reusable logic. |
| 89 |         """Get total number of cattle""" | Implements file-specific logic, configuration, or structure in this context. |
| 90 |         with self.lock: | Implements file-specific logic, configuration, or structure in this context. |
| 91 |             return len(self.cattle_dict) | Returns data/control from the current function/component. |
| 92 | (blank) | Blank line for readability and section separation. |
| 93 |     def get_all_cattle_dict(self): | Defines a function with reusable logic. |
| 94 |         """Get cattle dictionary""" | Implements file-specific logic, configuration, or structure in this context. |
| 95 |         with self.lock: | Implements file-specific logic, configuration, or structure in this context. |
| 96 |             return dict(self.cattle_dict) | Returns data/control from the current function/component. |
| 97 | (blank) | Blank line for readability and section separation. |
| 98 |     def update_all_cattle(self): | Defines a function with reusable logic. |
| 99 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 100 |         Update all cattle (position, health, etc.) | Performs SQLite database connection/query/schema operation. |
| 101 |         Called during simulation step | Implements file-specific logic, configuration, or structure in this context. |
| 102 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 103 |         with self.lock: | Implements file-specific logic, configuration, or structure in this context. |
| 104 |             for cattle in self.cattle_dict.values(): | Loop iterating over a sequence or range. |
| 105 |                 cattle.update_position() | Performs SQLite database connection/query/schema operation. |
| 106 |                 cattle.update_health() | Performs SQLite database connection/query/schema operation. |
| 107 | (blank) | Blank line for readability and section separation. |
| 108 |     def get_cattle_list_for_api(self): | Defines a function with reusable logic. |
| 109 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 110 |         Get all cattle as dictionary list (for API response) | Implements file-specific logic, configuration, or structure in this context. |
| 111 | (blank) | Blank line for readability and section separation. |
| 112 |         Returns: | Assigns a property/value pair in object/CSS context. |
| 113 |             List of cattle dictionaries | Implements file-specific logic, configuration, or structure in this context. |
| 114 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 115 |         with self.lock: | Implements file-specific logic, configuration, or structure in this context. |
| 116 |             return [cattle.to_dict() for cattle in self.cattle_dict.values()] | Returns data/control from the current function/component. |
| 117 | (blank) | Blank line for readability and section separation. |
| 118 |     def get_available_cattle_ids(self): | Defines a function with reusable logic. |
| 119 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 120 |         Get list of available cattle IDs from dataset | Implements file-specific logic, configuration, or structure in this context. |
| 121 |         (for mobile app "Add Cattle" dropdown) | Structural syntax token delimiting code blocks/collections. |
| 122 | (blank) | Blank line for readability and section separation. |
| 123 |         Returns: | Assigns a property/value pair in object/CSS context. |
| 124 |             List of available cattle IDs | Implements file-specific logic, configuration, or structure in this context. |
| 125 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 126 |         available = self.data_loader.get_available_cows() | Implements file-specific logic, configuration, or structure in this context. |
| 127 |         current = set(self.cattle_dict.keys()) | Implements file-specific logic, configuration, or structure in this context. |
| 128 | (blank) | Blank line for readability and section separation. |
| 129 |         # Return IDs that aren't already added | Comment line documenting intent or context. |
| 130 |         return [cid for cid in available if cid not in current] | Returns data/control from the current function/component. |
| 131 | (blank) | Blank line for readability and section separation. |
| 132 |     def get_health_summary(self): | Defines a function with reusable logic. |
| 133 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 134 |         Get herd health summary | Implements file-specific logic, configuration, or structure in this context. |
| 135 | (blank) | Blank line for readability and section separation. |
| 136 |         Returns: | Assigns a property/value pair in object/CSS context. |
| 137 |             Dictionary with health statistics | Implements file-specific logic, configuration, or structure in this context. |
| 138 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 139 |         with self.lock: | Implements file-specific logic, configuration, or structure in this context. |
| 140 |             total = len(self.cattle_dict) | Implements file-specific logic, configuration, or structure in this context. |
| 141 |             if total == 0: | Conditional branch that executes when condition is true. |
| 142 |                 return { | Returns data/control from the current function/component. |
| 143 |                     'total': 0, | Implements file-specific logic, configuration, or structure in this context. |
| 144 |                     'healthy': 0, | Implements file-specific logic, configuration, or structure in this context. |
| 145 |                     'fever': 0, | Implements file-specific logic, configuration, or structure in this context. |
| 146 |                     'lame': 0, | Implements file-specific logic, configuration, or structure in this context. |
| 147 |                     'stressed': 0, | Implements file-specific logic, configuration, or structure in this context. |
| 148 |                     'low_milk': 0 | Implements file-specific logic, configuration, or structure in this context. |
| 149 |                 } | Structural syntax token delimiting code blocks/collections. |
| 150 | (blank) | Blank line for readability and section separation. |
| 151 |             health_counts = { | Implements file-specific logic, configuration, or structure in this context. |
| 152 |                 'healthy': 0, | Implements file-specific logic, configuration, or structure in this context. |
| 153 |                 'fever': 0, | Implements file-specific logic, configuration, or structure in this context. |
| 154 |                 'lame': 0, | Implements file-specific logic, configuration, or structure in this context. |
| 155 |                 'stressed': 0, | Implements file-specific logic, configuration, or structure in this context. |
| 156 |                 'low_milk': 0 | Implements file-specific logic, configuration, or structure in this context. |
| 157 |             } | Structural syntax token delimiting code blocks/collections. |
| 158 | (blank) | Blank line for readability and section separation. |
| 159 |             for cattle in self.cattle_dict.values(): | Loop iterating over a sequence or range. |
| 160 |                 status = cattle.health_status | Implements file-specific logic, configuration, or structure in this context. |
| 161 |                 if status in health_counts: | Conditional branch that executes when condition is true. |
| 162 |                     health_counts[status] += 1 | Implements file-specific logic, configuration, or structure in this context. |
| 163 | (blank) | Blank line for readability and section separation. |
| 164 |             return { | Returns data/control from the current function/component. |
| 165 |                 'total': total, | Implements file-specific logic, configuration, or structure in this context. |
| 166 |                 **health_counts | Block comment content for documentation. |
| 167 |             } | Structural syntax token delimiting code blocks/collections. |
| 168 | (blank) | Blank line for readability and section separation. |
| 169 |     def get_alerts(self): | Defines a function with reusable logic. |
| 170 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 171 |         Get all current health alerts | Implements file-specific logic, configuration, or structure in this context. |
| 172 | (blank) | Blank line for readability and section separation. |
| 173 |         Returns: | Assigns a property/value pair in object/CSS context. |
| 174 |             List of alert dictionaries | Implements file-specific logic, configuration, or structure in this context. |
| 175 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 176 |         alerts = [] | Implements file-specific logic, configuration, or structure in this context. |
| 177 | (blank) | Blank line for readability and section separation. |
| 178 |         with self.lock: | Implements file-specific logic, configuration, or structure in this context. |
| 179 |             for cattle in self.cattle_dict.values(): | Loop iterating over a sequence or range. |
| 180 |                 if cattle.health_status != 'healthy': | Conditional branch that executes when condition is true. |
| 181 |                     alerts.append({ | Implements file-specific logic, configuration, or structure in this context. |
| 182 |                         'cattle_id': cattle.cattle_id, | Implements file-specific logic, configuration, or structure in this context. |
| 183 |                         'type': cattle.health_status.upper(), | Implements file-specific logic, configuration, or structure in this context. |
| 184 |                         'severity': 'critical' if cattle.health_status == 'fever' else 'warning', | Implements file-specific logic, configuration, or structure in this context. |
| 185 |                         'value': cattle.temperature if cattle.health_status == 'fever' else cattle.heart_rate, | Implements file-specific logic, configuration, or structure in this context. |
| 186 |                         'timestamp': cattle.last_updated | Performs SQLite database connection/query/schema operation. |
| 187 |                     }) | Structural syntax token delimiting code blocks/collections. |
| 188 | (blank) | Blank line for readability and section separation. |
| 189 |         return alerts | Returns data/control from the current function/component. |
| 190 | (blank) | Blank line for readability and section separation. |
| 191 | (blank) | Blank line for readability and section separation. |
| 192 | # Global instance | Comment line documenting intent or context. |
| 193 | _cattle_service = None | Implements file-specific logic, configuration, or structure in this context. |
| 194 | (blank) | Blank line for readability and section separation. |
| 195 | def get_cattle_service(): | Defines a function with reusable logic. |
| 196 |     """Get or create global cattle service instance""" | Implements file-specific logic, configuration, or structure in this context. |
| 197 |     global _cattle_service | Implements file-specific logic, configuration, or structure in this context. |
| 198 |     if _cattle_service is None: | Conditional branch that executes when condition is true. |
| 199 |         _cattle_service = CattleService() | Implements file-specific logic, configuration, or structure in this context. |
| 200 |     return _cattle_service | Returns data/control from the current function/component. |

## File: backend\services\data_loader.py

| Line | Code | Explanation |
|---:|---|---|
| 1 | """ | Implements file-specific logic, configuration, or structure in this context. |
| 2 | CSV Data Loader Service | Implements file-specific logic, configuration, or structure in this context. |
| 3 | Loads cattle data from combined_virtual_fencing_dataset.csv | Implements file-specific logic, configuration, or structure in this context. |
| 4 | """ | Implements file-specific logic, configuration, or structure in this context. |
| 5 | (blank) | Blank line for readability and section separation. |
| 6 | import pandas as pd | Imports a dependency/module needed in this file. |
| 7 | from pathlib import Path | Imports specific symbol(s) from another module. |
| 8 | from models.cattle import Cattle | Imports specific symbol(s) from another module. |
| 9 | (blank) | Blank line for readability and section separation. |
| 10 | class DataLoader: | Defines a class and its associated behavior/state. |
| 11 |     """Load and parse CSV data for cattle initialization""" | Implements file-specific logic, configuration, or structure in this context. |
| 12 | (blank) | Blank line for readability and section separation. |
| 13 |     def __init__(self, csv_path=None): | Defines a function with reusable logic. |
| 14 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 15 |         Initialize data loader | Implements file-specific logic, configuration, or structure in this context. |
| 16 | (blank) | Blank line for readability and section separation. |
| 17 |         Args: | Assigns a property/value pair in object/CSS context. |
| 18 |             csv_path: Path to CSV file (optional) | Assigns a property/value pair in object/CSS context. |
| 19 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 20 |         if csv_path is None: | Conditional branch that executes when condition is true. |
| 21 |             # Default path relative to backend folder | Comment line documenting intent or context. |
| 22 |             csv_path = Path(__file__).parent.parent / 'data' / 'combined_virtual_fencing_dataset.csv' | Implements file-specific logic, configuration, or structure in this context. |
| 23 | (blank) | Blank line for readability and section separation. |
| 24 |         self.csv_path = csv_path | Implements file-specific logic, configuration, or structure in this context. |
| 25 |         self.df = None | Implements file-specific logic, configuration, or structure in this context. |
| 26 |         self.unique_cows = [] | Implements file-specific logic, configuration, or structure in this context. |
| 27 | (blank) | Blank line for readability and section separation. |
| 28 |     def load_csv(self): | Defines a function with reusable logic. |
| 29 |         """Load CSV file into pandas DataFrame""" | Implements file-specific logic, configuration, or structure in this context. |
| 30 |         try: | Starts protected block for exception handling. |
| 31 |             print(f"[DATA] Loading CSV: {self.csv_path}") | Starts object property block for grouped configuration/style. |
| 32 |             self.df = pd.read_csv(self.csv_path) | Implements file-specific logic, configuration, or structure in this context. |
| 33 |             print(f"[DATA] âœ“ CSV loaded: {len(self.df)} rows") | Starts object property block for grouped configuration/style. |
| 34 |             return True | Returns data/control from the current function/component. |
| 35 |         except Exception as e: | Handles exceptions raised in the try block. |
| 36 |             print(f"[DATA] âœ— Error loading CSV: {e}") | Starts object property block for grouped configuration/style. |
| 37 |             return False | Returns data/control from the current function/component. |
| 38 | (blank) | Blank line for readability and section separation. |
| 39 |     def get_unique_cows(self): | Defines a function with reusable logic. |
| 40 |         """Get list of unique cattle IDs from CSV""" | Implements file-specific logic, configuration, or structure in this context. |
| 41 |         if self.df is None: | Conditional branch that executes when condition is true. |
| 42 |             return [] | Returns data/control from the current function/component. |
| 43 | (blank) | Blank line for readability and section separation. |
| 44 |         try: | Starts protected block for exception handling. |
| 45 |             # Get unique cow IDs from the 'training_cow_id' column | Comment line documenting intent or context. |
| 46 |             unique_ids = self.df['training_cow_id'].dropna().unique() | Implements file-specific logic, configuration, or structure in this context. |
| 47 |             self.unique_cows = sorted([int(x) for x in unique_ids]) | Implements file-specific logic, configuration, or structure in this context. |
| 48 |             print(f"[DATA] âœ“ Found {len(self.unique_cows)} unique cattle in dataset") | Implements file-specific logic, configuration, or structure in this context. |
| 49 |             return self.unique_cows | Returns data/control from the current function/component. |
| 50 |         except Exception as e: | Handles exceptions raised in the try block. |
| 51 |             print(f"[DATA] âœ— Error getting unique cows: {e}") | Starts object property block for grouped configuration/style. |
| 52 |             return [] | Returns data/control from the current function/component. |
| 53 | (blank) | Blank line for readability and section separation. |
| 54 |     def get_cow_data(self, cow_id): | Defines a function with reusable logic. |
| 55 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 56 |         Get data for specific cow from CSV | Implements file-specific logic, configuration, or structure in this context. |
| 57 | (blank) | Blank line for readability and section separation. |
| 58 |         Args: | Assigns a property/value pair in object/CSS context. |
| 59 |             cow_id: Cattle ID to fetch | Assigns a property/value pair in object/CSS context. |
| 60 | (blank) | Blank line for readability and section separation. |
| 61 |         Returns: | Assigns a property/value pair in object/CSS context. |
| 62 |             Dictionary with cow data or None | Implements file-specific logic, configuration, or structure in this context. |
| 63 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 64 |         if self.df is None: | Conditional branch that executes when condition is true. |
| 65 |             return None | Returns data/control from the current function/component. |
| 66 | (blank) | Blank line for readability and section separation. |
| 67 |         try: | Starts protected block for exception handling. |
| 68 |             cow_data = self.df[self.df['training_cow_id'] == cow_id] | Implements file-specific logic, configuration, or structure in this context. |
| 69 |             if len(cow_data) > 0: | Conditional branch that executes when condition is true. |
| 70 |                 # Return first row as dictionary | Comment line documenting intent or context. |
| 71 |                 return cow_data.iloc[0].to_dict() | Returns data/control from the current function/component. |
| 72 |             return None | Returns data/control from the current function/component. |
| 73 |         except Exception as e: | Handles exceptions raised in the try block. |
| 74 |             print(f"[DATA] âœ— Error getting cow data: {e}") | Starts object property block for grouped configuration/style. |
| 75 |             return None | Returns data/control from the current function/component. |
| 76 | (blank) | Blank line for readability and section separation. |
| 77 |     def create_cattle_from_csv(self, cattle_id): | Defines a function with reusable logic. |
| 78 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 79 |         Create Cattle object with real data from CSV | Implements file-specific logic, configuration, or structure in this context. |
| 80 | (blank) | Blank line for readability and section separation. |
| 81 |         Args: | Assigns a property/value pair in object/CSS context. |
| 82 |             cattle_id: ID of cattle to create | Assigns a property/value pair in object/CSS context. |
| 83 | (blank) | Blank line for readability and section separation. |
| 84 |         Returns: | Assigns a property/value pair in object/CSS context. |
| 85 |             Cattle object or None | Implements file-specific logic, configuration, or structure in this context. |
| 86 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 87 |         cow_data = self.get_cow_data(cattle_id) | Implements file-specific logic, configuration, or structure in this context. |
| 88 | (blank) | Blank line for readability and section separation. |
| 89 |         try: | Starts protected block for exception handling. |
| 90 |             cattle = Cattle(cattle_id, csv_row=cow_data) | Implements file-specific logic, configuration, or structure in this context. |
| 91 |             return cattle | Returns data/control from the current function/component. |
| 92 |         except Exception as e: | Handles exceptions raised in the try block. |
| 93 |             print(f"[DATA] âœ— Error creating cattle object: {e}") | Starts object property block for grouped configuration/style. |
| 94 |             return None | Returns data/control from the current function/component. |
| 95 | (blank) | Blank line for readability and section separation. |
| 96 |     def initialize_cattle_dict(self, cattle_ids): | Defines a function with reusable logic. |
| 97 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 98 |         Initialize dictionary of Cattle objects | Implements file-specific logic, configuration, or structure in this context. |
| 99 | (blank) | Blank line for readability and section separation. |
| 100 |         Args: | Assigns a property/value pair in object/CSS context. |
| 101 |             cattle_ids: List of cattle IDs to initialize | Assigns a property/value pair in object/CSS context. |
| 102 | (blank) | Blank line for readability and section separation. |
| 103 |         Returns: | Assigns a property/value pair in object/CSS context. |
| 104 |             Dictionary {cattle_id: Cattle object} | Starts CSS selector block for related style rules. |
| 105 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 106 |         cattle_dict = {} | Implements file-specific logic, configuration, or structure in this context. |
| 107 | (blank) | Blank line for readability and section separation. |
| 108 |         print(f"[DATA] Initializing {len(cattle_ids)} cattle...") | Implements file-specific logic, configuration, or structure in this context. |
| 109 | (blank) | Blank line for readability and section separation. |
| 110 |         for cattle_id in cattle_ids: | Loop iterating over a sequence or range. |
| 111 |             cattle = self.create_cattle_from_csv(cattle_id) | Implements file-specific logic, configuration, or structure in this context. |
| 112 |             if cattle: | Conditional branch that executes when condition is true. |
| 113 |                 cattle_dict[cattle_id] = cattle | Implements file-specific logic, configuration, or structure in this context. |
| 114 |             else: | Fallback branch when prior conditions fail. |
| 115 |                 print(f"[DATA] âš  Failed to create cattle {cattle_id}") | Implements file-specific logic, configuration, or structure in this context. |
| 116 | (blank) | Blank line for readability and section separation. |
| 117 |         print(f"[DATA] âœ“ Created {len(cattle_dict)} cattle objects") | Implements file-specific logic, configuration, or structure in this context. |
| 118 |         return cattle_dict | Returns data/control from the current function/component. |
| 119 | (blank) | Blank line for readability and section separation. |
| 120 |     def get_available_cows(self): | Defines a function with reusable logic. |
| 121 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 122 |         Get list of available cows from dataset (for mobile app dropdown) | Implements file-specific logic, configuration, or structure in this context. |
| 123 | (blank) | Blank line for readability and section separation. |
| 124 |         Returns: | Assigns a property/value pair in object/CSS context. |
| 125 |             List of cattle IDs available to add | Implements file-specific logic, configuration, or structure in this context. |
| 126 |         """ | Implements file-specific logic, configuration, or structure in this context. |
| 127 |         return self.unique_cows | Returns data/control from the current function/component. |
| 128 | (blank) | Blank line for readability and section separation. |
| 129 |     def get_dataset_summary(self): | Defines a function with reusable logic. |
| 130 |         """Get summary statistics of dataset""" | Implements file-specific logic, configuration, or structure in this context. |
| 131 |         if self.df is None: | Conditional branch that executes when condition is true. |
| 132 |             return {} | Returns data/control from the current function/component. |
| 133 | (blank) | Blank line for readability and section separation. |
| 134 |         return { | Returns data/control from the current function/component. |
| 135 |             'total_rows': len(self.df), | Implements file-specific logic, configuration, or structure in this context. |
| 136 |             'unique_cows': len(self.unique_cows), | Implements file-specific logic, configuration, or structure in this context. |
| 137 |             'columns': list(self.df.columns), | Implements file-specific logic, configuration, or structure in this context. |
| 138 |             'date_range': f"{self.df['collars_Time'].min()} to {self.df['collars_Time'].max()}" | Implements file-specific logic, configuration, or structure in this context. |
| 139 |         } | Structural syntax token delimiting code blocks/collections. |
| 140 | (blank) | Blank line for readability and section separation. |
| 141 | (blank) | Blank line for readability and section separation. |
| 142 | # Global instance | Comment line documenting intent or context. |
| 143 | _data_loader = None | Implements file-specific logic, configuration, or structure in this context. |
| 144 | (blank) | Blank line for readability and section separation. |
| 145 | def get_data_loader(): | Defines a function with reusable logic. |
| 146 |     """Get or create global data loader instance""" | Implements file-specific logic, configuration, or structure in this context. |
| 147 |     global _data_loader | Implements file-specific logic, configuration, or structure in this context. |
| 148 |     if _data_loader is None: | Conditional branch that executes when condition is true. |
| 149 |         _data_loader = DataLoader() | Implements file-specific logic, configuration, or structure in this context. |
| 150 |         _data_loader.load_csv() | Implements file-specific logic, configuration, or structure in this context. |
| 151 |         _data_loader.get_unique_cows() | Implements file-specific logic, configuration, or structure in this context. |
| 152 |     return _data_loader | Returns data/control from the current function/component. |

## File: mobile2\App.js

| Line | Code | Explanation |
|---:|---|---|
| 1 | import React, { useState, useEffect, useRef } from 'react'; | Imports a dependency/module needed in this file. |
| 2 | import { | Imports a dependency/module needed in this file. |
| 3 |   View, Text, StyleSheet, TouchableOpacity, ScrollView, | Implements file-specific logic, configuration, or structure in this context. |
| 4 |   TextInput, Alert, ActivityIndicator, SafeAreaView, | Implements file-specific logic, configuration, or structure in this context. |
| 5 |   StatusBar, Dimensions, Modal | Implements file-specific logic, configuration, or structure in this context. |
| 6 | } from 'react-native'; | Structural syntax token delimiting code blocks/collections. |
| 7 | import axios from 'axios'; | Imports a dependency/module needed in this file. |
| 8 | import { io } from 'socket.io-client'; | Imports a dependency/module needed in this file. |
| 9 | (blank) | Blank line for readability and section separation. |
| 10 | const BACKEND = 'http://192.168.1.8:5000'; | Declares a JavaScript constant used in component logic. |
| 11 | const { width, height } = Dimensions.get('window'); | Starts CSS selector block for related style rules. |
| 12 | (blank) | Blank line for readability and section separation. |
| 13 | const C = { | Declares a JavaScript constant used in component logic. |
| 14 |   bg: '#0d1117', surface: '#161b22', surface2: '#1c2330', | Assigns a property/value pair in object/CSS context. |
| 15 |   border: '#2a3441', accent: '#3fb950', accent2: '#f7c948', | Assigns a property/value pair in object/CSS context. |
| 16 |   danger: '#f85149', warn: '#ff7b25', pulse: '#58a6ff', | Assigns a property/value pair in object/CSS context. |
| 17 |   text: '#e6edf3', muted: '#7d8590', | Assigns a property/value pair in object/CSS context. |
| 18 | }; | Structural syntax token delimiting code blocks/collections. |
| 19 | (blank) | Blank line for readability and section separation. |
| 20 | function healthColor(status) { | Defines a JavaScript function for reusable logic. |
| 21 |   const s = (status \\|\\| '').toLowerCase(); | Declares a JavaScript constant used in component logic. |
| 22 |   if (s === 'fever' \\|\\| s === 'stress') return C.danger; | Conditional branch that executes when condition is true. |
| 23 |   if (s === 'hypothermia') return C.accent2; | Conditional branch that executes when condition is true. |
| 24 |   if (s === 'lame') return C.warn; | Conditional branch that executes when condition is true. |
| 25 |   if (s === 'fence_breach') return C.danger; | Conditional branch that executes when condition is true. |
| 26 |   return C.accent; | Returns data/control from the current function/component. |
| 27 | } | Structural syntax token delimiting code blocks/collections. |
| 28 | (blank) | Blank line for readability and section separation. |
| 29 | // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• | Comment line documenting intent or context. |
| 30 | // TAB 1 â€” MAP | Comment line documenting intent or context. |
| 31 | // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• | Comment line documenting intent or context. |
| 32 | function MapTab({ cattle, connected, farmerPaddocks, simRunning, onToggleSim }) { | Defines a JavaScript function for reusable logic. |
| 33 |   const mapW = width - 32; | Declares a JavaScript constant used in component logic. |
| 34 |   const mapH = 300; | Declares a JavaScript constant used in component logic. |
| 35 | (blank) | Blank line for readability and section separation. |
| 36 |   const renderFence = (p) => { | Declares a JavaScript constant used in component logic. |
| 37 |     const pts = p.points; | Declares a JavaScript constant used in component logic. |
| 38 |     if (!pts \\|\\| pts.length < 2) return null; | Conditional branch that executes when condition is true. |
| 39 | (blank) | Blank line for readability and section separation. |
| 40 |     const toXY = (pt) => ({ | Declares a JavaScript constant used in component logic. |
| 41 |       x: (pt.x / 100) * mapW, | Assigns a property/value pair in object/CSS context. |
| 42 |       y: (pt.y / 100) * mapH, | Assigns a property/value pair in object/CSS context. |
| 43 |     }); | Structural syntax token delimiting code blocks/collections. |
| 44 | (blank) | Blank line for readability and section separation. |
| 45 |     const lines = []; | Declares a JavaScript constant used in component logic. |
| 46 |     for (let i = 1; i < pts.length; i++) { | Loop iterating over a sequence or range. |
| 47 |       const a = toXY(pts[i - 1]); | Declares a JavaScript constant used in component logic. |
| 48 |       const b = toXY(pts[i]); | Declares a JavaScript constant used in component logic. |
| 49 |       const len = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2); | Declares a JavaScript constant used in component logic. |
| 50 |       const angle = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI; | Declares a JavaScript constant used in component logic. |
| 51 |       lines.push( | Implements file-specific logic, configuration, or structure in this context. |
| 52 |         <View key={`${p.id}-line-${i}`} style={{ | Implements file-specific logic, configuration, or structure in this context. |
| 53 |           position: 'absolute', | Assigns a property/value pair in object/CSS context. |
| 54 |           left: a.x, top: a.y, | Assigns a property/value pair in object/CSS context. |
| 55 |           width: len, height: 2, | Assigns a property/value pair in object/CSS context. |
| 56 |           backgroundColor: C.accent2, | Assigns a property/value pair in object/CSS context. |
| 57 |           transform: [{ rotate: `${angle}deg` }], | Assigns a property/value pair in object/CSS context. |
| 58 |           transformOrigin: '0 0', | Assigns a property/value pair in object/CSS context. |
| 59 |         }} /> | Structural syntax token delimiting code blocks/collections. |
| 60 |       ); | Structural syntax token delimiting code blocks/collections. |
| 61 |     } | Structural syntax token delimiting code blocks/collections. |
| 62 | (blank) | Blank line for readability and section separation. |
| 63 |     if (pts.length > 2) { | Conditional branch that executes when condition is true. |
| 64 |       const a = toXY(pts[pts.length - 1]); | Declares a JavaScript constant used in component logic. |
| 65 |       const b = toXY(pts[0]); | Declares a JavaScript constant used in component logic. |
| 66 |       const len = Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2); | Declares a JavaScript constant used in component logic. |
| 67 |       const angle = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI; | Declares a JavaScript constant used in component logic. |
| 68 |       lines.push( | Implements file-specific logic, configuration, or structure in this context. |
| 69 |         <View key={`${p.id}-close`} style={{ | Implements file-specific logic, configuration, or structure in this context. |
| 70 |           position: 'absolute', | Assigns a property/value pair in object/CSS context. |
| 71 |           left: a.x, top: a.y, | Assigns a property/value pair in object/CSS context. |
| 72 |           width: len, height: 2, | Assigns a property/value pair in object/CSS context. |
| 73 |           backgroundColor: C.accent2, | Assigns a property/value pair in object/CSS context. |
| 74 |           opacity: 0.6, | Assigns a property/value pair in object/CSS context. |
| 75 |           transform: [{ rotate: `${angle}deg` }], | Assigns a property/value pair in object/CSS context. |
| 76 |           transformOrigin: '0 0', | Assigns a property/value pair in object/CSS context. |
| 77 |         }} /> | Structural syntax token delimiting code blocks/collections. |
| 78 |       ); | Structural syntax token delimiting code blocks/collections. |
| 79 |     } | Structural syntax token delimiting code blocks/collections. |
| 80 | (blank) | Blank line for readability and section separation. |
| 81 |     const firstPt = toXY(pts[0]); | Declares a JavaScript constant used in component logic. |
| 82 | (blank) | Blank line for readability and section separation. |
| 83 |     return ( | Returns data/control from the current function/component. |
| 84 |       <React.Fragment key={p.id}> | JSX/HTML structure line defining UI element hierarchy. |
| 85 |         {lines} | Structural syntax token delimiting code blocks/collections. |
| 86 |         <Text style={[s.fenceLabel, { top: Math.max(0, firstPt.y - 16), left: firstPt.x }]}> | JSX/HTML structure line defining UI element hierarchy. |
| 87 |           {p.name} | Structural syntax token delimiting code blocks/collections. |
| 88 |         </Text> | JSX/HTML structure line defining UI element hierarchy. |
| 89 |       </React.Fragment> | JSX/HTML structure line defining UI element hierarchy. |
| 90 |     ); | Structural syntax token delimiting code blocks/collections. |
| 91 |   }; | Structural syntax token delimiting code blocks/collections. |
| 92 | (blank) | Blank line for readability and section separation. |
| 93 |   return ( | Returns data/control from the current function/component. |
| 94 |     <ScrollView style={s.tab}> | JSX/HTML structure line defining UI element hierarchy. |
| 95 |       <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}> | JSX/HTML structure line defining UI element hierarchy. |
| 96 |         <TouchableOpacity | Implements file-specific logic, configuration, or structure in this context. |
| 97 |           style={[s.actionBtn, { backgroundColor: simRunning ? C.danger : C.accent, flex: 1 }]} | Implements file-specific logic, configuration, or structure in this context. |
| 98 |           onPress={onToggleSim} | Implements file-specific logic, configuration, or structure in this context. |
| 99 |         > | Implements file-specific logic, configuration, or structure in this context. |
| 100 |           <Text style={s.actionBtnText}>{simRunning ? 'â¹ Stop Simulation' : 'â–¶ Start Simulation'}</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 101 |         </TouchableOpacity> | JSX/HTML structure line defining UI element hierarchy. |
| 102 |       </View> | JSX/HTML structure line defining UI element hierarchy. |
| 103 | (blank) | Blank line for readability and section separation. |
| 104 |       <View style={s.statusRow}> | JSX/HTML structure line defining UI element hierarchy. |
| 105 |         <View style={[s.dot, { backgroundColor: connected ? C.accent : C.danger }]} /> | JSX/HTML structure line defining UI element hierarchy. |
| 106 |         <Text style={s.statusText}>{connected ? 'LIVE' : 'DISCONNECTED'}</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 107 |         <Text style={[s.statusText, { marginLeft: 'auto' }]}>{Object.keys(cattle).length} cattle</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 108 |       </View> | JSX/HTML structure line defining UI element hierarchy. |
| 109 | (blank) | Blank line for readability and section separation. |
| 110 |       <View style={[s.mapBox, { width: mapW, height: mapH }]}> | JSX/HTML structure line defining UI element hierarchy. |
| 111 |         <Text style={s.mapLabel}>PASTURE MAP</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 112 |         {[0.25, 0.5, 0.75].map(p => ( | Structural syntax token delimiting code blocks/collections. |
| 113 |           <View key={`h${p}`} style={[s.gridLineH, { top: mapH * p }]} /> | JSX/HTML structure line defining UI element hierarchy. |
| 114 |         ))} | Structural syntax token delimiting code blocks/collections. |
| 115 |         {[0.25, 0.5, 0.75].map(p => ( | Structural syntax token delimiting code blocks/collections. |
| 116 |           <View key={`v${p}`} style={[s.gridLineV, { left: mapW * p }]} /> | JSX/HTML structure line defining UI element hierarchy. |
| 117 |         ))} | Structural syntax token delimiting code blocks/collections. |
| 118 | (blank) | Blank line for readability and section separation. |
| 119 |         {farmerPaddocks.filter(p => p.status === 'occupied').map(p => renderFence(p))} | Structural syntax token delimiting code blocks/collections. |
| 120 | (blank) | Blank line for readability and section separation. |
| 121 |         {Object.values(cattle).map(c => { | Structural syntax token delimiting code blocks/collections. |
| 122 |           const cx = (c.x / 100) * mapW; | Declares a JavaScript constant used in component logic. |
| 123 |           const cy = (c.y / 100) * mapH; | Declares a JavaScript constant used in component logic. |
| 124 |           return ( | Returns data/control from the current function/component. |
| 125 |             <View key={c.cattle_id} style={[s.cattleDot, { | Implements file-specific logic, configuration, or structure in this context. |
| 126 |               left: cx - 8, top: cy - 8, | Assigns a property/value pair in object/CSS context. |
| 127 |               backgroundColor: healthColor(c.health_status), | Assigns a property/value pair in object/CSS context. |
| 128 |             }]}> | Structural syntax token delimiting code blocks/collections. |
| 129 |               <Text style={s.cattleDotText}>{c.cattle_id}</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 130 |             </View> | JSX/HTML structure line defining UI element hierarchy. |
| 131 |           ); | Structural syntax token delimiting code blocks/collections. |
| 132 |         })} | Structural syntax token delimiting code blocks/collections. |
| 133 | (blank) | Blank line for readability and section separation. |
| 134 |         {Object.keys(cattle).length === 0 && ( | Structural syntax token delimiting code blocks/collections. |
| 135 |           <Text style={s.mapEmpty}>Add cattle to see them on the map</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 136 |         )} | Structural syntax token delimiting code blocks/collections. |
| 137 |       </View> | JSX/HTML structure line defining UI element hierarchy. |
| 138 | (blank) | Blank line for readability and section separation. |
| 139 |       <View style={s.card}> | JSX/HTML structure line defining UI element hierarchy. |
| 140 |         <Text style={s.cardTitle}>LEGEND</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 141 |         {[ | Structural syntax token delimiting code blocks/collections. |
| 142 |           { color: C.accent, label: 'Healthy' }, | Structural syntax token delimiting code blocks/collections. |
| 143 |           { color: C.pulse, label: 'Lying Down' }, | Structural syntax token delimiting code blocks/collections. |
| 144 |           { color: C.warn, label: 'Lameness' }, | Structural syntax token delimiting code blocks/collections. |
| 145 |           { color: C.danger, label: 'Fever / Stress / Fence Breach' }, | Structural syntax token delimiting code blocks/collections. |
| 146 |           { color: C.accent2, label: 'Hypothermia' }, | Structural syntax token delimiting code blocks/collections. |
| 147 |         ].map(item => ( | Structural syntax token delimiting code blocks/collections. |
| 148 |           <View key={item.label} style={s.legendRow}> | JSX/HTML structure line defining UI element hierarchy. |
| 149 |             <View style={[s.legendDot, { backgroundColor: item.color }]} /> | JSX/HTML structure line defining UI element hierarchy. |
| 150 |             <Text style={s.legendText}>{item.label}</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 151 |           </View> | JSX/HTML structure line defining UI element hierarchy. |
| 152 |         ))} | Structural syntax token delimiting code blocks/collections. |
| 153 |       </View> | JSX/HTML structure line defining UI element hierarchy. |
| 154 |     </ScrollView> | JSX/HTML structure line defining UI element hierarchy. |
| 155 |   ); | Structural syntax token delimiting code blocks/collections. |
| 156 | } | Structural syntax token delimiting code blocks/collections. |
| 157 | (blank) | Blank line for readability and section separation. |
| 158 | // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• | Comment line documenting intent or context. |
| 159 | // TAB 2 â€” CATTLE | Comment line documenting intent or context. |
| 160 | // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• | Comment line documenting intent or context. |
| 161 | function CattleTab({ cattle, available, onAdd, onRemove, loading }) { | Defines a JavaScript function for reusable logic. |
| 162 |   const [search, setSearch] = useState(''); | Statement terminator ending current instruction. |
| 163 |   const filtered = available.filter(id => String(id).includes(search)); | Declares a JavaScript constant used in component logic. |
| 164 | (blank) | Blank line for readability and section separation. |
| 165 |   return ( | Returns data/control from the current function/component. |
| 166 |     <View style={s.tab}> | JSX/HTML structure line defining UI element hierarchy. |
| 167 |       <View style={s.card}> | JSX/HTML structure line defining UI element hierarchy. |
| 168 |         <Text style={s.cardTitle}>ACTIVE HERD ({Object.keys(cattle).length})</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 169 |         {Object.keys(cattle).length === 0 ? ( | Structural syntax token delimiting code blocks/collections. |
| 170 |           <Text style={s.muted}>No cattle added yet</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 171 |         ) : ( | Structural syntax token delimiting code blocks/collections. |
| 172 |           Object.values(cattle).map(c => ( | Implements file-specific logic, configuration, or structure in this context. |
| 173 |             <View key={c.cattle_id} style={s.cattleRow}> | JSX/HTML structure line defining UI element hierarchy. |
| 174 |               <View style={[s.dot, { backgroundColor: healthColor(c.health_status) }]} /> | JSX/HTML structure line defining UI element hierarchy. |
| 175 |               <Text style={s.cattleRowId}>#{c.cattle_id}</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 176 |               <Text style={[s.cattleRowStatus, { color: healthColor(c.health_status) }]}> | JSX/HTML structure line defining UI element hierarchy. |
| 177 |                 {c.health_status \\|\\| 'HEALTHY'} | Structural syntax token delimiting code blocks/collections. |
| 178 |               </Text> | JSX/HTML structure line defining UI element hierarchy. |
| 179 |               <TouchableOpacity style={s.removeBtn} onPress={() => onRemove(c.cattle_id)}> | Implements file-specific logic, configuration, or structure in this context. |
| 180 |                 <Text style={s.removeBtnText}>âœ•</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 181 |               </TouchableOpacity> | JSX/HTML structure line defining UI element hierarchy. |
| 182 |             </View> | JSX/HTML structure line defining UI element hierarchy. |
| 183 |           )) | Structural syntax token delimiting code blocks/collections. |
| 184 |         )} | Structural syntax token delimiting code blocks/collections. |
| 185 |       </View> | JSX/HTML structure line defining UI element hierarchy. |
| 186 | (blank) | Blank line for readability and section separation. |
| 187 |       <View style={s.card}> | JSX/HTML structure line defining UI element hierarchy. |
| 188 |         <Text style={s.cardTitle}>ADD CATTLE FROM DATASET ({available.length} available)</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 189 |         <TextInput | Implements file-specific logic, configuration, or structure in this context. |
| 190 |           style={s.input} | Implements file-specific logic, configuration, or structure in this context. |
| 191 |           placeholder="Search by ID..." | Implements file-specific logic, configuration, or structure in this context. |
| 192 |           placeholderTextColor={C.muted} | Implements file-specific logic, configuration, or structure in this context. |
| 193 |           value={search} | Implements file-specific logic, configuration, or structure in this context. |
| 194 |           onChangeText={setSearch} | Implements file-specific logic, configuration, or structure in this context. |
| 195 |           keyboardType="numeric" | Implements file-specific logic, configuration, or structure in this context. |
| 196 |         /> | Implements file-specific logic, configuration, or structure in this context. |
| 197 |         <ScrollView style={{ maxHeight: 240 }}> | JSX/HTML structure line defining UI element hierarchy. |
| 198 |           {filtered.slice(0, 30).map(id => ( | Structural syntax token delimiting code blocks/collections. |
| 199 |             <TouchableOpacity key={id} style={s.availableRow} onPress={() => onAdd(id)}> | Implements file-specific logic, configuration, or structure in this context. |
| 200 |               <Text style={s.availableId}>Cattle #{id}</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 201 |               <Text style={s.addBtn}>+ ADD</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 202 |             </TouchableOpacity> | JSX/HTML structure line defining UI element hierarchy. |
| 203 |           ))} | Structural syntax token delimiting code blocks/collections. |
| 204 |         </ScrollView> | JSX/HTML structure line defining UI element hierarchy. |
| 205 |         {loading && <ActivityIndicator color={C.accent} style={{ marginTop: 10 }} />} | Structural syntax token delimiting code blocks/collections. |
| 206 |       </View> | JSX/HTML structure line defining UI element hierarchy. |
| 207 |     </View> | JSX/HTML structure line defining UI element hierarchy. |
| 208 |   ); | Structural syntax token delimiting code blocks/collections. |
| 209 | } | Structural syntax token delimiting code blocks/collections. |
| 210 | (blank) | Blank line for readability and section separation. |
| 211 | // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• | Comment line documenting intent or context. |
| 212 | // TAB 3 â€” DRAW FENCE (includes optional scheduling at save time) | Comment line documenting intent or context. |
| 213 | // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• | Comment line documenting intent or context. |
| 214 | function DrawFenceTab({ cattle, farmerPaddocks, onPaddockCreated }) { | Defines a JavaScript function for reusable logic. |
| 215 |   const [points, setPoints] = useState([]); | Statement terminator ending current instruction. |
| 216 |   const [paddockName, setPaddockName] = useState(''); | Statement terminator ending current instruction. |
| 217 |   const [scheduleTime, setScheduleTime] = useState(''); | Statement terminator ending current instruction. |
| 218 |   const [saving, setSaving] = useState(false); | Statement terminator ending current instruction. |
| 219 |   const [showAssign, setShowAssign] = useState(false); | Statement terminator ending current instruction. |
| 220 |   const [selectedPaddock, setSelectedPaddock] = useState(null); | Performs SQLite database connection/query/schema operation. |
| 221 |   const [selectedCattle, setSelectedCattle] = useState([]); | Performs SQLite database connection/query/schema operation. |
| 222 | (blank) | Blank line for readability and section separation. |
| 223 |   const gridW = width - 32; | Declares a JavaScript constant used in component logic. |
| 224 |   const gridH = 280; | Declares a JavaScript constant used in component logic. |
| 225 | (blank) | Blank line for readability and section separation. |
| 226 |   const handleGridTap = (e) => { | Declares a JavaScript constant used in component logic. |
| 227 |     const { locationX, locationY } = e.nativeEvent; | Starts CSS selector block for related style rules. |
| 228 |     const x = Math.round((locationX / gridW) * 100); | Declares a JavaScript constant used in component logic. |
| 229 |     const y = Math.round((locationY / gridH) * 100); | Declares a JavaScript constant used in component logic. |
| 230 |     setPoints([...points, { x, y }]); | Statement terminator ending current instruction. |
| 231 |   }; | Structural syntax token delimiting code blocks/collections. |
| 232 | (blank) | Blank line for readability and section separation. |
| 233 |   const quickTime = (minutesFromNow) => { | Declares a JavaScript constant used in component logic. |
| 234 |     const d = new Date(Date.now() + minutesFromNow * 60000); | Declares a JavaScript constant used in component logic. |
| 235 |     const pad = (n) => String(n).padStart(2, '0'); | Declares a JavaScript constant used in component logic. |
| 236 |     setScheduleTime(`${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`); | Statement terminator ending current instruction. |
| 237 |   }; | Structural syntax token delimiting code blocks/collections. |
| 238 | (blank) | Blank line for readability and section separation. |
| 239 |   const savePaddock = async () => { | Declares a JavaScript constant used in component logic. |
| 240 |     if (points.length < 3) { | Conditional branch that executes when condition is true. |
| 241 |       Alert.alert('Need more points', 'Tap at least 3 points to define a paddock boundary'); | Statement terminator ending current instruction. |
| 242 |       return; | Statement terminator ending current instruction. |
| 243 |     } | Structural syntax token delimiting code blocks/collections. |
| 244 |     if (!paddockName.trim()) { | Conditional branch that executes when condition is true. |
| 245 |       Alert.alert('Name required', 'Give your paddock a name'); | Statement terminator ending current instruction. |
| 246 |       return; | Statement terminator ending current instruction. |
| 247 |     } | Structural syntax token delimiting code blocks/collections. |
| 248 |     setSaving(true); | Statement terminator ending current instruction. |
| 249 |     try { | Starts CSS selector block for related style rules. |
| 250 |       const res = await axios.post(`${BACKEND}/api/farmer/paddocks`, { | Declares a JavaScript constant used in component logic. |
| 251 |         name: paddockName.trim(), | Assigns a property/value pair in object/CSS context. |
| 252 |         points: points, | Assigns a property/value pair in object/CSS context. |
| 253 |       }); | Structural syntax token delimiting code blocks/collections. |
| 254 | (blank) | Blank line for readability and section separation. |
| 255 |       const newPaddock = res.data.paddock; | Declares a JavaScript constant used in component logic. |
| 256 | (blank) | Blank line for readability and section separation. |
| 257 |       if (scheduleTime.trim()) { | Conditional branch that executes when condition is true. |
| 258 |         const iso = scheduleTime.trim().replace(' ', 'T'); | Declares a JavaScript constant used in component logic. |
| 259 |         await axios.post(`${BACKEND}/api/farmer/schedules`, { | Implements file-specific logic, configuration, or structure in this context. |
| 260 |           paddock_id: newPaddock.id, | Assigns a property/value pair in object/CSS context. |
| 261 |           paddock_name: newPaddock.name, | Assigns a property/value pair in object/CSS context. |
| 262 |           cattle_ids: [], | Assigns a property/value pair in object/CSS context. |
| 263 |           start_time: iso, | Assigns a property/value pair in object/CSS context. |
| 264 |           notes: '', | Assigns a property/value pair in object/CSS context. |
| 265 |         }); | Structural syntax token delimiting code blocks/collections. |
| 266 |         Alert.alert('âœ… Saved & Scheduled', `${paddockName} created â€” herd moves here at ${scheduleTime}`); | Statement terminator ending current instruction. |
| 267 |       } else { | Structural syntax token delimiting code blocks/collections. |
| 268 |         Alert.alert('âœ… Saved', `${paddockName} created successfully`); | Statement terminator ending current instruction. |
| 269 |       } | Structural syntax token delimiting code blocks/collections. |
| 270 | (blank) | Blank line for readability and section separation. |
| 271 |       setPoints([]); | Statement terminator ending current instruction. |
| 272 |       setPaddockName(''); | Statement terminator ending current instruction. |
| 273 |       setScheduleTime(''); | Statement terminator ending current instruction. |
| 274 |       onPaddockCreated(); | Statement terminator ending current instruction. |
| 275 |     } catch (e) { | Structural syntax token delimiting code blocks/collections. |
| 276 |       Alert.alert('Error', 'Failed to save paddock'); | Statement terminator ending current instruction. |
| 277 |     } | Structural syntax token delimiting code blocks/collections. |
| 278 |     setSaving(false); | Statement terminator ending current instruction. |
| 279 |   }; | Structural syntax token delimiting code blocks/collections. |
| 280 | (blank) | Blank line for readability and section separation. |
| 281 |   const openAssign = (paddock) => { | Declares a JavaScript constant used in component logic. |
| 282 |     setSelectedPaddock(paddock); | Performs SQLite database connection/query/schema operation. |
| 283 |     setSelectedCattle(paddock.cattle_ids \\|\\| []); | Performs SQLite database connection/query/schema operation. |
| 284 |     setShowAssign(true); | Statement terminator ending current instruction. |
| 285 |   }; | Structural syntax token delimiting code blocks/collections. |
| 286 | (blank) | Blank line for readability and section separation. |
| 287 |   const assignCattle = async () => { | Declares a JavaScript constant used in component logic. |
| 288 |     try { | Starts CSS selector block for related style rules. |
| 289 |       await axios.post(`${BACKEND}/api/farmer/paddocks/${selectedPaddock.id}/assign`, { | Performs SQLite database connection/query/schema operation. |
| 290 |         cattle_ids: selectedCattle, | Performs SQLite database connection/query/schema operation. |
| 291 |       }); | Structural syntax token delimiting code blocks/collections. |
| 292 |       Alert.alert('âœ… Assigned', `${selectedCattle.length} cattle assigned to ${selectedPaddock.name}`); | Performs SQLite database connection/query/schema operation. |
| 293 |       setShowAssign(false); | Statement terminator ending current instruction. |
| 294 |       onPaddockCreated(); | Statement terminator ending current instruction. |
| 295 |     } catch (e) { | Structural syntax token delimiting code blocks/collections. |
| 296 |       Alert.alert('Error', 'Failed to assign cattle'); | Statement terminator ending current instruction. |
| 297 |     } | Structural syntax token delimiting code blocks/collections. |
| 298 |   }; | Structural syntax token delimiting code blocks/collections. |
| 299 | (blank) | Blank line for readability and section separation. |
| 300 |   const deletePaddock = (paddock) => { | Performs SQLite database connection/query/schema operation. |
| 301 |     Alert.alert('Delete Paddock', `Delete "${paddock.name}"?`, [ | Performs SQLite database connection/query/schema operation. |
| 302 |       { text: 'Cancel', style: 'cancel' }, | Structural syntax token delimiting code blocks/collections. |
| 303 |       { | Structural syntax token delimiting code blocks/collections. |
| 304 |         text: 'Delete', style: 'destructive', | Performs SQLite database connection/query/schema operation. |
| 305 |         onPress: async () => { | Assigns a property/value pair in object/CSS context. |
| 306 |           try { | Starts CSS selector block for related style rules. |
| 307 |             await axios.delete(`${BACKEND}/api/farmer/paddocks/${paddock.id}`); | Performs SQLite database connection/query/schema operation. |
| 308 |             onPaddockCreated(); | Statement terminator ending current instruction. |
| 309 |           } catch (e) { | Structural syntax token delimiting code blocks/collections. |
| 310 |             Alert.alert('Error', 'Failed to delete'); | Performs SQLite database connection/query/schema operation. |
| 311 |           } | Structural syntax token delimiting code blocks/collections. |
| 312 |         } | Structural syntax token delimiting code blocks/collections. |
| 313 |       } | Structural syntax token delimiting code blocks/collections. |
| 314 |     ]); | Structural syntax token delimiting code blocks/collections. |
| 315 |   }; | Structural syntax token delimiting code blocks/collections. |
| 316 | (blank) | Blank line for readability and section separation. |
| 317 |   const toggleCattle = (id) => { | Declares a JavaScript constant used in component logic. |
| 318 |     setSelectedCattle(prev => | Performs SQLite database connection/query/schema operation. |
| 319 |       prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id] | Implements file-specific logic, configuration, or structure in this context. |
| 320 |     ); | Structural syntax token delimiting code blocks/collections. |
| 321 |   }; | Structural syntax token delimiting code blocks/collections. |
| 322 | (blank) | Blank line for readability and section separation. |
| 323 |   return ( | Returns data/control from the current function/component. |
| 324 |     <ScrollView style={s.tab}> | JSX/HTML structure line defining UI element hierarchy. |
| 325 |       <View style={s.card}> | JSX/HTML structure line defining UI element hierarchy. |
| 326 |         <Text style={s.cardTitle}>DRAW FENCE BOUNDARY</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 327 |         <Text style={[s.muted, { marginBottom: 8, fontSize: 12 }]}> | JSX/HTML structure line defining UI element hierarchy. |
| 328 |           Tap on the grid to drop fence points ({points.length} points dropped) | Implements file-specific logic, configuration, or structure in this context. |
| 329 |         </Text> | JSX/HTML structure line defining UI element hierarchy. |
| 330 | (blank) | Blank line for readability and section separation. |
| 331 |         <TouchableOpacity | Implements file-specific logic, configuration, or structure in this context. |
| 332 |           activeOpacity={1} | Implements file-specific logic, configuration, or structure in this context. |
| 333 |           onPress={handleGridTap} | Implements file-specific logic, configuration, or structure in this context. |
| 334 |           style={[s.drawGrid, { width: gridW - 28, height: gridH }]} | Implements file-specific logic, configuration, or structure in this context. |
| 335 |         > | Implements file-specific logic, configuration, or structure in this context. |
| 336 |           {[0.2, 0.4, 0.6, 0.8].map(p => ( | Structural syntax token delimiting code blocks/collections. |
| 337 |             <View key={`gh${p}`} style={[s.gridLineH, { top: gridH * p, backgroundColor: 'rgba(63,185,80,0.15)' }]} /> | JSX/HTML structure line defining UI element hierarchy. |
| 338 |           ))} | Structural syntax token delimiting code blocks/collections. |
| 339 |           {[0.2, 0.4, 0.6, 0.8].map(p => ( | Structural syntax token delimiting code blocks/collections. |
| 340 |             <View key={`gv${p}`} style={[s.gridLineV, { left: (gridW - 28) * p, backgroundColor: 'rgba(63,185,80,0.15)' }]} /> | JSX/HTML structure line defining UI element hierarchy. |
| 341 |           ))} | Structural syntax token delimiting code blocks/collections. |
| 342 | (blank) | Blank line for readability and section separation. |
| 343 |           {points.length > 1 && points.map((pt, i) => { | Structural syntax token delimiting code blocks/collections. |
| 344 |             if (i === 0) return null; | Conditional branch that executes when condition is true. |
| 345 |             const prev = points[i - 1]; | Declares a JavaScript constant used in component logic. |
| 346 |             const x1 = (prev.x / 100) * (gridW - 28); | Declares a JavaScript constant used in component logic. |
| 347 |             const y1 = (prev.y / 100) * gridH; | Declares a JavaScript constant used in component logic. |
| 348 |             const x2 = (pt.x / 100) * (gridW - 28); | Declares a JavaScript constant used in component logic. |
| 349 |             const y2 = (pt.y / 100) * gridH; | Declares a JavaScript constant used in component logic. |
| 350 |             const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2); | Declares a JavaScript constant used in component logic. |
| 351 |             const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI; | Declares a JavaScript constant used in component logic. |
| 352 |             return ( | Returns data/control from the current function/component. |
| 353 |               <View key={`line${i}`} style={{ | Implements file-specific logic, configuration, or structure in this context. |
| 354 |                 position: 'absolute', | Assigns a property/value pair in object/CSS context. |
| 355 |                 left: x1, top: y1, | Assigns a property/value pair in object/CSS context. |
| 356 |                 width: len, height: 2, | Assigns a property/value pair in object/CSS context. |
| 357 |                 backgroundColor: C.accent2, | Assigns a property/value pair in object/CSS context. |
| 358 |                 transform: [{ rotate: `${angle}deg` }], | Assigns a property/value pair in object/CSS context. |
| 359 |                 transformOrigin: '0 0', | Assigns a property/value pair in object/CSS context. |
| 360 |               }} /> | Structural syntax token delimiting code blocks/collections. |
| 361 |             ); | Structural syntax token delimiting code blocks/collections. |
| 362 |           })} | Structural syntax token delimiting code blocks/collections. |
| 363 | (blank) | Blank line for readability and section separation. |
| 364 |           {points.length > 2 && (() => { | Structural syntax token delimiting code blocks/collections. |
| 365 |             const first = points[0]; | Declares a JavaScript constant used in component logic. |
| 366 |             const last = points[points.length - 1]; | Declares a JavaScript constant used in component logic. |
| 367 |             const x1 = (last.x / 100) * (gridW - 28); | Declares a JavaScript constant used in component logic. |
| 368 |             const y1 = (last.y / 100) * gridH; | Declares a JavaScript constant used in component logic. |
| 369 |             const x2 = (first.x / 100) * (gridW - 28); | Declares a JavaScript constant used in component logic. |
| 370 |             const y2 = (first.y / 100) * gridH; | Declares a JavaScript constant used in component logic. |
| 371 |             const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2); | Declares a JavaScript constant used in component logic. |
| 372 |             const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI; | Declares a JavaScript constant used in component logic. |
| 373 |             return ( | Returns data/control from the current function/component. |
| 374 |               <View style={{ | Implements file-specific logic, configuration, or structure in this context. |
| 375 |                 position: 'absolute', | Assigns a property/value pair in object/CSS context. |
| 376 |                 left: x1, top: y1, | Assigns a property/value pair in object/CSS context. |
| 377 |                 width: len, height: 2, | Assigns a property/value pair in object/CSS context. |
| 378 |                 backgroundColor: C.accent2, | Assigns a property/value pair in object/CSS context. |
| 379 |                 opacity: 0.5, | Assigns a property/value pair in object/CSS context. |
| 380 |                 transform: [{ rotate: `${angle}deg` }], | Assigns a property/value pair in object/CSS context. |
| 381 |                 transformOrigin: '0 0', | Assigns a property/value pair in object/CSS context. |
| 382 |               }} /> | Structural syntax token delimiting code blocks/collections. |
| 383 |             ); | Structural syntax token delimiting code blocks/collections. |
| 384 |           })()} | Structural syntax token delimiting code blocks/collections. |
| 385 | (blank) | Blank line for readability and section separation. |
| 386 |           {points.map((pt, i) => { | Structural syntax token delimiting code blocks/collections. |
| 387 |             const x = (pt.x / 100) * (gridW - 28); | Declares a JavaScript constant used in component logic. |
| 388 |             const y = (pt.y / 100) * gridH; | Declares a JavaScript constant used in component logic. |
| 389 |             return ( | Returns data/control from the current function/component. |
| 390 |               <View key={`pt${i}`} style={[s.fencePin, { left: x - 8, top: y - 8 }]}> | JSX/HTML structure line defining UI element hierarchy. |
| 391 |                 <Text style={s.fencePinText}>{i + 1}</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 392 |               </View> | JSX/HTML structure line defining UI element hierarchy. |
| 393 |             ); | Structural syntax token delimiting code blocks/collections. |
| 394 |           })} | Structural syntax token delimiting code blocks/collections. |
| 395 | (blank) | Blank line for readability and section separation. |
| 396 |           {points.length === 0 && ( | Structural syntax token delimiting code blocks/collections. |
| 397 |             <Text style={s.mapEmpty}>Tap here to drop fence points</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 398 |           )} | Structural syntax token delimiting code blocks/collections. |
| 399 |         </TouchableOpacity> | JSX/HTML structure line defining UI element hierarchy. |
| 400 | (blank) | Blank line for readability and section separation. |
| 401 |         <TextInput | Implements file-specific logic, configuration, or structure in this context. |
| 402 |           style={[s.input, { marginTop: 10 }]} | Implements file-specific logic, configuration, or structure in this context. |
| 403 |           placeholder="Paddock name (e.g. Pasture 1)" | Implements file-specific logic, configuration, or structure in this context. |
| 404 |           placeholderTextColor={C.muted} | Implements file-specific logic, configuration, or structure in this context. |
| 405 |           value={paddockName} | Implements file-specific logic, configuration, or structure in this context. |
| 406 |           onChangeText={setPaddockName} | Implements file-specific logic, configuration, or structure in this context. |
| 407 |         /> | Implements file-specific logic, configuration, or structure in this context. |
| 408 | (blank) | Blank line for readability and section separation. |
| 409 |         <Text style={[s.muted, { marginBottom: 6, marginTop: 4 }]}> | JSX/HTML structure line defining UI element hierarchy. |
| 410 |           ACTIVATE AT (optional â€” leave blank to activate immediately) | Implements file-specific logic, configuration, or structure in this context. |
| 411 |         </Text> | JSX/HTML structure line defining UI element hierarchy. |
| 412 |         <TextInput | Implements file-specific logic, configuration, or structure in this context. |
| 413 |           style={s.input} | Implements file-specific logic, configuration, or structure in this context. |
| 414 |           placeholder="2026-07-06 14:30" | Implements file-specific logic, configuration, or structure in this context. |
| 415 |           placeholderTextColor={C.muted} | Implements file-specific logic, configuration, or structure in this context. |
| 416 |           value={scheduleTime} | Implements file-specific logic, configuration, or structure in this context. |
| 417 |           onChangeText={setScheduleTime} | Implements file-specific logic, configuration, or structure in this context. |
| 418 |         /> | Implements file-specific logic, configuration, or structure in this context. |
| 419 |         <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}> | JSX/HTML structure line defining UI element hierarchy. |
| 420 |           <TouchableOpacity style={s.smallBtn2} onPress={() => quickTime(0.25)}> | Implements file-specific logic, configuration, or structure in this context. |
| 421 |             <Text style={s.smallBtn2Text}>+15 sec</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 422 |           </TouchableOpacity> | JSX/HTML structure line defining UI element hierarchy. |
| 423 |           <TouchableOpacity style={s.smallBtn2} onPress={() => quickTime(1)}> | Implements file-specific logic, configuration, or structure in this context. |
| 424 |             <Text style={s.smallBtn2Text}>+1 min</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 425 |           </TouchableOpacity> | JSX/HTML structure line defining UI element hierarchy. |
| 426 |           <TouchableOpacity style={s.smallBtn2} onPress={() => quickTime(60)}> | Implements file-specific logic, configuration, or structure in this context. |
| 427 |             <Text style={s.smallBtn2Text}>+1 hour</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 428 |           </TouchableOpacity> | JSX/HTML structure line defining UI element hierarchy. |
| 429 |           <TouchableOpacity style={s.smallBtn2} onPress={() => quickTime(1440)}> | Implements file-specific logic, configuration, or structure in this context. |
| 430 |             <Text style={s.smallBtn2Text}>+1 day</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 431 |           </TouchableOpacity> | JSX/HTML structure line defining UI element hierarchy. |
| 432 |         </View> | JSX/HTML structure line defining UI element hierarchy. |
| 433 | (blank) | Blank line for readability and section separation. |
| 434 |         <View style={{ flexDirection: 'row', gap: 8 }}> | JSX/HTML structure line defining UI element hierarchy. |
| 435 |           <TouchableOpacity | Implements file-specific logic, configuration, or structure in this context. |
| 436 |             style={[s.actionBtn, { backgroundColor: C.danger, flex: 1 }]} | Implements file-specific logic, configuration, or structure in this context. |
| 437 |             onPress={() => setPoints([])} | Implements file-specific logic, configuration, or structure in this context. |
| 438 |           > | Implements file-specific logic, configuration, or structure in this context. |
| 439 |             <Text style={s.actionBtnText}>â†© Clear</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 440 |           </TouchableOpacity> | JSX/HTML structure line defining UI element hierarchy. |
| 441 |           <TouchableOpacity | Implements file-specific logic, configuration, or structure in this context. |
| 442 |             style={[s.actionBtn, { backgroundColor: C.accent, flex: 2 }]} | Implements file-specific logic, configuration, or structure in this context. |
| 443 |             onPress={savePaddock} | Implements file-specific logic, configuration, or structure in this context. |
| 444 |             disabled={saving} | Implements file-specific logic, configuration, or structure in this context. |
| 445 |           > | Implements file-specific logic, configuration, or structure in this context. |
| 446 |             {saving | Structural syntax token delimiting code blocks/collections. |
| 447 |               ? <ActivityIndicator color="#fff" /> | Implements file-specific logic, configuration, or structure in this context. |
| 448 |               : <Text style={s.actionBtnText}>ðŸ’¾ Save Paddock</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 449 |             } | Structural syntax token delimiting code blocks/collections. |
| 450 |           </TouchableOpacity> | JSX/HTML structure line defining UI element hierarchy. |
| 451 |         </View> | JSX/HTML structure line defining UI element hierarchy. |
| 452 |       </View> | JSX/HTML structure line defining UI element hierarchy. |
| 453 | (blank) | Blank line for readability and section separation. |
| 454 |       <View style={s.card}> | JSX/HTML structure line defining UI element hierarchy. |
| 455 |         <Text style={s.cardTitle}>SAVED PADDOCKS ({farmerPaddocks.length})</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 456 |         {farmerPaddocks.length === 0 ? ( | Structural syntax token delimiting code blocks/collections. |
| 457 |           <Text style={s.muted}>No paddocks created yet. Draw a fence above.</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 458 |         ) : ( | Structural syntax token delimiting code blocks/collections. |
| 459 |           farmerPaddocks.map(p => ( | Implements file-specific logic, configuration, or structure in this context. |
| 460 |             <View key={p.id} style={s.savedPaddock}> | JSX/HTML structure line defining UI element hierarchy. |
| 461 |               <View style={{ flex: 1 }}> | JSX/HTML structure line defining UI element hierarchy. |
| 462 |                 <Text style={s.savedPaddockName}>{p.name}</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 463 |                 <Text style={s.muted}> | JSX/HTML structure line defining UI element hierarchy. |
| 464 |                   {p.points.length} fence points Â· {p.cattle_ids?.length \\|\\| 0} cattle assigned | Structural syntax token delimiting code blocks/collections. |
| 465 |                 </Text> | JSX/HTML structure line defining UI element hierarchy. |
| 466 |               </View> | JSX/HTML structure line defining UI element hierarchy. |
| 467 |               <TouchableOpacity | Implements file-specific logic, configuration, or structure in this context. |
| 468 |                 style={[s.smallBtn, { backgroundColor: C.pulse, marginRight: 6 }]} | Implements file-specific logic, configuration, or structure in this context. |
| 469 |                 onPress={() => openAssign(p)} | Implements file-specific logic, configuration, or structure in this context. |
| 470 |               > | Implements file-specific logic, configuration, or structure in this context. |
| 471 |                 <Text style={s.smallBtnText}>Assign</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 472 |               </TouchableOpacity> | JSX/HTML structure line defining UI element hierarchy. |
| 473 |               <TouchableOpacity | Implements file-specific logic, configuration, or structure in this context. |
| 474 |                 style={[s.smallBtn, { backgroundColor: C.danger }]} | Implements file-specific logic, configuration, or structure in this context. |
| 475 |                 onPress={() => deletePaddock(p)} | Performs SQLite database connection/query/schema operation. |
| 476 |               > | Implements file-specific logic, configuration, or structure in this context. |
| 477 |                 <Text style={s.smallBtnText}>Delete</Text> | Performs SQLite database connection/query/schema operation. |
| 478 |               </TouchableOpacity> | JSX/HTML structure line defining UI element hierarchy. |
| 479 |             </View> | JSX/HTML structure line defining UI element hierarchy. |
| 480 |           )) | Structural syntax token delimiting code blocks/collections. |
| 481 |         )} | Structural syntax token delimiting code blocks/collections. |
| 482 |       </View> | JSX/HTML structure line defining UI element hierarchy. |
| 483 | (blank) | Blank line for readability and section separation. |
| 484 |       <Modal visible={showAssign} transparent animationType="slide"> | JSX/HTML structure line defining UI element hierarchy. |
| 485 |         <View style={s.modalOverlay}> | JSX/HTML structure line defining UI element hierarchy. |
| 486 |           <View style={s.modalBox}> | JSX/HTML structure line defining UI element hierarchy. |
| 487 |             <Text style={s.modalTitle}> | JSX/HTML structure line defining UI element hierarchy. |
| 488 |               Assign Cattle to {selectedPaddock?.name} | Performs SQLite database connection/query/schema operation. |
| 489 |             </Text> | JSX/HTML structure line defining UI element hierarchy. |
| 490 |             <Text style={[s.muted, { marginBottom: 10 }]}> | JSX/HTML structure line defining UI element hierarchy. |
| 491 |               Tap cattle to select/deselect | Performs SQLite database connection/query/schema operation. |
| 492 |             </Text> | JSX/HTML structure line defining UI element hierarchy. |
| 493 |             <ScrollView style={{ maxHeight: 300 }}> | JSX/HTML structure line defining UI element hierarchy. |
| 494 |               {Object.values(cattle).map(c => { | Structural syntax token delimiting code blocks/collections. |
| 495 |                 const selected = selectedCattle.includes(c.cattle_id); | Performs SQLite database connection/query/schema operation. |
| 496 |                 return ( | Returns data/control from the current function/component. |
| 497 |                   <TouchableOpacity | Implements file-specific logic, configuration, or structure in this context. |
| 498 |                     key={c.cattle_id} | Implements file-specific logic, configuration, or structure in this context. |
| 499 |                     style={[s.assignRow, selected && s.assignRowSelected]} | Performs SQLite database connection/query/schema operation. |
| 500 |                     onPress={() => toggleCattle(c.cattle_id)} | Implements file-specific logic, configuration, or structure in this context. |
| 501 |                   > | Implements file-specific logic, configuration, or structure in this context. |
| 502 |                     <Text style={[s.assignId, selected && { color: C.accent }]}> | Performs SQLite database connection/query/schema operation. |
| 503 |                       #{c.cattle_id} | Comment line documenting intent or context. |
| 504 |                     </Text> | JSX/HTML structure line defining UI element hierarchy. |
| 505 |                     <Text style={[s.assignStatus, { color: healthColor(c.health_status) }]}> | JSX/HTML structure line defining UI element hierarchy. |
| 506 |                       {c.health_status \\|\\| 'HEALTHY'} | Structural syntax token delimiting code blocks/collections. |
| 507 |                     </Text> | JSX/HTML structure line defining UI element hierarchy. |
| 508 |                     {selected && <Text style={{ color: C.accent, fontWeight: '700' }}>âœ“</Text>} | Performs SQLite database connection/query/schema operation. |
| 509 |                   </TouchableOpacity> | JSX/HTML structure line defining UI element hierarchy. |
| 510 |                 ); | Structural syntax token delimiting code blocks/collections. |
| 511 |               })} | Structural syntax token delimiting code blocks/collections. |
| 512 |               {Object.keys(cattle).length === 0 && ( | Structural syntax token delimiting code blocks/collections. |
| 513 |                 <Text style={s.muted}>Add cattle first from the Cattle tab</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 514 |               )} | Structural syntax token delimiting code blocks/collections. |
| 515 |             </ScrollView> | JSX/HTML structure line defining UI element hierarchy. |
| 516 |             <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}> | JSX/HTML structure line defining UI element hierarchy. |
| 517 |               <TouchableOpacity | Implements file-specific logic, configuration, or structure in this context. |
| 518 |                 style={[s.actionBtn, { backgroundColor: C.border, flex: 1 }]} | Implements file-specific logic, configuration, or structure in this context. |
| 519 |                 onPress={() => setShowAssign(false)} | Implements file-specific logic, configuration, or structure in this context. |
| 520 |               > | Implements file-specific logic, configuration, or structure in this context. |
| 521 |                 <Text style={s.actionBtnText}>Cancel</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 522 |               </TouchableOpacity> | JSX/HTML structure line defining UI element hierarchy. |
| 523 |               <TouchableOpacity | Implements file-specific logic, configuration, or structure in this context. |
| 524 |                 style={[s.actionBtn, { backgroundColor: C.accent, flex: 1 }]} | Implements file-specific logic, configuration, or structure in this context. |
| 525 |                 onPress={assignCattle} | Implements file-specific logic, configuration, or structure in this context. |
| 526 |               > | Implements file-specific logic, configuration, or structure in this context. |
| 527 |                 <Text style={s.actionBtnText}>Assign ({selectedCattle.length})</Text> | Performs SQLite database connection/query/schema operation. |
| 528 |               </TouchableOpacity> | JSX/HTML structure line defining UI element hierarchy. |
| 529 |             </View> | JSX/HTML structure line defining UI element hierarchy. |
| 530 |           </View> | JSX/HTML structure line defining UI element hierarchy. |
| 531 |         </View> | JSX/HTML structure line defining UI element hierarchy. |
| 532 |       </Modal> | JSX/HTML structure line defining UI element hierarchy. |
| 533 |     </ScrollView> | JSX/HTML structure line defining UI element hierarchy. |
| 534 |   ); | Structural syntax token delimiting code blocks/collections. |
| 535 | } | Structural syntax token delimiting code blocks/collections. |
| 536 | (blank) | Blank line for readability and section separation. |
| 537 | // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• | Comment line documenting intent or context. |
| 538 | // TAB 4 â€” PADDOCKS | Comment line documenting intent or context. |
| 539 | // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• | Comment line documenting intent or context. |
| 540 | function PaddocksTab({ farmerPaddocks, cattle, onRefresh }) { | Defines a JavaScript function for reusable logic. |
| 541 |   return ( | Returns data/control from the current function/component. |
| 542 |     <ScrollView style={s.tab}> | JSX/HTML structure line defining UI element hierarchy. |
| 543 |       <TouchableOpacity style={s.refreshBtn} onPress={onRefresh}> | JSX/HTML structure line defining UI element hierarchy. |
| 544 |         <Text style={s.refreshBtnText}>â†» Refresh</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 545 |       </TouchableOpacity> | JSX/HTML structure line defining UI element hierarchy. |
| 546 | (blank) | Blank line for readability and section separation. |
| 547 |       {farmerPaddocks.length === 0 ? ( | Structural syntax token delimiting code blocks/collections. |
| 548 |         <View style={s.card}> | JSX/HTML structure line defining UI element hierarchy. |
| 549 |           <Text style={[s.cardTitle, { marginBottom: 6 }]}>NO PADDOCKS YET</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 550 |           <Text style={s.muted}> | JSX/HTML structure line defining UI element hierarchy. |
| 551 |             Go to the "Draw Fence" tab to create paddocks by tapping fence boundaries on the grid. | Implements file-specific logic, configuration, or structure in this context. |
| 552 |           </Text> | JSX/HTML structure line defining UI element hierarchy. |
| 553 |         </View> | JSX/HTML structure line defining UI element hierarchy. |
| 554 |       ) : ( | Structural syntax token delimiting code blocks/collections. |
| 555 |         farmerPaddocks.map(p => { | Implements file-specific logic, configuration, or structure in this context. |
| 556 |           const assignedCattle = (p.cattle_ids \\|\\| []) | Declares a JavaScript constant used in component logic. |
| 557 |             .map(id => cattle[id]) | Implements file-specific logic, configuration, or structure in this context. |
| 558 |             .filter(Boolean); | Statement terminator ending current instruction. |
| 559 | (blank) | Blank line for readability and section separation. |
| 560 |           return ( | Returns data/control from the current function/component. |
| 561 |             <View key={p.id} style={[s.card, p.status === 'occupied' && { borderColor: C.pulse }]}> | JSX/HTML structure line defining UI element hierarchy. |
| 562 |               <View style={s.paddockHeader}> | JSX/HTML structure line defining UI element hierarchy. |
| 563 |                 <Text style={s.paddockName}>{p.name}</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 564 |                 <View style={[s.badge, | Implements file-specific logic, configuration, or structure in this context. |
| 565 |                   p.status === 'occupied' ? s.badgeOccupied : s.badgeAvailable | Implements file-specific logic, configuration, or structure in this context. |
| 566 |                 ]}> | Structural syntax token delimiting code blocks/collections. |
| 567 |                   <Text style={s.badgeText}>{(p.status \\|\\| 'available').toUpperCase()}</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 568 |                 </View> | JSX/HTML structure line defining UI element hierarchy. |
| 569 |               </View> | JSX/HTML structure line defining UI element hierarchy. |
| 570 | (blank) | Blank line for readability and section separation. |
| 571 |               <View style={s.paddockRow}> | JSX/HTML structure line defining UI element hierarchy. |
| 572 |                 <Text style={s.paddockLabel}>Fence Points</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 573 |                 <Text style={s.paddockValue}>{p.points.length}</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 574 |               </View> | JSX/HTML structure line defining UI element hierarchy. |
| 575 |               <View style={s.paddockRow}> | JSX/HTML structure line defining UI element hierarchy. |
| 576 |                 <Text style={s.paddockLabel}>Cattle Assigned</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 577 |                 <Text style={s.paddockValue}>{p.cattle_ids?.length \\|\\| 0}</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 578 |               </View> | JSX/HTML structure line defining UI element hierarchy. |
| 579 |               <View style={s.paddockRow}> | JSX/HTML structure line defining UI element hierarchy. |
| 580 |                 <Text style={s.paddockLabel}>Created</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 581 |                 <Text style={s.paddockValue}> | JSX/HTML structure line defining UI element hierarchy. |
| 582 |                   {p.created ? new Date(p.created).toLocaleDateString() : 'â€”'} | Structural syntax token delimiting code blocks/collections. |
| 583 |                 </Text> | JSX/HTML structure line defining UI element hierarchy. |
| 584 |               </View> | JSX/HTML structure line defining UI element hierarchy. |
| 585 | (blank) | Blank line for readability and section separation. |
| 586 |               {assignedCattle.length > 0 && ( | Structural syntax token delimiting code blocks/collections. |
| 587 |                 <View style={{ marginTop: 8 }}> | JSX/HTML structure line defining UI element hierarchy. |
| 588 |                   <Text style={[s.muted, { fontSize: 11, marginBottom: 4 }]}>ASSIGNED CATTLE:</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 589 |                   <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}> | JSX/HTML structure line defining UI element hierarchy. |
| 590 |                     {assignedCattle.map(c => ( | Structural syntax token delimiting code blocks/collections. |
| 591 |                       <View key={c.cattle_id} style={[s.cattleChip, { borderColor: healthColor(c.health_status) }]}> | JSX/HTML structure line defining UI element hierarchy. |
| 592 |                         <Text style={[s.cattleChipText, { color: healthColor(c.health_status) }]}> | JSX/HTML structure line defining UI element hierarchy. |
| 593 |                           #{c.cattle_id} | Comment line documenting intent or context. |
| 594 |                         </Text> | JSX/HTML structure line defining UI element hierarchy. |
| 595 |                       </View> | JSX/HTML structure line defining UI element hierarchy. |
| 596 |                     ))} | Structural syntax token delimiting code blocks/collections. |
| 597 |                   </View> | JSX/HTML structure line defining UI element hierarchy. |
| 598 |                 </View> | JSX/HTML structure line defining UI element hierarchy. |
| 599 |               )} | Structural syntax token delimiting code blocks/collections. |
| 600 |             </View> | JSX/HTML structure line defining UI element hierarchy. |
| 601 |           ); | Structural syntax token delimiting code blocks/collections. |
| 602 |         }) | Structural syntax token delimiting code blocks/collections. |
| 603 |       )} | Structural syntax token delimiting code blocks/collections. |
| 604 |     </ScrollView> | JSX/HTML structure line defining UI element hierarchy. |
| 605 |   ); | Structural syntax token delimiting code blocks/collections. |
| 606 | } | Structural syntax token delimiting code blocks/collections. |
| 607 | (blank) | Blank line for readability and section separation. |
| 608 | // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• | Comment line documenting intent or context. |
| 609 | // TAB â€” SCHEDULE (read-only summary) | Comment line documenting intent or context. |
| 610 | // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• | Comment line documenting intent or context. |
| 611 | function ScheduleTab({ schedules, farmerPaddocks, onRefresh }) { | Defines a JavaScript function for reusable logic. |
| 612 |   const getPaddockStatus = (paddockId) => { | Declares a JavaScript constant used in component logic. |
| 613 |     const p = farmerPaddocks.find(fp => fp.id === paddockId); | Declares a JavaScript constant used in component logic. |
| 614 |     return p?.status === 'occupied' ? 'ACTIVE NOW' : 'inactive'; | Returns data/control from the current function/component. |
| 615 |   }; | Structural syntax token delimiting code blocks/collections. |
| 616 | (blank) | Blank line for readability and section separation. |
| 617 |   return ( | Returns data/control from the current function/component. |
| 618 |     <ScrollView style={s.tab}> | JSX/HTML structure line defining UI element hierarchy. |
| 619 |       <TouchableOpacity style={s.refreshBtn} onPress={onRefresh}> | JSX/HTML structure line defining UI element hierarchy. |
| 620 |         <Text style={s.refreshBtnText}>â†» Refresh</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 621 |       </TouchableOpacity> | JSX/HTML structure line defining UI element hierarchy. |
| 622 | (blank) | Blank line for readability and section separation. |
| 623 |       <View style={s.card}> | JSX/HTML structure line defining UI element hierarchy. |
| 624 |         <Text style={s.cardTitle}>PASTURE SCHEDULE ({schedules.length})</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 625 |         {schedules.length === 0 ? ( | Structural syntax token delimiting code blocks/collections. |
| 626 |           <Text style={s.muted}>No pasture schedules yet. Set a time while saving a paddock in Draw Fence tab.</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 627 |         ) : ( | Structural syntax token delimiting code blocks/collections. |
| 628 |           schedules.map(sc => { | Implements file-specific logic, configuration, or structure in this context. |
| 629 |             const status = getPaddockStatus(sc.paddock_id); | Declares a JavaScript constant used in component logic. |
| 630 |             const isActive = status === 'ACTIVE NOW'; | Declares a JavaScript constant used in component logic. |
| 631 |             return ( | Returns data/control from the current function/component. |
| 632 |               <View key={sc.id} style={[s.savedPaddock, isActive && { borderColor: C.accent }]}> | JSX/HTML structure line defining UI element hierarchy. |
| 633 |                 <View style={{ flex: 1 }}> | JSX/HTML structure line defining UI element hierarchy. |
| 634 |                   <Text style={s.savedPaddockName}>{sc.paddock_name}</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 635 |                   <Text style={s.muted}>{sc.start_time?.replace('T', ' ')}</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 636 |                 </View> | JSX/HTML structure line defining UI element hierarchy. |
| 637 |                 <View style={[s.badge, isActive ? s.badgeOccupied : s.badgeAvailable]}> | JSX/HTML structure line defining UI element hierarchy. |
| 638 |                   <Text style={s.badgeText}>{isActive ? 'ACTIVE' : (sc.activated ? 'DONE' : 'PENDING')}</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 639 |                 </View> | JSX/HTML structure line defining UI element hierarchy. |
| 640 |               </View> | JSX/HTML structure line defining UI element hierarchy. |
| 641 |             ); | Structural syntax token delimiting code blocks/collections. |
| 642 |           }) | Structural syntax token delimiting code blocks/collections. |
| 643 |         )} | Structural syntax token delimiting code blocks/collections. |
| 644 |       </View> | JSX/HTML structure line defining UI element hierarchy. |
| 645 |     </ScrollView> | JSX/HTML structure line defining UI element hierarchy. |
| 646 |   ); | Structural syntax token delimiting code blocks/collections. |
| 647 | } | Structural syntax token delimiting code blocks/collections. |
| 648 | (blank) | Blank line for readability and section separation. |
| 649 | // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• | Comment line documenting intent or context. |
| 650 | // TAB â€” HEALTH | Comment line documenting intent or context. |
| 651 | // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• | Comment line documenting intent or context. |
| 652 | function HealthTab({ cattle }) { | Defines a JavaScript function for reusable logic. |
| 653 |   const cattleArr = Object.values(cattle); | Declares a JavaScript constant used in component logic. |
| 654 |   return ( | Returns data/control from the current function/component. |
| 655 |     <ScrollView style={s.tab}> | JSX/HTML structure line defining UI element hierarchy. |
| 656 |       {cattleArr.length === 0 ? ( | Structural syntax token delimiting code blocks/collections. |
| 657 |         <View style={s.card}><Text style={s.muted}>Add cattle to monitor health</Text></View> | Implements file-specific logic, configuration, or structure in this context. |
| 658 |       ) : ( | Structural syntax token delimiting code blocks/collections. |
| 659 |         cattleArr.map(c => { | Implements file-specific logic, configuration, or structure in this context. |
| 660 |           const color = healthColor(c.health_status); | Declares a JavaScript constant used in component logic. |
| 661 |           return ( | Returns data/control from the current function/component. |
| 662 |             <View key={c.cattle_id} style={[s.card, { borderLeftWidth: 3, borderLeftColor: color }]}> | JSX/HTML structure line defining UI element hierarchy. |
| 663 |               <View style={s.healthHeader}> | JSX/HTML structure line defining UI element hierarchy. |
| 664 |                 <Text style={s.healthId}>ðŸ„ Cattle #{c.cattle_id}</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 665 |                 <Text style={[s.healthStatus, { color }]}>{c.health_status \\|\\| 'HEALTHY'}</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 666 |               </View> | JSX/HTML structure line defining UI element hierarchy. |
| 667 |               <View style={s.healthRow}> | JSX/HTML structure line defining UI element hierarchy. |
| 668 |                 <Text style={s.healthLabel}>Temperature</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 669 |                 <Text style={[s.healthValue, { color: c.temperature > 39.5 ? C.danger : C.text }]}> | Implements file-specific logic, configuration, or structure in this context. |
| 670 |                   {(c.temperature \\|\\| 0).toFixed(1)}Â°C | Structural syntax token delimiting code blocks/collections. |
| 671 |                 </Text> | JSX/HTML structure line defining UI element hierarchy. |
| 672 |               </View> | JSX/HTML structure line defining UI element hierarchy. |
| 673 |               <View style={s.healthRow}> | JSX/HTML structure line defining UI element hierarchy. |
| 674 |                 <Text style={s.healthLabel}>Heart Rate</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 675 |                 <Text style={[s.healthValue, { color: c.heart_rate > 100 ? C.danger : C.text }]}> | Implements file-specific logic, configuration, or structure in this context. |
| 676 |                   {c.heart_rate \\|\\| 0} bpm | Structural syntax token delimiting code blocks/collections. |
| 677 |                 </Text> | JSX/HTML structure line defining UI element hierarchy. |
| 678 |               </View> | JSX/HTML structure line defining UI element hierarchy. |
| 679 |               <View style={s.healthRow}> | JSX/HTML structure line defining UI element hierarchy. |
| 680 |                 <Text style={s.healthLabel}>Milk Production</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 681 |                 <Text style={s.healthValue}>{(c.milk_production \\|\\| 0).toFixed(1)} L/day</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 682 |               </View> | JSX/HTML structure line defining UI element hierarchy. |
| 683 |               <View style={s.healthRow}> | JSX/HTML structure line defining UI element hierarchy. |
| 684 |                 <Text style={s.healthLabel}>Behavior</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 685 |                 <Text style={s.healthValue}>{c.behavior \\|\\| 'â€”'}</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 686 |               </View> | JSX/HTML structure line defining UI element hierarchy. |
| 687 |               <View style={s.healthRow}> | JSX/HTML structure line defining UI element hierarchy. |
| 688 |                 <Text style={s.healthLabel}>Position</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 689 |                 <Text style={s.healthValue}>({(c.x \\|\\| 0).toFixed(0)}, {(c.y \\|\\| 0).toFixed(0)})</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 690 |               </View> | JSX/HTML structure line defining UI element hierarchy. |
| 691 |             </View> | JSX/HTML structure line defining UI element hierarchy. |
| 692 |           ); | Structural syntax token delimiting code blocks/collections. |
| 693 |         }) | Structural syntax token delimiting code blocks/collections. |
| 694 |       )} | Structural syntax token delimiting code blocks/collections. |
| 695 |     </ScrollView> | JSX/HTML structure line defining UI element hierarchy. |
| 696 |   ); | Structural syntax token delimiting code blocks/collections. |
| 697 | } | Structural syntax token delimiting code blocks/collections. |
| 698 | (blank) | Blank line for readability and section separation. |
| 699 | // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• | Comment line documenting intent or context. |
| 700 | // MAIN APP | Comment line documenting intent or context. |
| 701 | // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• | Comment line documenting intent or context. |
| 702 | export default function App() { | Declares and exports the default function/component. |
| 703 |   const [activeTab, setActiveTab] = useState('map'); | Statement terminator ending current instruction. |
| 704 |   const [cattle, setCattle] = useState({}); | Statement terminator ending current instruction. |
| 705 |   const [available, setAvailable] = useState([]); | Statement terminator ending current instruction. |
| 706 |   const [farmerPaddocks, setFarmerPaddocks] = useState([]); | Statement terminator ending current instruction. |
| 707 |   const [schedules, setSchedules] = useState([]); | Statement terminator ending current instruction. |
| 708 |   const [connected, setConnected] = useState(false); | Statement terminator ending current instruction. |
| 709 |   const [loading, setLoading] = useState(false); | Statement terminator ending current instruction. |
| 710 |   const [simRunning, setSimRunning] = useState(false); | Statement terminator ending current instruction. |
| 711 |   const socketRef = useRef(null); | Declares a JavaScript constant used in component logic. |
| 712 | (blank) | Blank line for readability and section separation. |
| 713 |   const TABS = [ | Declares a JavaScript constant used in component logic. |
| 714 |     { id: 'map', label: 'ðŸ—º Map' }, | Structural syntax token delimiting code blocks/collections. |
| 715 |     { id: 'cattle', label: 'ðŸ„ Cattle' }, | Structural syntax token delimiting code blocks/collections. |
| 716 |     { id: 'fence', label: 'ðŸ“ Draw Fence' }, | Structural syntax token delimiting code blocks/collections. |
| 717 |     { id: 'paddocks', label: 'ðŸŒ¾ Paddocks' }, | Structural syntax token delimiting code blocks/collections. |
| 718 |     { id: 'schedule', label: 'ðŸ“… Schedule' }, | Structural syntax token delimiting code blocks/collections. |
| 719 |     { id: 'health', label: 'â¤ï¸ Health' }, | Structural syntax token delimiting code blocks/collections. |
| 720 |   ]; | Structural syntax token delimiting code blocks/collections. |
| 721 | (blank) | Blank line for readability and section separation. |
| 722 |   useEffect(() => { | Implements file-specific logic, configuration, or structure in this context. |
| 723 |     const socket = io(BACKEND, { transports: ['websocket'] }); | Declares a JavaScript constant used in component logic. |
| 724 |     socketRef.current = socket; | Statement terminator ending current instruction. |
| 725 | (blank) | Blank line for readability and section separation. |
| 726 |     socket.on('connect', () => { setConnected(true); fetchAll(); }); | Statement terminator ending current instruction. |
| 727 |     socket.on('disconnect', () => setConnected(false)); | Statement terminator ending current instruction. |
| 728 | (blank) | Blank line for readability and section separation. |
| 729 |     socket.on('cattle_update', (data) => { | Performs SQLite database connection/query/schema operation. |
| 730 |       if (data.cattle) { | Conditional branch that executes when condition is true. |
| 731 |         const d = {}; | Declares a JavaScript constant used in component logic. |
| 732 |         data.cattle.forEach(c => { d[c.cattle_id] = c; }); | Statement terminator ending current instruction. |
| 733 |         setCattle(d); | Statement terminator ending current instruction. |
| 734 |       } | Structural syntax token delimiting code blocks/collections. |
| 735 |     }); | Structural syntax token delimiting code blocks/collections. |
| 736 | (blank) | Blank line for readability and section separation. |
| 737 |     socket.on('cattle_added', (data) => { | Implements file-specific logic, configuration, or structure in this context. |
| 738 |       if (data.cattle) { | Conditional branch that executes when condition is true. |
| 739 |         setCattle(prev => ({ ...prev, [data.cattle.cattle_id]: data.cattle })); | Statement terminator ending current instruction. |
| 740 |         fetchAvailable(); | Statement terminator ending current instruction. |
| 741 |       } | Structural syntax token delimiting code blocks/collections. |
| 742 |     }); | Structural syntax token delimiting code blocks/collections. |
| 743 | (blank) | Blank line for readability and section separation. |
| 744 |     socket.on('cattle_removed', (data) => { | Implements file-specific logic, configuration, or structure in this context. |
| 745 |       if (data.cattle_id) { | Conditional branch that executes when condition is true. |
| 746 |         setCattle(prev => { const n = { ...prev }; delete n[data.cattle_id]; return n; }); | Performs SQLite database connection/query/schema operation. |
| 747 |         fetchAvailable(); | Statement terminator ending current instruction. |
| 748 |       } | Structural syntax token delimiting code blocks/collections. |
| 749 |     }); | Structural syntax token delimiting code blocks/collections. |
| 750 | (blank) | Blank line for readability and section separation. |
| 751 |     socket.on('paddock_created', () => fetchFarmerPaddocks()); | Statement terminator ending current instruction. |
| 752 |     socket.on('paddock_updated', () => fetchFarmerPaddocks()); | Performs SQLite database connection/query/schema operation. |
| 753 |     socket.on('paddock_deleted', () => fetchFarmerPaddocks()); | Performs SQLite database connection/query/schema operation. |
| 754 | (blank) | Blank line for readability and section separation. |
| 755 |     socket.on('schedule_created', () => fetchSchedules()); | Statement terminator ending current instruction. |
| 756 |     socket.on('schedule_deleted', () => fetchSchedules()); | Performs SQLite database connection/query/schema operation. |
| 757 |     socket.on('schedule_activated', (data) => { | Implements file-specific logic, configuration, or structure in this context. |
| 758 |       fetchSchedules(); | Statement terminator ending current instruction. |
| 759 |       fetchFarmerPaddocks(); | Statement terminator ending current instruction. |
| 760 |       Alert.alert('ðŸ„ Herd Moved', `Herd is now moving to ${data.paddock_name}`); | Statement terminator ending current instruction. |
| 761 |     }); | Structural syntax token delimiting code blocks/collections. |
| 762 | (blank) | Blank line for readability and section separation. |
| 763 |     socket.on('simulation_status', (data) => setSimRunning(data.running)); | Statement terminator ending current instruction. |
| 764 | (blank) | Blank line for readability and section separation. |
| 765 |     return () => socket.disconnect(); | Returns data/control from the current function/component. |
| 766 |   }, []); | Structural syntax token delimiting code blocks/collections. |
| 767 | (blank) | Blank line for readability and section separation. |
| 768 |   const fetchAll = () => { | Declares a JavaScript constant used in component logic. |
| 769 |     fetchCattle(); fetchAvailable(); fetchFarmerPaddocks(); fetchSchedules(); | Statement terminator ending current instruction. |
| 770 |   }; | Structural syntax token delimiting code blocks/collections. |
| 771 | (blank) | Blank line for readability and section separation. |
| 772 |   const fetchCattle = async () => { | Declares a JavaScript constant used in component logic. |
| 773 |     try { | Starts CSS selector block for related style rules. |
| 774 |       const r = await axios.get(`${BACKEND}/api/cattle`); | Declares a JavaScript constant used in component logic. |
| 775 |       const d = {}; | Declares a JavaScript constant used in component logic. |
| 776 |       r.data.cattle.forEach(c => { d[c.cattle_id] = c; }); | Statement terminator ending current instruction. |
| 777 |       setCattle(d); | Statement terminator ending current instruction. |
| 778 |     } catch (e) { console.warn('fetchCattle', e.message); } | Structural syntax token delimiting code blocks/collections. |
| 779 |   }; | Structural syntax token delimiting code blocks/collections. |
| 780 | (blank) | Blank line for readability and section separation. |
| 781 |   const fetchAvailable = async () => { | Declares a JavaScript constant used in component logic. |
| 782 |     try { | Starts CSS selector block for related style rules. |
| 783 |       const r = await axios.get(`${BACKEND}/api/cattle/available`); | Declares a JavaScript constant used in component logic. |
| 784 |       setAvailable(r.data.available_cattle \\|\\| []); | Statement terminator ending current instruction. |
| 785 |     } catch (e) { console.warn('fetchAvailable', e.message); } | Structural syntax token delimiting code blocks/collections. |
| 786 |   }; | Structural syntax token delimiting code blocks/collections. |
| 787 | (blank) | Blank line for readability and section separation. |
| 788 |   const fetchFarmerPaddocks = async () => { | Declares a JavaScript constant used in component logic. |
| 789 |     try { | Starts CSS selector block for related style rules. |
| 790 |       const r = await axios.get(`${BACKEND}/api/farmer/paddocks`); | Declares a JavaScript constant used in component logic. |
| 791 |       setFarmerPaddocks(r.data.paddocks \\|\\| []); | Statement terminator ending current instruction. |
| 792 |     } catch (e) { console.warn('fetchFarmerPaddocks', e.message); } | Structural syntax token delimiting code blocks/collections. |
| 793 |   }; | Structural syntax token delimiting code blocks/collections. |
| 794 | (blank) | Blank line for readability and section separation. |
| 795 |   const fetchSchedules = async () => { | Declares a JavaScript constant used in component logic. |
| 796 |     try { | Starts CSS selector block for related style rules. |
| 797 |       const r = await axios.get(`${BACKEND}/api/farmer/schedules`); | Declares a JavaScript constant used in component logic. |
| 798 |       setSchedules(r.data.schedules \\|\\| []); | Statement terminator ending current instruction. |
| 799 |     } catch (e) { console.warn('fetchSchedules', e.message); } | Structural syntax token delimiting code blocks/collections. |
| 800 |   }; | Structural syntax token delimiting code blocks/collections. |
| 801 | (blank) | Blank line for readability and section separation. |
| 802 |   const handleAdd = async (id) => { | Declares a JavaScript constant used in component logic. |
| 803 |     setLoading(true); | Statement terminator ending current instruction. |
| 804 |     try { | Starts CSS selector block for related style rules. |
| 805 |       await axios.post(`${BACKEND}/api/cattle`, { cattle_id: id }); | Statement terminator ending current instruction. |
| 806 |       Alert.alert('âœ… Added', `Cattle #${id} added to herd`); | Statement terminator ending current instruction. |
| 807 |     } catch (e) { | Structural syntax token delimiting code blocks/collections. |
| 808 |       Alert.alert('Error', e.response?.data?.error \\|\\| 'Failed to add cattle'); | Statement terminator ending current instruction. |
| 809 |     } | Structural syntax token delimiting code blocks/collections. |
| 810 |     setLoading(false); | Statement terminator ending current instruction. |
| 811 |   }; | Structural syntax token delimiting code blocks/collections. |
| 812 | (blank) | Blank line for readability and section separation. |
| 813 |   const handleRemove = (id) => { | Declares a JavaScript constant used in component logic. |
| 814 |     Alert.alert('Remove Cattle', `Remove cattle #${id}?`, [ | Implements file-specific logic, configuration, or structure in this context. |
| 815 |       { text: 'Cancel', style: 'cancel' }, | Structural syntax token delimiting code blocks/collections. |
| 816 |       { | Structural syntax token delimiting code blocks/collections. |
| 817 |         text: 'Remove', style: 'destructive', | Assigns a property/value pair in object/CSS context. |
| 818 |         onPress: async () => { | Assigns a property/value pair in object/CSS context. |
| 819 |           try { await axios.delete(`${BACKEND}/api/cattle/${id}`); } | Performs SQLite database connection/query/schema operation. |
| 820 |           catch (e) { Alert.alert('Error', 'Failed to remove'); } | Implements file-specific logic, configuration, or structure in this context. |
| 821 |         } | Structural syntax token delimiting code blocks/collections. |
| 822 |       } | Structural syntax token delimiting code blocks/collections. |
| 823 |     ]); | Structural syntax token delimiting code blocks/collections. |
| 824 |   }; | Structural syntax token delimiting code blocks/collections. |
| 825 | (blank) | Blank line for readability and section separation. |
| 826 |   const toggleSim = () => { | Declares a JavaScript constant used in component logic. |
| 827 |     if (simRunning) { | Conditional branch that executes when condition is true. |
| 828 |       socketRef.current.emit('stop_simulation'); | Statement terminator ending current instruction. |
| 829 |     } else { | Structural syntax token delimiting code blocks/collections. |
| 830 |       socketRef.current.emit('start_simulation'); | Statement terminator ending current instruction. |
| 831 |     } | Structural syntax token delimiting code blocks/collections. |
| 832 |   }; | Structural syntax token delimiting code blocks/collections. |
| 833 | (blank) | Blank line for readability and section separation. |
| 834 |   return ( | Returns data/control from the current function/component. |
| 835 |     <SafeAreaView style={s.root}> | JSX/HTML structure line defining UI element hierarchy. |
| 836 |       <StatusBar barStyle="light-content" backgroundColor={C.bg} /> | JSX/HTML structure line defining UI element hierarchy. |
| 837 | (blank) | Blank line for readability and section separation. |
| 838 |       <View style={s.header}> | JSX/HTML structure line defining UI element hierarchy. |
| 839 |         <Text style={s.headerTitle}>ðŸ„ VirtualHerd+</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 840 |         <View style={s.headerRight}> | JSX/HTML structure line defining UI element hierarchy. |
| 841 |           <View style={[s.dot, { backgroundColor: connected ? C.accent : C.danger }]} /> | JSX/HTML structure line defining UI element hierarchy. |
| 842 |           <Text style={s.headerSub}>{connected ? 'LIVE' : 'OFFLINE'}</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 843 |         </View> | JSX/HTML structure line defining UI element hierarchy. |
| 844 |       </View> | JSX/HTML structure line defining UI element hierarchy. |
| 845 | (blank) | Blank line for readability and section separation. |
| 846 |       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabBar}> | JSX/HTML structure line defining UI element hierarchy. |
| 847 |         {TABS.map(t => ( | Structural syntax token delimiting code blocks/collections. |
| 848 |           <TouchableOpacity | Implements file-specific logic, configuration, or structure in this context. |
| 849 |             key={t.id} | Implements file-specific logic, configuration, or structure in this context. |
| 850 |             style={[s.tabBtn, activeTab === t.id && s.tabBtnActive]} | Implements file-specific logic, configuration, or structure in this context. |
| 851 |             onPress={() => setActiveTab(t.id)} | Implements file-specific logic, configuration, or structure in this context. |
| 852 |           > | Implements file-specific logic, configuration, or structure in this context. |
| 853 |             <Text style={[s.tabBtnText, activeTab === t.id && s.tabBtnTextActive]}>{t.label}</Text> | Implements file-specific logic, configuration, or structure in this context. |
| 854 |           </TouchableOpacity> | JSX/HTML structure line defining UI element hierarchy. |
| 855 |         ))} | Structural syntax token delimiting code blocks/collections. |
| 856 |       </ScrollView> | JSX/HTML structure line defining UI element hierarchy. |
| 857 | (blank) | Blank line for readability and section separation. |
| 858 |       {activeTab === 'map' && ( | Structural syntax token delimiting code blocks/collections. |
| 859 |         <MapTab | Implements file-specific logic, configuration, or structure in this context. |
| 860 |           cattle={cattle} | Implements file-specific logic, configuration, or structure in this context. |
| 861 |           connected={connected} | Implements file-specific logic, configuration, or structure in this context. |
| 862 |           farmerPaddocks={farmerPaddocks} | Implements file-specific logic, configuration, or structure in this context. |
| 863 |           simRunning={simRunning} | Implements file-specific logic, configuration, or structure in this context. |
| 864 |           onToggleSim={toggleSim} | Implements file-specific logic, configuration, or structure in this context. |
| 865 |         /> | Implements file-specific logic, configuration, or structure in this context. |
| 866 |       )} | Structural syntax token delimiting code blocks/collections. |
| 867 |       {activeTab === 'cattle' && <CattleTab cattle={cattle} available={available} onAdd={handleAdd} onRemove={handleRemove} loading={loading} />} | Structural syntax token delimiting code blocks/collections. |
| 868 |       {activeTab === 'fence' && <DrawFenceTab cattle={cattle} farmerPaddocks={farmerPaddocks} onPaddockCreated={() => { fetchFarmerPaddocks(); fetchSchedules(); }} />} | Structural syntax token delimiting code blocks/collections. |
| 869 |       {activeTab === 'paddocks' && <PaddocksTab farmerPaddocks={farmerPaddocks} cattle={cattle} onRefresh={fetchFarmerPaddocks} />} | Structural syntax token delimiting code blocks/collections. |
| 870 | (blank) | Blank line for readability and section separation. |
| 871 |       {activeTab === 'schedule' && ( | Structural syntax token delimiting code blocks/collections. |
| 872 |         <ScheduleTab | Implements file-specific logic, configuration, or structure in this context. |
| 873 |           schedules={schedules} | Implements file-specific logic, configuration, or structure in this context. |
| 874 |           farmerPaddocks={farmerPaddocks} | Implements file-specific logic, configuration, or structure in this context. |
| 875 |           onRefresh={() => { fetchSchedules(); fetchFarmerPaddocks(); }} | Implements file-specific logic, configuration, or structure in this context. |
| 876 |         /> | Implements file-specific logic, configuration, or structure in this context. |
| 877 |       )} | Structural syntax token delimiting code blocks/collections. |
| 878 | (blank) | Blank line for readability and section separation. |
| 879 |       {activeTab === 'health' && <HealthTab cattle={cattle} />} | Structural syntax token delimiting code blocks/collections. |
| 880 |     </SafeAreaView> | JSX/HTML structure line defining UI element hierarchy. |
| 881 |   ); | Structural syntax token delimiting code blocks/collections. |
| 882 | } | Structural syntax token delimiting code blocks/collections. |
| 883 | (blank) | Blank line for readability and section separation. |
| 884 | // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• | Comment line documenting intent or context. |
| 885 | // STYLES | Comment line documenting intent or context. |
| 886 | // â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• | Comment line documenting intent or context. |
| 887 | const s = StyleSheet.create({ | Defines React Native style object for component styling. |
| 888 |   root: { flex: 1, backgroundColor: C.bg }, | Starts object property block for grouped configuration/style. |
| 889 |   header: { | Starts object property block for grouped configuration/style. |
| 890 |     flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', | Assigns a property/value pair in object/CSS context. |
| 891 |     padding: 14, backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border, | Assigns a property/value pair in object/CSS context. |
| 892 |   }, | Structural syntax token delimiting code blocks/collections. |
| 893 |   headerTitle: { color: C.accent, fontSize: 18, fontWeight: '700' }, | Starts object property block for grouped configuration/style. |
| 894 |   headerRight: { flexDirection: 'row', alignItems: 'center', gap: 6 }, | Starts object property block for grouped configuration/style. |
| 895 |   headerSub: { color: C.muted, fontSize: 12 }, | Starts object property block for grouped configuration/style. |
| 896 |   tabBar: { backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border, flexGrow: 0 }, | Starts object property block for grouped configuration/style. |
| 897 |   tabBtn: { paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 2, borderBottomColor: 'transparent' }, | Starts object property block for grouped configuration/style. |
| 898 |   tabBtnActive: { borderBottomColor: C.accent }, | Starts object property block for grouped configuration/style. |
| 899 |   tabBtnText: { color: C.muted, fontSize: 12, fontWeight: '600' }, | Starts object property block for grouped configuration/style. |
| 900 |   tabBtnTextActive: { color: C.accent }, | Starts object property block for grouped configuration/style. |
| 901 |   tab: { flex: 1, padding: 12 }, | Starts object property block for grouped configuration/style. |
| 902 |   card: { backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 10, padding: 14, marginBottom: 12 }, | Starts object property block for grouped configuration/style. |
| 903 |   cardTitle: { color: C.accent, fontSize: 11, fontWeight: '700', letterSpacing: 1, marginBottom: 10 }, | Starts object property block for grouped configuration/style. |
| 904 |   statusRow: { | Starts object property block for grouped configuration/style. |
| 905 |     flexDirection: 'row', alignItems: 'center', gap: 8, | Assigns a property/value pair in object/CSS context. |
| 906 |     backgroundColor: C.surface2, borderRadius: 8, padding: 10, marginBottom: 12, | Assigns a property/value pair in object/CSS context. |
| 907 |     borderWidth: 1, borderColor: C.border, | Assigns a property/value pair in object/CSS context. |
| 908 |   }, | Structural syntax token delimiting code blocks/collections. |
| 909 |   statusText: { color: C.muted, fontSize: 12, fontWeight: '600' }, | Starts object property block for grouped configuration/style. |
| 910 |   dot: { width: 8, height: 8, borderRadius: 4 }, | Starts object property block for grouped configuration/style. |
| 911 |   mapBox: { backgroundColor: '#0a1520', borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: C.border, overflow: 'hidden', position: 'relative' }, | Starts object property block for grouped configuration/style. |
| 912 |   mapLabel: { color: C.muted, fontSize: 10, fontWeight: '700', letterSpacing: 1, position: 'absolute', top: 8, left: 10 }, | Starts object property block for grouped configuration/style. |
| 913 |   fenceLabel: { color: C.accent2, fontSize: 10, fontWeight: '700', position: 'absolute' }, | Starts object property block for grouped configuration/style. |
| 914 |   mapEmpty: { color: C.muted, textAlign: 'center', marginTop: 120, fontSize: 13 }, | Starts object property block for grouped configuration/style. |
| 915 |   gridLineH: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: 'rgba(47,85,59,0.2)' }, | Starts object property block for grouped configuration/style. |
| 916 |   gridLineV: { position: 'absolute', top: 0, bottom: 0, width: 1, backgroundColor: 'rgba(47,85,59,0.2)' }, | Starts object property block for grouped configuration/style. |
| 917 |   cattleDot: { position: 'absolute', width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(0,0,0,0.4)' }, | Starts object property block for grouped configuration/style. |
| 918 |   cattleDotText: { color: '#fff', fontSize: 7, fontWeight: '700' }, | Starts object property block for grouped configuration/style. |
| 919 |   fencePoint: { position: 'absolute', width: 8, height: 8, borderRadius: 4, backgroundColor: C.accent2 }, | Starts object property block for grouped configuration/style. |
| 920 |   legendRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }, | Starts object property block for grouped configuration/style. |
| 921 |   legendDot: { width: 10, height: 10, borderRadius: 5 }, | Starts object property block for grouped configuration/style. |
| 922 |   legendText: { color: C.text, fontSize: 13 }, | Starts object property block for grouped configuration/style. |
| 923 |   cattleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: C.border }, | Starts object property block for grouped configuration/style. |
| 924 |   cattleRowId: { color: C.accent, fontWeight: '700', fontSize: 14, flex: 1 }, | Starts object property block for grouped configuration/style. |
| 925 |   cattleRowStatus: { fontSize: 12, fontWeight: '600' }, | Starts object property block for grouped configuration/style. |
| 926 |   removeBtn: { backgroundColor: C.danger, borderRadius: 6, paddingHorizontal: 10, paddingVertical: 4 }, | Starts object property block for grouped configuration/style. |
| 927 |   removeBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' }, | Starts object property block for grouped configuration/style. |
| 928 |   input: { backgroundColor: C.surface, borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 10, color: C.text, marginBottom: 10, fontSize: 14 }, | Starts object property block for grouped configuration/style. |
| 929 |   availableRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border }, | Starts object property block for grouped configuration/style. |
| 930 |   availableId: { color: C.text, fontSize: 14 }, | Starts object property block for grouped configuration/style. |
| 931 |   addBtn: { color: C.accent, fontWeight: '700', fontSize: 13 }, | Starts object property block for grouped configuration/style. |
| 932 |   muted: { color: C.muted, fontSize: 13 }, | Starts object property block for grouped configuration/style. |
| 933 |   drawGrid: { backgroundColor: '#0a1520', borderRadius: 8, position: 'relative', overflow: 'hidden', borderWidth: 1, borderColor: C.border }, | Starts object property block for grouped configuration/style. |
| 934 |   fencePin: { position: 'absolute', width: 16, height: 16, borderRadius: 8, backgroundColor: C.accent2, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#000' }, | Starts object property block for grouped configuration/style. |
| 935 |   fencePinText: { color: '#000', fontSize: 8, fontWeight: '700' }, | Starts object property block for grouped configuration/style. |
| 936 |   actionBtn: { padding: 12, borderRadius: 8, alignItems: 'center' }, | Starts object property block for grouped configuration/style. |
| 937 |   actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 }, | Starts object property block for grouped configuration/style. |
| 938 |   savedPaddock: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border }, | Starts object property block for grouped configuration/style. |
| 939 |   savedPaddockName: { color: C.accent, fontWeight: '700', fontSize: 14 }, | Starts object property block for grouped configuration/style. |
| 940 |   smallBtn: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6 }, | Starts object property block for grouped configuration/style. |
| 941 |   smallBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' }, | Starts object property block for grouped configuration/style. |
| 942 |   refreshBtn: { backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 8, padding: 10, alignItems: 'center', marginBottom: 12 }, | Starts object property block for grouped configuration/style. |
| 943 |   refreshBtnText: { color: C.accent, fontWeight: '600', fontSize: 13 }, | Starts object property block for grouped configuration/style. |
| 944 |   paddockHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }, | Starts object property block for grouped configuration/style. |
| 945 |   paddockName: { color: C.accent, fontWeight: '700', fontSize: 15 }, | Starts object property block for grouped configuration/style. |
| 946 |   badge: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3 }, | Starts object property block for grouped configuration/style. |
| 947 |   badgeAvailable: { backgroundColor: 'rgba(63,185,80,0.2)' }, | Starts object property block for grouped configuration/style. |
| 948 |   badgeOccupied: { backgroundColor: 'rgba(88,166,255,0.2)' }, | Starts object property block for grouped configuration/style. |
| 949 |   badgeText: { fontSize: 10, fontWeight: '700', color: C.text }, | Starts object property block for grouped configuration/style. |
| 950 |   paddockRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }, | Starts object property block for grouped configuration/style. |
| 951 |   paddockLabel: { color: C.muted, fontSize: 13 }, | Starts object property block for grouped configuration/style. |
| 952 |   paddockValue: { color: C.text, fontWeight: '600', fontSize: 13 }, | Starts object property block for grouped configuration/style. |
| 953 |   cattleChip: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3 }, | Starts object property block for grouped configuration/style. |
| 954 |   cattleChipText: { fontSize: 11, fontWeight: '600' }, | Starts object property block for grouped configuration/style. |
| 955 |   healthHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }, | Starts object property block for grouped configuration/style. |
| 956 |   healthId: { color: C.text, fontWeight: '700', fontSize: 15 }, | Starts object property block for grouped configuration/style. |
| 957 |   healthStatus: { fontWeight: '700', fontSize: 13 }, | Starts object property block for grouped configuration/style. |
| 958 |   healthRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }, | Starts object property block for grouped configuration/style. |
| 959 |   healthLabel: { color: C.muted, fontSize: 13 }, | Starts object property block for grouped configuration/style. |
| 960 |   healthValue: { color: C.text, fontWeight: '600', fontSize: 13 }, | Starts object property block for grouped configuration/style. |
| 961 |   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', padding: 20 }, | Starts object property block for grouped configuration/style. |
| 962 |   modalBox: { backgroundColor: C.surface2, borderRadius: 12, padding: 20, borderWidth: 1, borderColor: C.border }, | Starts object property block for grouped configuration/style. |
| 963 |   modalTitle: { color: C.accent, fontWeight: '700', fontSize: 16, marginBottom: 6 }, | Starts object property block for grouped configuration/style. |
| 964 |   assignRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.border, gap: 10 }, | Starts object property block for grouped configuration/style. |
| 965 |   assignRowSelected: { backgroundColor: 'rgba(63,185,80,0.1)', borderRadius: 6, paddingHorizontal: 6 }, | Performs SQLite database connection/query/schema operation. |
| 966 |   assignId: { color: C.text, fontWeight: '600', flex: 1 }, | Starts object property block for grouped configuration/style. |
| 967 |   assignStatus: { fontSize: 12 }, | Starts object property block for grouped configuration/style. |
| 968 |   pillBtn: { borderWidth: 1, borderColor: C.border, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 6, marginRight: 6, backgroundColor: C.surface }, | Starts object property block for grouped configuration/style. |
| 969 |   pillBtnActive: { backgroundColor: C.accent, borderColor: C.accent }, | Starts object property block for grouped configuration/style. |
| 970 |   pillBtnText: { color: C.muted, fontSize: 12, fontWeight: '600' }, | Starts object property block for grouped configuration/style. |
| 971 |   pillBtnTextActive: { color: '#fff' }, | Starts object property block for grouped configuration/style. |
| 972 |   smallBtn2: { flex: 1, backgroundColor: C.surface2, borderWidth: 1, borderColor: C.border, borderRadius: 6, padding: 8, alignItems: 'center' }, | Starts object property block for grouped configuration/style. |
| 973 |   smallBtn2Text: { color: C.accent, fontSize: 12, fontWeight: '600' }, | Starts object property block for grouped configuration/style. |
| 974 | }); | Structural syntax token delimiting code blocks/collections. |

## File: mobile2\index.js

| Line | Code | Explanation |
|---:|---|---|
| 1 | import { registerRootComponent } from 'expo'; | Imports a dependency/module needed in this file. |
| 2 | (blank) | Blank line for readability and section separation. |
| 3 | import App from './App'; | Imports a dependency/module needed in this file. |
| 4 | (blank) | Blank line for readability and section separation. |
| 5 | // registerRootComponent calls AppRegistry.registerComponent('main', () => App); | Comment line documenting intent or context. |
| 6 | // It also ensures that whether you load the app in Expo Go or in a native build, | Comment line documenting intent or context. |
| 7 | // the environment is set up appropriately | Comment line documenting intent or context. |
| 8 | registerRootComponent(App); | Statement terminator ending current instruction. |

## File: web\dashboard.html

| Line | Code | Explanation |
|---:|---|---|
| 1 | <!DOCTYPE html> | JSX/HTML structure line defining UI element hierarchy. |
| 2 | <html lang="en"> | JSX/HTML structure line defining UI element hierarchy. |
| 3 | <head> | JSX/HTML structure line defining UI element hierarchy. |
| 4 | <meta charset="UTF-8"> | JSX/HTML structure line defining UI element hierarchy. |
| 5 | <meta name="viewport" content="width=device-width, initial-scale=1.0"> | JSX/HTML structure line defining UI element hierarchy. |
| 6 | <title>VirtualHerd â€” Smart Pasture System</title> | Implements file-specific logic, configuration, or structure in this context. |
| 7 | <style> | JSX/HTML structure line defining UI element hierarchy. |
| 8 |   @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@300;400;600;700&display=swap'); | Statement terminator ending current instruction. |
| 9 | (blank) | Blank line for readability and section separation. |
| 10 |   :root { | Implements file-specific logic, configuration, or structure in this context. |
| 11 |     --bg: #0d1117; | Statement terminator ending current instruction. |
| 12 |     --surface: #161b22; | Statement terminator ending current instruction. |
| 13 |     --surface2: #1c2330; | Statement terminator ending current instruction. |
| 14 |     --border: #2a3441; | Statement terminator ending current instruction. |
| 15 |     --accent: #3fb950; | Statement terminator ending current instruction. |
| 16 |     --accent2: #f7c948; | Statement terminator ending current instruction. |
| 17 |     --danger: #f85149; | Statement terminator ending current instruction. |
| 18 |     --pulse: #58a6ff; | Statement terminator ending current instruction. |
| 19 |     --warn: #ff7b25; | Statement terminator ending current instruction. |
| 20 |     --text: #e6edf3; | Statement terminator ending current instruction. |
| 21 |     --muted: #7d8590; | Statement terminator ending current instruction. |
| 22 |   } | Structural syntax token delimiting code blocks/collections. |
| 23 | (blank) | Blank line for readability and section separation. |
| 24 |   * { margin:0; padding:0; box-sizing:border-box; } | Block comment content for documentation. |
| 25 | (blank) | Blank line for readability and section separation. |
| 26 |   body { | Starts CSS selector block for related style rules. |
| 27 |     font-family: 'Sora', sans-serif; | Assigns a property/value pair in object/CSS context. |
| 28 |     background: var(--bg); | Assigns a property/value pair in object/CSS context. |
| 29 |     color: var(--text); | Assigns a property/value pair in object/CSS context. |
| 30 |     height: 100vh; | Assigns a property/value pair in object/CSS context. |
| 31 |     display: flex; | Assigns a property/value pair in object/CSS context. |
| 32 |     flex-direction: column; | Assigns a property/value pair in object/CSS context. |
| 33 |     overflow: hidden; | Assigns a property/value pair in object/CSS context. |
| 34 |   } | Structural syntax token delimiting code blocks/collections. |
| 35 | (blank) | Blank line for readability and section separation. |
| 36 |   header { | Starts CSS selector block for related style rules. |
| 37 |     display: flex; | Assigns a property/value pair in object/CSS context. |
| 38 |     align-items: center; | Assigns a property/value pair in object/CSS context. |
| 39 |     justify-content: space-between; | Assigns a property/value pair in object/CSS context. |
| 40 |     padding: 10px 20px; | Assigns a property/value pair in object/CSS context. |
| 41 |     background: var(--surface); | Assigns a property/value pair in object/CSS context. |
| 42 |     border-bottom: 1px solid var(--border); | Assigns a property/value pair in object/CSS context. |
| 43 |     flex-shrink: 0; | Assigns a property/value pair in object/CSS context. |
| 44 |   } | Structural syntax token delimiting code blocks/collections. |
| 45 | (blank) | Blank line for readability and section separation. |
| 46 |   .logo { | Implements file-specific logic, configuration, or structure in this context. |
| 47 |     display: flex; | Assigns a property/value pair in object/CSS context. |
| 48 |     align-items: center; | Assigns a property/value pair in object/CSS context. |
| 49 |     gap: 10px; | Assigns a property/value pair in object/CSS context. |
| 50 |     font-size: 1.1rem; | Assigns a property/value pair in object/CSS context. |
| 51 |     font-weight: 700; | Assigns a property/value pair in object/CSS context. |
| 52 |   } | Structural syntax token delimiting code blocks/collections. |
| 53 | (blank) | Blank line for readability and section separation. |
| 54 |   .logo-icon { font-size: 1.4rem; } | Implements file-specific logic, configuration, or structure in this context. |
| 55 |   .logo span { color: var(--accent); } | Implements file-specific logic, configuration, or structure in this context. |
| 56 | (blank) | Blank line for readability and section separation. |
| 57 |   .header-right { | Implements file-specific logic, configuration, or structure in this context. |
| 58 |     display: flex; | Assigns a property/value pair in object/CSS context. |
| 59 |     align-items: center; | Assigns a property/value pair in object/CSS context. |
| 60 |     gap: 12px; | Assigns a property/value pair in object/CSS context. |
| 61 |     font-size: 0.75rem; | Assigns a property/value pair in object/CSS context. |
| 62 |     font-family: 'DM Mono', monospace; | Assigns a property/value pair in object/CSS context. |
| 63 |     color: var(--muted); | Assigns a property/value pair in object/CSS context. |
| 64 |   } | Structural syntax token delimiting code blocks/collections. |
| 65 | (blank) | Blank line for readability and section separation. |
| 66 |   .live-dot { | Implements file-specific logic, configuration, or structure in this context. |
| 67 |     width: 7px; height: 7px; | Assigns a property/value pair in object/CSS context. |
| 68 |     border-radius: 50%; | Assigns a property/value pair in object/CSS context. |
| 69 |     background: var(--accent); | Assigns a property/value pair in object/CSS context. |
| 70 |     animation: blink 1.5s infinite; | Assigns a property/value pair in object/CSS context. |
| 71 |   } | Structural syntax token delimiting code blocks/collections. |
| 72 | (blank) | Blank line for readability and section separation. |
| 73 |   @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.3} } | Implements file-specific logic, configuration, or structure in this context. |
| 74 | (blank) | Blank line for readability and section separation. |
| 75 |   .tab-nav { | Implements file-specific logic, configuration, or structure in this context. |
| 76 |     display: flex; | Assigns a property/value pair in object/CSS context. |
| 77 |     background: var(--surface); | Assigns a property/value pair in object/CSS context. |
| 78 |     border-bottom: 1px solid var(--border); | Assigns a property/value pair in object/CSS context. |
| 79 |     padding: 0 20px; | Assigns a property/value pair in object/CSS context. |
| 80 |     flex-shrink: 0; | Assigns a property/value pair in object/CSS context. |
| 81 |   } | Structural syntax token delimiting code blocks/collections. |
| 82 | (blank) | Blank line for readability and section separation. |
| 83 |   .tab-btn { | Implements file-specific logic, configuration, or structure in this context. |
| 84 |     padding: 10px 20px; | Assigns a property/value pair in object/CSS context. |
| 85 |     background: none; | Assigns a property/value pair in object/CSS context. |
| 86 |     border: none; | Assigns a property/value pair in object/CSS context. |
| 87 |     color: var(--muted); | Assigns a property/value pair in object/CSS context. |
| 88 |     cursor: pointer; | Assigns a property/value pair in object/CSS context. |
| 89 |     font-size: 0.85rem; | Assigns a property/value pair in object/CSS context. |
| 90 |     font-weight: 600; | Assigns a property/value pair in object/CSS context. |
| 91 |     border-bottom: 2px solid transparent; | Assigns a property/value pair in object/CSS context. |
| 92 |     transition: all 0.2s; | Assigns a property/value pair in object/CSS context. |
| 93 |     font-family: 'Sora', sans-serif; | Assigns a property/value pair in object/CSS context. |
| 94 |   } | Structural syntax token delimiting code blocks/collections. |
| 95 | (blank) | Blank line for readability and section separation. |
| 96 |   .tab-btn.active { color: var(--accent); border-bottom-color: var(--accent); } | Implements file-specific logic, configuration, or structure in this context. |
| 97 |   .tab-btn:hover { color: var(--text); } | Implements file-specific logic, configuration, or structure in this context. |
| 98 | (blank) | Blank line for readability and section separation. |
| 99 |   .main { display: flex; flex: 1; overflow: hidden; } | Implements file-specific logic, configuration, or structure in this context. |
| 100 | (blank) | Blank line for readability and section separation. |
| 101 |   .tab-content { display: none; flex: 1; overflow: hidden; } | Implements file-specific logic, configuration, or structure in this context. |
| 102 |   .tab-content.active { display: flex; } | Implements file-specific logic, configuration, or structure in this context. |
| 103 | (blank) | Blank line for readability and section separation. |
| 104 |   /* MAP TAB */ | Block comment content for documentation. |
| 105 |   .canvas-wrap { flex: 1; background: #0a1520; overflow: hidden; } | Implements file-specific logic, configuration, or structure in this context. |
| 106 |   canvas { display: block; width: 100%; height: 100%; cursor: default; } | Starts CSS selector block for related style rules. |
| 107 | (blank) | Blank line for readability and section separation. |
| 108 |   .sidebar { | Implements file-specific logic, configuration, or structure in this context. |
| 109 |     width: 280px; | Assigns a property/value pair in object/CSS context. |
| 110 |     background: var(--surface); | Assigns a property/value pair in object/CSS context. |
| 111 |     border-left: 1px solid var(--border); | Assigns a property/value pair in object/CSS context. |
| 112 |     overflow-y: auto; | Assigns a property/value pair in object/CSS context. |
| 113 |     padding: 15px; | Assigns a property/value pair in object/CSS context. |
| 114 |     display: flex; | Assigns a property/value pair in object/CSS context. |
| 115 |     flex-direction: column; | Assigns a property/value pair in object/CSS context. |
| 116 |     gap: 15px; | Assigns a property/value pair in object/CSS context. |
| 117 |   } | Structural syntax token delimiting code blocks/collections. |
| 118 | (blank) | Blank line for readability and section separation. |
| 119 |   .panel { | Implements file-specific logic, configuration, or structure in this context. |
| 120 |     background: var(--surface2); | Assigns a property/value pair in object/CSS context. |
| 121 |     border: 1px solid var(--border); | Assigns a property/value pair in object/CSS context. |
| 122 |     border-radius: 8px; | Assigns a property/value pair in object/CSS context. |
| 123 |     padding: 12px; | Assigns a property/value pair in object/CSS context. |
| 124 |   } | Structural syntax token delimiting code blocks/collections. |
| 125 | (blank) | Blank line for readability and section separation. |
| 126 |   .panel-title { | Implements file-specific logic, configuration, or structure in this context. |
| 127 |     font-size: 0.7rem; | Assigns a property/value pair in object/CSS context. |
| 128 |     text-transform: uppercase; | Assigns a property/value pair in object/CSS context. |
| 129 |     font-weight: 700; | Assigns a property/value pair in object/CSS context. |
| 130 |     letter-spacing: 1px; | Assigns a property/value pair in object/CSS context. |
| 131 |     color: var(--accent); | Assigns a property/value pair in object/CSS context. |
| 132 |     margin-bottom: 8px; | Assigns a property/value pair in object/CSS context. |
| 133 |   } | Structural syntax token delimiting code blocks/collections. |
| 134 | (blank) | Blank line for readability and section separation. |
| 135 |   .herd-overview { | Implements file-specific logic, configuration, or structure in this context. |
| 136 |     display: grid; | Assigns a property/value pair in object/CSS context. |
| 137 |     grid-template-columns: 1fr 1fr 1fr; | Assigns a property/value pair in object/CSS context. |
| 138 |     gap: 8px; | Assigns a property/value pair in object/CSS context. |
| 139 |   } | Structural syntax token delimiting code blocks/collections. |
| 140 | (blank) | Blank line for readability and section separation. |
| 141 |   .stat { text-align: center; } | Implements file-specific logic, configuration, or structure in this context. |
| 142 |   .stat-value { font-size: 1.4rem; font-weight: 700; color: var(--accent); } | Implements file-specific logic, configuration, or structure in this context. |
| 143 |   .stat-label { font-size: 0.65rem; color: var(--muted); margin-top: 2px; text-transform: uppercase; } | Implements file-specific logic, configuration, or structure in this context. |
| 144 | (blank) | Blank line for readability and section separation. |
| 145 |   .legend { font-size: 0.75rem; } | Implements file-specific logic, configuration, or structure in this context. |
| 146 |   .legend-item { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; } | Implements file-specific logic, configuration, or structure in this context. |
| 147 |   .legend-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; } | Implements file-specific logic, configuration, or structure in this context. |
| 148 | (blank) | Blank line for readability and section separation. |
| 149 |   .herd-list { max-height: 200px; overflow-y: auto; font-size: 0.75rem; } | Implements file-specific logic, configuration, or structure in this context. |
| 150 |   .herd-item { | Implements file-specific logic, configuration, or structure in this context. |
| 151 |     display: flex; | Assigns a property/value pair in object/CSS context. |
| 152 |     justify-content: space-between; | Assigns a property/value pair in object/CSS context. |
| 153 |     padding: 6px 0; | Assigns a property/value pair in object/CSS context. |
| 154 |     border-bottom: 1px solid var(--border); | Assigns a property/value pair in object/CSS context. |
| 155 |   } | Structural syntax token delimiting code blocks/collections. |
| 156 |   .herd-item:last-child { border-bottom: none; } | Implements file-specific logic, configuration, or structure in this context. |
| 157 |   .herd-id { color: var(--accent); font-weight: 600; } | Implements file-specific logic, configuration, or structure in this context. |
| 158 |   .herd-behavior { color: var(--muted); } | Implements file-specific logic, configuration, or structure in this context. |
| 159 | (blank) | Blank line for readability and section separation. |
| 160 |   .alerts-list { max-height: 150px; overflow-y: auto; font-size: 0.75rem; } | Implements file-specific logic, configuration, or structure in this context. |
| 161 |   .alert-item { | Implements file-specific logic, configuration, or structure in this context. |
| 162 |     background: var(--surface); | Assigns a property/value pair in object/CSS context. |
| 163 |     border-left: 3px solid var(--warn); | Assigns a property/value pair in object/CSS context. |
| 164 |     padding: 8px; | Assigns a property/value pair in object/CSS context. |
| 165 |     margin-bottom: 6px; | Assigns a property/value pair in object/CSS context. |
| 166 |     border-radius: 4px; | Assigns a property/value pair in object/CSS context. |
| 167 |   } | Structural syntax token delimiting code blocks/collections. |
| 168 |   .alert-item.critical { border-left-color: var(--danger); } | Implements file-specific logic, configuration, or structure in this context. |
| 169 |   .alert-type { color: var(--accent2); font-weight: 600; } | Implements file-specific logic, configuration, or structure in this context. |
| 170 |   .alert-detail { color: var(--muted); font-size: 0.7rem; margin-top: 2px; } | Implements file-specific logic, configuration, or structure in this context. |
| 171 | (blank) | Blank line for readability and section separation. |
| 172 |   /* HEALTH TAB */ | Block comment content for documentation. |
| 173 |   .health-grid { | Implements file-specific logic, configuration, or structure in this context. |
| 174 |     display: grid; | Assigns a property/value pair in object/CSS context. |
| 175 |     grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); | Assigns a property/value pair in object/CSS context. |
| 176 |     gap: 15px; | Assigns a property/value pair in object/CSS context. |
| 177 |     padding: 20px; | Assigns a property/value pair in object/CSS context. |
| 178 |     overflow-y: auto; | Assigns a property/value pair in object/CSS context. |
| 179 |     flex: 1; | Assigns a property/value pair in object/CSS context. |
| 180 |     align-content: start; | Assigns a property/value pair in object/CSS context. |
| 181 |   } | Structural syntax token delimiting code blocks/collections. |
| 182 | (blank) | Blank line for readability and section separation. |
| 183 |   .health-card { | Implements file-specific logic, configuration, or structure in this context. |
| 184 |     background: var(--surface2); | Assigns a property/value pair in object/CSS context. |
| 185 |     border: 1px solid var(--border); | Assigns a property/value pair in object/CSS context. |
| 186 |     border-radius: 8px; | Assigns a property/value pair in object/CSS context. |
| 187 |     padding: 14px; | Assigns a property/value pair in object/CSS context. |
| 188 |   } | Structural syntax token delimiting code blocks/collections. |
| 189 | (blank) | Blank line for readability and section separation. |
| 190 |   .health-card-title { | Implements file-specific logic, configuration, or structure in this context. |
| 191 |     color: var(--accent); | Assigns a property/value pair in object/CSS context. |
| 192 |     font-weight: 600; | Assigns a property/value pair in object/CSS context. |
| 193 |     margin-bottom: 10px; | Assigns a property/value pair in object/CSS context. |
| 194 |     font-size: 0.9rem; | Assigns a property/value pair in object/CSS context. |
| 195 |     border-bottom: 1px solid var(--border); | Assigns a property/value pair in object/CSS context. |
| 196 |     padding-bottom: 6px; | Assigns a property/value pair in object/CSS context. |
| 197 |   } | Structural syntax token delimiting code blocks/collections. |
| 198 | (blank) | Blank line for readability and section separation. |
| 199 |   .health-metric { | Implements file-specific logic, configuration, or structure in this context. |
| 200 |     display: flex; | Assigns a property/value pair in object/CSS context. |
| 201 |     justify-content: space-between; | Assigns a property/value pair in object/CSS context. |
| 202 |     font-size: 0.8rem; | Assigns a property/value pair in object/CSS context. |
| 203 |     margin-bottom: 5px; | Assigns a property/value pair in object/CSS context. |
| 204 |   } | Structural syntax token delimiting code blocks/collections. |
| 205 |   .health-metric-label { color: var(--muted); } | Implements file-specific logic, configuration, or structure in this context. |
| 206 |   .health-metric-value { color: var(--text); font-weight: 600; } | Implements file-specific logic, configuration, or structure in this context. |
| 207 | (blank) | Blank line for readability and section separation. |
| 208 |   /* PADDOCKS TAB */ | Block comment content for documentation. |
| 209 |   .paddock-list { | Implements file-specific logic, configuration, or structure in this context. |
| 210 |     padding: 20px; | Assigns a property/value pair in object/CSS context. |
| 211 |     overflow-y: auto; | Assigns a property/value pair in object/CSS context. |
| 212 |     flex: 1; | Assigns a property/value pair in object/CSS context. |
| 213 |     display: grid; | Assigns a property/value pair in object/CSS context. |
| 214 |     grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); | Assigns a property/value pair in object/CSS context. |
| 215 |     gap: 15px; | Assigns a property/value pair in object/CSS context. |
| 216 |     align-content: start; | Assigns a property/value pair in object/CSS context. |
| 217 |   } | Structural syntax token delimiting code blocks/collections. |
| 218 | (blank) | Blank line for readability and section separation. |
| 219 |   .paddock-item { | Implements file-specific logic, configuration, or structure in this context. |
| 220 |     background: var(--surface2); | Assigns a property/value pair in object/CSS context. |
| 221 |     border: 1px solid var(--border); | Assigns a property/value pair in object/CSS context. |
| 222 |     border-radius: 8px; | Assigns a property/value pair in object/CSS context. |
| 223 |     padding: 16px; | Assigns a property/value pair in object/CSS context. |
| 224 |   } | Structural syntax token delimiting code blocks/collections. |
| 225 | (blank) | Blank line for readability and section separation. |
| 226 |   .paddock-header { | Implements file-specific logic, configuration, or structure in this context. |
| 227 |     display: flex; | Assigns a property/value pair in object/CSS context. |
| 228 |     justify-content: space-between; | Assigns a property/value pair in object/CSS context. |
| 229 |     align-items: center; | Assigns a property/value pair in object/CSS context. |
| 230 |     margin-bottom: 12px; | Assigns a property/value pair in object/CSS context. |
| 231 |   } | Structural syntax token delimiting code blocks/collections. |
| 232 | (blank) | Blank line for readability and section separation. |
| 233 |   .paddock-name { color: var(--accent); font-weight: 700; font-size: 1rem; } | Implements file-specific logic, configuration, or structure in this context. |
| 234 | (blank) | Blank line for readability and section separation. |
| 235 |   .paddock-badge { | Implements file-specific logic, configuration, or structure in this context. |
| 236 |     font-size: 0.65rem; | Assigns a property/value pair in object/CSS context. |
| 237 |     padding: 2px 8px; | Assigns a property/value pair in object/CSS context. |
| 238 |     border-radius: 10px; | Assigns a property/value pair in object/CSS context. |
| 239 |     font-weight: 600; | Assigns a property/value pair in object/CSS context. |
| 240 |     text-transform: uppercase; | Assigns a property/value pair in object/CSS context. |
| 241 |   } | Structural syntax token delimiting code blocks/collections. |
| 242 |   .badge-available { background: rgba(63,185,80,0.2); color: var(--accent); } | Implements file-specific logic, configuration, or structure in this context. |
| 243 |   .badge-occupied { background: rgba(88,166,255,0.2); color: var(--pulse); } | Implements file-specific logic, configuration, or structure in this context. |
| 244 |   .badge-recovering { background: rgba(255,123,37,0.2); color: var(--warn); } | Implements file-specific logic, configuration, or structure in this context. |
| 245 |   .badge-recommended { background: rgba(247,201,72,0.2); color: var(--accent2); } | Implements file-specific logic, configuration, or structure in this context. |
| 246 | (blank) | Blank line for readability and section separation. |
| 247 |   .paddock-stat { | Implements file-specific logic, configuration, or structure in this context. |
| 248 |     display: flex; | Assigns a property/value pair in object/CSS context. |
| 249 |     justify-content: space-between; | Assigns a property/value pair in object/CSS context. |
| 250 |     font-size: 0.8rem; | Assigns a property/value pair in object/CSS context. |
| 251 |     margin-bottom: 6px; | Assigns a property/value pair in object/CSS context. |
| 252 |     color: var(--muted); | Assigns a property/value pair in object/CSS context. |
| 253 |   } | Structural syntax token delimiting code blocks/collections. |
| 254 |   .paddock-stat span:last-child { color: var(--text); font-weight: 600; } | Implements file-specific logic, configuration, or structure in this context. |
| 255 | (blank) | Blank line for readability and section separation. |
| 256 |   .quality-bar-wrap { | Implements file-specific logic, configuration, or structure in this context. |
| 257 |     margin-top: 10px; | Assigns a property/value pair in object/CSS context. |
| 258 |     background: var(--border); | Assigns a property/value pair in object/CSS context. |
| 259 |     border-radius: 4px; | Assigns a property/value pair in object/CSS context. |
| 260 |     height: 6px; | Assigns a property/value pair in object/CSS context. |
| 261 |     overflow: hidden; | Assigns a property/value pair in object/CSS context. |
| 262 |   } | Structural syntax token delimiting code blocks/collections. |
| 263 |   .quality-bar { | Implements file-specific logic, configuration, or structure in this context. |
| 264 |     height: 100%; | Assigns a property/value pair in object/CSS context. |
| 265 |     border-radius: 4px; | Assigns a property/value pair in object/CSS context. |
| 266 |     transition: width 0.5s; | Assigns a property/value pair in object/CSS context. |
| 267 |   } | Structural syntax token delimiting code blocks/collections. |
| 268 | (blank) | Blank line for readability and section separation. |
| 269 |   /* SCHEDULE TAB */ | Block comment content for documentation. |
| 270 |   .schedule-view { | Implements file-specific logic, configuration, or structure in this context. |
| 271 |     padding: 20px; | Assigns a property/value pair in object/CSS context. |
| 272 |     overflow-y: auto; | Assigns a property/value pair in object/CSS context. |
| 273 |     flex: 1; | Assigns a property/value pair in object/CSS context. |
| 274 |     display: flex; | Assigns a property/value pair in object/CSS context. |
| 275 |     flex-direction: column; | Assigns a property/value pair in object/CSS context. |
| 276 |     gap: 12px; | Assigns a property/value pair in object/CSS context. |
| 277 |   } | Structural syntax token delimiting code blocks/collections. |
| 278 | (blank) | Blank line for readability and section separation. |
| 279 |   .schedule-header { | Implements file-specific logic, configuration, or structure in this context. |
| 280 |     background: var(--surface2); | Assigns a property/value pair in object/CSS context. |
| 281 |     border: 1px solid var(--accent2); | Assigns a property/value pair in object/CSS context. |
| 282 |     border-radius: 8px; | Assigns a property/value pair in object/CSS context. |
| 283 |     padding: 16px; | Assigns a property/value pair in object/CSS context. |
| 284 |     margin-bottom: 4px; | Assigns a property/value pair in object/CSS context. |
| 285 |   } | Structural syntax token delimiting code blocks/collections. |
| 286 | (blank) | Blank line for readability and section separation. |
| 287 |   .schedule-header h3 { color: var(--accent2); margin-bottom: 6px; font-size: 0.9rem; } | Implements file-specific logic, configuration, or structure in this context. |
| 288 |   .schedule-header p { color: var(--muted); font-size: 0.8rem; } | Implements file-specific logic, configuration, or structure in this context. |
| 289 | (blank) | Blank line for readability and section separation. |
| 290 |   .schedule-day { | Implements file-specific logic, configuration, or structure in this context. |
| 291 |     background: var(--surface2); | Assigns a property/value pair in object/CSS context. |
| 292 |     border: 1px solid var(--border); | Assigns a property/value pair in object/CSS context. |
| 293 |     border-radius: 8px; | Assigns a property/value pair in object/CSS context. |
| 294 |     padding: 14px; | Assigns a property/value pair in object/CSS context. |
| 295 |     display: flex; | Assigns a property/value pair in object/CSS context. |
| 296 |     gap: 16px; | Assigns a property/value pair in object/CSS context. |
| 297 |     align-items: center; | Assigns a property/value pair in object/CSS context. |
| 298 |   } | Structural syntax token delimiting code blocks/collections. |
| 299 | (blank) | Blank line for readability and section separation. |
| 300 |   .schedule-day.today { border-color: var(--accent); } | Implements file-specific logic, configuration, or structure in this context. |
| 301 | (blank) | Blank line for readability and section separation. |
| 302 |   .schedule-day-info { flex: 1; } | Implements file-specific logic, configuration, or structure in this context. |
| 303 |   .schedule-day-name { font-weight: 600; margin-bottom: 4px; color: var(--accent); } | Implements file-specific logic, configuration, or structure in this context. |
| 304 |   .schedule-day-paddock { color: var(--accent); font-size: 0.85rem; margin-bottom: 4px; } | Implements file-specific logic, configuration, or structure in this context. |
| 305 |   .schedule-day-details { color: var(--muted); font-size: 0.75rem; } | Implements file-specific logic, configuration, or structure in this context. |
| 306 | (blank) | Blank line for readability and section separation. |
| 307 |   .schedule-quality { | Implements file-specific logic, configuration, or structure in this context. |
| 308 |     text-align: right; | Assigns a property/value pair in object/CSS context. |
| 309 |     min-width: 70px; | Assigns a property/value pair in object/CSS context. |
| 310 |   } | Structural syntax token delimiting code blocks/collections. |
| 311 |   .schedule-quality-num { font-size: 1.2rem; font-weight: 700; color: var(--accent); } | Implements file-specific logic, configuration, or structure in this context. |
| 312 |   .schedule-quality-label { font-size: 0.65rem; color: var(--muted); } | Implements file-specific logic, configuration, or structure in this context. |
| 313 | (blank) | Blank line for readability and section separation. |
| 314 |   ::-webkit-scrollbar { width: 6px; } | Implements file-specific logic, configuration, or structure in this context. |
| 315 |   ::-webkit-scrollbar-track { background: var(--surface2); } | Implements file-specific logic, configuration, or structure in this context. |
| 316 |   ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 3px; } | Implements file-specific logic, configuration, or structure in this context. |
| 317 |   ::-webkit-scrollbar-thumb:hover { background: var(--muted); } | Implements file-specific logic, configuration, or structure in this context. |
| 318 | </style> | JSX/HTML structure line defining UI element hierarchy. |
| 319 | </head> | JSX/HTML structure line defining UI element hierarchy. |
| 320 | <body> | JSX/HTML structure line defining UI element hierarchy. |
| 321 | (blank) | Blank line for readability and section separation. |
| 322 | <header> | JSX/HTML structure line defining UI element hierarchy. |
| 323 |   <div class="logo"> | JSX/HTML structure line defining UI element hierarchy. |
| 324 |     <span class="logo-icon">ðŸ„</span> | Implements file-specific logic, configuration, or structure in this context. |
| 325 |     <span>Virtual <span>Herd</span> â€” Smart Pasture System</span> | Implements file-specific logic, configuration, or structure in this context. |
| 326 |   </div> | JSX/HTML structure line defining UI element hierarchy. |
| 327 |   <div class="header-right"> | JSX/HTML structure line defining UI element hierarchy. |
| 328 |     <span id="dayDisplay">Day 1</span> | Implements file-specific logic, configuration, or structure in this context. |
| 329 |     <div class="live-dot"></div> | Implements file-specific logic, configuration, or structure in this context. |
| 330 |     <span id="connectionStatus">CONNECTING...</span> | Implements file-specific logic, configuration, or structure in this context. |
| 331 |   </div> | JSX/HTML structure line defining UI element hierarchy. |
| 332 | </header> | JSX/HTML structure line defining UI element hierarchy. |
| 333 | (blank) | Blank line for readability and section separation. |
| 334 | <div class="tab-nav"> | JSX/HTML structure line defining UI element hierarchy. |
| 335 |   <button class="tab-btn active" data-tab="map">ðŸ—º Map</button> | Implements file-specific logic, configuration, or structure in this context. |
| 336 |   <button class="tab-btn" data-tab="health">â¤ï¸ Health</button> | Implements file-specific logic, configuration, or structure in this context. |
| 337 |   <button class="tab-btn" data-tab="paddocks">ðŸŒ¾ Paddocks</button> | Implements file-specific logic, configuration, or structure in this context. |
| 338 |   <button class="tab-btn" data-tab="schedule">ðŸ“… Schedule</button> | Implements file-specific logic, configuration, or structure in this context. |
| 339 | </div> | JSX/HTML structure line defining UI element hierarchy. |
| 340 | (blank) | Blank line for readability and section separation. |
| 341 | <div class="main"> | JSX/HTML structure line defining UI element hierarchy. |
| 342 | (blank) | Blank line for readability and section separation. |
| 343 |   <!-- MAP TAB --> | JSX/HTML structure line defining UI element hierarchy. |
| 344 |   <div id="map" class="tab-content active"> | JSX/HTML structure line defining UI element hierarchy. |
| 345 |     <div class="canvas-wrap"> | JSX/HTML structure line defining UI element hierarchy. |
| 346 |       <canvas id="canvas"></canvas> | Implements file-specific logic, configuration, or structure in this context. |
| 347 |     </div> | JSX/HTML structure line defining UI element hierarchy. |
| 348 |     <div class="sidebar"> | JSX/HTML structure line defining UI element hierarchy. |
| 349 |       <div class="panel"> | JSX/HTML structure line defining UI element hierarchy. |
| 350 |         <div class="panel-title">Herd Overview</div> | Implements file-specific logic, configuration, or structure in this context. |
| 351 |         <div class="herd-overview"> | JSX/HTML structure line defining UI element hierarchy. |
| 352 |           <div class="stat"> | JSX/HTML structure line defining UI element hierarchy. |
| 353 |             <div class="stat-value" id="totalCows">0</div> | Implements file-specific logic, configuration, or structure in this context. |
| 354 |             <div class="stat-label">Cows</div> | Implements file-specific logic, configuration, or structure in this context. |
| 355 |           </div> | JSX/HTML structure line defining UI element hierarchy. |
| 356 |           <div class="stat"> | JSX/HTML structure line defining UI element hierarchy. |
| 357 |             <div class="stat-value" id="healthyCows">0</div> | Implements file-specific logic, configuration, or structure in this context. |
| 358 |             <div class="stat-label">Healthy</div> | Implements file-specific logic, configuration, or structure in this context. |
| 359 |           </div> | JSX/HTML structure line defining UI element hierarchy. |
| 360 |           <div class="stat"> | JSX/HTML structure line defining UI element hierarchy. |
| 361 |             <div class="stat-value" id="alertCount">0</div> | Implements file-specific logic, configuration, or structure in this context. |
| 362 |             <div class="stat-label">Alerts</div> | Implements file-specific logic, configuration, or structure in this context. |
| 363 |           </div> | JSX/HTML structure line defining UI element hierarchy. |
| 364 |         </div> | JSX/HTML structure line defining UI element hierarchy. |
| 365 |       </div> | JSX/HTML structure line defining UI element hierarchy. |
| 366 | (blank) | Blank line for readability and section separation. |
| 367 |       <div class="panel"> | JSX/HTML structure line defining UI element hierarchy. |
| 368 |         <div class="panel-title">Live Alerts</div> | Implements file-specific logic, configuration, or structure in this context. |
| 369 |         <div class="alerts-list" id="alertsList"> | JSX/HTML structure line defining UI element hierarchy. |
| 370 |           <div style="color: var(--muted); font-size: 0.7rem;">No alerts</div> | Implements file-specific logic, configuration, or structure in this context. |
| 371 |         </div> | JSX/HTML structure line defining UI element hierarchy. |
| 372 |       </div> | JSX/HTML structure line defining UI element hierarchy. |
| 373 | (blank) | Blank line for readability and section separation. |
| 374 |       <div class="panel"> | JSX/HTML structure line defining UI element hierarchy. |
| 375 |         <div class="panel-title">Herd List</div> | Implements file-specific logic, configuration, or structure in this context. |
| 376 |         <div class="herd-list" id="herdList"> | JSX/HTML structure line defining UI element hierarchy. |
| 377 |           <div style="color: var(--muted); font-size: 0.7rem;">No cattle added</div> | Implements file-specific logic, configuration, or structure in this context. |
| 378 |         </div> | JSX/HTML structure line defining UI element hierarchy. |
| 379 |       </div> | JSX/HTML structure line defining UI element hierarchy. |
| 380 | (blank) | Blank line for readability and section separation. |
| 381 |       <div class="panel"> | JSX/HTML structure line defining UI element hierarchy. |
| 382 |         <div class="panel-title">Legend</div> | Implements file-specific logic, configuration, or structure in this context. |
| 383 |         <div class="legend"> | JSX/HTML structure line defining UI element hierarchy. |
| 384 |           <div class="legend-item"> | JSX/HTML structure line defining UI element hierarchy. |
| 385 |             <div class="legend-dot" style="background: var(--accent);"></div> | Implements file-specific logic, configuration, or structure in this context. |
| 386 |             <span>Healthy</span> | Implements file-specific logic, configuration, or structure in this context. |
| 387 |           </div> | JSX/HTML structure line defining UI element hierarchy. |
| 388 |           <div class="legend-item"> | JSX/HTML structure line defining UI element hierarchy. |
| 389 |             <div class="legend-dot" style="background: var(--pulse);"></div> | Implements file-specific logic, configuration, or structure in this context. |
| 390 |             <span>Lying Down</span> | Implements file-specific logic, configuration, or structure in this context. |
| 391 |           </div> | JSX/HTML structure line defining UI element hierarchy. |
| 392 |           <div class="legend-item"> | JSX/HTML structure line defining UI element hierarchy. |
| 393 |             <div class="legend-dot" style="background: var(--warn);"></div> | Implements file-specific logic, configuration, or structure in this context. |
| 394 |             <span>Lameness</span> | Implements file-specific logic, configuration, or structure in this context. |
| 395 |           </div> | JSX/HTML structure line defining UI element hierarchy. |
| 396 |           <div class="legend-item"> | JSX/HTML structure line defining UI element hierarchy. |
| 397 |             <div class="legend-dot" style="background: var(--danger);"></div> | Implements file-specific logic, configuration, or structure in this context. |
| 398 |             <span>Fever / Stress</span> | Implements file-specific logic, configuration, or structure in this context. |
| 399 |           </div> | JSX/HTML structure line defining UI element hierarchy. |
| 400 |           <div class="legend-item"> | JSX/HTML structure line defining UI element hierarchy. |
| 401 |             <div class="legend-dot" style="background: var(--accent2);"></div> | Implements file-specific logic, configuration, or structure in this context. |
| 402 |             <span>Hypothermia</span> | Implements file-specific logic, configuration, or structure in this context. |
| 403 |           </div> | JSX/HTML structure line defining UI element hierarchy. |
| 404 |         </div> | JSX/HTML structure line defining UI element hierarchy. |
| 405 |       </div> | JSX/HTML structure line defining UI element hierarchy. |
| 406 |     </div> | JSX/HTML structure line defining UI element hierarchy. |
| 407 |   </div> | JSX/HTML structure line defining UI element hierarchy. |
| 408 | (blank) | Blank line for readability and section separation. |
| 409 |   <!-- HEALTH TAB --> | JSX/HTML structure line defining UI element hierarchy. |
| 410 |   <div id="health" class="tab-content"> | JSX/HTML structure line defining UI element hierarchy. |
| 411 |     <div class="health-grid" id="healthGrid"> | JSX/HTML structure line defining UI element hierarchy. |
| 412 |       <div style="color: var(--muted); padding: 20px; grid-column: 1/-1;">Add cattle to see health data</div> | Implements file-specific logic, configuration, or structure in this context. |
| 413 |     </div> | JSX/HTML structure line defining UI element hierarchy. |
| 414 |   </div> | JSX/HTML structure line defining UI element hierarchy. |
| 415 | (blank) | Blank line for readability and section separation. |
| 416 |   <!-- PADDOCKS TAB --> | JSX/HTML structure line defining UI element hierarchy. |
| 417 |   <div id="paddocks" class="tab-content"> | JSX/HTML structure line defining UI element hierarchy. |
| 418 |     <div class="paddock-list" id="paddockList"> | JSX/HTML structure line defining UI element hierarchy. |
| 419 |       <div style="color: var(--muted);">Loading paddocks...</div> | Implements file-specific logic, configuration, or structure in this context. |
| 420 |     </div> | JSX/HTML structure line defining UI element hierarchy. |
| 421 |   </div> | JSX/HTML structure line defining UI element hierarchy. |
| 422 | (blank) | Blank line for readability and section separation. |
| 423 |   <!-- SCHEDULE TAB --> | JSX/HTML structure line defining UI element hierarchy. |
| 424 |   <div id="schedule" class="tab-content"> | JSX/HTML structure line defining UI element hierarchy. |
| 425 |     <div class="schedule-view" id="scheduleView"> | JSX/HTML structure line defining UI element hierarchy. |
| 426 |       <div style="color: var(--muted);">Loading schedule...</div> | Implements file-specific logic, configuration, or structure in this context. |
| 427 |     </div> | JSX/HTML structure line defining UI element hierarchy. |
| 428 |   </div> | JSX/HTML structure line defining UI element hierarchy. |
| 429 | (blank) | Blank line for readability and section separation. |
| 430 | </div> | JSX/HTML structure line defining UI element hierarchy. |
| 431 | (blank) | Blank line for readability and section separation. |
| 432 | <script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.5/socket.io.min.js"></script> | Implements file-specific logic, configuration, or structure in this context. |
| 433 | <script> | JSX/HTML structure line defining UI element hierarchy. |
| 434 |   let farmerPaddocksData = []; | Declares a mutable JavaScript variable for changing state/data. |
| 435 |   const BACKEND_URL = 'http://localhost:5000'; | Declares a JavaScript constant used in component logic. |
| 436 |   const canvas = document.getElementById('canvas'); | Declares a JavaScript constant used in component logic. |
| 437 |   const ctx = canvas.getContext('2d'); | Declares a JavaScript constant used in component logic. |
| 438 | (blank) | Blank line for readability and section separation. |
| 439 |   let cattle = {}; | Declares a mutable JavaScript variable for changing state/data. |
| 440 |   let alerts = []; | Declares a mutable JavaScript variable for changing state/data. |
| 441 |   let paddocksData = []; | Declares a mutable JavaScript variable for changing state/data. |
| 442 |   let scheduleData = []; | Declares a mutable JavaScript variable for changing state/data. |
| 443 | (blank) | Blank line for readability and section separation. |
| 444 |   // â”€â”€ Canvas resize â”€â”€ | Comment line documenting intent or context. |
| 445 |   function resizeCanvas() { | Defines a JavaScript function for reusable logic. |
| 446 |     canvas.width = canvas.offsetWidth; | Statement terminator ending current instruction. |
| 447 |     canvas.height = canvas.offsetHeight; | Statement terminator ending current instruction. |
| 448 |   } | Structural syntax token delimiting code blocks/collections. |
| 449 |   resizeCanvas(); | Statement terminator ending current instruction. |
| 450 |   window.addEventListener('resize', resizeCanvas); | Statement terminator ending current instruction. |
| 451 | (blank) | Blank line for readability and section separation. |
| 452 |   // â”€â”€ Cattle color by health â”€â”€ | Comment line documenting intent or context. |
| 453 |   function getCattleColor(c) { | Defines a JavaScript function for reusable logic. |
| 454 |     const s = (c.health_status \\|\\| '').toLowerCase(); | Declares a JavaScript constant used in component logic. |
| 455 |     if (s === 'fever' \\|\\| s === 'stress') return '#f85149'; | Conditional branch that executes when condition is true. |
| 456 |     if (s === 'hypothermia') return '#f7c948'; | Conditional branch that executes when condition is true. |
| 457 |     if (c.lying) return '#58a6ff'; | Conditional branch that executes when condition is true. |
| 458 |     if (c.lameness) return '#ff7b25'; | Conditional branch that executes when condition is true. |
| 459 |     return '#3fb950'; | Returns data/control from the current function/component. |
| 460 |   } | Structural syntax token delimiting code blocks/collections. |
| 461 | (blank) | Blank line for readability and section separation. |
| 462 |   // â”€â”€ Canvas draw loop â”€â”€ | Comment line documenting intent or context. |
| 463 |   function draw() { | Defines a JavaScript function for reusable logic. |
| 464 |     ctx.fillStyle = '#0a1520'; | Statement terminator ending current instruction. |
| 465 |     ctx.fillRect(0, 0, canvas.width, canvas.height); | Statement terminator ending current instruction. |
| 466 | (blank) | Blank line for readability and section separation. |
| 467 |     // Grid | Comment line documenting intent or context. |
| 468 |     ctx.strokeStyle = 'rgba(47, 85, 59, 0.2)'; | Statement terminator ending current instruction. |
| 469 |     ctx.lineWidth = 1; | Statement terminator ending current instruction. |
| 470 |     for (let i = 0; i < canvas.width; i += 50) { | Loop iterating over a sequence or range. |
| 471 |       ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke(); | Statement terminator ending current instruction. |
| 472 |     } | Structural syntax token delimiting code blocks/collections. |
| 473 |     for (let i = 0; i < canvas.height; i += 50) { | Loop iterating over a sequence or range. |
| 474 |       ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke(); | Statement terminator ending current instruction. |
| 475 |     } | Structural syntax token delimiting code blocks/collections. |
| 476 | (blank) | Blank line for readability and section separation. |
| 477 |     // Draw farmer paddock boundaries â€” ONLY the currently active (occupied) paddock | Comment line documenting intent or context. |
| 478 |     if (farmerPaddocksData && farmerPaddocksData.length > 0) { | Conditional branch that executes when condition is true. |
| 479 |       farmerPaddocksData.filter(p => p.status === 'occupied').forEach(p => { | Implements file-specific logic, configuration, or structure in this context. |
| 480 |         if (!p.points \\|\\| p.points.length < 2) return; | Conditional branch that executes when condition is true. |
| 481 |         ctx.strokeStyle = '#f7c948'; | Statement terminator ending current instruction. |
| 482 |         ctx.lineWidth = 2; | Statement terminator ending current instruction. |
| 483 |         ctx.setLineDash([6, 4]); | Statement terminator ending current instruction. |
| 484 |         ctx.beginPath(); | Statement terminator ending current instruction. |
| 485 |         p.points.forEach((pt, i) => { | Implements file-specific logic, configuration, or structure in this context. |
| 486 |           const x = (pt.x / 100) * canvas.width; | Declares a JavaScript constant used in component logic. |
| 487 |           const y = (pt.y / 100) * canvas.height; | Declares a JavaScript constant used in component logic. |
| 488 |           if (i === 0) ctx.moveTo(x, y); | Conditional branch that executes when condition is true. |
| 489 |           else ctx.lineTo(x, y); | Statement terminator ending current instruction. |
| 490 |         }); | Structural syntax token delimiting code blocks/collections. |
| 491 |         ctx.closePath(); | Statement terminator ending current instruction. |
| 492 |         ctx.stroke(); | Statement terminator ending current instruction. |
| 493 |         ctx.setLineDash([]); | Statement terminator ending current instruction. |
| 494 |         // Label | Comment line documenting intent or context. |
| 495 |         if (p.points.length > 0) { | Conditional branch that executes when condition is true. |
| 496 |           const cx = p.points.reduce((s, pt) => s + pt.x, 0) / p.points.length; | Declares a JavaScript constant used in component logic. |
| 497 |           const cy = p.points.reduce((s, pt) => s + pt.y, 0) / p.points.length; | Declares a JavaScript constant used in component logic. |
| 498 |           ctx.fillStyle = '#f7c948'; | Statement terminator ending current instruction. |
| 499 |           ctx.font = 'bold 11px Arial'; | Statement terminator ending current instruction. |
| 500 |           ctx.textAlign = 'center'; | Statement terminator ending current instruction. |
| 501 |           ctx.fillText(p.name, (cx / 100) * canvas.width, (cy / 100) * canvas.height); | Statement terminator ending current instruction. |
| 502 |         } | Structural syntax token delimiting code blocks/collections. |
| 503 |       }); | Structural syntax token delimiting code blocks/collections. |
| 504 |     } | Structural syntax token delimiting code blocks/collections. |
| 505 |     // Cattle dots | Comment line documenting intent or context. |
| 506 |     Object.values(cattle).forEach(c => { | Implements file-specific logic, configuration, or structure in this context. |
| 507 |       const x = (c.x / 100) * canvas.width; | Declares a JavaScript constant used in component logic. |
| 508 |       const y = (c.y / 100) * canvas.height; | Declares a JavaScript constant used in component logic. |
| 509 |       const color = getCattleColor(c); | Declares a JavaScript constant used in component logic. |
| 510 | (blank) | Blank line for readability and section separation. |
| 511 |       ctx.fillStyle = color; | Statement terminator ending current instruction. |
| 512 |       ctx.beginPath(); | Statement terminator ending current instruction. |
| 513 |       ctx.arc(x, y, 7, 0, Math.PI * 2); | Statement terminator ending current instruction. |
| 514 |       ctx.fill(); | Statement terminator ending current instruction. |
| 515 | (blank) | Blank line for readability and section separation. |
| 516 |       ctx.strokeStyle = 'rgba(0,0,0,0.5)'; | Statement terminator ending current instruction. |
| 517 |       ctx.lineWidth = 1.5; | Statement terminator ending current instruction. |
| 518 |       ctx.stroke(); | Statement terminator ending current instruction. |
| 519 | (blank) | Blank line for readability and section separation. |
| 520 |       ctx.fillStyle = '#fff'; | Statement terminator ending current instruction. |
| 521 |       ctx.font = 'bold 8px Arial'; | Statement terminator ending current instruction. |
| 522 |       ctx.textAlign = 'center'; | Statement terminator ending current instruction. |
| 523 |       ctx.textBaseline = 'middle'; | Statement terminator ending current instruction. |
| 524 |       ctx.fillText(c.cattle_id, x, y); | Statement terminator ending current instruction. |
| 525 |     }); | Structural syntax token delimiting code blocks/collections. |
| 526 | (blank) | Blank line for readability and section separation. |
| 527 |     requestAnimationFrame(draw); | Statement terminator ending current instruction. |
| 528 |   } | Structural syntax token delimiting code blocks/collections. |
| 529 |   draw(); | Statement terminator ending current instruction. |
| 530 | (blank) | Blank line for readability and section separation. |
| 531 |   // â”€â”€ Tab switching â”€â”€ | Comment line documenting intent or context. |
| 532 |   document.querySelectorAll('.tab-btn').forEach(btn => { | Performs SQLite database connection/query/schema operation. |
| 533 |     btn.addEventListener('click', () => { | Implements file-specific logic, configuration, or structure in this context. |
| 534 |       const tabId = btn.getAttribute('data-tab'); | Declares a JavaScript constant used in component logic. |
| 535 |       document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active')); | Performs SQLite database connection/query/schema operation. |
| 536 |       document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active')); | Performs SQLite database connection/query/schema operation. |
| 537 |       document.getElementById(tabId).classList.add('active'); | Statement terminator ending current instruction. |
| 538 |       btn.classList.add('active'); | Statement terminator ending current instruction. |
| 539 |     }); | Structural syntax token delimiting code blocks/collections. |
| 540 |   }); | Structural syntax token delimiting code blocks/collections. |
| 541 | (blank) | Blank line for readability and section separation. |
| 542 |   // â”€â”€ Update Map tab â”€â”€ | Comment line documenting intent or context. |
| 543 |   function updateMapUI() { | Defines a JavaScript function for reusable logic. |
| 544 |     const total = Object.keys(cattle).length; | Declares a JavaScript constant used in component logic. |
| 545 |     const healthy = Object.values(cattle).filter(c => { | Declares a JavaScript constant used in component logic. |
| 546 |       const s = (c.health_status \\|\\| '').toLowerCase(); | Declares a JavaScript constant used in component logic. |
| 547 |       return s === 'healthy' \\|\\| s === ''; | Returns data/control from the current function/component. |
| 548 |     }).length; | Structural syntax token delimiting code blocks/collections. |
| 549 | (blank) | Blank line for readability and section separation. |
| 550 |     document.getElementById('totalCows').textContent = total; | Statement terminator ending current instruction. |
| 551 |     document.getElementById('healthyCows').textContent = healthy; | Statement terminator ending current instruction. |
| 552 |     document.getElementById('alertCount').textContent = alerts.length; | Statement terminator ending current instruction. |
| 553 | (blank) | Blank line for readability and section separation. |
| 554 |     document.getElementById('herdList').innerHTML = Object.values(cattle).length | Implements file-specific logic, configuration, or structure in this context. |
| 555 |       ? Object.values(cattle).map(c => ` | Implements file-specific logic, configuration, or structure in this context. |
| 556 |           <div class="herd-item"> | JSX/HTML structure line defining UI element hierarchy. |
| 557 |             <span class="herd-id">#${c.cattle_id}</span> | Implements file-specific logic, configuration, or structure in this context. |
| 558 |             <span class="herd-behavior" style="color: ${getCattleColor(c)}">${c.health_status \\|\\| c.behavior \\|\\| 'HEALTHY'}</span> | Implements file-specific logic, configuration, or structure in this context. |
| 559 |           </div>`).join('') | JSX/HTML structure line defining UI element hierarchy. |
| 560 |       : '<div style="color: var(--muted); font-size: 0.7rem;">No cattle added</div>'; | Statement terminator ending current instruction. |
| 561 | (blank) | Blank line for readability and section separation. |
| 562 |     document.getElementById('alertsList').innerHTML = alerts.length | Implements file-specific logic, configuration, or structure in this context. |
| 563 |       ? alerts.slice(0, 8).map(a => ` | Implements file-specific logic, configuration, or structure in this context. |
| 564 |           <div class="alert-item ${a.severity === 'critical' ? 'critical' : ''}"> | JSX/HTML structure line defining UI element hierarchy. |
| 565 |             <div class="alert-type">${a.type}</div> | Implements file-specific logic, configuration, or structure in this context. |
| 566 |             <div class="alert-detail">Cattle #${a.cattle_id}</div> | Implements file-specific logic, configuration, or structure in this context. |
| 567 |           </div>`).join('') | JSX/HTML structure line defining UI element hierarchy. |
| 568 |       : '<div style="color: var(--muted); font-size: 0.7rem;">No alerts</div>'; | Statement terminator ending current instruction. |
| 569 |   } | Structural syntax token delimiting code blocks/collections. |
| 570 | (blank) | Blank line for readability and section separation. |
| 571 |   // â”€â”€ Update Health tab â”€â”€ | Comment line documenting intent or context. |
| 572 |   function updateHealthTab() { | Defines a JavaScript function for reusable logic. |
| 573 |     const cattleArr = Object.values(cattle); | Declares a JavaScript constant used in component logic. |
| 574 |     if (!cattleArr.length) { | Conditional branch that executes when condition is true. |
| 575 |       document.getElementById('healthGrid').innerHTML = | Implements file-specific logic, configuration, or structure in this context. |
| 576 |         '<div style="color: var(--muted); padding: 20px; grid-column: 1/-1;">Add cattle to see health data</div>'; | Statement terminator ending current instruction. |
| 577 |       return; | Statement terminator ending current instruction. |
| 578 |     } | Structural syntax token delimiting code blocks/collections. |
| 579 | (blank) | Blank line for readability and section separation. |
| 580 |     document.getElementById('healthGrid').innerHTML = cattleArr.map(c => { | Implements file-specific logic, configuration, or structure in this context. |
| 581 |       const statusColor = (() => { | Declares a JavaScript constant used in component logic. |
| 582 |         const s = (c.health_status \\|\\| '').toLowerCase(); | Declares a JavaScript constant used in component logic. |
| 583 |         if (s === 'fever' \\|\\| s === 'stress') return 'var(--danger)'; | Conditional branch that executes when condition is true. |
| 584 |         if (s === 'hypothermia') return 'var(--accent2)'; | Conditional branch that executes when condition is true. |
| 585 |         return 'var(--accent)'; | Returns data/control from the current function/component. |
| 586 |       })(); | Structural syntax token delimiting code blocks/collections. |
| 587 |       return ` | Returns data/control from the current function/component. |
| 588 |         <div class="health-card"> | JSX/HTML structure line defining UI element hierarchy. |
| 589 |           <div class="health-card-title">ðŸ„ Cattle #${c.cattle_id}</div> | Implements file-specific logic, configuration, or structure in this context. |
| 590 |           <div class="health-metric"> | JSX/HTML structure line defining UI element hierarchy. |
| 591 |             <span class="health-metric-label">Temperature</span> | Implements file-specific logic, configuration, or structure in this context. |
| 592 |             <span class="health-metric-value" style="color: ${c.temperature > 39.5 ? 'var(--danger)' : 'inherit'}">${(c.temperature \\|\\| 0).toFixed(1)}Â°C</span> | Implements file-specific logic, configuration, or structure in this context. |
| 593 |           </div> | JSX/HTML structure line defining UI element hierarchy. |
| 594 |           <div class="health-metric"> | JSX/HTML structure line defining UI element hierarchy. |
| 595 |             <span class="health-metric-label">Heart Rate</span> | Implements file-specific logic, configuration, or structure in this context. |
| 596 |             <span class="health-metric-value" style="color: ${c.heart_rate > 100 ? 'var(--danger)' : 'inherit'}">${c.heart_rate \\|\\| 0} bpm</span> | Implements file-specific logic, configuration, or structure in this context. |
| 597 |           </div> | JSX/HTML structure line defining UI element hierarchy. |
| 598 |           <div class="health-metric"> | JSX/HTML structure line defining UI element hierarchy. |
| 599 |             <span class="health-metric-label">Milk Production</span> | Implements file-specific logic, configuration, or structure in this context. |
| 600 |             <span class="health-metric-value">${(c.milk_production \\|\\| 0).toFixed(1)} L/day</span> | Implements file-specific logic, configuration, or structure in this context. |
| 601 |           </div> | JSX/HTML structure line defining UI element hierarchy. |
| 602 |           <div class="health-metric"> | JSX/HTML structure line defining UI element hierarchy. |
| 603 |             <span class="health-metric-label">Health Status</span> | Implements file-specific logic, configuration, or structure in this context. |
| 604 |             <span class="health-metric-value" style="color: ${statusColor}">${c.health_status \\|\\| 'HEALTHY'}</span> | Implements file-specific logic, configuration, or structure in this context. |
| 605 |           </div> | JSX/HTML structure line defining UI element hierarchy. |
| 606 |           <div class="health-metric"> | JSX/HTML structure line defining UI element hierarchy. |
| 607 |             <span class="health-metric-label">Behavior</span> | Implements file-specific logic, configuration, or structure in this context. |
| 608 |             <span class="health-metric-value">${c.behavior \\|\\| 'â€”'}</span> | Implements file-specific logic, configuration, or structure in this context. |
| 609 |           </div> | JSX/HTML structure line defining UI element hierarchy. |
| 610 |           <div class="health-metric"> | JSX/HTML structure line defining UI element hierarchy. |
| 611 |             <span class="health-metric-label">Position</span> | Implements file-specific logic, configuration, or structure in this context. |
| 612 |             <span class="health-metric-value">(${(c.x\\|\\|0).toFixed(0)}, ${(c.y\\|\\|0).toFixed(0)})</span> | Implements file-specific logic, configuration, or structure in this context. |
| 613 |           </div> | JSX/HTML structure line defining UI element hierarchy. |
| 614 |         </div>`; | JSX/HTML structure line defining UI element hierarchy. |
| 615 |     }).join(''); | Structural syntax token delimiting code blocks/collections. |
| 616 |   } | Structural syntax token delimiting code blocks/collections. |
| 617 | (blank) | Blank line for readability and section separation. |
| 618 |   // â”€â”€ Update Paddocks tab â”€â”€ | Comment line documenting intent or context. |
| 619 |   function updatePaddocksTab() { | Defines a JavaScript function for reusable logic. |
| 620 |   const paddockList = document.getElementById('paddockList'); | Declares a JavaScript constant used in component logic. |
| 621 |   if (!paddocksData \\|\\| !paddocksData.length) { | Conditional branch that executes when condition is true. |
| 622 |     paddockList.innerHTML = '<div style="color:var(--muted)">No paddocks created yet. Use mobile app to draw fence.</div>'; | Statement terminator ending current instruction. |
| 623 |     return; | Statement terminator ending current instruction. |
| 624 |   } | Structural syntax token delimiting code blocks/collections. |
| 625 |   paddockList.innerHTML = paddocksData.map(p => { | Implements file-specific logic, configuration, or structure in this context. |
| 626 |     const quality = p.grass_quality \\|\\| 80; | Declares a JavaScript constant used in component logic. |
| 627 |     const qualityColor = quality >= 80 ? 'var(--accent)' : quality >= 65 ? 'var(--accent2)' : 'var(--danger)'; | Declares a JavaScript constant used in component logic. |
| 628 |     const cattleCount = (p.cattle_ids \\|\\| []).length; | Declares a JavaScript constant used in component logic. |
| 629 |     return ` | Returns data/control from the current function/component. |
| 630 |       <div class="paddock-item"> | JSX/HTML structure line defining UI element hierarchy. |
| 631 |         <div class="paddock-header"> | JSX/HTML structure line defining UI element hierarchy. |
| 632 |           <div class="paddock-name">${p.name}</div> | Implements file-specific logic, configuration, or structure in this context. |
| 633 |           <div class="paddock-badge ${p.status === 'occupied' ? 'badge-occupied' : 'badge-available'}"> | JSX/HTML structure line defining UI element hierarchy. |
| 634 |             ${(p.status \\|\\| 'available').toUpperCase()} | Implements file-specific logic, configuration, or structure in this context. |
| 635 |           </div> | JSX/HTML structure line defining UI element hierarchy. |
| 636 |         </div> | JSX/HTML structure line defining UI element hierarchy. |
| 637 |         <div class="paddock-stat"><span>Fence Points</span><span>${(p.points \\|\\| []).length}</span></div> | Implements file-specific logic, configuration, or structure in this context. |
| 638 |         <div class="paddock-stat"><span>Grass Quality</span><span style="color:${qualityColor}">${quality}%</span></div> | Implements file-specific logic, configuration, or structure in this context. |
| 639 |         <div class="paddock-stat"><span>Cattle Assigned</span><span>${cattleCount}</span></div> | Implements file-specific logic, configuration, or structure in this context. |
| 640 |         <div class="paddock-stat"><span>Created</span><span>${p.created ? new Date(p.created).toLocaleDateString() : 'â€”'}</span></div> | Implements file-specific logic, configuration, or structure in this context. |
| 641 |         <div class="quality-bar-wrap"><div class="quality-bar" style="width:${quality}%;background:${qualityColor}"></div></div> | Implements file-specific logic, configuration, or structure in this context. |
| 642 |       </div>`; | JSX/HTML structure line defining UI element hierarchy. |
| 643 |    }).join(''); | Structural syntax token delimiting code blocks/collections. |
| 644 |   } | Structural syntax token delimiting code blocks/collections. |
| 645 | (blank) | Blank line for readability and section separation. |
| 646 |   // â”€â”€ Update Schedule tab â”€â”€ | Comment line documenting intent or context. |
| 647 |   function updateScheduleTab() { | Defines a JavaScript function for reusable logic. |
| 648 |     if (!scheduleData.length) { | Conditional branch that executes when condition is true. |
| 649 |       document.getElementById('scheduleView').innerHTML = | Implements file-specific logic, configuration, or structure in this context. |
| 650 |         '<div style="color: var(--muted);">No pasture schedules yet.</div>'; | Statement terminator ending current instruction. |
| 651 |       return; | Statement terminator ending current instruction. |
| 652 |     } | Structural syntax token delimiting code blocks/collections. |
| 653 | (blank) | Blank line for readability and section separation. |
| 654 |     document.getElementById('scheduleView').innerHTML = ` | Implements file-specific logic, configuration, or structure in this context. |
| 655 |       <div class="schedule-header"> | JSX/HTML structure line defining UI element hierarchy. |
| 656 |         <h3>ðŸ“… Pasture Schedule</h3> | Implements file-specific logic, configuration, or structure in this context. |
| 657 |         <p>${scheduleData.length} scheduled move${scheduleData.length !== 1 ? 's' : ''}</p> | Implements file-specific logic, configuration, or structure in this context. |
| 658 |       </div> | JSX/HTML structure line defining UI element hierarchy. |
| 659 |       ${scheduleData.map(sc => { | Implements file-specific logic, configuration, or structure in this context. |
| 660 |         const targetPaddock = farmerPaddocksData.find(p => p.id === sc.paddock_id); | Declares a JavaScript constant used in component logic. |
| 661 |         const isActive = targetPaddock && targetPaddock.status === 'occupied'; | Declares a JavaScript constant used in component logic. |
| 662 |         const statusLabel = isActive ? 'ACTIVE' : (sc.activated ? 'DONE' : 'PENDING'); | Declares a JavaScript constant used in component logic. |
| 663 |         const statusColor = isActive ? 'var(--accent)' : (sc.activated ? 'var(--muted)' : 'var(--accent2)'); | Declares a JavaScript constant used in component logic. |
| 664 |         const displayTime = (sc.start_time \\|\\| '').replace('T', ' '); | Declares a JavaScript constant used in component logic. |
| 665 | (blank) | Blank line for readability and section separation. |
| 666 |         return ` | Returns data/control from the current function/component. |
| 667 |           <div class="schedule-day ${isActive ? 'today' : ''}"> | JSX/HTML structure line defining UI element hierarchy. |
| 668 |             <div class="schedule-day-info"> | JSX/HTML structure line defining UI element hierarchy. |
| 669 |               <div class="schedule-day-name">${sc.paddock_name \\|\\| 'Unknown Paddock'}</div> | Implements file-specific logic, configuration, or structure in this context. |
| 670 |               <div class="schedule-day-details">${displayTime}</div> | Implements file-specific logic, configuration, or structure in this context. |
| 671 |             </div> | JSX/HTML structure line defining UI element hierarchy. |
| 672 |             <div class="schedule-quality"> | JSX/HTML structure line defining UI element hierarchy. |
| 673 |               <div class="schedule-quality-num" style="color: ${statusColor}; font-size: 0.85rem;">${statusLabel}</div> | Implements file-specific logic, configuration, or structure in this context. |
| 674 |             </div> | JSX/HTML structure line defining UI element hierarchy. |
| 675 |           </div>`; | JSX/HTML structure line defining UI element hierarchy. |
| 676 |       }).join('')}`; | Structural syntax token delimiting code blocks/collections. |
| 677 |   } | Structural syntax token delimiting code blocks/collections. |
| 678 | (blank) | Blank line for readability and section separation. |
| 679 |   // â”€â”€ Master update â”€â”€ | Comment line documenting intent or context. |
| 680 |   function updateAllUI() { | Defines a JavaScript function for reusable logic. |
| 681 |     updateMapUI(); | Performs SQLite database connection/query/schema operation. |
| 682 |     updateHealthTab(); | Performs SQLite database connection/query/schema operation. |
| 683 |     updatePaddocksTab(); | Performs SQLite database connection/query/schema operation. |
| 684 |     updateScheduleTab(); | Performs SQLite database connection/query/schema operation. |
| 685 |   } | Structural syntax token delimiting code blocks/collections. |
| 686 | (blank) | Blank line for readability and section separation. |
| 687 |   // â”€â”€ Fetch paddocks â”€â”€ | Comment line documenting intent or context. |
| 688 |   function fetchPaddocks() { | Defines a JavaScript function for reusable logic. |
| 689 |     fetch(`${BACKEND_URL}/api/farmer/paddocks`) | Implements file-specific logic, configuration, or structure in this context. |
| 690 |       .then(r => r.json()) | Implements file-specific logic, configuration, or structure in this context. |
| 691 |       .then(data => { | Implements file-specific logic, configuration, or structure in this context. |
| 692 |         farmerPaddocksData = data.paddocks \\|\\| []; | Statement terminator ending current instruction. |
| 693 |         paddocksData = data.paddocks \\|\\| []; | Statement terminator ending current instruction. |
| 694 |         updatePaddocksTab(); | Performs SQLite database connection/query/schema operation. |
| 695 |         updateScheduleTab(); | Performs SQLite database connection/query/schema operation. |
| 696 |       }) | Structural syntax token delimiting code blocks/collections. |
| 697 |       .catch(e => console.warn('Paddocks fetch error:', e)); | Statement terminator ending current instruction. |
| 698 |   } | Structural syntax token delimiting code blocks/collections. |
| 699 | (blank) | Blank line for readability and section separation. |
| 700 |   // â”€â”€ Fetch schedule â”€â”€ | Comment line documenting intent or context. |
| 701 |   function fetchSchedule() { | Defines a JavaScript function for reusable logic. |
| 702 |     fetch(`${BACKEND_URL}/api/farmer/schedules`) | Implements file-specific logic, configuration, or structure in this context. |
| 703 |       .then(r => r.json()) | Implements file-specific logic, configuration, or structure in this context. |
| 704 |       .then(data => { scheduleData = data.schedules \\|\\| []; updateScheduleTab(); }) | Performs SQLite database connection/query/schema operation. |
| 705 |       .catch(e => console.warn('Schedule fetch error:', e)); | Statement terminator ending current instruction. |
| 706 |   } | Structural syntax token delimiting code blocks/collections. |
| 707 | (blank) | Blank line for readability and section separation. |
| 708 |   // â”€â”€ WebSocket â”€â”€ | Comment line documenting intent or context. |
| 709 |   const socket = io(BACKEND_URL); | Declares a JavaScript constant used in component logic. |
| 710 | (blank) | Blank line for readability and section separation. |
| 711 |   socket.on('connect', () => { | Implements file-specific logic, configuration, or structure in this context. |
| 712 |     console.log('âœ… Connected to backend'); | Statement terminator ending current instruction. |
| 713 |     document.getElementById('connectionStatus').textContent = 'LIVE'; | Statement terminator ending current instruction. |
| 714 |     document.getElementById('connectionStatus').style.color = 'var(--accent)'; | Statement terminator ending current instruction. |
| 715 |     fetchPaddocks(); | Statement terminator ending current instruction. |
| 716 |     fetchSchedule(); | Statement terminator ending current instruction. |
| 717 |   }); | Structural syntax token delimiting code blocks/collections. |
| 718 | (blank) | Blank line for readability and section separation. |
| 719 |   socket.on('disconnect', () => { | Implements file-specific logic, configuration, or structure in this context. |
| 720 |     document.getElementById('connectionStatus').textContent = 'DISCONNECTED'; | Statement terminator ending current instruction. |
| 721 |     document.getElementById('connectionStatus').style.color = 'var(--danger)'; | Statement terminator ending current instruction. |
| 722 |   }); | Structural syntax token delimiting code blocks/collections. |
| 723 | (blank) | Blank line for readability and section separation. |
| 724 |   socket.on('cattle_update', (data) => { | Performs SQLite database connection/query/schema operation. |
| 725 |     if (data.cattle) { | Conditional branch that executes when condition is true. |
| 726 |       cattle = {}; | Statement terminator ending current instruction. |
| 727 |       data.cattle.forEach(c => { cattle[c.cattle_id] = c; }); | Statement terminator ending current instruction. |
| 728 |       updateAllUI(); | Performs SQLite database connection/query/schema operation. |
| 729 |       if (data.training_day) { | Conditional branch that executes when condition is true. |
| 730 |         document.getElementById('dayDisplay').textContent = `Day ${data.training_day}`; | Statement terminator ending current instruction. |
| 731 |       } | Structural syntax token delimiting code blocks/collections. |
| 732 |     } | Structural syntax token delimiting code blocks/collections. |
| 733 |     if (data.alerts) { alerts = data.alerts; updateMapUI(); } | Conditional branch that executes when condition is true. |
| 734 |   }); | Structural syntax token delimiting code blocks/collections. |
| 735 | (blank) | Blank line for readability and section separation. |
| 736 |   socket.on('cattle_added', (data) => { | Implements file-specific logic, configuration, or structure in this context. |
| 737 |     if (data.cattle) { | Conditional branch that executes when condition is true. |
| 738 |       cattle[data.cattle.cattle_id] = data.cattle; | Statement terminator ending current instruction. |
| 739 |       updateAllUI(); | Performs SQLite database connection/query/schema operation. |
| 740 |       fetchPaddocks(); | Statement terminator ending current instruction. |
| 741 |     } | Structural syntax token delimiting code blocks/collections. |
| 742 |   }); | Structural syntax token delimiting code blocks/collections. |
| 743 | (blank) | Blank line for readability and section separation. |
| 744 |   socket.on('cattle_removed', (data) => { | Implements file-specific logic, configuration, or structure in this context. |
| 745 |     if (data.cattle_id) { | Conditional branch that executes when condition is true. |
| 746 |       delete cattle[data.cattle_id]; | Performs SQLite database connection/query/schema operation. |
| 747 |       updateAllUI(); | Performs SQLite database connection/query/schema operation. |
| 748 |       fetchPaddocks(); | Statement terminator ending current instruction. |
| 749 |     } | Structural syntax token delimiting code blocks/collections. |
| 750 |   }); | Structural syntax token delimiting code blocks/collections. |
| 751 | (blank) | Blank line for readability and section separation. |
| 752 |   socket.on('paddock_created', () => fetchPaddocks()); | Statement terminator ending current instruction. |
| 753 |   socket.on('paddock_updated', () => fetchPaddocks()); | Performs SQLite database connection/query/schema operation. |
| 754 |   socket.on('paddock_deleted', () => fetchPaddocks()); | Performs SQLite database connection/query/schema operation. |
| 755 | (blank) | Blank line for readability and section separation. |
| 756 |   socket.on('schedule_created', () => fetchSchedule()); | Statement terminator ending current instruction. |
| 757 |   socket.on('schedule_deleted', () => fetchSchedule()); | Performs SQLite database connection/query/schema operation. |
| 758 |   socket.on('schedule_activated', () => { | Implements file-specific logic, configuration, or structure in this context. |
| 759 |     fetchSchedule(); | Statement terminator ending current instruction. |
| 760 |     fetchPaddocks(); | Statement terminator ending current instruction. |
| 761 |   }); | Structural syntax token delimiting code blocks/collections. |
| 762 | (blank) | Blank line for readability and section separation. |
| 763 |   // â”€â”€ Initial load â”€â”€ | Comment line documenting intent or context. |
| 764 |   fetch(`${BACKEND_URL}/api/cattle`) | Implements file-specific logic, configuration, or structure in this context. |
| 765 |     .then(r => r.json()) | Implements file-specific logic, configuration, or structure in this context. |
| 766 |     .then(data => { | Implements file-specific logic, configuration, or structure in this context. |
| 767 |       if (data.cattle) { | Conditional branch that executes when condition is true. |
| 768 |         data.cattle.forEach(c => { cattle[c.cattle_id] = c; }); | Statement terminator ending current instruction. |
| 769 |         updateAllUI(); | Performs SQLite database connection/query/schema operation. |
| 770 |       } | Structural syntax token delimiting code blocks/collections. |
| 771 |     }) | Structural syntax token delimiting code blocks/collections. |
| 772 |     .catch(e => console.warn('Initial load error:', e)); | Statement terminator ending current instruction. |
| 773 | (blank) | Blank line for readability and section separation. |
| 774 |   // Refresh paddocks and schedule every 30s (safety net alongside socket events) | Comment line documenting intent or context. |
| 775 |   setInterval(fetchPaddocks, 30000); | Statement terminator ending current instruction. |
| 776 |   setInterval(fetchSchedule, 30000); | Statement terminator ending current instruction. |
| 777 | </script> | JSX/HTML structure line defining UI element hierarchy. |
| 778 | (blank) | Blank line for readability and section separation. |
| 779 | </body> | JSX/HTML structure line defining UI element hierarchy. |
| 780 | </html> | JSX/HTML structure line defining UI element hierarchy. |

## File: mobile\src\app\_layout.tsx

| Line | Code | Explanation |
|---:|---|---|
| 1 | import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router'; | Imports a dependency/module needed in this file. |
| 2 | import { useColorScheme } from 'react-native'; | Imports a dependency/module needed in this file. |
| 3 | (blank) | Blank line for readability and section separation. |
| 4 | import { AnimatedSplashOverlay } from '@/components/animated-icon'; | Imports a dependency/module needed in this file. |
| 5 | import AppTabs from '@/components/app-tabs'; | Imports a dependency/module needed in this file. |
| 6 | (blank) | Blank line for readability and section separation. |
| 7 | export default function TabLayout() { | Declares and exports the default function/component. |
| 8 |   const colorScheme = useColorScheme(); | Declares a JavaScript constant used in component logic. |
| 9 |   return ( | Returns data/control from the current function/component. |
| 10 |     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}> | JSX/HTML structure line defining UI element hierarchy. |
| 11 |       <AnimatedSplashOverlay /> | JSX/HTML structure line defining UI element hierarchy. |
| 12 |       <AppTabs /> | JSX/HTML structure line defining UI element hierarchy. |
| 13 |     </ThemeProvider> | JSX/HTML structure line defining UI element hierarchy. |
| 14 |   ); | Structural syntax token delimiting code blocks/collections. |
| 15 | } | Structural syntax token delimiting code blocks/collections. |

## File: mobile\src\app\index.tsx

| Line | Code | Explanation |
|---:|---|---|
| 1 | import * as Device from 'expo-device'; | Imports a dependency/module needed in this file. |
| 2 | import { Platform, StyleSheet } from 'react-native'; | Imports a dependency/module needed in this file. |
| 3 | import { SafeAreaView } from 'react-native-safe-area-context'; | Imports a dependency/module needed in this file. |
| 4 | (blank) | Blank line for readability and section separation. |
| 5 | import { AnimatedIcon } from '@/components/animated-icon'; | Imports a dependency/module needed in this file. |
| 6 | import { HintRow } from '@/components/hint-row'; | Imports a dependency/module needed in this file. |
| 7 | import { ThemedText } from '@/components/themed-text'; | Imports a dependency/module needed in this file. |
| 8 | import { ThemedView } from '@/components/themed-view'; | Imports a dependency/module needed in this file. |
| 9 | import { WebBadge } from '@/components/web-badge'; | Imports a dependency/module needed in this file. |
| 10 | import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme'; | Imports a dependency/module needed in this file. |
| 11 | (blank) | Blank line for readability and section separation. |
| 12 | function getDevMenuHint() { | Defines a JavaScript function for reusable logic. |
| 13 |   if (Platform.OS === 'web') { | Conditional branch that executes when condition is true. |
| 14 |     return <ThemedText type="small">use browser devtools</ThemedText>; | Returns data/control from the current function/component. |
| 15 |   } | Structural syntax token delimiting code blocks/collections. |
| 16 |   if (Device.isDevice) { | Conditional branch that executes when condition is true. |
| 17 |     return ( | Returns data/control from the current function/component. |
| 18 |       <ThemedText type="small"> | JSX/HTML structure line defining UI element hierarchy. |
| 19 |         shake device or press <ThemedText type="code">m</ThemedText> in terminal | Implements file-specific logic, configuration, or structure in this context. |
| 20 |       </ThemedText> | JSX/HTML structure line defining UI element hierarchy. |
| 21 |     ); | Structural syntax token delimiting code blocks/collections. |
| 22 |   } | Structural syntax token delimiting code blocks/collections. |
| 23 |   const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d'; | Declares a JavaScript constant used in component logic. |
| 24 |   return ( | Returns data/control from the current function/component. |
| 25 |     <ThemedText type="small"> | JSX/HTML structure line defining UI element hierarchy. |
| 26 |       press <ThemedText type="code">{shortcut}</ThemedText> | Implements file-specific logic, configuration, or structure in this context. |
| 27 |     </ThemedText> | JSX/HTML structure line defining UI element hierarchy. |
| 28 |   ); | Structural syntax token delimiting code blocks/collections. |
| 29 | } | Structural syntax token delimiting code blocks/collections. |
| 30 | (blank) | Blank line for readability and section separation. |
| 31 | export default function HomeScreen() { | Declares and exports the default function/component. |
| 32 |   return ( | Returns data/control from the current function/component. |
| 33 |     <ThemedView style={styles.container}> | JSX/HTML structure line defining UI element hierarchy. |
| 34 |       <SafeAreaView style={styles.safeArea}> | JSX/HTML structure line defining UI element hierarchy. |
| 35 |         <ThemedView style={styles.heroSection}> | JSX/HTML structure line defining UI element hierarchy. |
| 36 |           <AnimatedIcon /> | JSX/HTML structure line defining UI element hierarchy. |
| 37 |           <ThemedText type="title" style={styles.title}> | JSX/HTML structure line defining UI element hierarchy. |
| 38 |             Welcome to&nbsp;Expo | Implements file-specific logic, configuration, or structure in this context. |
| 39 |           </ThemedText> | JSX/HTML structure line defining UI element hierarchy. |
| 40 |         </ThemedView> | JSX/HTML structure line defining UI element hierarchy. |
| 41 | (blank) | Blank line for readability and section separation. |
| 42 |         <ThemedText type="code" style={styles.code}> | JSX/HTML structure line defining UI element hierarchy. |
| 43 |           get started | Implements file-specific logic, configuration, or structure in this context. |
| 44 |         </ThemedText> | JSX/HTML structure line defining UI element hierarchy. |
| 45 | (blank) | Blank line for readability and section separation. |
| 46 |         <ThemedView type="backgroundElement" style={styles.stepContainer}> | JSX/HTML structure line defining UI element hierarchy. |
| 47 |           <HintRow | Implements file-specific logic, configuration, or structure in this context. |
| 48 |             title="Try editing" | Implements file-specific logic, configuration, or structure in this context. |
| 49 |             hint={<ThemedText type="code">src/app/index.tsx</ThemedText>} | Implements file-specific logic, configuration, or structure in this context. |
| 50 |           /> | Implements file-specific logic, configuration, or structure in this context. |
| 51 |           <HintRow title="Dev tools" hint={getDevMenuHint()} /> | JSX/HTML structure line defining UI element hierarchy. |
| 52 |           <HintRow | Implements file-specific logic, configuration, or structure in this context. |
| 53 |             title="Fresh start" | Implements file-specific logic, configuration, or structure in this context. |
| 54 |             hint={<ThemedText type="code">npm run reset-project</ThemedText>} | Implements file-specific logic, configuration, or structure in this context. |
| 55 |           /> | Implements file-specific logic, configuration, or structure in this context. |
| 56 |         </ThemedView> | JSX/HTML structure line defining UI element hierarchy. |
| 57 | (blank) | Blank line for readability and section separation. |
| 58 |         {Platform.OS === 'web' && <WebBadge />} | Structural syntax token delimiting code blocks/collections. |
| 59 |       </SafeAreaView> | JSX/HTML structure line defining UI element hierarchy. |
| 60 |     </ThemedView> | JSX/HTML structure line defining UI element hierarchy. |
| 61 |   ); | Structural syntax token delimiting code blocks/collections. |
| 62 | } | Structural syntax token delimiting code blocks/collections. |
| 63 | (blank) | Blank line for readability and section separation. |
| 64 | const styles = StyleSheet.create({ | Defines React Native style object for component styling. |
| 65 |   container: { | Starts object property block for grouped configuration/style. |
| 66 |     flex: 1, | Assigns a property/value pair in object/CSS context. |
| 67 |     justifyContent: 'center', | Assigns a property/value pair in object/CSS context. |
| 68 |     flexDirection: 'row', | Assigns a property/value pair in object/CSS context. |
| 69 |   }, | Structural syntax token delimiting code blocks/collections. |
| 70 |   safeArea: { | Starts object property block for grouped configuration/style. |
| 71 |     flex: 1, | Assigns a property/value pair in object/CSS context. |
| 72 |     paddingHorizontal: Spacing.four, | Assigns a property/value pair in object/CSS context. |
| 73 |     alignItems: 'center', | Assigns a property/value pair in object/CSS context. |
| 74 |     gap: Spacing.three, | Assigns a property/value pair in object/CSS context. |
| 75 |     paddingBottom: BottomTabInset + Spacing.three, | Assigns a property/value pair in object/CSS context. |
| 76 |     maxWidth: MaxContentWidth, | Assigns a property/value pair in object/CSS context. |
| 77 |   }, | Structural syntax token delimiting code blocks/collections. |
| 78 |   heroSection: { | Starts object property block for grouped configuration/style. |
| 79 |     alignItems: 'center', | Assigns a property/value pair in object/CSS context. |
| 80 |     justifyContent: 'center', | Assigns a property/value pair in object/CSS context. |
| 81 |     flex: 1, | Assigns a property/value pair in object/CSS context. |
| 82 |     paddingHorizontal: Spacing.four, | Assigns a property/value pair in object/CSS context. |
| 83 |     gap: Spacing.four, | Assigns a property/value pair in object/CSS context. |
| 84 |   }, | Structural syntax token delimiting code blocks/collections. |
| 85 |   title: { | Starts object property block for grouped configuration/style. |
| 86 |     textAlign: 'center', | Assigns a property/value pair in object/CSS context. |
| 87 |   }, | Structural syntax token delimiting code blocks/collections. |
| 88 |   code: { | Starts object property block for grouped configuration/style. |
| 89 |     textTransform: 'uppercase', | Assigns a property/value pair in object/CSS context. |
| 90 |   }, | Structural syntax token delimiting code blocks/collections. |
| 91 |   stepContainer: { | Starts object property block for grouped configuration/style. |
| 92 |     gap: Spacing.three, | Assigns a property/value pair in object/CSS context. |
| 93 |     alignSelf: 'stretch', | Assigns a property/value pair in object/CSS context. |
| 94 |     paddingHorizontal: Spacing.three, | Assigns a property/value pair in object/CSS context. |
| 95 |     paddingVertical: Spacing.four, | Assigns a property/value pair in object/CSS context. |
| 96 |     borderRadius: Spacing.four, | Assigns a property/value pair in object/CSS context. |
| 97 |   }, | Structural syntax token delimiting code blocks/collections. |
| 98 | }); | Structural syntax token delimiting code blocks/collections. |

## File: mobile\src\app\explore.tsx

| Line | Code | Explanation |
|---:|---|---|
| 1 | import { Image } from 'expo-image'; | Imports a dependency/module needed in this file. |
| 2 | import { SymbolView } from 'expo-symbols'; | Imports a dependency/module needed in this file. |
| 3 | import { Platform, Pressable, ScrollView, StyleSheet } from 'react-native'; | Imports a dependency/module needed in this file. |
| 4 | import { useSafeAreaInsets } from 'react-native-safe-area-context'; | Imports a dependency/module needed in this file. |
| 5 | (blank) | Blank line for readability and section separation. |
| 6 | import { ExternalLink } from '@/components/external-link'; | Imports a dependency/module needed in this file. |
| 7 | import { ThemedText } from '@/components/themed-text'; | Imports a dependency/module needed in this file. |
| 8 | import { ThemedView } from '@/components/themed-view'; | Imports a dependency/module needed in this file. |
| 9 | import { Collapsible } from '@/components/ui/collapsible'; | Imports a dependency/module needed in this file. |
| 10 | import { WebBadge } from '@/components/web-badge'; | Imports a dependency/module needed in this file. |
| 11 | import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme'; | Imports a dependency/module needed in this file. |
| 12 | import { useTheme } from '@/hooks/use-theme'; | Imports a dependency/module needed in this file. |
| 13 | (blank) | Blank line for readability and section separation. |
| 14 | export default function TabTwoScreen() { | Declares and exports the default function/component. |
| 15 |   const safeAreaInsets = useSafeAreaInsets(); | Declares a JavaScript constant used in component logic. |
| 16 |   const insets = { | Declares a JavaScript constant used in component logic. |
| 17 |     ...safeAreaInsets, | Implements file-specific logic, configuration, or structure in this context. |
| 18 |     bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three, | Assigns a property/value pair in object/CSS context. |
| 19 |   }; | Structural syntax token delimiting code blocks/collections. |
| 20 |   const theme = useTheme(); | Declares a JavaScript constant used in component logic. |
| 21 | (blank) | Blank line for readability and section separation. |
| 22 |   const contentPlatformStyle = Platform.select({ | Performs SQLite database connection/query/schema operation. |
| 23 |     android: { | Starts object property block for grouped configuration/style. |
| 24 |       paddingTop: insets.top, | Assigns a property/value pair in object/CSS context. |
| 25 |       paddingLeft: insets.left, | Assigns a property/value pair in object/CSS context. |
| 26 |       paddingRight: insets.right, | Assigns a property/value pair in object/CSS context. |
| 27 |       paddingBottom: insets.bottom, | Assigns a property/value pair in object/CSS context. |
| 28 |     }, | Structural syntax token delimiting code blocks/collections. |
| 29 |     web: { | Starts object property block for grouped configuration/style. |
| 30 |       paddingTop: Spacing.six, | Assigns a property/value pair in object/CSS context. |
| 31 |       paddingBottom: Spacing.four, | Assigns a property/value pair in object/CSS context. |
| 32 |     }, | Structural syntax token delimiting code blocks/collections. |
| 33 |   }); | Structural syntax token delimiting code blocks/collections. |
| 34 | (blank) | Blank line for readability and section separation. |
| 35 |   return ( | Returns data/control from the current function/component. |
| 36 |     <ScrollView | Implements file-specific logic, configuration, or structure in this context. |
| 37 |       style={[styles.scrollView, { backgroundColor: theme.background }]} | Implements file-specific logic, configuration, or structure in this context. |
| 38 |       contentInset={insets} | Implements file-specific logic, configuration, or structure in this context. |
| 39 |       contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}> | Implements file-specific logic, configuration, or structure in this context. |
| 40 |       <ThemedView style={styles.container}> | JSX/HTML structure line defining UI element hierarchy. |
| 41 |         <ThemedView style={styles.titleContainer}> | JSX/HTML structure line defining UI element hierarchy. |
| 42 |           <ThemedText type="subtitle">Explore</ThemedText> | Implements file-specific logic, configuration, or structure in this context. |
| 43 |           <ThemedText style={styles.centerText} themeColor="textSecondary"> | JSX/HTML structure line defining UI element hierarchy. |
| 44 |             This starter app includes example{'\n'}code to help you get started. | Implements file-specific logic, configuration, or structure in this context. |
| 45 |           </ThemedText> | JSX/HTML structure line defining UI element hierarchy. |
| 46 | (blank) | Blank line for readability and section separation. |
| 47 |           <ExternalLink href="https://docs.expo.dev" asChild> | JSX/HTML structure line defining UI element hierarchy. |
| 48 |             <Pressable style={({ pressed }) => pressed && styles.pressed}> | Implements file-specific logic, configuration, or structure in this context. |
| 49 |               <ThemedView type="backgroundElement" style={styles.linkButton}> | JSX/HTML structure line defining UI element hierarchy. |
| 50 |                 <ThemedText type="link">Expo documentation</ThemedText> | Implements file-specific logic, configuration, or structure in this context. |
| 51 |                 <SymbolView | Implements file-specific logic, configuration, or structure in this context. |
| 52 |                   tintColor={theme.text} | Implements file-specific logic, configuration, or structure in this context. |
| 53 |                   name={{ ios: 'arrow.up.right.square', android: 'link', web: 'link' }} | Implements file-specific logic, configuration, or structure in this context. |
| 54 |                   size={12} | Implements file-specific logic, configuration, or structure in this context. |
| 55 |                 /> | Implements file-specific logic, configuration, or structure in this context. |
| 56 |               </ThemedView> | JSX/HTML structure line defining UI element hierarchy. |
| 57 |             </Pressable> | JSX/HTML structure line defining UI element hierarchy. |
| 58 |           </ExternalLink> | JSX/HTML structure line defining UI element hierarchy. |
| 59 |         </ThemedView> | JSX/HTML structure line defining UI element hierarchy. |
| 60 | (blank) | Blank line for readability and section separation. |
| 61 |         <ThemedView style={styles.sectionsWrapper}> | JSX/HTML structure line defining UI element hierarchy. |
| 62 |           <Collapsible title="File-based routing"> | JSX/HTML structure line defining UI element hierarchy. |
| 63 |             <ThemedText type="small"> | JSX/HTML structure line defining UI element hierarchy. |
| 64 |               This app has two screens: <ThemedText type="code">src/app/index.tsx</ThemedText> and{' '} | Implements file-specific logic, configuration, or structure in this context. |
| 65 |               <ThemedText type="code">src/app/explore.tsx</ThemedText> | Implements file-specific logic, configuration, or structure in this context. |
| 66 |             </ThemedText> | JSX/HTML structure line defining UI element hierarchy. |
| 67 |             <ThemedText type="small"> | JSX/HTML structure line defining UI element hierarchy. |
| 68 |               The layout file in <ThemedText type="code">src/app/_layout.tsx</ThemedText> sets up | Implements file-specific logic, configuration, or structure in this context. |
| 69 |               the tab navigator. | Implements file-specific logic, configuration, or structure in this context. |
| 70 |             </ThemedText> | JSX/HTML structure line defining UI element hierarchy. |
| 71 |             <ExternalLink href="https://docs.expo.dev/router/introduction"> | JSX/HTML structure line defining UI element hierarchy. |
| 72 |               <ThemedText type="linkPrimary">Learn more</ThemedText> | Implements file-specific logic, configuration, or structure in this context. |
| 73 |             </ExternalLink> | JSX/HTML structure line defining UI element hierarchy. |
| 74 |           </Collapsible> | JSX/HTML structure line defining UI element hierarchy. |
| 75 | (blank) | Blank line for readability and section separation. |
| 76 |           <Collapsible title="Android, iOS, and web support"> | JSX/HTML structure line defining UI element hierarchy. |
| 77 |             <ThemedView type="backgroundElement" style={styles.collapsibleContent}> | JSX/HTML structure line defining UI element hierarchy. |
| 78 |               <ThemedText type="small"> | JSX/HTML structure line defining UI element hierarchy. |
| 79 |                 You can open this project on Android, iOS, and the web. To open the web version, | Implements file-specific logic, configuration, or structure in this context. |
| 80 |                 press <ThemedText type="smallBold">w</ThemedText> in the terminal running this | Implements file-specific logic, configuration, or structure in this context. |
| 81 |                 project. | Implements file-specific logic, configuration, or structure in this context. |
| 82 |               </ThemedText> | JSX/HTML structure line defining UI element hierarchy. |
| 83 |               <Image | Implements file-specific logic, configuration, or structure in this context. |
| 84 |                 source={require('@/assets/images/tutorial-web.png')} | Implements file-specific logic, configuration, or structure in this context. |
| 85 |                 style={styles.imageTutorial} | Implements file-specific logic, configuration, or structure in this context. |
| 86 |               /> | Implements file-specific logic, configuration, or structure in this context. |
| 87 |             </ThemedView> | JSX/HTML structure line defining UI element hierarchy. |
| 88 |           </Collapsible> | JSX/HTML structure line defining UI element hierarchy. |
| 89 | (blank) | Blank line for readability and section separation. |
| 90 |           <Collapsible title="Images"> | JSX/HTML structure line defining UI element hierarchy. |
| 91 |             <ThemedText type="small"> | JSX/HTML structure line defining UI element hierarchy. |
| 92 |               For static images, you can use the <ThemedText type="code">@2x</ThemedText> and{' '} | Loop iterating over a sequence or range. |
| 93 |               <ThemedText type="code">@3x</ThemedText> suffixes to provide files for different | Implements file-specific logic, configuration, or structure in this context. |
| 94 |               screen densities. | Implements file-specific logic, configuration, or structure in this context. |
| 95 |             </ThemedText> | JSX/HTML structure line defining UI element hierarchy. |
| 96 |             <Image source={require('@/assets/images/react-logo.png')} style={styles.imageReact} /> | JSX/HTML structure line defining UI element hierarchy. |
| 97 |             <ExternalLink href="https://reactnative.dev/docs/images"> | JSX/HTML structure line defining UI element hierarchy. |
| 98 |               <ThemedText type="linkPrimary">Learn more</ThemedText> | Implements file-specific logic, configuration, or structure in this context. |
| 99 |             </ExternalLink> | JSX/HTML structure line defining UI element hierarchy. |
| 100 |           </Collapsible> | JSX/HTML structure line defining UI element hierarchy. |
| 101 | (blank) | Blank line for readability and section separation. |
| 102 |           <Collapsible title="Light and dark mode components"> | JSX/HTML structure line defining UI element hierarchy. |
| 103 |             <ThemedText type="small"> | JSX/HTML structure line defining UI element hierarchy. |
| 104 |               This template has light and dark mode support. The{' '} | Implements file-specific logic, configuration, or structure in this context. |
| 105 |               <ThemedText type="code">useColorScheme()</ThemedText> hook lets you inspect what the | Implements file-specific logic, configuration, or structure in this context. |
| 106 |               user&apos;s current color scheme is, and so you can adjust UI colors accordingly. | Implements file-specific logic, configuration, or structure in this context. |
| 107 |             </ThemedText> | JSX/HTML structure line defining UI element hierarchy. |
| 108 |             <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/"> | JSX/HTML structure line defining UI element hierarchy. |
| 109 |               <ThemedText type="linkPrimary">Learn more</ThemedText> | Implements file-specific logic, configuration, or structure in this context. |
| 110 |             </ExternalLink> | JSX/HTML structure line defining UI element hierarchy. |
| 111 |           </Collapsible> | JSX/HTML structure line defining UI element hierarchy. |
| 112 | (blank) | Blank line for readability and section separation. |
| 113 |           <Collapsible title="Animations"> | JSX/HTML structure line defining UI element hierarchy. |
| 114 |             <ThemedText type="small"> | JSX/HTML structure line defining UI element hierarchy. |
| 115 |               This template includes an example of an animated component. The{' '} | Implements file-specific logic, configuration, or structure in this context. |
| 116 |               <ThemedText type="code">src/components/ui/collapsible.tsx</ThemedText> component uses | Implements file-specific logic, configuration, or structure in this context. |
| 117 |               the powerful <ThemedText type="code">react-native-reanimated</ThemedText> library to | Implements file-specific logic, configuration, or structure in this context. |
| 118 |               animate opening this hint. | Implements file-specific logic, configuration, or structure in this context. |
| 119 |             </ThemedText> | JSX/HTML structure line defining UI element hierarchy. |
| 120 |           </Collapsible> | JSX/HTML structure line defining UI element hierarchy. |
| 121 |         </ThemedView> | JSX/HTML structure line defining UI element hierarchy. |
| 122 |         {Platform.OS === 'web' && <WebBadge />} | Structural syntax token delimiting code blocks/collections. |
| 123 |       </ThemedView> | JSX/HTML structure line defining UI element hierarchy. |
| 124 |     </ScrollView> | JSX/HTML structure line defining UI element hierarchy. |
| 125 |   ); | Structural syntax token delimiting code blocks/collections. |
| 126 | } | Structural syntax token delimiting code blocks/collections. |
| 127 | (blank) | Blank line for readability and section separation. |
| 128 | const styles = StyleSheet.create({ | Defines React Native style object for component styling. |
| 129 |   scrollView: { | Starts object property block for grouped configuration/style. |
| 130 |     flex: 1, | Assigns a property/value pair in object/CSS context. |
| 131 |   }, | Structural syntax token delimiting code blocks/collections. |
| 132 |   contentContainer: { | Starts object property block for grouped configuration/style. |
| 133 |     flexDirection: 'row', | Assigns a property/value pair in object/CSS context. |
| 134 |     justifyContent: 'center', | Assigns a property/value pair in object/CSS context. |
| 135 |   }, | Structural syntax token delimiting code blocks/collections. |
| 136 |   container: { | Starts object property block for grouped configuration/style. |
| 137 |     maxWidth: MaxContentWidth, | Assigns a property/value pair in object/CSS context. |
| 138 |     flexGrow: 1, | Assigns a property/value pair in object/CSS context. |
| 139 |   }, | Structural syntax token delimiting code blocks/collections. |
| 140 |   titleContainer: { | Starts object property block for grouped configuration/style. |
| 141 |     gap: Spacing.three, | Assigns a property/value pair in object/CSS context. |
| 142 |     alignItems: 'center', | Assigns a property/value pair in object/CSS context. |
| 143 |     paddingHorizontal: Spacing.four, | Assigns a property/value pair in object/CSS context. |
| 144 |     paddingVertical: Spacing.six, | Assigns a property/value pair in object/CSS context. |
| 145 |   }, | Structural syntax token delimiting code blocks/collections. |
| 146 |   centerText: { | Starts object property block for grouped configuration/style. |
| 147 |     textAlign: 'center', | Assigns a property/value pair in object/CSS context. |
| 148 |   }, | Structural syntax token delimiting code blocks/collections. |
| 149 |   pressed: { | Starts object property block for grouped configuration/style. |
| 150 |     opacity: 0.7, | Assigns a property/value pair in object/CSS context. |
| 151 |   }, | Structural syntax token delimiting code blocks/collections. |
| 152 |   linkButton: { | Starts object property block for grouped configuration/style. |
| 153 |     flexDirection: 'row', | Assigns a property/value pair in object/CSS context. |
| 154 |     paddingHorizontal: Spacing.four, | Assigns a property/value pair in object/CSS context. |
| 155 |     paddingVertical: Spacing.two, | Assigns a property/value pair in object/CSS context. |
| 156 |     borderRadius: Spacing.five, | Assigns a property/value pair in object/CSS context. |
| 157 |     justifyContent: 'center', | Assigns a property/value pair in object/CSS context. |
| 158 |     gap: Spacing.one, | Assigns a property/value pair in object/CSS context. |
| 159 |     alignItems: 'center', | Assigns a property/value pair in object/CSS context. |
| 160 |   }, | Structural syntax token delimiting code blocks/collections. |
| 161 |   sectionsWrapper: { | Starts object property block for grouped configuration/style. |
| 162 |     gap: Spacing.five, | Assigns a property/value pair in object/CSS context. |
| 163 |     paddingHorizontal: Spacing.four, | Assigns a property/value pair in object/CSS context. |
| 164 |     paddingTop: Spacing.three, | Assigns a property/value pair in object/CSS context. |
| 165 |   }, | Structural syntax token delimiting code blocks/collections. |
| 166 |   collapsibleContent: { | Starts object property block for grouped configuration/style. |
| 167 |     alignItems: 'center', | Assigns a property/value pair in object/CSS context. |
| 168 |   }, | Structural syntax token delimiting code blocks/collections. |
| 169 |   imageTutorial: { | Starts object property block for grouped configuration/style. |
| 170 |     width: '100%', | Assigns a property/value pair in object/CSS context. |
| 171 |     aspectRatio: 296 / 171, | Assigns a property/value pair in object/CSS context. |
| 172 |     borderRadius: Spacing.three, | Assigns a property/value pair in object/CSS context. |
| 173 |     marginTop: Spacing.two, | Assigns a property/value pair in object/CSS context. |
| 174 |   }, | Structural syntax token delimiting code blocks/collections. |
| 175 |   imageReact: { | Starts object property block for grouped configuration/style. |
| 176 |     width: 100, | Assigns a property/value pair in object/CSS context. |
| 177 |     height: 100, | Assigns a property/value pair in object/CSS context. |
| 178 |     alignSelf: 'center', | Assigns a property/value pair in object/CSS context. |
| 179 |   }, | Structural syntax token delimiting code blocks/collections. |
| 180 | }); | Structural syntax token delimiting code blocks/collections. |

## File: mobile\src\components\animated-icon.tsx

| Line | Code | Explanation |
|---:|---|---|
| 1 | import { Image } from 'expo-image'; | Imports a dependency/module needed in this file. |
| 2 | import { useState } from 'react'; | Imports a dependency/module needed in this file. |
| 3 | import { Dimensions, StyleSheet, View } from 'react-native'; | Imports a dependency/module needed in this file. |
| 4 | import Animated, { Easing, Keyframe } from 'react-native-reanimated'; | Imports a dependency/module needed in this file. |
| 5 | import { scheduleOnRN } from 'react-native-worklets'; | Imports a dependency/module needed in this file. |
| 6 | (blank) | Blank line for readability and section separation. |
| 7 | const INITIAL_SCALE_FACTOR = Dimensions.get('screen').height / 90; | Declares a JavaScript constant used in component logic. |
| 8 | const DURATION = 600; | Declares a JavaScript constant used in component logic. |
| 9 | (blank) | Blank line for readability and section separation. |
| 10 | export function AnimatedSplashOverlay() { | Declares and exports a named function/component. |
| 11 |   const [visible, setVisible] = useState(true); | Statement terminator ending current instruction. |
| 12 | (blank) | Blank line for readability and section separation. |
| 13 |   if (!visible) return null; | Conditional branch that executes when condition is true. |
| 14 | (blank) | Blank line for readability and section separation. |
| 15 |   const splashKeyframe = new Keyframe({ | Declares a JavaScript constant used in component logic. |
| 16 |     0: { | Starts object property block for grouped configuration/style. |
| 17 |       transform: [{ scale: INITIAL_SCALE_FACTOR }], | Assigns a property/value pair in object/CSS context. |
| 18 |       opacity: 1, | Assigns a property/value pair in object/CSS context. |
| 19 |     }, | Structural syntax token delimiting code blocks/collections. |
| 20 |     20: { | Starts object property block for grouped configuration/style. |
| 21 |       opacity: 1, | Assigns a property/value pair in object/CSS context. |
| 22 |     }, | Structural syntax token delimiting code blocks/collections. |
| 23 |     70: { | Starts object property block for grouped configuration/style. |
| 24 |       opacity: 0, | Assigns a property/value pair in object/CSS context. |
| 25 |       easing: Easing.elastic(0.7), | Assigns a property/value pair in object/CSS context. |
| 26 |     }, | Structural syntax token delimiting code blocks/collections. |
| 27 |     100: { | Starts object property block for grouped configuration/style. |
| 28 |       opacity: 0, | Assigns a property/value pair in object/CSS context. |
| 29 |       transform: [{ scale: 1 }], | Assigns a property/value pair in object/CSS context. |
| 30 |       easing: Easing.elastic(0.7), | Assigns a property/value pair in object/CSS context. |
| 31 |     }, | Structural syntax token delimiting code blocks/collections. |
| 32 |   }); | Structural syntax token delimiting code blocks/collections. |
| 33 | (blank) | Blank line for readability and section separation. |
| 34 |   return ( | Returns data/control from the current function/component. |
| 35 |     <Animated.View | Implements file-specific logic, configuration, or structure in this context. |
| 36 |       entering={splashKeyframe.duration(DURATION).withCallback((finished) => { | Implements file-specific logic, configuration, or structure in this context. |
| 37 |         'worklet'; | Statement terminator ending current instruction. |
| 38 |         if (finished) { | Conditional branch that executes when condition is true. |
| 39 |           scheduleOnRN(setVisible, false); | Statement terminator ending current instruction. |
| 40 |         } | Structural syntax token delimiting code blocks/collections. |
| 41 |       })} | Structural syntax token delimiting code blocks/collections. |
| 42 |       style={styles.backgroundSolidColor} | Implements file-specific logic, configuration, or structure in this context. |
| 43 |     /> | Implements file-specific logic, configuration, or structure in this context. |
| 44 |   ); | Structural syntax token delimiting code blocks/collections. |
| 45 | } | Structural syntax token delimiting code blocks/collections. |
| 46 | (blank) | Blank line for readability and section separation. |
| 47 | const keyframe = new Keyframe({ | Declares a JavaScript constant used in component logic. |
| 48 |   0: { | Starts object property block for grouped configuration/style. |
| 49 |     transform: [{ scale: INITIAL_SCALE_FACTOR }], | Assigns a property/value pair in object/CSS context. |
| 50 |   }, | Structural syntax token delimiting code blocks/collections. |
| 51 |   100: { | Starts object property block for grouped configuration/style. |
| 52 |     transform: [{ scale: 1 }], | Assigns a property/value pair in object/CSS context. |
| 53 |     easing: Easing.elastic(0.7), | Assigns a property/value pair in object/CSS context. |
| 54 |   }, | Structural syntax token delimiting code blocks/collections. |
| 55 | }); | Structural syntax token delimiting code blocks/collections. |
| 56 | (blank) | Blank line for readability and section separation. |
| 57 | const logoKeyframe = new Keyframe({ | Declares a JavaScript constant used in component logic. |
| 58 |   0: { | Starts object property block for grouped configuration/style. |
| 59 |     transform: [{ scale: 1.3 }], | Assigns a property/value pair in object/CSS context. |
| 60 |     opacity: 0, | Assigns a property/value pair in object/CSS context. |
| 61 |   }, | Structural syntax token delimiting code blocks/collections. |
| 62 |   40: { | Starts object property block for grouped configuration/style. |
| 63 |     transform: [{ scale: 1.3 }], | Assigns a property/value pair in object/CSS context. |
| 64 |     opacity: 0, | Assigns a property/value pair in object/CSS context. |
| 65 |     easing: Easing.elastic(0.7), | Assigns a property/value pair in object/CSS context. |
| 66 |   }, | Structural syntax token delimiting code blocks/collections. |
| 67 |   100: { | Starts object property block for grouped configuration/style. |
| 68 |     opacity: 1, | Assigns a property/value pair in object/CSS context. |
| 69 |     transform: [{ scale: 1 }], | Assigns a property/value pair in object/CSS context. |
| 70 |     easing: Easing.elastic(0.7), | Assigns a property/value pair in object/CSS context. |
| 71 |   }, | Structural syntax token delimiting code blocks/collections. |
| 72 | }); | Structural syntax token delimiting code blocks/collections. |
| 73 | (blank) | Blank line for readability and section separation. |
| 74 | const glowKeyframe = new Keyframe({ | Declares a JavaScript constant used in component logic. |
| 75 |   0: { | Starts object property block for grouped configuration/style. |
| 76 |     transform: [{ rotateZ: '0deg' }], | Assigns a property/value pair in object/CSS context. |
| 77 |   }, | Structural syntax token delimiting code blocks/collections. |
| 78 |   100: { | Starts object property block for grouped configuration/style. |
| 79 |     transform: [{ rotateZ: '7200deg' }], | Assigns a property/value pair in object/CSS context. |
| 80 |   }, | Structural syntax token delimiting code blocks/collections. |
| 81 | }); | Structural syntax token delimiting code blocks/collections. |
| 82 | (blank) | Blank line for readability and section separation. |
| 83 | export function AnimatedIcon() { | Declares and exports a named function/component. |
| 84 |   return ( | Returns data/control from the current function/component. |
| 85 |     <View style={styles.iconContainer}> | JSX/HTML structure line defining UI element hierarchy. |
| 86 |       <Animated.View entering={glowKeyframe.duration(60 * 1000 * 4)} style={styles.glow}> | JSX/HTML structure line defining UI element hierarchy. |
| 87 |         <Image style={styles.glow} source={require('@/assets/images/logo-glow.png')} /> | JSX/HTML structure line defining UI element hierarchy. |
| 88 |       </Animated.View> | JSX/HTML structure line defining UI element hierarchy. |
| 89 | (blank) | Blank line for readability and section separation. |
| 90 |       <Animated.View entering={keyframe.duration(DURATION)} style={styles.background} /> | JSX/HTML structure line defining UI element hierarchy. |
| 91 |       <Animated.View style={styles.imageContainer} entering={logoKeyframe.duration(DURATION)}> | JSX/HTML structure line defining UI element hierarchy. |
| 92 |         <Image style={styles.image} source={require('@/assets/images/expo-logo.png')} /> | JSX/HTML structure line defining UI element hierarchy. |
| 93 |       </Animated.View> | JSX/HTML structure line defining UI element hierarchy. |
| 94 |     </View> | JSX/HTML structure line defining UI element hierarchy. |
| 95 |   ); | Structural syntax token delimiting code blocks/collections. |
| 96 | } | Structural syntax token delimiting code blocks/collections. |
| 97 | (blank) | Blank line for readability and section separation. |
| 98 | const styles = StyleSheet.create({ | Defines React Native style object for component styling. |
| 99 |   imageContainer: { | Starts object property block for grouped configuration/style. |
| 100 |     justifyContent: 'center', | Assigns a property/value pair in object/CSS context. |
| 101 |     alignItems: 'center', | Assigns a property/value pair in object/CSS context. |
| 102 |   }, | Structural syntax token delimiting code blocks/collections. |
| 103 |   glow: { | Starts object property block for grouped configuration/style. |
| 104 |     width: 201, | Assigns a property/value pair in object/CSS context. |
| 105 |     height: 201, | Assigns a property/value pair in object/CSS context. |
| 106 |     position: 'absolute', | Assigns a property/value pair in object/CSS context. |
| 107 |   }, | Structural syntax token delimiting code blocks/collections. |
| 108 |   iconContainer: { | Starts object property block for grouped configuration/style. |
| 109 |     justifyContent: 'center', | Assigns a property/value pair in object/CSS context. |
| 110 |     alignItems: 'center', | Assigns a property/value pair in object/CSS context. |
| 111 |     width: 128, | Assigns a property/value pair in object/CSS context. |
| 112 |     height: 128, | Assigns a property/value pair in object/CSS context. |
| 113 |     zIndex: 100, | Assigns a property/value pair in object/CSS context. |
| 114 |   }, | Structural syntax token delimiting code blocks/collections. |
| 115 |   image: { | Starts object property block for grouped configuration/style. |
| 116 |     position: 'absolute', | Assigns a property/value pair in object/CSS context. |
| 117 |     width: 76, | Assigns a property/value pair in object/CSS context. |
| 118 |     height: 71, | Assigns a property/value pair in object/CSS context. |
| 119 |   }, | Structural syntax token delimiting code blocks/collections. |
| 120 |   background: { | Starts object property block for grouped configuration/style. |
| 121 |     borderRadius: 40, | Assigns a property/value pair in object/CSS context. |
| 122 |     experimental_backgroundImage: `linear-gradient(180deg, #3C9FFE, #0274DF)`, | Assigns a property/value pair in object/CSS context. |
| 123 |     width: 128, | Assigns a property/value pair in object/CSS context. |
| 124 |     height: 128, | Assigns a property/value pair in object/CSS context. |
| 125 |     position: 'absolute', | Assigns a property/value pair in object/CSS context. |
| 126 |   }, | Structural syntax token delimiting code blocks/collections. |
| 127 |   backgroundSolidColor: { | Starts object property block for grouped configuration/style. |
| 128 |     ...StyleSheet.absoluteFill, | Implements file-specific logic, configuration, or structure in this context. |
| 129 |     backgroundColor: '#208AEF', | Assigns a property/value pair in object/CSS context. |
| 130 |     zIndex: 1000, | Assigns a property/value pair in object/CSS context. |
| 131 |   }, | Structural syntax token delimiting code blocks/collections. |
| 132 | }); | Structural syntax token delimiting code blocks/collections. |

## File: mobile\src\components\animated-icon.web.tsx

| Line | Code | Explanation |
|---:|---|---|
| 1 | import { Image } from 'expo-image'; | Imports a dependency/module needed in this file. |
| 2 | import { StyleSheet, View } from 'react-native'; | Imports a dependency/module needed in this file. |
| 3 | import Animated, { Keyframe, Easing } from 'react-native-reanimated'; | Imports a dependency/module needed in this file. |
| 4 | (blank) | Blank line for readability and section separation. |
| 5 | import classes from './animated-icon.module.css'; | Imports a dependency/module needed in this file. |
| 6 | const DURATION = 300; | Declares a JavaScript constant used in component logic. |
| 7 | (blank) | Blank line for readability and section separation. |
| 8 | export function AnimatedSplashOverlay() { | Declares and exports a named function/component. |
| 9 |   return null; | Returns data/control from the current function/component. |
| 10 | } | Structural syntax token delimiting code blocks/collections. |
| 11 | (blank) | Blank line for readability and section separation. |
| 12 | const keyframe = new Keyframe({ | Declares a JavaScript constant used in component logic. |
| 13 |   0: { | Starts object property block for grouped configuration/style. |
| 14 |     transform: [{ scale: 0 }], | Assigns a property/value pair in object/CSS context. |
| 15 |   }, | Structural syntax token delimiting code blocks/collections. |
| 16 |   60: { | Starts object property block for grouped configuration/style. |
| 17 |     transform: [{ scale: 1.2 }], | Assigns a property/value pair in object/CSS context. |
| 18 |     easing: Easing.elastic(1.2), | Assigns a property/value pair in object/CSS context. |
| 19 |   }, | Structural syntax token delimiting code blocks/collections. |
| 20 |   100: { | Starts object property block for grouped configuration/style. |
| 21 |     transform: [{ scale: 1 }], | Assigns a property/value pair in object/CSS context. |
| 22 |     easing: Easing.elastic(1.2), | Assigns a property/value pair in object/CSS context. |
| 23 |   }, | Structural syntax token delimiting code blocks/collections. |
| 24 | }); | Structural syntax token delimiting code blocks/collections. |
| 25 | (blank) | Blank line for readability and section separation. |
| 26 | const logoKeyframe = new Keyframe({ | Declares a JavaScript constant used in component logic. |
| 27 |   0: { | Starts object property block for grouped configuration/style. |
| 28 |     opacity: 0, | Assigns a property/value pair in object/CSS context. |
| 29 |   }, | Structural syntax token delimiting code blocks/collections. |
| 30 |   60: { | Starts object property block for grouped configuration/style. |
| 31 |     transform: [{ scale: 1.2 }], | Assigns a property/value pair in object/CSS context. |
| 32 |     opacity: 0, | Assigns a property/value pair in object/CSS context. |
| 33 |     easing: Easing.elastic(1.2), | Assigns a property/value pair in object/CSS context. |
| 34 |   }, | Structural syntax token delimiting code blocks/collections. |
| 35 |   100: { | Starts object property block for grouped configuration/style. |
| 36 |     transform: [{ scale: 1 }], | Assigns a property/value pair in object/CSS context. |
| 37 |     opacity: 1, | Assigns a property/value pair in object/CSS context. |
| 38 |     easing: Easing.elastic(1.2), | Assigns a property/value pair in object/CSS context. |
| 39 |   }, | Structural syntax token delimiting code blocks/collections. |
| 40 | }); | Structural syntax token delimiting code blocks/collections. |
| 41 | (blank) | Blank line for readability and section separation. |
| 42 | const glowKeyframe = new Keyframe({ | Declares a JavaScript constant used in component logic. |
| 43 |   0: { | Starts object property block for grouped configuration/style. |
| 44 |     transform: [{ rotateZ: '-180deg' }, { scale: 0.8 }], | Assigns a property/value pair in object/CSS context. |
| 45 |     opacity: 0, | Assigns a property/value pair in object/CSS context. |
| 46 |   }, | Structural syntax token delimiting code blocks/collections. |
| 47 |   [DURATION / 1000]: { | Structural syntax token delimiting code blocks/collections. |
| 48 |     transform: [{ rotateZ: '0deg' }, { scale: 1 }], | Assigns a property/value pair in object/CSS context. |
| 49 |     opacity: 1, | Assigns a property/value pair in object/CSS context. |
| 50 |     easing: Easing.elastic(0.7), | Assigns a property/value pair in object/CSS context. |
| 51 |   }, | Structural syntax token delimiting code blocks/collections. |
| 52 |   100: { | Starts object property block for grouped configuration/style. |
| 53 |     transform: [{ rotateZ: '7200deg' }], | Assigns a property/value pair in object/CSS context. |
| 54 |   }, | Structural syntax token delimiting code blocks/collections. |
| 55 | }); | Structural syntax token delimiting code blocks/collections. |
| 56 | (blank) | Blank line for readability and section separation. |
| 57 | export function AnimatedIcon() { | Declares and exports a named function/component. |
| 58 |   return ( | Returns data/control from the current function/component. |
| 59 |     <View style={styles.iconContainer}> | JSX/HTML structure line defining UI element hierarchy. |
| 60 |       <Animated.View entering={glowKeyframe.duration(60 * 1000 * 4)} style={styles.glow}> | JSX/HTML structure line defining UI element hierarchy. |
| 61 |         <Image style={styles.glow} source={require('@/assets/images/logo-glow.png')} /> | JSX/HTML structure line defining UI element hierarchy. |
| 62 |       </Animated.View> | JSX/HTML structure line defining UI element hierarchy. |
| 63 | (blank) | Blank line for readability and section separation. |
| 64 |       <Animated.View style={styles.background} entering={keyframe.duration(DURATION)}> | JSX/HTML structure line defining UI element hierarchy. |
| 65 |         <div className={classes.expoLogoBackground} /> | JSX/HTML structure line defining UI element hierarchy. |
| 66 |       </Animated.View> | JSX/HTML structure line defining UI element hierarchy. |
| 67 | (blank) | Blank line for readability and section separation. |
| 68 |       <Animated.View style={styles.imageContainer} entering={logoKeyframe.duration(DURATION)}> | JSX/HTML structure line defining UI element hierarchy. |
| 69 |         <Image style={styles.image} source={require('@/assets/images/expo-logo.png')} /> | JSX/HTML structure line defining UI element hierarchy. |
| 70 |       </Animated.View> | JSX/HTML structure line defining UI element hierarchy. |
| 71 |     </View> | JSX/HTML structure line defining UI element hierarchy. |
| 72 |   ); | Structural syntax token delimiting code blocks/collections. |
| 73 | } | Structural syntax token delimiting code blocks/collections. |
| 74 | (blank) | Blank line for readability and section separation. |
| 75 | const styles = StyleSheet.create({ | Defines React Native style object for component styling. |
| 76 |   container: { | Starts object property block for grouped configuration/style. |
| 77 |     alignItems: 'center', | Assigns a property/value pair in object/CSS context. |
| 78 |     width: '100%', | Assigns a property/value pair in object/CSS context. |
| 79 |     zIndex: 1000, | Assigns a property/value pair in object/CSS context. |
| 80 |     position: 'absolute', | Assigns a property/value pair in object/CSS context. |
| 81 |     top: 128 / 2 + 138, | Assigns a property/value pair in object/CSS context. |
| 82 |   }, | Structural syntax token delimiting code blocks/collections. |
| 83 |   imageContainer: { | Starts object property block for grouped configuration/style. |
| 84 |     justifyContent: 'center', | Assigns a property/value pair in object/CSS context. |
| 85 |     alignItems: 'center', | Assigns a property/value pair in object/CSS context. |
| 86 |   }, | Structural syntax token delimiting code blocks/collections. |
| 87 |   glow: { | Starts object property block for grouped configuration/style. |
| 88 |     width: 201, | Assigns a property/value pair in object/CSS context. |
| 89 |     height: 201, | Assigns a property/value pair in object/CSS context. |
| 90 |     position: 'absolute', | Assigns a property/value pair in object/CSS context. |
| 91 |   }, | Structural syntax token delimiting code blocks/collections. |
| 92 |   iconContainer: { | Starts object property block for grouped configuration/style. |
| 93 |     justifyContent: 'center', | Assigns a property/value pair in object/CSS context. |
| 94 |     alignItems: 'center', | Assigns a property/value pair in object/CSS context. |
| 95 |     width: 128, | Assigns a property/value pair in object/CSS context. |
| 96 |     height: 128, | Assigns a property/value pair in object/CSS context. |
| 97 |   }, | Structural syntax token delimiting code blocks/collections. |
| 98 |   image: { | Starts object property block for grouped configuration/style. |
| 99 |     position: 'absolute', | Assigns a property/value pair in object/CSS context. |
| 100 |     width: 76, | Assigns a property/value pair in object/CSS context. |
| 101 |     height: 71, | Assigns a property/value pair in object/CSS context. |
| 102 |   }, | Structural syntax token delimiting code blocks/collections. |
| 103 |   background: { | Starts object property block for grouped configuration/style. |
| 104 |     width: 128, | Assigns a property/value pair in object/CSS context. |
| 105 |     height: 128, | Assigns a property/value pair in object/CSS context. |
| 106 |     position: 'absolute', | Assigns a property/value pair in object/CSS context. |
| 107 |   }, | Structural syntax token delimiting code blocks/collections. |
| 108 | }); | Structural syntax token delimiting code blocks/collections. |

## File: mobile\src\components\app-tabs.tsx

| Line | Code | Explanation |
|---:|---|---|
| 1 | import { NativeTabs } from 'expo-router/unstable-native-tabs'; | Imports a dependency/module needed in this file. |
| 2 | import { useColorScheme } from 'react-native'; | Imports a dependency/module needed in this file. |
| 3 | (blank) | Blank line for readability and section separation. |
| 4 | import { Colors } from '@/constants/theme'; | Imports a dependency/module needed in this file. |
| 5 | (blank) | Blank line for readability and section separation. |
| 6 | export default function AppTabs() { | Declares and exports the default function/component. |
| 7 |   const scheme = useColorScheme(); | Declares a JavaScript constant used in component logic. |
| 8 |   const colors = Colors[scheme === 'unspecified' ? 'light' : scheme]; | Declares a JavaScript constant used in component logic. |
| 9 | (blank) | Blank line for readability and section separation. |
| 10 |   return ( | Returns data/control from the current function/component. |
| 11 |     <NativeTabs | Implements file-specific logic, configuration, or structure in this context. |
| 12 |       backgroundColor={colors.background} | Implements file-specific logic, configuration, or structure in this context. |
| 13 |       indicatorColor={colors.backgroundElement} | Implements file-specific logic, configuration, or structure in this context. |
| 14 |       labelStyle={{ selected: { color: colors.text } }}> | Performs SQLite database connection/query/schema operation. |
| 15 |       <NativeTabs.Trigger name="index"> | JSX/HTML structure line defining UI element hierarchy. |
| 16 |         <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label> | Implements file-specific logic, configuration, or structure in this context. |
| 17 |         <NativeTabs.Trigger.Icon | Implements file-specific logic, configuration, or structure in this context. |
| 18 |           src={require('@/assets/images/tabIcons/home.png')} | Implements file-specific logic, configuration, or structure in this context. |
| 19 |           renderingMode="template" | Implements file-specific logic, configuration, or structure in this context. |
| 20 |         /> | Implements file-specific logic, configuration, or structure in this context. |
| 21 |       </NativeTabs.Trigger> | JSX/HTML structure line defining UI element hierarchy. |
| 22 | (blank) | Blank line for readability and section separation. |
| 23 |       <NativeTabs.Trigger name="explore"> | JSX/HTML structure line defining UI element hierarchy. |
| 24 |         <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label> | Implements file-specific logic, configuration, or structure in this context. |
| 25 |         <NativeTabs.Trigger.Icon | Implements file-specific logic, configuration, or structure in this context. |
| 26 |           src={require('@/assets/images/tabIcons/explore.png')} | Implements file-specific logic, configuration, or structure in this context. |
| 27 |           renderingMode="template" | Implements file-specific logic, configuration, or structure in this context. |
| 28 |         /> | Implements file-specific logic, configuration, or structure in this context. |
| 29 |       </NativeTabs.Trigger> | JSX/HTML structure line defining UI element hierarchy. |
| 30 |     </NativeTabs> | JSX/HTML structure line defining UI element hierarchy. |
| 31 |   ); | Structural syntax token delimiting code blocks/collections. |
| 32 | } | Structural syntax token delimiting code blocks/collections. |

## File: mobile\src\components\app-tabs.web.tsx

| Line | Code | Explanation |
|---:|---|---|
| 1 | import { | Imports a dependency/module needed in this file. |
| 2 |   Tabs, | Implements file-specific logic, configuration, or structure in this context. |
| 3 |   TabList, | Implements file-specific logic, configuration, or structure in this context. |
| 4 |   TabTrigger, | Implements file-specific logic, configuration, or structure in this context. |
| 5 |   TabSlot, | Implements file-specific logic, configuration, or structure in this context. |
| 6 |   TabTriggerSlotProps, | Implements file-specific logic, configuration, or structure in this context. |
| 7 |   TabListProps, | Implements file-specific logic, configuration, or structure in this context. |
| 8 | } from 'expo-router/ui'; | Structural syntax token delimiting code blocks/collections. |
| 9 | import { SymbolView } from 'expo-symbols'; | Imports a dependency/module needed in this file. |
| 10 | import { Pressable, useColorScheme, View, StyleSheet } from 'react-native'; | Imports a dependency/module needed in this file. |
| 11 | (blank) | Blank line for readability and section separation. |
| 12 | import { ExternalLink } from './external-link'; | Imports a dependency/module needed in this file. |
| 13 | import { ThemedText } from './themed-text'; | Imports a dependency/module needed in this file. |
| 14 | import { ThemedView } from './themed-view'; | Imports a dependency/module needed in this file. |
| 15 | (blank) | Blank line for readability and section separation. |
| 16 | import { Colors, MaxContentWidth, Spacing } from '@/constants/theme'; | Imports a dependency/module needed in this file. |
| 17 | (blank) | Blank line for readability and section separation. |
| 18 | export default function AppTabs() { | Declares and exports the default function/component. |
| 19 |   return ( | Returns data/control from the current function/component. |
| 20 |     <Tabs> | JSX/HTML structure line defining UI element hierarchy. |
| 21 |       <TabSlot style={{ height: '100%' }} /> | JSX/HTML structure line defining UI element hierarchy. |
| 22 |       <TabList asChild> | JSX/HTML structure line defining UI element hierarchy. |
| 23 |         <CustomTabList> | JSX/HTML structure line defining UI element hierarchy. |
| 24 |           <TabTrigger name="home" href="/" asChild> | JSX/HTML structure line defining UI element hierarchy. |
| 25 |             <TabButton>Home</TabButton> | Implements file-specific logic, configuration, or structure in this context. |
| 26 |           </TabTrigger> | JSX/HTML structure line defining UI element hierarchy. |
| 27 |           <TabTrigger name="explore" href="/explore" asChild> | JSX/HTML structure line defining UI element hierarchy. |
| 28 |             <TabButton>Explore</TabButton> | Implements file-specific logic, configuration, or structure in this context. |
| 29 |           </TabTrigger> | JSX/HTML structure line defining UI element hierarchy. |
| 30 |         </CustomTabList> | JSX/HTML structure line defining UI element hierarchy. |
| 31 |       </TabList> | JSX/HTML structure line defining UI element hierarchy. |
| 32 |     </Tabs> | JSX/HTML structure line defining UI element hierarchy. |
| 33 |   ); | Structural syntax token delimiting code blocks/collections. |
| 34 | } | Structural syntax token delimiting code blocks/collections. |
| 35 | (blank) | Blank line for readability and section separation. |
| 36 | export function TabButton({ children, isFocused, ...props }: TabTriggerSlotProps) { | Declares and exports a named function/component. |
| 37 |   return ( | Returns data/control from the current function/component. |
| 38 |     <Pressable {...props} style={({ pressed }) => pressed && styles.pressed}> | Implements file-specific logic, configuration, or structure in this context. |
| 39 |       <ThemedView | Implements file-specific logic, configuration, or structure in this context. |
| 40 |         type={isFocused ? 'backgroundSelected' : 'backgroundElement'} | Performs SQLite database connection/query/schema operation. |
| 41 |         style={styles.tabButtonView}> | Implements file-specific logic, configuration, or structure in this context. |
| 42 |         <ThemedText type="small" themeColor={isFocused ? 'text' : 'textSecondary'}> | JSX/HTML structure line defining UI element hierarchy. |
| 43 |           {children} | Structural syntax token delimiting code blocks/collections. |
| 44 |         </ThemedText> | JSX/HTML structure line defining UI element hierarchy. |
| 45 |       </ThemedView> | JSX/HTML structure line defining UI element hierarchy. |
| 46 |     </Pressable> | JSX/HTML structure line defining UI element hierarchy. |
| 47 |   ); | Structural syntax token delimiting code blocks/collections. |
| 48 | } | Structural syntax token delimiting code blocks/collections. |
| 49 | (blank) | Blank line for readability and section separation. |
| 50 | export function CustomTabList(props: TabListProps) { | Declares and exports a named function/component. |
| 51 |   const scheme = useColorScheme(); | Declares a JavaScript constant used in component logic. |
| 52 |   const colors = Colors[scheme === 'unspecified' ? 'light' : scheme]; | Declares a JavaScript constant used in component logic. |
| 53 | (blank) | Blank line for readability and section separation. |
| 54 |   return ( | Returns data/control from the current function/component. |
| 55 |     <View {...props} style={styles.tabListContainer}> | JSX/HTML structure line defining UI element hierarchy. |
| 56 |       <ThemedView type="backgroundElement" style={styles.innerContainer}> | JSX/HTML structure line defining UI element hierarchy. |
| 57 |         <ThemedText type="smallBold" style={styles.brandText}> | JSX/HTML structure line defining UI element hierarchy. |
| 58 |           Expo Starter | Implements file-specific logic, configuration, or structure in this context. |
| 59 |         </ThemedText> | JSX/HTML structure line defining UI element hierarchy. |
| 60 | (blank) | Blank line for readability and section separation. |
| 61 |         {props.children} | Structural syntax token delimiting code blocks/collections. |
| 62 | (blank) | Blank line for readability and section separation. |
| 63 |         <ExternalLink href="https://docs.expo.dev" asChild> | JSX/HTML structure line defining UI element hierarchy. |
| 64 |           <Pressable style={styles.externalPressable}> | JSX/HTML structure line defining UI element hierarchy. |
| 65 |             <ThemedText type="link">Docs</ThemedText> | Implements file-specific logic, configuration, or structure in this context. |
| 66 |             <SymbolView | Implements file-specific logic, configuration, or structure in this context. |
| 67 |               tintColor={colors.text} | Implements file-specific logic, configuration, or structure in this context. |
| 68 |               name={{ ios: 'arrow.up.right.square', web: 'link' }} | Implements file-specific logic, configuration, or structure in this context. |
| 69 |               size={12} | Implements file-specific logic, configuration, or structure in this context. |
| 70 |             /> | Implements file-specific logic, configuration, or structure in this context. |
| 71 |           </Pressable> | JSX/HTML structure line defining UI element hierarchy. |
| 72 |         </ExternalLink> | JSX/HTML structure line defining UI element hierarchy. |
| 73 |       </ThemedView> | JSX/HTML structure line defining UI element hierarchy. |
| 74 |     </View> | JSX/HTML structure line defining UI element hierarchy. |
| 75 |   ); | Structural syntax token delimiting code blocks/collections. |
| 76 | } | Structural syntax token delimiting code blocks/collections. |
| 77 | (blank) | Blank line for readability and section separation. |
| 78 | const styles = StyleSheet.create({ | Defines React Native style object for component styling. |
| 79 |   tabListContainer: { | Starts object property block for grouped configuration/style. |
| 80 |     position: 'absolute', | Assigns a property/value pair in object/CSS context. |
| 81 |     width: '100%', | Assigns a property/value pair in object/CSS context. |
| 82 |     padding: Spacing.three, | Assigns a property/value pair in object/CSS context. |
| 83 |     justifyContent: 'center', | Assigns a property/value pair in object/CSS context. |
| 84 |     alignItems: 'center', | Assigns a property/value pair in object/CSS context. |
| 85 |     flexDirection: 'row', | Assigns a property/value pair in object/CSS context. |
| 86 |   }, | Structural syntax token delimiting code blocks/collections. |
| 87 |   innerContainer: { | Starts object property block for grouped configuration/style. |
| 88 |     paddingVertical: Spacing.two, | Assigns a property/value pair in object/CSS context. |
| 89 |     paddingHorizontal: Spacing.five, | Assigns a property/value pair in object/CSS context. |
| 90 |     borderRadius: Spacing.five, | Assigns a property/value pair in object/CSS context. |
| 91 |     flexDirection: 'row', | Assigns a property/value pair in object/CSS context. |
| 92 |     alignItems: 'center', | Assigns a property/value pair in object/CSS context. |
| 93 |     flexGrow: 1, | Assigns a property/value pair in object/CSS context. |
| 94 |     gap: Spacing.two, | Assigns a property/value pair in object/CSS context. |
| 95 |     maxWidth: MaxContentWidth, | Assigns a property/value pair in object/CSS context. |
| 96 |   }, | Structural syntax token delimiting code blocks/collections. |
| 97 |   brandText: { | Starts object property block for grouped configuration/style. |
| 98 |     marginRight: 'auto', | Assigns a property/value pair in object/CSS context. |
| 99 |   }, | Structural syntax token delimiting code blocks/collections. |
| 100 |   pressed: { | Starts object property block for grouped configuration/style. |
| 101 |     opacity: 0.7, | Assigns a property/value pair in object/CSS context. |
| 102 |   }, | Structural syntax token delimiting code blocks/collections. |
| 103 |   tabButtonView: { | Starts object property block for grouped configuration/style. |
| 104 |     paddingVertical: Spacing.one, | Assigns a property/value pair in object/CSS context. |
| 105 |     paddingHorizontal: Spacing.three, | Assigns a property/value pair in object/CSS context. |
| 106 |     borderRadius: Spacing.three, | Assigns a property/value pair in object/CSS context. |
| 107 |   }, | Structural syntax token delimiting code blocks/collections. |
| 108 |   externalPressable: { | Starts object property block for grouped configuration/style. |
| 109 |     flexDirection: 'row', | Assigns a property/value pair in object/CSS context. |
| 110 |     justifyContent: 'center', | Assigns a property/value pair in object/CSS context. |
| 111 |     alignItems: 'center', | Assigns a property/value pair in object/CSS context. |
| 112 |     gap: Spacing.one, | Assigns a property/value pair in object/CSS context. |
| 113 |     marginLeft: Spacing.three, | Assigns a property/value pair in object/CSS context. |
| 114 |   }, | Structural syntax token delimiting code blocks/collections. |
| 115 | }); | Structural syntax token delimiting code blocks/collections. |

## File: mobile\src\components\external-link.tsx

| Line | Code | Explanation |
|---:|---|---|
| 1 | import { Href, Link } from 'expo-router'; | Imports a dependency/module needed in this file. |
| 2 | import { openBrowserAsync, WebBrowserPresentationStyle } from 'expo-web-browser'; | Imports a dependency/module needed in this file. |
| 3 | import { type ComponentProps } from 'react'; | Imports a dependency/module needed in this file. |
| 4 | (blank) | Blank line for readability and section separation. |
| 5 | type Props = Omit<ComponentProps<typeof Link>, 'href'> & { href: Href & string }; | Statement terminator ending current instruction. |
| 6 | (blank) | Blank line for readability and section separation. |
| 7 | export function ExternalLink({ href, ...rest }: Props) { | Declares and exports a named function/component. |
| 8 |   return ( | Returns data/control from the current function/component. |
| 9 |     <Link | Implements file-specific logic, configuration, or structure in this context. |
| 10 |       target="_blank" | Implements file-specific logic, configuration, or structure in this context. |
| 11 |       {...rest} | Structural syntax token delimiting code blocks/collections. |
| 12 |       href={href} | Implements file-specific logic, configuration, or structure in this context. |
| 13 |       onPress={async (event) => { | Implements file-specific logic, configuration, or structure in this context. |
| 14 |         if (process.env.EXPO_OS !== 'web') { | Conditional branch that executes when condition is true. |
| 15 |           // Prevent the default behavior of linking to the default browser on native. | Comment line documenting intent or context. |
| 16 |           event.preventDefault(); | Statement terminator ending current instruction. |
| 17 |           // Open the link in an in-app browser. | Comment line documenting intent or context. |
| 18 |           await openBrowserAsync(href, { | Implements file-specific logic, configuration, or structure in this context. |
| 19 |             presentationStyle: WebBrowserPresentationStyle.AUTOMATIC, | Assigns a property/value pair in object/CSS context. |
| 20 |           }); | Structural syntax token delimiting code blocks/collections. |
| 21 |         } | Structural syntax token delimiting code blocks/collections. |
| 22 |       }} | Structural syntax token delimiting code blocks/collections. |
| 23 |     /> | Implements file-specific logic, configuration, or structure in this context. |
| 24 |   ); | Structural syntax token delimiting code blocks/collections. |
| 25 | } | Structural syntax token delimiting code blocks/collections. |

## File: mobile\src\components\hint-row.tsx

| Line | Code | Explanation |
|---:|---|---|
| 1 | import type { ReactNode } from 'react'; | Imports a dependency/module needed in this file. |
| 2 | import { View, StyleSheet } from 'react-native'; | Imports a dependency/module needed in this file. |
| 3 | (blank) | Blank line for readability and section separation. |
| 4 | import { ThemedText } from './themed-text'; | Imports a dependency/module needed in this file. |
| 5 | import { ThemedView } from './themed-view'; | Imports a dependency/module needed in this file. |
| 6 | (blank) | Blank line for readability and section separation. |
| 7 | import { Spacing } from '@/constants/theme'; | Imports a dependency/module needed in this file. |
| 8 | (blank) | Blank line for readability and section separation. |
| 9 | type HintRowProps = { | Implements file-specific logic, configuration, or structure in this context. |
| 10 |   title?: string; | Statement terminator ending current instruction. |
| 11 |   hint?: ReactNode; | Statement terminator ending current instruction. |
| 12 | }; | Structural syntax token delimiting code blocks/collections. |
| 13 | (blank) | Blank line for readability and section separation. |
| 14 | export function HintRow({ title = 'Try editing', hint = 'app/index.tsx' }: HintRowProps) { | Declares and exports a named function/component. |
| 15 |   return ( | Returns data/control from the current function/component. |
| 16 |     <View style={styles.stepRow}> | JSX/HTML structure line defining UI element hierarchy. |
| 17 |       <ThemedText type="small">{title}</ThemedText> | Implements file-specific logic, configuration, or structure in this context. |
| 18 |       <ThemedView type="backgroundSelected" style={styles.codeSnippet}> | Performs SQLite database connection/query/schema operation. |
| 19 |         <ThemedText themeColor="textSecondary">{hint}</ThemedText> | Implements file-specific logic, configuration, or structure in this context. |
| 20 |       </ThemedView> | JSX/HTML structure line defining UI element hierarchy. |
| 21 |     </View> | JSX/HTML structure line defining UI element hierarchy. |
| 22 |   ); | Structural syntax token delimiting code blocks/collections. |
| 23 | } | Structural syntax token delimiting code blocks/collections. |
| 24 | (blank) | Blank line for readability and section separation. |
| 25 | const styles = StyleSheet.create({ | Defines React Native style object for component styling. |
| 26 |   stepRow: { | Starts object property block for grouped configuration/style. |
| 27 |     flexDirection: 'row', | Assigns a property/value pair in object/CSS context. |
| 28 |     justifyContent: 'space-between', | Assigns a property/value pair in object/CSS context. |
| 29 |   }, | Structural syntax token delimiting code blocks/collections. |
| 30 |   codeSnippet: { | Starts object property block for grouped configuration/style. |
| 31 |     borderRadius: Spacing.two, | Assigns a property/value pair in object/CSS context. |
| 32 |     paddingVertical: Spacing.half, | Assigns a property/value pair in object/CSS context. |
| 33 |     paddingHorizontal: Spacing.two, | Assigns a property/value pair in object/CSS context. |
| 34 |   }, | Structural syntax token delimiting code blocks/collections. |
| 35 | }); | Structural syntax token delimiting code blocks/collections. |

## File: mobile\src\components\themed-text.tsx

| Line | Code | Explanation |
|---:|---|---|
| 1 | import { Platform, StyleSheet, Text, type TextProps } from 'react-native'; | Imports a dependency/module needed in this file. |
| 2 | (blank) | Blank line for readability and section separation. |
| 3 | import { Fonts, ThemeColor } from '@/constants/theme'; | Imports a dependency/module needed in this file. |
| 4 | import { useTheme } from '@/hooks/use-theme'; | Imports a dependency/module needed in this file. |
| 5 | (blank) | Blank line for readability and section separation. |
| 6 | export type ThemedTextProps = TextProps & { | Implements file-specific logic, configuration, or structure in this context. |
| 7 |   type?: 'default' \\| 'title' \\| 'small' \\| 'smallBold' \\| 'subtitle' \\| 'link' \\| 'linkPrimary' \\| 'code'; | Statement terminator ending current instruction. |
| 8 |   themeColor?: ThemeColor; | Statement terminator ending current instruction. |
| 9 | }; | Structural syntax token delimiting code blocks/collections. |
| 10 | (blank) | Blank line for readability and section separation. |
| 11 | export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) { | Declares and exports a named function/component. |
| 12 |   const theme = useTheme(); | Declares a JavaScript constant used in component logic. |
| 13 | (blank) | Blank line for readability and section separation. |
| 14 |   return ( | Returns data/control from the current function/component. |
| 15 |     <Text | Implements file-specific logic, configuration, or structure in this context. |
| 16 |       style={[ | Implements file-specific logic, configuration, or structure in this context. |
| 17 |         { color: theme[themeColor ?? 'text'] }, | Structural syntax token delimiting code blocks/collections. |
| 18 |         type === 'default' && styles.default, | Implements file-specific logic, configuration, or structure in this context. |
| 19 |         type === 'title' && styles.title, | Implements file-specific logic, configuration, or structure in this context. |
| 20 |         type === 'small' && styles.small, | Implements file-specific logic, configuration, or structure in this context. |
| 21 |         type === 'smallBold' && styles.smallBold, | Implements file-specific logic, configuration, or structure in this context. |
| 22 |         type === 'subtitle' && styles.subtitle, | Implements file-specific logic, configuration, or structure in this context. |
| 23 |         type === 'link' && styles.link, | Implements file-specific logic, configuration, or structure in this context. |
| 24 |         type === 'linkPrimary' && styles.linkPrimary, | Implements file-specific logic, configuration, or structure in this context. |
| 25 |         type === 'code' && styles.code, | Implements file-specific logic, configuration, or structure in this context. |
| 26 |         style, | Implements file-specific logic, configuration, or structure in this context. |
| 27 |       ]} | Structural syntax token delimiting code blocks/collections. |
| 28 |       {...rest} | Structural syntax token delimiting code blocks/collections. |
| 29 |     /> | Implements file-specific logic, configuration, or structure in this context. |
| 30 |   ); | Structural syntax token delimiting code blocks/collections. |
| 31 | } | Structural syntax token delimiting code blocks/collections. |
| 32 | (blank) | Blank line for readability and section separation. |
| 33 | const styles = StyleSheet.create({ | Defines React Native style object for component styling. |
| 34 |   small: { | Starts object property block for grouped configuration/style. |
| 35 |     fontSize: 14, | Assigns a property/value pair in object/CSS context. |
| 36 |     lineHeight: 20, | Assigns a property/value pair in object/CSS context. |
| 37 |     fontWeight: 500, | Assigns a property/value pair in object/CSS context. |
| 38 |   }, | Structural syntax token delimiting code blocks/collections. |
| 39 |   smallBold: { | Starts object property block for grouped configuration/style. |
| 40 |     fontSize: 14, | Assigns a property/value pair in object/CSS context. |
| 41 |     lineHeight: 20, | Assigns a property/value pair in object/CSS context. |
| 42 |     fontWeight: 700, | Assigns a property/value pair in object/CSS context. |
| 43 |   }, | Structural syntax token delimiting code blocks/collections. |
| 44 |   default: { | Starts object property block for grouped configuration/style. |
| 45 |     fontSize: 16, | Assigns a property/value pair in object/CSS context. |
| 46 |     lineHeight: 24, | Assigns a property/value pair in object/CSS context. |
| 47 |     fontWeight: 500, | Assigns a property/value pair in object/CSS context. |
| 48 |   }, | Structural syntax token delimiting code blocks/collections. |
| 49 |   title: { | Starts object property block for grouped configuration/style. |
| 50 |     fontSize: 48, | Assigns a property/value pair in object/CSS context. |
| 51 |     fontWeight: 600, | Assigns a property/value pair in object/CSS context. |
| 52 |     lineHeight: 52, | Assigns a property/value pair in object/CSS context. |
| 53 |   }, | Structural syntax token delimiting code blocks/collections. |
| 54 |   subtitle: { | Starts object property block for grouped configuration/style. |
| 55 |     fontSize: 32, | Assigns a property/value pair in object/CSS context. |
| 56 |     lineHeight: 44, | Assigns a property/value pair in object/CSS context. |
| 57 |     fontWeight: 600, | Assigns a property/value pair in object/CSS context. |
| 58 |   }, | Structural syntax token delimiting code blocks/collections. |
| 59 |   link: { | Starts object property block for grouped configuration/style. |
| 60 |     lineHeight: 30, | Assigns a property/value pair in object/CSS context. |
| 61 |     fontSize: 14, | Assigns a property/value pair in object/CSS context. |
| 62 |   }, | Structural syntax token delimiting code blocks/collections. |
| 63 |   linkPrimary: { | Starts object property block for grouped configuration/style. |
| 64 |     lineHeight: 30, | Assigns a property/value pair in object/CSS context. |
| 65 |     fontSize: 14, | Assigns a property/value pair in object/CSS context. |
| 66 |     color: '#3c87f7', | Assigns a property/value pair in object/CSS context. |
| 67 |   }, | Structural syntax token delimiting code blocks/collections. |
| 68 |   code: { | Starts object property block for grouped configuration/style. |
| 69 |     fontFamily: Fonts.mono, | Assigns a property/value pair in object/CSS context. |
| 70 |     fontWeight: Platform.select({ android: 700 }) ?? 500, | Performs SQLite database connection/query/schema operation. |
| 71 |     fontSize: 12, | Assigns a property/value pair in object/CSS context. |
| 72 |   }, | Structural syntax token delimiting code blocks/collections. |
| 73 | }); | Structural syntax token delimiting code blocks/collections. |

## File: mobile\src\components\themed-view.tsx

| Line | Code | Explanation |
|---:|---|---|
| 1 | import { View, type ViewProps } from 'react-native'; | Imports a dependency/module needed in this file. |
| 2 | (blank) | Blank line for readability and section separation. |
| 3 | import { ThemeColor } from '@/constants/theme'; | Imports a dependency/module needed in this file. |
| 4 | import { useTheme } from '@/hooks/use-theme'; | Imports a dependency/module needed in this file. |
| 5 | (blank) | Blank line for readability and section separation. |
| 6 | export type ThemedViewProps = ViewProps & { | Implements file-specific logic, configuration, or structure in this context. |
| 7 |   lightColor?: string; | Statement terminator ending current instruction. |
| 8 |   darkColor?: string; | Statement terminator ending current instruction. |
| 9 |   type?: ThemeColor; | Statement terminator ending current instruction. |
| 10 | }; | Structural syntax token delimiting code blocks/collections. |
| 11 | (blank) | Blank line for readability and section separation. |
| 12 | export function ThemedView({ style, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) { | Declares and exports a named function/component. |
| 13 |   const theme = useTheme(); | Declares a JavaScript constant used in component logic. |
| 14 | (blank) | Blank line for readability and section separation. |
| 15 |   return <View style={[{ backgroundColor: theme[type ?? 'background'] }, style]} {...otherProps} />; | Returns data/control from the current function/component. |
| 16 | } | Structural syntax token delimiting code blocks/collections. |

## File: mobile\src\components\web-badge.tsx

| Line | Code | Explanation |
|---:|---|---|
| 1 | import { version } from 'expo/package.json'; | Imports a dependency/module needed in this file. |
| 2 | import { Image } from 'expo-image'; | Imports a dependency/module needed in this file. |
| 3 | import { useColorScheme, StyleSheet } from 'react-native'; | Imports a dependency/module needed in this file. |
| 4 | (blank) | Blank line for readability and section separation. |
| 5 | import { ThemedText } from './themed-text'; | Imports a dependency/module needed in this file. |
| 6 | import { ThemedView } from './themed-view'; | Imports a dependency/module needed in this file. |
| 7 | (blank) | Blank line for readability and section separation. |
| 8 | import { Spacing } from '@/constants/theme'; | Imports a dependency/module needed in this file. |
| 9 | (blank) | Blank line for readability and section separation. |
| 10 | export function WebBadge() { | Declares and exports a named function/component. |
| 11 |   const scheme = useColorScheme(); | Declares a JavaScript constant used in component logic. |
| 12 | (blank) | Blank line for readability and section separation. |
| 13 |   return ( | Returns data/control from the current function/component. |
| 14 |     <ThemedView style={styles.container}> | JSX/HTML structure line defining UI element hierarchy. |
| 15 |       <ThemedText type="code" themeColor="textSecondary" style={styles.versionText}> | JSX/HTML structure line defining UI element hierarchy. |
| 16 |         v{version} | Starts CSS selector block for related style rules. |
| 17 |       </ThemedText> | JSX/HTML structure line defining UI element hierarchy. |
| 18 |       <Image | Implements file-specific logic, configuration, or structure in this context. |
| 19 |         source={ | Implements file-specific logic, configuration, or structure in this context. |
| 20 |           scheme === 'dark' | Implements file-specific logic, configuration, or structure in this context. |
| 21 |             ? require('@/assets/images/expo-badge-white.png') | Implements file-specific logic, configuration, or structure in this context. |
| 22 |             : require('@/assets/images/expo-badge.png') | Implements file-specific logic, configuration, or structure in this context. |
| 23 |         } | Structural syntax token delimiting code blocks/collections. |
| 24 |         style={styles.badgeImage} | Implements file-specific logic, configuration, or structure in this context. |
| 25 |       /> | Implements file-specific logic, configuration, or structure in this context. |
| 26 |     </ThemedView> | JSX/HTML structure line defining UI element hierarchy. |
| 27 |   ); | Structural syntax token delimiting code blocks/collections. |
| 28 | } | Structural syntax token delimiting code blocks/collections. |
| 29 | (blank) | Blank line for readability and section separation. |
| 30 | const styles = StyleSheet.create({ | Defines React Native style object for component styling. |
| 31 |   container: { | Starts object property block for grouped configuration/style. |
| 32 |     padding: Spacing.five, | Assigns a property/value pair in object/CSS context. |
| 33 |     alignItems: 'center', | Assigns a property/value pair in object/CSS context. |
| 34 |     gap: Spacing.two, | Assigns a property/value pair in object/CSS context. |
| 35 |   }, | Structural syntax token delimiting code blocks/collections. |
| 36 |   versionText: { | Starts object property block for grouped configuration/style. |
| 37 |     textAlign: 'center', | Assigns a property/value pair in object/CSS context. |
| 38 |   }, | Structural syntax token delimiting code blocks/collections. |
| 39 |   badgeImage: { | Starts object property block for grouped configuration/style. |
| 40 |     width: 123, | Assigns a property/value pair in object/CSS context. |
| 41 |     aspectRatio: 123 / 24, | Assigns a property/value pair in object/CSS context. |
| 42 |   }, | Structural syntax token delimiting code blocks/collections. |
| 43 | }); | Structural syntax token delimiting code blocks/collections. |

## File: mobile\src\components\ui\collapsible.tsx

| Line | Code | Explanation |
|---:|---|---|
| 1 | import { SymbolView } from 'expo-symbols'; | Imports a dependency/module needed in this file. |
| 2 | import { PropsWithChildren, useState } from 'react'; | Imports a dependency/module needed in this file. |
| 3 | import { Pressable, StyleSheet } from 'react-native'; | Imports a dependency/module needed in this file. |
| 4 | import Animated, { FadeIn } from 'react-native-reanimated'; | Imports a dependency/module needed in this file. |
| 5 | (blank) | Blank line for readability and section separation. |
| 6 | import { ThemedText } from '@/components/themed-text'; | Imports a dependency/module needed in this file. |
| 7 | import { ThemedView } from '@/components/themed-view'; | Imports a dependency/module needed in this file. |
| 8 | import { Spacing } from '@/constants/theme'; | Imports a dependency/module needed in this file. |
| 9 | import { useTheme } from '@/hooks/use-theme'; | Imports a dependency/module needed in this file. |
| 10 | (blank) | Blank line for readability and section separation. |
| 11 | export function Collapsible({ children, title }: PropsWithChildren & { title: string }) { | Declares and exports a named function/component. |
| 12 |   const [isOpen, setIsOpen] = useState(false); | Statement terminator ending current instruction. |
| 13 |   const theme = useTheme(); | Declares a JavaScript constant used in component logic. |
| 14 | (blank) | Blank line for readability and section separation. |
| 15 |   return ( | Returns data/control from the current function/component. |
| 16 |     <ThemedView> | JSX/HTML structure line defining UI element hierarchy. |
| 17 |       <Pressable | Implements file-specific logic, configuration, or structure in this context. |
| 18 |         style={({ pressed }) => [styles.heading, pressed && styles.pressedHeading]} | Implements file-specific logic, configuration, or structure in this context. |
| 19 |         onPress={() => setIsOpen((value) => !value)}> | Implements file-specific logic, configuration, or structure in this context. |
| 20 |         <ThemedView type="backgroundElement" style={styles.button}> | JSX/HTML structure line defining UI element hierarchy. |
| 21 |           <SymbolView | Implements file-specific logic, configuration, or structure in this context. |
| 22 |             name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron_right' }} | Implements file-specific logic, configuration, or structure in this context. |
| 23 |             size={14} | Implements file-specific logic, configuration, or structure in this context. |
| 24 |             weight="bold" | Implements file-specific logic, configuration, or structure in this context. |
| 25 |             tintColor={theme.text} | Implements file-specific logic, configuration, or structure in this context. |
| 26 |             style={{ transform: [{ rotate: isOpen ? '-90deg' : '90deg' }] }} | Implements file-specific logic, configuration, or structure in this context. |
| 27 |           /> | Implements file-specific logic, configuration, or structure in this context. |
| 28 |         </ThemedView> | JSX/HTML structure line defining UI element hierarchy. |
| 29 | (blank) | Blank line for readability and section separation. |
| 30 |         <ThemedText type="small">{title}</ThemedText> | Implements file-specific logic, configuration, or structure in this context. |
| 31 |       </Pressable> | JSX/HTML structure line defining UI element hierarchy. |
| 32 |       {isOpen && ( | Structural syntax token delimiting code blocks/collections. |
| 33 |         <Animated.View entering={FadeIn.duration(200)}> | JSX/HTML structure line defining UI element hierarchy. |
| 34 |           <ThemedView type="backgroundElement" style={styles.content}> | JSX/HTML structure line defining UI element hierarchy. |
| 35 |             {children} | Structural syntax token delimiting code blocks/collections. |
| 36 |           </ThemedView> | JSX/HTML structure line defining UI element hierarchy. |
| 37 |         </Animated.View> | JSX/HTML structure line defining UI element hierarchy. |
| 38 |       )} | Structural syntax token delimiting code blocks/collections. |
| 39 |     </ThemedView> | JSX/HTML structure line defining UI element hierarchy. |
| 40 |   ); | Structural syntax token delimiting code blocks/collections. |
| 41 | } | Structural syntax token delimiting code blocks/collections. |
| 42 | (blank) | Blank line for readability and section separation. |
| 43 | const styles = StyleSheet.create({ | Defines React Native style object for component styling. |
| 44 |   heading: { | Starts object property block for grouped configuration/style. |
| 45 |     flexDirection: 'row', | Assigns a property/value pair in object/CSS context. |
| 46 |     alignItems: 'center', | Assigns a property/value pair in object/CSS context. |
| 47 |     gap: Spacing.two, | Assigns a property/value pair in object/CSS context. |
| 48 |   }, | Structural syntax token delimiting code blocks/collections. |
| 49 |   pressedHeading: { | Starts object property block for grouped configuration/style. |
| 50 |     opacity: 0.7, | Assigns a property/value pair in object/CSS context. |
| 51 |   }, | Structural syntax token delimiting code blocks/collections. |
| 52 |   button: { | Starts object property block for grouped configuration/style. |
| 53 |     width: Spacing.four, | Assigns a property/value pair in object/CSS context. |
| 54 |     height: Spacing.four, | Assigns a property/value pair in object/CSS context. |
| 55 |     borderRadius: 12, | Assigns a property/value pair in object/CSS context. |
| 56 |     justifyContent: 'center', | Assigns a property/value pair in object/CSS context. |
| 57 |     alignItems: 'center', | Assigns a property/value pair in object/CSS context. |
| 58 |   }, | Structural syntax token delimiting code blocks/collections. |
| 59 |   content: { | Starts object property block for grouped configuration/style. |
| 60 |     marginTop: Spacing.three, | Assigns a property/value pair in object/CSS context. |
| 61 |     borderRadius: Spacing.three, | Assigns a property/value pair in object/CSS context. |
| 62 |     marginLeft: Spacing.four, | Assigns a property/value pair in object/CSS context. |
| 63 |     padding: Spacing.four, | Assigns a property/value pair in object/CSS context. |
| 64 |   }, | Structural syntax token delimiting code blocks/collections. |
| 65 | }); | Structural syntax token delimiting code blocks/collections. |

## File: mobile\src\hooks\use-theme.ts

| Line | Code | Explanation |
|---:|---|---|
| 1 | /** | Block comment content for documentation. |
| 2 |  * Learn more about light and dark modes: | Block comment content for documentation. |
| 3 |  * https://docs.expo.dev/guides/color-schemes/ | Block comment content for documentation. |
| 4 |  */ | Block comment content for documentation. |
| 5 | (blank) | Blank line for readability and section separation. |
| 6 | import { Colors } from '@/constants/theme'; | Imports a dependency/module needed in this file. |
| 7 | import { useColorScheme } from '@/hooks/use-color-scheme'; | Imports a dependency/module needed in this file. |
| 8 | (blank) | Blank line for readability and section separation. |
| 9 | export function useTheme() { | Declares and exports a named function/component. |
| 10 |   const scheme = useColorScheme(); | Declares a JavaScript constant used in component logic. |
| 11 |   const theme = scheme === 'unspecified' ? 'light' : scheme; | Declares a JavaScript constant used in component logic. |
| 12 | (blank) | Blank line for readability and section separation. |
| 13 |   return Colors[theme]; | Returns data/control from the current function/component. |
| 14 | } | Structural syntax token delimiting code blocks/collections. |

## File: mobile\src\hooks\use-color-scheme.ts

| Line | Code | Explanation |
|---:|---|---|
| 1 | e | Implements file-specific logic, configuration, or structure in this context. |

## File: mobile\src\hooks\use-color-scheme.web.ts

| Line | Code | Explanation |
|---:|---|---|
| 1 | import { useEffect, useState } from 'react'; | Imports a dependency/module needed in this file. |
| 2 | import { useColorScheme as useRNColorScheme } from 'react-native'; | Imports a dependency/module needed in this file. |
| 3 | (blank) | Blank line for readability and section separation. |
| 4 | /** | Block comment content for documentation. |
| 5 |  * To support static rendering, this value needs to be re-calculated on the client side for web | Block comment content for documentation. |
| 6 |  */ | Block comment content for documentation. |
| 7 | export function useColorScheme() { | Declares and exports a named function/component. |
| 8 |   const [hasHydrated, setHasHydrated] = useState(false); | Statement terminator ending current instruction. |
| 9 | (blank) | Blank line for readability and section separation. |
| 10 |   useEffect(() => { | Implements file-specific logic, configuration, or structure in this context. |
| 11 |     setHasHydrated(true); | Statement terminator ending current instruction. |
| 12 |   }, []); | Structural syntax token delimiting code blocks/collections. |
| 13 | (blank) | Blank line for readability and section separation. |
| 14 |   const colorScheme = useRNColorScheme(); | Declares a JavaScript constant used in component logic. |
| 15 | (blank) | Blank line for readability and section separation. |
| 16 |   if (hasHydrated) { | Conditional branch that executes when condition is true. |
| 17 |     return colorScheme; | Returns data/control from the current function/component. |
| 18 |   } | Structural syntax token delimiting code blocks/collections. |
| 19 | (blank) | Blank line for readability and section separation. |
| 20 |   return 'light'; | Returns data/control from the current function/component. |
| 21 | } | Structural syntax token delimiting code blocks/collections. |

## File: mobile\src\constants\theme.ts

| Line | Code | Explanation |
|---:|---|---|
| 1 | /** | Block comment content for documentation. |
| 2 |  * Below are the colors that are used in the app. The colors are defined in the light and dark mode. | Block comment content for documentation. |
| 3 |  * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc. | Block comment content for documentation. |
| 4 |  */ | Block comment content for documentation. |
| 5 | (blank) | Blank line for readability and section separation. |
| 6 | import '@/global.css'; | Imports a dependency/module needed in this file. |
| 7 | (blank) | Blank line for readability and section separation. |
| 8 | import { Platform } from 'react-native'; | Imports a dependency/module needed in this file. |
| 9 | (blank) | Blank line for readability and section separation. |
| 10 | export const Colors = { | Implements file-specific logic, configuration, or structure in this context. |
| 11 |   light: { | Starts object property block for grouped configuration/style. |
| 12 |     text: '#000000', | Assigns a property/value pair in object/CSS context. |
| 13 |     background: '#ffffff', | Assigns a property/value pair in object/CSS context. |
| 14 |     backgroundElement: '#F0F0F3', | Assigns a property/value pair in object/CSS context. |
| 15 |     backgroundSelected: '#E0E1E6', | Performs SQLite database connection/query/schema operation. |
| 16 |     textSecondary: '#60646C', | Assigns a property/value pair in object/CSS context. |
| 17 |   }, | Structural syntax token delimiting code blocks/collections. |
| 18 |   dark: { | Starts object property block for grouped configuration/style. |
| 19 |     text: '#ffffff', | Assigns a property/value pair in object/CSS context. |
| 20 |     background: '#000000', | Assigns a property/value pair in object/CSS context. |
| 21 |     backgroundElement: '#212225', | Assigns a property/value pair in object/CSS context. |
| 22 |     backgroundSelected: '#2E3135', | Performs SQLite database connection/query/schema operation. |
| 23 |     textSecondary: '#B0B4BA', | Assigns a property/value pair in object/CSS context. |
| 24 |   }, | Structural syntax token delimiting code blocks/collections. |
| 25 | } as const; | Structural syntax token delimiting code blocks/collections. |
| 26 | (blank) | Blank line for readability and section separation. |
| 27 | export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark; | Statement terminator ending current instruction. |
| 28 | (blank) | Blank line for readability and section separation. |
| 29 | export const Fonts = Platform.select({ | Performs SQLite database connection/query/schema operation. |
| 30 |   ios: { | Starts object property block for grouped configuration/style. |
| 31 |     /** iOS `UIFontDescriptorSystemDesignDefault` */ | Block comment content for documentation. |
| 32 |     sans: 'system-ui', | Assigns a property/value pair in object/CSS context. |
| 33 |     /** iOS `UIFontDescriptorSystemDesignSerif` */ | Block comment content for documentation. |
| 34 |     serif: 'ui-serif', | Assigns a property/value pair in object/CSS context. |
| 35 |     /** iOS `UIFontDescriptorSystemDesignRounded` */ | Block comment content for documentation. |
| 36 |     rounded: 'ui-rounded', | Assigns a property/value pair in object/CSS context. |
| 37 |     /** iOS `UIFontDescriptorSystemDesignMonospaced` */ | Block comment content for documentation. |
| 38 |     mono: 'ui-monospace', | Assigns a property/value pair in object/CSS context. |
| 39 |   }, | Structural syntax token delimiting code blocks/collections. |
| 40 |   default: { | Starts object property block for grouped configuration/style. |
| 41 |     sans: 'normal', | Assigns a property/value pair in object/CSS context. |
| 42 |     serif: 'serif', | Assigns a property/value pair in object/CSS context. |
| 43 |     rounded: 'normal', | Assigns a property/value pair in object/CSS context. |
| 44 |     mono: 'monospace', | Assigns a property/value pair in object/CSS context. |
| 45 |   }, | Structural syntax token delimiting code blocks/collections. |
| 46 |   web: { | Starts object property block for grouped configuration/style. |
| 47 |     sans: 'var(--font-display)', | Assigns a property/value pair in object/CSS context. |
| 48 |     serif: 'var(--font-serif)', | Assigns a property/value pair in object/CSS context. |
| 49 |     rounded: 'var(--font-rounded)', | Assigns a property/value pair in object/CSS context. |
| 50 |     mono: 'var(--font-mono)', | Assigns a property/value pair in object/CSS context. |
| 51 |   }, | Structural syntax token delimiting code blocks/collections. |
| 52 | }); | Structural syntax token delimiting code blocks/collections. |
| 53 | (blank) | Blank line for readability and section separation. |
| 54 | export const Spacing = { | Implements file-specific logic, configuration, or structure in this context. |
| 55 |   half: 2, | Assigns a property/value pair in object/CSS context. |
| 56 |   one: 4, | Assigns a property/value pair in object/CSS context. |
| 57 |   two: 8, | Assigns a property/value pair in object/CSS context. |
| 58 |   three: 16, | Assigns a property/value pair in object/CSS context. |
| 59 |   four: 24, | Assigns a property/value pair in object/CSS context. |
| 60 |   five: 32, | Assigns a property/value pair in object/CSS context. |
| 61 |   six: 64, | Assigns a property/value pair in object/CSS context. |
| 62 | } as const; | Structural syntax token delimiting code blocks/collections. |
| 63 | (blank) | Blank line for readability and section separation. |
| 64 | export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0; | Performs SQLite database connection/query/schema operation. |
| 65 | export const MaxContentWidth = 800; | Statement terminator ending current instruction. |

## File: mobile\src\components\animated-icon.module.css

| Line | Code | Explanation |
|---:|---|---|
| 1 | .expoLogoBackground { | Implements file-specific logic, configuration, or structure in this context. |
| 2 |   background-image: linear-gradient(180deg, #3c9ffe, #0274df); | Assigns a property/value pair in object/CSS context. |
| 3 |   border-radius: 40px; | Assigns a property/value pair in object/CSS context. |
| 4 |   width: 128px; | Assigns a property/value pair in object/CSS context. |
| 5 |   height: 128px; | Assigns a property/value pair in object/CSS context. |
| 6 | } | Structural syntax token delimiting code blocks/collections. |


