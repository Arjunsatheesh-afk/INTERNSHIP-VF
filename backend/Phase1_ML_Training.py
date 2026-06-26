"""
VIRTUALHERD+ ML MODEL TRAINING
Train behavior classifier from CSV data
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

print("\n" + "="*80)
print("VIRTUALHERD+ - ML MODEL TRAINING PHASE")
print("="*80)

# ============================================================================
# LOAD DATA
# ============================================================================

csv_path = Path('data/combined_virtual_fencing_dataset.csv')
print(f"\n[TRAIN] Loading CSV: {csv_path}")

df = pd.read_csv(csv_path)
print(f"[TRAIN] ✓ Loaded {len(df)} rows")
print(f"[TRAIN] Columns: {len(df.columns)}")

# ============================================================================
# FEATURE ENGINEERING
# ============================================================================

print(f"\n[TRAIN] Engineering features from cattle metrics...")

# Create synthetic behavior labels based on activity patterns
# 14 behavior classes matching real cattle behavior
behaviors = [
    'ETC',  # Eating
    'RES',  # Resting
    'RUS',  # Ruminating (standing)
    'MOV',  # Movement
    'GRZ',  # Grazing
    'SLT',  # Sleeping/Lying
    'FES',  # Feeding (supplementary)
    'DRN',  # Drinking
    'LCK',  # Licking
    'REL',  # Social/Relief behaviors
    'URI',  # Urinating
    'ATT',  # Attention/Alert
    'ESC',  # Escaping/Running
    'BMN'   # Begging/Missing behavior
]

# Extract features for ML model
def create_features(row):
    """Create feature vector from row data"""
    try:
        # Numeric features from CSV
        temp = float(row.get('collars_Temperature', 38.5))
        hr = float(row.get('health_heart_rate_(BPM)', 80))
        activity = float(row.get('GPS_Activity', 3))
        milk = float(row.get('training_milk_production_lpd', 24))
        pulse_freq = float(row.get('training_paddock_pulse_freq_per_day', 5))
        sound_freq = float(row.get('training_paddock_sound_freq_per_day', 20))
        
        # Create derived features
        activity_level = activity / 10.0
        temp_deviation = abs(temp - 38.5)
        hr_stress = max(0, hr - 80) / 40.0
        milk_stress = max(0, 24 - milk) / 10.0
        pulse_sound_ratio = pulse_freq / (sound_freq + 0.1)
        
        return [activity_level, temp_deviation, hr_stress, milk_stress, 
                pulse_sound_ratio, temp, hr, milk, pulse_freq, sound_freq,
                activity, sound_freq * activity_level]
    except:
        return [0] * 12

def assign_behavior(row):
    """Assign behavior label based on metrics"""
    try:
        temp = float(row.get('collars_Temperature', 38.5))
        hr = float(row.get('health_heart_rate_(BPM)', 80))
        activity = float(row.get('GPS_Activity', 3))
        milk = float(row.get('training_milk_production_lpd', 24))
        
        # Decision tree logic for behavior classification
        if hr > 100:
            return 'ESC'  # High HR = Running/Escaping
        elif temp > 39.5:
            return 'RES'  # High temp = Resting
        elif activity > 7:
            return 'MOV'  # High activity = Movement
        elif activity > 5:
            return 'GRZ'  # Medium activity = Grazing
        elif activity < 2:
            return 'SLT'  # Low activity = Sleeping/Lying
        elif hr < 70:
            return 'DRN'  # Low HR = Drinking/Calm
        elif milk < 18:
            return 'RUS'  # Low milk = Ruminating
        else:
            return 'RES'  # Default = Resting
    except:
        return 'GRZ'

print("[TRAIN] Creating features and labels...")

# Create feature matrix
X = []
y = []

for idx, row in df.iterrows():
    features = create_features(row)
    behavior = assign_behavior(row)
    X.append(features)
    y.append(behavior)
    
    if (idx + 1) % 10000 == 0:
        print(f"  Processed {idx + 1}/{len(df)} rows")

X = np.array(X)
y = np.array(y)

print(f"[TRAIN] ✓ Created {len(X)} feature vectors")
print(f"[TRAIN] ✓ Assigned {len(y)} behavior labels")

# ============================================================================
# LABEL ENCODING
# ============================================================================

print(f"\n[TRAIN] Encoding behavior labels...")

label_encoder = LabelEncoder()
y_encoded = label_encoder.fit_transform(y)

print(f"[TRAIN] ✓ Encoded {len(label_encoder.classes_)} unique behaviors:")
for idx, behavior in enumerate(label_encoder.classes_):
    count = np.sum(y == behavior)
    print(f"  {behavior}: {count} samples ({count/len(y)*100:.1f}%)")

# ============================================================================
# TRAIN TEST SPLIT
# ============================================================================

print(f"\n[TRAIN] Splitting data (80% train, 20% test)...")

X_train, X_test, y_train, y_test = train_test_split(
    X, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
)

print(f"[TRAIN] ✓ Training set: {len(X_train)} samples")
print(f"[TRAIN] ✓ Test set: {len(X_test)} samples")

# ============================================================================
# TRAIN RANDOM FOREST
# ============================================================================

print(f"\n[TRAIN] Training Random Forest Classifier...")
print(f"[TRAIN] Parameters: n_estimators=200, max_depth=15, random_state=42")

model = RandomForestClassifier(
    n_estimators=200,
    max_depth=15,
    min_samples_split=5,
    min_samples_leaf=2,
    random_state=42,
    n_jobs=-1,
    verbose=1
)

model.fit(X_train, y_train)
print(f"[TRAIN] ✓ Model training complete!")

# ============================================================================
# EVALUATE MODEL
# ============================================================================

print(f"\n[TRAIN] Evaluating model...")

# Training accuracy
train_pred = model.predict(X_train)
train_acc = accuracy_score(y_train, train_pred)
print(f"[TRAIN] Training Accuracy: {train_acc*100:.2f}%")

# Test accuracy
test_pred = model.predict(X_test)
test_acc = accuracy_score(y_test, test_pred)
print(f"[TRAIN] ✓ Test Accuracy: {test_acc*100:.2f}%")

print(f"\n[TRAIN] Classification Report:")
print(classification_report(y_test, test_pred, target_names=label_encoder.classes_))

# ============================================================================
# FEATURE IMPORTANCE
# ============================================================================

print(f"\n[TRAIN] Feature Importance (Top 5):")

feature_names = [
    'activity_level', 'temp_deviation', 'hr_stress', 'milk_stress', 
    'pulse_sound_ratio', 'temperature', 'heart_rate', 'milk_production',
    'pulse_freq', 'sound_freq', 'activity', 'sound_activity_interaction'
]

importances = model.feature_importances_
indices = np.argsort(importances)[::-1]

for i in range(min(5, len(feature_names))):
    idx = indices[i]
    print(f"  {i+1}. {feature_names[idx]}: {importances[idx]:.4f}")

# ============================================================================
# SAVE MODEL
# ============================================================================

print(f"\n[TRAIN] Saving trained model...")

models_dir = Path('ml_models')
models_dir.mkdir(exist_ok=True)

# Save model
model_path = models_dir / 'behavior_classifier.pkl'
joblib.dump(model, model_path)
print(f"[TRAIN] ✓ Saved: {model_path}")

# Save label encoder
encoder_path = models_dir / 'label_encoder.pkl'
joblib.dump(label_encoder, encoder_path)
print(f"[TRAIN] ✓ Saved: {encoder_path}")

# Save feature list
features_path = models_dir / 'feature_list.pkl'
joblib.dump(feature_names, features_path)
print(f"[TRAIN] ✓ Saved: {features_path}")

# ============================================================================
# SUMMARY
# ============================================================================

print(f"\n" + "="*80)
print(f"TRAINING COMPLETE!")
print(f"="*80)
print(f"\n✓ Model Accuracy: {test_acc*100:.2f}%")
print(f"✓ Behaviors: {len(label_encoder.classes_)}")
print(f"✓ Training Samples: {len(X_train)}")
print(f"✓ Test Samples: {len(X_test)}")
print(f"\n✓ Model saved to: {model_path}")
print(f"✓ Label encoder saved to: {encoder_path}")
print(f"✓ Feature list saved to: {features_path}")
print(f"\n✓ Ready to use in app.py!")
print(f"="*80 + "\n")