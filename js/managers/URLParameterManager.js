class URLParameterManager {
    constructor() {
        this.urlParams = new URLSearchParams(window.location.search);
        this.debounceTimer = null; // Initialize debounce timer
    }

    // Method to parse URL parameters and update settings accordingly
    parseURLParameters() {
        const visualParams = ['textFont', 'textSize']; // List of visual-related parameters
        visualParams.forEach(param => {
            const paramValue = this.getParameterValue(param);
            if (paramValue) {
                // Update the visual settings in local storage based on the URL parameter
                storageManager.updateData({ visualSettings: { [param]: paramValue } });
            }
        });

        const trainerParams = ['totalNumTargets', 'numTargetsOnScreen', 'trainerTypeMode', 'time',
                                'displayEncouragement', 'encouragementMessages', 'staticTarget', 'movingTarget',
                                'targetSize', 'targetColor', 'targetShape', 'scoreTypeMode', 
                                'successfulHitScore', 'unsuccessfulHitScore', 'image']; // List of trainer-related parameters
    
        trainerParams.forEach(param => {
            const paramValue = this.getParameterValue(param);
            if (paramValue) {
                // Update the trainer settings in local storage based on the URL parameter
                storageManager.updateData({ trainerSettings: { [param]: paramValue } });
            }
        });
    }

     // Method to get all URL parameters as an object
     getURLParameters() {
        const params = {};
        for (const [key, value] of this.urlParams.entries()) {
            params[key] = value;
        }
        return params;
    }

    // Method to get a specific parameter value from the URL
    getParameterValue(paramName) {
        return this.urlParams.get(paramName);
    }
    
    // Method to set or update a parameter value in the URL
    setParameterValue(paramName, paramValue) {
        this.urlParams.set(paramName, paramValue);
    }

    // Method to remove a parameter from the URL
    removeParameter(paramName) {
        this.urlParams.delete(paramName);
    }

    // Debounced method to update the URL with the current parameters
    updateURL() {
        clearTimeout(this.debounceTimer); // Clear the existing timer
        this.debounceTimer = setTimeout(() => {
            history.replaceState(null, null, `?${this.urlParams.toString()}`);
        }, 300); // Set a new timer with a 300ms delay
    }

    clearTabParameters(tabName) {
        // Customize this based on your specific tab parameters
        const tabParams = ['param1', 'param2']; // Add your tab parameters here
        tabParams.forEach(param => this.urlParams.delete(`${tabName}_${param}`));
    }

    clearVisualParameters() {
        // List all visual-related parameters
        const visualParams = ['textFont', 'textSize'];
        visualParams.forEach(param => this.urlParams.delete(param));
    }

    async resetVisualURLParameters() {
        this.clearVisualParameters(); // Clear visual parameters before setting new ones
        const defaults = await storageManager.fetchDefaultSettings();
        if (defaults && defaults.visualSettings) {
            Object.entries(defaults.visualSettings).forEach(([key, value]) => {
                this.urlParams.set(`${key}`, value.toString());
            });
            this.updateURL();
        }
    }

     // Method to reset URL parameters for a specific tab
     async resetTabURLParameters(tabName) {
        this.clearTabParameters(tabName); // Clear tab parameters before setting new ones
        const defaults = await storageManager.fetchDefaultSettings();
        if (defaults && defaults[`${tabName}Settings`]) {
            Object.entries(defaults[`${tabName}Settings`]).forEach(([key, value]) => {
                // Flatten nested objects or arrays as needed
                this.urlParams.set(`${tabName}_${key}`, JSON.stringify(value));
            });
            this.updateURL();
        }
    }
}

const urlParameterManager = new URLParameterManager();
