# VirtualHerd+ Viva Flashcards

Use this as rapid Q/A practice. Read the question, pause, answer aloud, then check the model answer.

## Backend and API Flashcards

1. Q: Why did you use both REST and Socket.IO?
A: REST is for explicit CRUD operations (add/remove cattle, paddocks, schedules). Socket.IO is for continuous real-time updates (cattle movement, alerts, schedule activation). This gives clean separation between command operations and live streaming state.

2. Q: What happens when backend starts?
A: It initializes Flask + Socket.IO, loads ML artifacts if available, initializes/migrates SQLite tables, restores active cattle from DB, starts schedule checker thread, and waits for API and WebSocket events.

3. Q: What are the main backend tables?
A: farmer_paddocks, active_cattle, schedules.

4. Q: What is stored in farmer_paddocks?
A: id, name, points (JSON polygon), cattle_ids (JSON list), status, grass_quality, created timestamp.

5. Q: What is stored in active_cattle?
A: cattle_id and added_at timestamp. It is used for persistence across restart.

6. Q: What is stored in schedules?
A: schedule id, target paddock id/name, cattle list, start/end time, notes, created, and activated flag.

7. Q: Which endpoint returns all cattle?
A: GET /api/cattle.

8. Q: Which endpoint adds cattle?
A: POST /api/cattle with JSON { "cattle_id": <id> }.

9. Q: Which endpoint returns available dataset cattle IDs?
A: GET /api/cattle/available.

10. Q: Which endpoints manage paddocks?
A: GET/POST /api/farmer/paddocks, POST /api/farmer/paddocks/<id>/assign, DELETE /api/farmer/paddocks/<id>.

11. Q: Which endpoints manage schedules?
A: GET/POST /api/farmer/schedules, DELETE /api/farmer/schedules/<id>.

12. Q: Which endpoint gives overall runtime metadata?
A: GET /api/status.

13. Q: How is thread safety handled for in-memory herd data?
A: CattleService wraps cattle dictionary access with a threading.Lock.

14. Q: What does simulation loop run frequency mean in this project?
A: It updates once per second (time.sleep(1)), so clients get near-real-time state.

15. Q: What triggers fence breach alerts?
A: If cattle is outside polygon or step crosses polygon boundary, alert type FENCE_BREACH is generated and emitted.

16. Q: How does backend recover from ML model loading failure?
A: It falls back to rule-based health classification.

## Geometry and Workflow Flashcards

17. Q: What algorithm is used for fence inclusion check?
A: Ray casting point-in-polygon algorithm.

18. Q: Why are map coordinates normalized from 0 to 100?
A: It keeps simulation UI-independent and easy to scale to mobile/web canvas sizes.

19. Q: How is cattle spawn behavior implemented on add?
A: Usually inside active paddock, but sometimes intentionally outside for breach detection demo/testing.

20. Q: How are polygons represented in DB/API?
A: List of points, each point as object with x and y.

21. Q: What is schedule activation flow?
A: schedule_checker_loop checks due schedules, marks other paddocks available, assigns target paddock herd, sets activated=1, emits schedule_activated.

22. Q: Why is schedule checker interval short?
A: It uses a fast interval for demo responsiveness.

23. Q: What is a full user workflow example?
A: Add cattle -> draw paddock -> assign cattle -> start simulation -> monitor live alerts -> schedule move -> auto-activation event.

## ML and Data Flashcards

24. Q: What does Phase1_ML_Training.py do?
A: Loads CSV, engineers features, pseudo-labels behavior, train/test split, trains RandomForest, evaluates, and saves model artifacts.

25. Q: Which model is trained in script?
A: RandomForestClassifier.

26. Q: Which artifacts are saved?
A: behavior_classifier.pkl, label_encoder.pkl, feature_list.pkl.

27. Q: Where are artifacts stored?
A: backend/ml_models.

28. Q: How many dataset rows are used?
A: 96,702 data rows (96,703 total lines including header).

29. Q: What are main dataset column groups?
A: collars_*, gps_*, training_*, health_*.

30. Q: How are labels produced in training?
A: Using rule-based assign_behavior logic from thresholds on temp, heart rate, activity, milk.

31. Q: Why should you discuss pseudo-label limitations?
A: Because generated labels can inflate reported accuracy and may not represent field-ground-truth behavior.

32. Q: How is inference done in app.py?
A: Build feature vector, pad/truncate to expected size, model predict + predict_proba, decode label.

33. Q: What fallback health rules are used?
A: Fever if temp high, stress if heart rate high, hypothermia if temp low, otherwise healthy.

34. Q: One honest ML improvement you can propose?
A: Use expert-annotated labels and time-series sequence models for real behavior transitions.

## Frontend and Client Flashcards

35. Q: What is the production mobile app in this repo?
A: mobile2/App.js.

36. Q: Why is mobile folder different?
A: mobile is an Expo template/starter structure; mobile2 contains operational project UI logic.

37. Q: Which library is used for HTTP in mobile2?
A: axios.

38. Q: Which library is used for real-time in mobile2 and web?
A: socket.io-client.

39. Q: How many major tabs are in mobile2?
A: Map, Cattle, Draw Fence, Paddocks, Schedule, Health.

40. Q: What does web/dashboard.html provide?
A: Live map rendering on canvas, health/paddock/schedule views, and socket-driven updates.

## Risk and Improvement Flashcards

41. Q: Mention one configuration risk.
A: Backend URL is hardcoded in mobile2, which can fail when IP/network changes.

42. Q: Mention one data consistency risk.
A: Health status casing mismatch (uppercase vs lowercase) can affect summary counting.

43. Q: Mention one metadata inconsistency.
A: Status endpoint mentions ensemble while training script currently builds RandomForest.

44. Q: Security gap to mention?
A: No authentication/authorization layer yet on APIs and sockets.

45. Q: Testing gap to mention?
A: Need automated tests for geometry, schedule activation, API responses, and socket event contracts.

46. Q: Scalability gap to mention?
A: In-memory state and local SQLite are ideal for prototype but should move to distributed services for production.

## Rapid Fire One-Liners

47. Q: Project goal in one line?
A: Real-time smart cattle monitoring with virtual fencing and scheduled pasture control.

48. Q: Core backend stack?
A: Flask, Flask-SocketIO, SQLite, pandas, scikit-learn.

49. Q: Core client stack?
A: React Native Expo (mobile2) and vanilla web dashboard with Socket.IO.

50. Q: Most demo-worthy feature?
A: Live fence breach detection with instant alert propagation to mobile and web.

## 2-Minute Self-Test Script

- Explain architecture in 20 seconds.
- Explain one full API flow in 20 seconds.
- Explain fence breach logic in 20 seconds.
- Explain ML training and limitations in 20 seconds.
- Explain one risk and one improvement in 20 seconds.
- Close with impact statement in 20 seconds.

If you can answer all 6 smoothly, you are ready for the final review.