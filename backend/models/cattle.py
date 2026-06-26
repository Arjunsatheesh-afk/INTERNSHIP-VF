"""
Cattle Data Model
Represents a single dairy cow with all attributes
"""

from datetime import datetime
import random
import math

class Cattle:
    """
    Dairy cattle object with real-world attributes
    Initialized with data from CSV
    """
    
    def __init__(self, cattle_id, csv_row=None):
        """
        Initialize cattle with optional CSV data
        
        Args:
            cattle_id: Unique identifier
            csv_row: Dictionary from CSV (optional)
        """
        self.cattle_id = cattle_id
        
        # Position (simulated farm coordinates 0-100)
        self.x = random.uniform(20, 80)
        self.y = random.uniform(20, 80)
        self.heading = random.uniform(0, 360)
        self.speed = random.uniform(0.3, 0.8)
        
        # Behavior (from ML model)
        self.behavior = "GRZ"  # Will be updated by ML predictions
        self.behavior_confidence = 0.85
        
        # Health metrics (from CSV or defaults)
        if csv_row:
            self.temperature = float(csv_row.get('collars_Temperature', 38.5))
            self.heart_rate = int(csv_row.get('health_heart_rate_(BPM)', 80))
            self.heat_stress = float(csv_row.get('health_heat_stress_(°C)', 0))
            self.milk_production = float(csv_row.get('training_milk_production_lpd', 24.0))
            self.pulse_freq = float(csv_row.get('training_paddock_pulse_freq_per_day', 5.0))
            self.sound_freq = float(csv_row.get('training_paddock_sound_freq_per_day', 20.0))
            self.pulse_sound_ratio = float(csv_row.get('training_paddock_pulse_sound_ratio', 0.22))
        else:
            self.temperature = 38.5
            self.heart_rate = 80
            self.heat_stress = 0.0
            self.milk_production = 24.0
            self.pulse_freq = 5.0
            self.sound_freq = 20.0
            self.pulse_sound_ratio = 0.22
        
        # Status
        self.health_status = "healthy"
        self.lameness = False
        self.lying = False
        self.lying_duration = 0
        self.last_alert = None
        self.pulse_count_today = 0
        self.sound_count_today = 0
        self.activity = 3
        
        # Metadata
        self.created_at = datetime.now().isoformat()
        self.last_updated = datetime.now().isoformat()
    
    def update_position(self):
        """Update cattle position (movement simulation)"""
        # Random heading change
        self.heading += random.uniform(-15, 15)
        if self.heading > 360:
            self.heading -= 360
        if self.heading < 0:
            self.heading += 360
        
        # Calculate new position
        rad = math.radians(self.heading)
        self.x += self.speed * math.cos(rad) * 0.1
        self.y += self.speed * math.sin(rad) * 0.1
        
        # Keep within bounds
        if self.x < 0:
            self.x = 0
            self.heading = 180 - self.heading
        if self.x > 100:
            self.x = 100
            self.heading = 180 - self.heading
        if self.y < 0:
            self.y = 0
            self.heading = -self.heading
        if self.y > 100:
            self.y = 100
            self.heading = -self.heading
    
    def update_health(self):
        """Update health metrics"""
        # Temperature fluctuation
        self.temperature = max(37.5, min(41.0, self.temperature + random.uniform(-0.5, 0.5)))
        
        # Heart rate fluctuation
        self.heart_rate = max(60, min(120, self.heart_rate + random.randint(-5, 5)))
        
        # Milk production variation
        self.milk_production = max(15, min(35, self.milk_production + random.uniform(-0.5, 0.5)))
        
        # Determine health status
        if self.temperature > 39.5:
            self.health_status = "fever"
        elif self.heart_rate > 100:
            self.health_status = "stressed"
        elif self.milk_production < 18:
            self.health_status = "low_milk"
        elif random.random() < 0.05:
            self.health_status = "lame"
            self.lameness = True
        else:
            self.health_status = "healthy"
            self.lameness = False
        
        # Lying/standing
        if random.random() < 0.05:
            self.lying = not self.lying
        
        self.last_updated = datetime.now().isoformat()
    
    def to_dict(self):
        """Convert to dictionary for JSON response"""
        return {
            'cattle_id': self.cattle_id,
            'x': round(self.x, 2),
            'y': round(self.y, 2),
            'heading': round(self.heading, 1),
            'behavior': self.behavior,
            'confidence': round(self.behavior_confidence, 3),
            'temperature': round(self.temperature, 1),
            'heart_rate': self.heart_rate,
            'milk_production': round(self.milk_production, 1),
            'health_status': self.health_status,
            'lameness': self.lameness,
            'lying': self.lying,
            'pulse_freq': round(self.pulse_freq, 2),
            'sound_freq': round(self.sound_freq, 2),
            'pulse_count_today': self.pulse_count_today,
            'sound_count_today': self.sound_count_today,
            'created_at': self.created_at,
            'last_updated': self.last_updated
        }