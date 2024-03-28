class GameRunManager {
    static instance;

    constructor() {
        if (GameRunManager.instance) {
            return GameRunManager.instance;
        }
        this.runs = this.loadRuns() || [];
        this.currentRun = null;
        GameRunManager.instance = this;
    }

    // Method to load runs from localStorage
    loadRuns() {
        const runs = localStorage.getItem('gameRuns');
        return runs ? JSON.parse(runs) : [];
    }

    // Method to save a single run to localStorage
    saveRun(score, time, settings, exitedEarly = false, fittsData, keyboardInfo) {
        const run = {
            score,
            time,
            settings,
            date: new Date().toISOString(),
            runNumber: this.runs.length + 1,
            exitedEarly,
            fittsData,
            keyboardInfo
        };
        this.runs.push(run);
        localStorage.setItem('gameRuns', JSON.stringify(this.runs));
    }

    // Method to start a new run
    startRun() {
        if (this.currentRun) {
            console.warn("A run is already in progress.");
            return;
        }

        this.currentRun = {
            score: 0,
            time: 0,
            settings,
            date: new Date().toISOString(),
            runNumber: this.runs.length + 1,
            exitedEarly: false,
            fittsData: {
                startPositions: [],
                targetDistances: [],
                targetPositions: [],
                meanDistance: null,
                effectiveWidth: null,
                indexDifficulty: null,
                targetWidth: null,
                missPositions: [],
                hitPositions: [],
                mousePath: [],
                clickTimestamps: [],
                pathLength: null,
                pathEfficiency: null,
                clickEfficiency: null,
            },
            keyboardInfo: null
        };
    }

    // Method to stop the current run  
    stopRun() {
        if (!this.currentRun) {
            console.warn("No run in progress to stop.");
            return;
        }
        // Perform Fitts' data calculations
        this.calculateMeanDistance();
        this.calculateEffectiveWidth();
        this.calculateIndexOfDifficulty();
        this.calculateAndStoreEfficiencies();
        this.setKeyboardInfo();

        // Then proceed with saving the run
        if (this.currentRun.time !== 0 || this.currentRun.score !== 0 || this.currentRun.exitedEarly) {
            this.saveRun(
                this.currentRun.score,
                this.currentRun.time,
                this.currentRun.settings,
                this.currentRun.exitedEarly,
                this.currentRun.fittsData,
                this.currentRun.keyboardInfo
            );
        } 

        this.currentRun = null;
    }



    // Method to update the score of the current run
    updateScore(score) {
        if (!this.currentRun) {
            console.warn("No run in progress to update score.");
            return;
        }
        this.currentRun.score = score;
    }

    updateTimeRemaining(time){
        if (!this.currentRun) {
            console.warn("No run in progress to update time remaining.");
            return;
        }
        this.currentRun.time = time;
    }

    // Method to mark the current run as exited earlys
    markAsExitedEarly() {
        if (!this.currentRun) {
            console.warn("No run in progress to mark as exited early.");
            return;
        }
        this.currentRun.exitedEarly = true;
    }

    // add to end positions array for fitts data
    addEndPosition(position){
        if (!this.currentRun) {
            console.warn("No run in progress to add end position.");
            return;
        }
        this.currentRun.fittsData.endPositions.push(position);
    }

    // add target distances
    addTargetDistance(distance){
        if (!this.currentRun) {
            console.warn("No run in progress to add target distance.");
            return;
        }
        this.currentRun.fittsData.targetDistances.push(distance);
    }

    // add target positions
    addTargetPosition(position){
        if (!this.currentRun) {
            console.warn("No run in progress to add target position.");
            return;
        }

        if(position.x != 0 && position.y != 0){
            this.currentRun.fittsData.targetPositions.push(position);
        }
    }

    // add miss positions
    addMissPosition(position){
        if (!this.currentRun) {
            console.warn("No run in progress to add miss position.");
            return;
        }
        this.currentRun.fittsData.missPositions.push(position);
    }

    // add hit positions
    addHitPosition(position){
        if (!this.currentRun) {
            console.warn("No run in progress to add hit position.");
            return;
        }
        this.currentRun.fittsData.hitPositions.push(position);
    }

    // Method to update target width in fittsData
    updateTargetWidth(width) {
        if (!this.currentRun) {
            console.warn("No run in progress to update target width.");
            return;
        }
        // Assuming you want to keep track of each target's width; if you just need the last one, adjust accordingly
        this.currentRun.fittsData.targetWidth = width; // Or push to an array if tracking all widths
    }

    // Optionally, a method to get all runs if needed for display or analysis
    getAllRuns() {
        return this.runs;
    }

    getInitStartPosition(){
        if (!this.currentRun) {
            console.warn("No run in progress to get start position.");
            return;
        }
        return this.currentRun.fittsData.startPositions[0];
    }

    captureStartPosition() {
        if (!this.currentRun) {
            console.warn("No run in progress to capture start position.");
            return;
        }
        
        // Check if the event listener is already attached
        if (!this.startPositionHandler) {
            // Define the event listener to capture cursor position on mouse move
            this.startPositionHandler = (event) => {
                const position = { x: event.clientX, y: event.clientY };
                this.currentRun.fittsData.startPositions.push(position);
                
                // Remove the event listener after capturing the start position
                document.removeEventListener('mousemove', this.startPositionHandler);
                // Set the event listener to null after removal
                this.startPositionHandler = null;
            };
    
            // Attach the event listener to the document
            document.addEventListener('mousemove', this.startPositionHandler);
        }
    }
    
    calculateMeanDistance() {
        if (!this.currentRun || this.currentRun.fittsData.targetDistances.length === 0) {
            console.warn("No run in progress or no distances to calculate mean distance.");
            return;
        }
        const sumOfDistances = this.currentRun.fittsData.targetDistances.reduce((acc, distance) => acc + distance, 0);
        const meanDistance = sumOfDistances / this.currentRun.fittsData.targetDistances.length;
        this.currentRun.fittsData.meanDistance = meanDistance;
    }
    
    calculateEffectiveWidth() {
        if (!this.currentRun || this.currentRun.fittsData.hitPositions.length === 0) {
            console.warn("No run in progress or hit positions data is missing.");
            return;
        }
        
        // Calculate mean position
        const meanPosition = FittsManager.mean(this.currentRun.fittsData.hitPositions);
        
        // Calculate variance
        const variance = FittsManager.variance(this.currentRun.fittsData.hitPositions, meanPosition);
        
        // Calculate standard deviation
        const standardDeviation = Math.sqrt(variance);
        
        // Calculate effective width using the 4.133 * SD formula
        this.currentRun.fittsData.effectiveWidth = 4.133 * standardDeviation;
    }
     
    calculateIndexOfDifficulty() {
        if (!this.currentRun || !this.currentRun.fittsData.meanDistance || !this.currentRun.fittsData.effectiveWidth) {
            console.warn("No run in progress or necessary data for index of difficulty calculation is missing.");
            return;
        }
        // Assuming the use of FittsManager's static method for calculating index of difficulty
        this.currentRun.fittsData.indexDifficulty = FittsManager.fittsIndexDifficulty(
            this.currentRun.fittsData.meanDistance,
            this.currentRun.fittsData.effectiveWidth
        );
    }
    
    // Method to add mouse path data
    captureMousePath(event) {
        if (!this.currentRun || !this.currentRun.fittsData.mousePath) {
            console.warn("No run in progress or mouse path data is missing.");
            return;
        }
        const position = { x: event.clientX, y: event.clientY };
        this.currentRun.fittsData.mousePath.push({ ...position, timestamp: Date.now() });
    }

    // Method to capture click timestamps
    captureClickTimestamp() {
        if (!this.currentRun || !this.currentRun.fittsData.clickTimestamps) {
            console.warn("No run in progress or click timestamps data is missing.");
            return;
        }
        this.currentRun.fittsData.clickTimestamps.push(Date.now());
    }

     // Method to calculate and store path length, path efficiency, and click efficiency
     calculateAndStoreEfficiencies() {
        if (!this.currentRun || !this.currentRun.fittsData.mousePath ||
            !this.currentRun.fittsData.targetDistances ||
            !this.currentRun.fittsData.targetWidth) {
            console.warn("No run in progress or necessary data for efficiency calculation is missing.");
            return;
        }

        const pathLength = FittsManager.pathLength(this.currentRun.fittsData.mousePath);
        const targetDistance = this.currentRun.fittsData.targetDistances.reduce((acc, distance) => acc + distance, 0);
        const targetWidth = this.currentRun.fittsData.targetWidth;

        const pathEfficiency = FittsManager.pathEfficiency(pathLength, targetDistance);
        const clickEfficiency = FittsManager.clickEfficiency(pathLength, targetWidth);

        // Store the calculated values in fittsData
        this.currentRun.fittsData.pathLength = pathLength;
        this.currentRun.fittsData.pathEfficiency = pathEfficiency;
        this.currentRun.fittsData.clickEfficiency = clickEfficiency;
    }

    // Add a method to GameRunManager to set keyboard info
    setKeyboardInfo() {
        const storedKeyboardInfo = localStorage.getItem('keyboardInfo');
        this.currentRun.keyboardInfo = storedKeyboardInfo;
    }
}

// Assuming we have the settings from the game, which could be the 'trainerSettings' object
const gameRunManager = new GameRunManager();
