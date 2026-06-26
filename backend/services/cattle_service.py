"""
Cattle Service
Business logic for cattle operations
"""

from models.cattle import Cattle
from services.data_loader import get_data_loader
import threading

class CattleService:
    """Manage cattle operations"""
    
    def __init__(self):
        """Initialize cattle service"""
        self.cattle_dict = {}
        self.lock = threading.Lock()
        self.data_loader = get_data_loader()
    
    def add_cattle(self, cattle_id):
        """
        Add a cattle to the system from CSV data
        
        Args:
            cattle_id: ID of cattle to add
            
        Returns:
            Cattle object or None if failed
        """
        with self.lock:
            # Check if already exists
            if cattle_id in self.cattle_dict:
                print(f"[SERVICE] ⚠ Cattle {cattle_id} already exists")
                return None
            
            # Create from CSV data
            cattle = self.data_loader.create_cattle_from_csv(cattle_id)
            
            if cattle:
                self.cattle_dict[cattle_id] = cattle
                print(f"[SERVICE] ✓ Added cattle {cattle_id}")
                return cattle
            else:
                print(f"[SERVICE] ✗ Failed to add cattle {cattle_id}")
                return None
    
    def remove_cattle(self, cattle_id):
        """
        Remove a cattle from the system
        
        Args:
            cattle_id: ID of cattle to remove
            
        Returns:
            True if successful, False otherwise
        """
        with self.lock:
            if cattle_id in self.cattle_dict:
                del self.cattle_dict[cattle_id]
                print(f"[SERVICE] ✓ Removed cattle {cattle_id}")
                return True
            else:
                print(f"[SERVICE] ⚠ Cattle {cattle_id} not found")
                return False
    
    def get_cattle(self, cattle_id):
        """
        Get a specific cattle
        
        Args:
            cattle_id: ID of cattle
            
        Returns:
            Cattle object or None
        """
        with self.lock:
            return self.cattle_dict.get(cattle_id)
    
    def get_all_cattle(self):
        """
        Get all cattle
        
        Returns:
            List of Cattle objects
        """
        with self.lock:
            return list(self.cattle_dict.values())
    
    def get_cattle_count(self):
        """Get total number of cattle"""
        with self.lock:
            return len(self.cattle_dict)
    
    def get_all_cattle_dict(self):
        """Get cattle dictionary"""
        with self.lock:
            return dict(self.cattle_dict)
    
    def update_all_cattle(self):
        """
        Update all cattle (position, health, etc.)
        Called during simulation step
        """
        with self.lock:
            for cattle in self.cattle_dict.values():
                cattle.update_position()
                cattle.update_health()
    
    def get_cattle_list_for_api(self):
        """
        Get all cattle as dictionary list (for API response)
        
        Returns:
            List of cattle dictionaries
        """
        with self.lock:
            return [cattle.to_dict() for cattle in self.cattle_dict.values()]
    
    def get_available_cattle_ids(self):
        """
        Get list of available cattle IDs from dataset
        (for mobile app "Add Cattle" dropdown)
        
        Returns:
            List of available cattle IDs
        """
        available = self.data_loader.get_available_cows()
        current = set(self.cattle_dict.keys())
        
        # Return IDs that aren't already added
        return [cid for cid in available if cid not in current]
    
    def get_health_summary(self):
        """
        Get herd health summary
        
        Returns:
            Dictionary with health statistics
        """
        with self.lock:
            total = len(self.cattle_dict)
            if total == 0:
                return {
                    'total': 0,
                    'healthy': 0,
                    'fever': 0,
                    'lame': 0,
                    'stressed': 0,
                    'low_milk': 0
                }
            
            health_counts = {
                'healthy': 0,
                'fever': 0,
                'lame': 0,
                'stressed': 0,
                'low_milk': 0
            }
            
            for cattle in self.cattle_dict.values():
                status = cattle.health_status
                if status in health_counts:
                    health_counts[status] += 1
            
            return {
                'total': total,
                **health_counts
            }
    
    def get_alerts(self):
        """
        Get all current health alerts
        
        Returns:
            List of alert dictionaries
        """
        alerts = []
        
        with self.lock:
            for cattle in self.cattle_dict.values():
                if cattle.health_status != 'healthy':
                    alerts.append({
                        'cattle_id': cattle.cattle_id,
                        'type': cattle.health_status.upper(),
                        'severity': 'critical' if cattle.health_status == 'fever' else 'warning',
                        'value': cattle.temperature if cattle.health_status == 'fever' else cattle.heart_rate,
                        'timestamp': cattle.last_updated
                    })
        
        return alerts


# Global instance
_cattle_service = None

def get_cattle_service():
    """Get or create global cattle service instance"""
    global _cattle_service
    if _cattle_service is None:
        _cattle_service = CattleService()
    return _cattle_service