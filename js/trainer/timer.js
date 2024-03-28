class Timer {
    constructor(initialTime) {
        this.time = initialTime;
        this.initialTime = initialTime;
        this.finalTime = 0;
        this.timerElement = document.getElementById('timer');
        this.isPaused = false;
    }

    decrement() {
        if (!this.isPaused && this.time > 0) {
            this.time--;
            this.updateTimerDisplay();
        }
    }

    stop(){
        this.finalTime = this.time;
        this.updateTimerDisplay();
    }

    pause() {
        this.isPaused = true;
    }

    getSeconds() {
        return this.time;
    }

    display() {
        this.updateTimerDisplay();
    }

    isTimeUp() {
        return this.time <= 0;
    }

    hide() {
        this.timerElement.style.display = 'none';
    }

    reset() {
        this.time = this.initialTime;
        this.isPaused = false; // Ensure timer is not paused when reset
        this.updateTimerDisplay();
        console.log(`Timer reset to ${this.initialTime}`);
    }    

    resume() {
        if (this.isPaused) {
            this.isPaused = false;
            this.updateTimerDisplay();
            console.log('Timer resumed');
        }
    }

    updateTimerDisplay() {
        this.timerElement.textContent = `Timer: ${this.getSeconds()}s`;
    }
}
