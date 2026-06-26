"""
CSV Data Loader Service
Loads cattle data from combined_virtual_fencing_dataset.csv
"""

import pandas as pd
from pathlib import Path
from models.cattle import Cattle

class DataLoader:
    """Load and parse CSV data for cattle initialization"""
    
    def __init__(self, csv_path=None):
        """
        Initialize data loader
        
        Args:
            csv_path: Path to CSV file (optional)
        """
        if csv_path is None:
            # Default path relative to backend folder
            csv_path = Path(__file__).parent.parent / 'data' / 'combined_virtual_fencing_dataset.csv'
        
        self.csv_path = csv_path
        self.df = None
        self.unique_cows = []
    
    def load_csv(self):
        """Load CSV file into pandas DataFrame"""
        try:
            print(f"[DATA] Loading CSV: {self.csv_path}")
            self.df = pd.read_csv(self.csv_path)
            print(f"[DATA] ✓ CSV loaded: {len(self.df)} rows")
            return True
        except Exception as e:
            print(f"[DATA] ✗ Error loading CSV: {e}")
            return False
    
    def get_unique_cows(self):
        """Get list of unique cattle IDs from CSV"""
        if self.df is None:
            return []
        
        try:
            # Get unique cow IDs from the 'training_cow_id' column
            unique_ids = self.df['training_cow_id'].dropna().unique()
            self.unique_cows = sorted([int(x) for x in unique_ids])
            print(f"[DATA] ✓ Found {len(self.unique_cows)} unique cattle in dataset")
            return self.unique_cows
        except Exception as e:
            print(f"[DATA] ✗ Error getting unique cows: {e}")
            return []
    
    def get_cow_data(self, cow_id):
        """
        Get data for specific cow from CSV
        
        Args:
            cow_id: Cattle ID to fetch
            
        Returns:
            Dictionary with cow data or None
        """
        if self.df is None:
            return None
        
        try:
            cow_data = self.df[self.df['training_cow_id'] == cow_id]
            if len(cow_data) > 0:
                # Return first row as dictionary
                return cow_data.iloc[0].to_dict()
            return None
        except Exception as e:
            print(f"[DATA] ✗ Error getting cow data: {e}")
            return None
    
    def create_cattle_from_csv(self, cattle_id):
        """
        Create Cattle object with real data from CSV
        
        Args:
            cattle_id: ID of cattle to create
            
        Returns:
            Cattle object or None
        """
        cow_data = self.get_cow_data(cattle_id)
        
        try:
            cattle = Cattle(cattle_id, csv_row=cow_data)
            return cattle
        except Exception as e:
            print(f"[DATA] ✗ Error creating cattle object: {e}")
            return None
    
    def initialize_cattle_dict(self, cattle_ids):
        """
        Initialize dictionary of Cattle objects
        
        Args:
            cattle_ids: List of cattle IDs to initialize
            
        Returns:
            Dictionary {cattle_id: Cattle object}
        """
        cattle_dict = {}
        
        print(f"[DATA] Initializing {len(cattle_ids)} cattle...")
        
        for cattle_id in cattle_ids:
            cattle = self.create_cattle_from_csv(cattle_id)
            if cattle:
                cattle_dict[cattle_id] = cattle
            else:
                print(f"[DATA] ⚠ Failed to create cattle {cattle_id}")
        
        print(f"[DATA] ✓ Created {len(cattle_dict)} cattle objects")
        return cattle_dict
    
    def get_available_cows(self):
        """
        Get list of available cows from dataset (for mobile app dropdown)
        
        Returns:
            List of cattle IDs available to add
        """
        return self.unique_cows
    
    def get_dataset_summary(self):
        """Get summary statistics of dataset"""
        if self.df is None:
            return {}
        
        return {
            'total_rows': len(self.df),
            'unique_cows': len(self.unique_cows),
            'columns': list(self.df.columns),
            'date_range': f"{self.df['collars_Time'].min()} to {self.df['collars_Time'].max()}"
        }


# Global instance
_data_loader = None

def get_data_loader():
    """Get or create global data loader instance"""
    global _data_loader
    if _data_loader is None:
        _data_loader = DataLoader()
        _data_loader.load_csv()
        _data_loader.get_unique_cows()
    return _data_loader