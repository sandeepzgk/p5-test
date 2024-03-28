class TrainerSettingsManager{
    constructor() {
        if (!TrainerSettingsManager.instance) {
            this.storageManager = new StorageManager();
            this.initialTrainerSettings = this.storageManager.getData()?.trainerSettings || {};
            TrainerSettingsManager.instance = this;
        }
        return TrainerSettingsManager.instance;
    }

    getInitialSettings() {
        return this.initialTrainerSettings;
    }

    getTrainerSettings() {
        return this.storageManager.getData()?.trainerSettings || {};
    }

    updateSettings(updatedSettings) {
        const currentSettings = this.storageManager.getData()?.trainerSettings || {};
        const newTrainerSettings = { ...currentSettings, ...updatedSettings };
        this.storageManager.updateData({ trainerSettings: newTrainerSettings });
    }

    hasChanges() {
        const currentSettings = this.storageManager.getData()?.trainerSettings || {};
        return JSON.stringify(currentSettings) !== JSON.stringify(this.initialTrainerSettings);
    }

    resetToDefault() {
        this.storageManager.resetTrainerSettings();
        // You may want to re-fetch the trainer settings and reapply them here
        this.updateTrainerSettingsUI();
    }

    updateTrainerSettingsUI() {
        const currentSettings = this.getTrainerSettings();

        // Example: Update total targets slider
        const totalTargetsSlider = document.getElementById('total-targets-slider');
        if (totalTargetsSlider) {
            totalTargetsSlider.value = currentSettings.totalNumTargets; // Update the value of the slider
        }

        // Example: Update targets on screen slider
        const targetsOnScreenSlider = document.getElementById('targets-on-screen-slider');
        if (targetsOnScreenSlider) {
            targetsOnScreenSlider.value = currentSettings.numTargetsOnScreen; // Update the value of the slider
            // set max value of numTargetsOnScreen slider to current value of totalNumTargets
            targetsOnScreenSlider.setAttribute('max', currentSettings.totalNumTargets);
        }

        // Example: Update trainer type mode radio buttons
        const timedModeButton = document.getElementById('timed-button');
        const unlimitedTimeModeButton = document.getElementById('unlimited-time-button');

        if (timedModeButton && unlimitedTimeModeButton) {
            timedModeButton.checked = currentSettings.trainerType.mode == 'timed';
            unlimitedTimeModeButton.checked = currentSettings.trainerType.mode == 'unlimited-time';
        }

        // Example: Update time slider
        const timeSlider = document.getElementById('time-slider');
        if (timeSlider) {
            timeSlider.value = currentSettings.trainerType.time;
        }

        // Example: Update encouragement checkbox
        const encouragementCheckbox = document.getElementById('display-encouragement');
        if (encouragementCheckbox) {
            encouragementCheckbox.checked = currentSettings.encouragement.display;
        }

        // Example: Update encouragement messages textbox
        const encouragementMessagesTextbox = document.getElementById('encouragementMessagesTextarea');
        if (encouragementMessagesTextbox) {
            encouragementMessagesTextbox.value = currentSettings.encouragement.messages;
        }

        // Example: Update target mode
        const targetMode = document.getElementById('target-mode-select');
        if (targetMode) {
            targetMode.value = currentSettings.targets.targetMode;
        }

        // Example: Update static target checkbox
        const staticTargetCheckbox = document.getElementById('static-target');
        if (staticTargetCheckbox) {
            staticTargetCheckbox.checked = currentSettings.targets.static;
        }

        // Example: Update moving target checkbox
        const movingTargetCheckbox = document.getElementById('moving-target');
        if (movingTargetCheckbox) {
            movingTargetCheckbox.checked = currentSettings.targets.moving;
        }

        if(currentSettings.targets.static == false && currentSettings.targets.moving == false){
            currentSettings.targets.static = true;
            staticTargetCheckbox.checked = currentSettings.targets.static;
            this.updateSettings({
                targets: {
                    ...currentSettings.targets,
                    static: staticTarget,
                },
            });
        }

        // Example: Update target size slider
        const targetSizeSlider = document.getElementById('target-size-slider');
        if (targetSizeSlider) {
            targetSizeSlider.value = currentSettings.targets.size;
        }

        // Example: Update target speed slider
        const targetSpeedSlider = document.getElementById('target-speed-slider');
        if (targetSpeedSlider) {
            targetSpeedSlider.value = currentSettings.targets.speed;
        }

        // Example: Update target color picker
        const targetColorPicker = document.getElementById('target-color-select');
        if (targetColorPicker) {
            targetColorPicker.value = currentSettings.targets.color;
        }

        // Example: Update target shape picker
        const targetShapePicker = document.getElementById('target-shape-select');
        if (targetShapePicker) {
            targetShapePicker.value = currentSettings.targets.shape;
        }

        // Example: Update score type mode radio buttons
        const scoredModeButton = document.getElementById('scored-button');
        const nonScoredModeButton = document.getElementById('non-scored-button');

        if (scoredModeButton && nonScoredModeButton) {
            scoredModeButton.checked = currentSettings.scoring.mode == 'scored';
            nonScoredModeButton.checked = currentSettings.scoring.mode == 'non-scored';
        }

        // Example: Update successful hit score slider
        const successfulHitScoreSlider = document.getElementById('successful-hit-score-slider');
        if (successfulHitScoreSlider) {
            successfulHitScoreSlider.value = currentSettings.scoring.successfulHit;
        }

        // Example: Update unsuccessful hit score slider
        const unsuccessfulHitScoreSlider = document.getElementById('unsuccessful-hit-score-slider');
        if (unsuccessfulHitScoreSlider) {
            unsuccessfulHitScoreSlider.value = currentSettings.scoring.missedHit;
        }

        // Example: Update negative score checkbox
        const showNegativeCheckbox = document.getElementById('show-negative-checkbox');
        if (showNegativeCheckbox) {
            showNegativeCheckbox.checked = currentSettings.scoring.showNegative;
        }

        // example: Update target image
        const targetImage = document.getElementById('target-image');
        if (targetImage) {
            targetImage.src = currentSettings.targets.image;
        }

        if (currentSettings.targets && currentSettings.targets.image) {
            const imagePreview = document.getElementById('image-preview') || document.createElement('img');
            imagePreview.id = 'image-preview';
            imagePreview.src = currentSettings.targets.image;
            imagePreview.style.maxWidth = '200px'; // Keep the preview size consistent
        
            // If you're also saving the file name, display that as well
            const fileNameDisplay = document.getElementById('file-name-display') || document.createElement('div');
            fileNameDisplay.id = 'file-name-display';
            fileNameDisplay.textContent = currentSettings.targets.fileName; // Assuming you save fileName in the settings
        
            // Append these elements where they should be in the UI if they weren't already
            if (!document.getElementById('image-preview')) {
                imageUploadContainer.appendChild(fileNameDisplay);
                imageUploadContainer.appendChild(imagePreview);
            }
        }
    }
}

const trainerSettingsManager = new TrainerSettingsManager();