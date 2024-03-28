class TargetBuilder {
    constructor() {
        this.targetConfig = trainerSettingsManager.getTrainerSettings().targets;
    }

    buildTarget() {
        const target = document.createElement('div');
        target.className = 'target';

        // Set target shape
        target.style.width = `${this.targetConfig.size}px`;
        target.style.height = `${this.targetConfig.size}px`;
        target.style.borderRadius = this.targetConfig.shape == 'Circle' ? '50%' : '0';

        // Update target width in GameRunManager
        gameRunManager.updateTargetWidth(this.targetConfig.size);

        // Set target color or image as background
        if (this.targetConfig.image) {
            target.style.backgroundImage = `url('${this.targetConfig.image}')`;
            target.style.backgroundSize = 'cover'; // Ensure the image covers the target
            target.style.backgroundPosition = 'center'; // Center the background image
        } else {
            target.style.backgroundColor = this.targetConfig.color;
        }

        return target;
    }
}

targetBuilder = new TargetBuilder();
