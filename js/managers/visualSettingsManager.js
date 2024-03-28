class VisualSettingsManager {
    constructor() {
        if (!VisualSettingsManager.instance) {
            this.storageManager = new StorageManager();
            this.initialVisualSettings = this.storageManager.getData()?.visualSettings || {};
            VisualSettingsManager.instance = this;
        }
        return VisualSettingsManager.instance;
    }

    getInitialSettings() {
        return this.initialVisualSettings;
    }

    getVisualSettings() {
        return this.storageManager.getData()?.visualSettings || {};
    }

    updateSettings(updatedSettings) {
        const currentSettings = this.storageManager.getData()?.visualSettings || {};
        const newVisualSettings = { ...currentSettings, ...updatedSettings };
        this.storageManager.updateData({ visualSettings: newVisualSettings });
    }

    hasChanges() {
        const currentSettings = this.storageManager.getData()?.visualSettings || {};
        return JSON.stringify(currentSettings) !== JSON.stringify(this.initialVisualSettings);
    }

    resetToDefault() {
        this.storageManager.resetVisualSettings();
        // You may want to re-fetch the visual settings and reapply them here
        this.applyVisualSettings();
    }    

    applyVisualSettings() {
        const currentSettings = this.storageManager.getData()?.visualSettings || {};
        
        // Apply font style to the whole website
        document.documentElement.style.setProperty('--md-fab-label-text-font', currentSettings.textFont + ', system-ui' + ', sans-serif' + ', serif');

        // Apply text size to the whole website
        document.documentElement.style.setProperty('--text-size', currentSettings.textSize + 'px');
        document.documentElement.style.setProperty('--md-font-size', currentSettings.textSize + 'px');
    }

    // Updated method to apply visual settings and update the UI
    updateVisualSettingsUI() {
        this.applyVisualSettings();
        
        // Add logic to update the UI elements based on current settings
        const currentSettings = this.getVisualSettings();
        
        // Example: Update font selection dropdown
        const fontSelect = document.getElementById('font-select');
        if (fontSelect) {
            fontSelect.value = currentSettings.textFont || ''; // Update the selected font in the dropdown
        }

        // Example: Update text size slider
        const textSizeSlider = document.getElementById('text-size-slider');
        if (textSizeSlider) {
            textSizeSlider.value = currentSettings.textSize || 16; // Update the slider value
        }
    }
}

const visualSettingsManager = new VisualSettingsManager();