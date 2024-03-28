// Singleton Storage Manager for JSON data and Local Storage
class StorageManager {
  constructor() {
    if (!StorageManager.instance) {
      this.dataKey = 'preferences'; // Change 'preferences' to your preferred key
      this.loadDefaultSettings();
      StorageManager.instance = this;
    }

    return StorageManager.instance;
  }

  // Get JSON data from local storage
  getData() {
    const storedData = localStorage.getItem(this.dataKey);
    return storedData ? JSON.parse(storedData) : null;
  }

  // Store JSON data in local storage
  setData(data) {
    localStorage.setItem(this.dataKey, JSON.stringify(data));
  }

  // Update JSON data in local storage
  updateData(updatedData) {
    const currentData = this.getData();
    if (currentData) {
        Object.keys(updatedData).forEach(key => {
            currentData[key] = { ...currentData[key], ...updatedData[key] };
        });
        this.setData(currentData);
        return true;
    }
    return false; // No existing data to update
  }

  // Reset JSON data in local storage
  resetData() {
    //localStorage.removeItem(this.dataKey);
    this.clearLocalStorage();
    this.loadDefaultSettings();
  }

  // Load default settings from config.json to local storage if not present
  loadDefaultSettings() {
    const storedData = this.getData();
    if (!storedData) {
      fetch('./json/config.json') // Change 'config.json' to the path of your default settings file
        .then(response => response.json())
        .then(defaultSettings => {
          this.setData(defaultSettings);
        })
        .catch(error => {
          console.error('Error loading default settings:', error);
        });
    }
  }

  // Other functions as needed...
   // Method to reset visual settings to default
   resetVisualSettings() {
    this.fetchDefaultSettings().then(defaultSettings => {
        if (defaultSettings.visualSettings) {
            this.updateData({ visualSettings: defaultSettings.visualSettings });
        }
    });
  }

  // Method to reset trainer settings to default
  resetTrainerSettings() {
      this.fetchDefaultSettings().then(defaultSettings => {
          if (defaultSettings.trainerSettings) {
              this.updateData({ trainerSettings: defaultSettings.trainerSettings });
          }
      });
  }

  // Helper method to fetch default settings from config.json
  fetchDefaultSettings() {
      return fetch('./json/config.json') // Adjust the path as necessary
          .then(response => response.json())
          .catch(error => console.error('Error loading default settings:', error));
  }
  

  // Example function to clear all local storage (use with caution)
  clearLocalStorage() {
    localStorage.clear();
  }
}

// Create a singleton instance of the StorageManager
const storageManager = new StorageManager();

//   // Usage example:
//   // Get stored data
//   const storedData = storageManager.getData();
//   console.log('Stored Data:', storedData);

//   // Update stored data
//   const updatedData = { someKey: 'newValue' };
//   storageManager.updateData(updatedData);

//   // Reset stored data and load default settings
//   // storageManager.resetData();
