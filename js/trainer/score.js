class Score {
    constructor(initialValue) {
        this.value = initialValue;
        this.scoreElement = document.getElementById('score');
    }

    increment(points) {
        this.value += points;
        this.updateScoreDisplay();
    }

    decrement(points) {
        const showNegative = trainerSettingsManager.getTrainerSettings().scoring.showNegative;
    
        if (showNegative || this.value >= points) {
            this.value -= points;
        } else {
            this.value = 0;
        }
    
        this.updateScoreDisplay();
    }
    
    getValue() {
        return this.value;
    }

    display() {
        this.updateScoreDisplay();
    }

    hide() {
        this.scoreElement.style.display = 'none';
    }

    reset() {
        this.value = 0;
        this.updateScoreDisplay();
    }

    updateScoreDisplay() {
        this.scoreElement.textContent = `Score: ${this.getValue()}`;
    }
}
