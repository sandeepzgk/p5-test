class TargetManager {
    constructor() {
        if (!TargetManager.instance) {
            this.totalTargetsHit = 0; // Updated to track the number of hits
            this.totalTargets = trainerSettingsManager.getTrainerSettings().totalNumTargets;
            this.targetsOnScreen = trainerSettingsManager.getTrainerSettings().numTargetsOnScreen;
            this.targets = [];
            this.consecutiveHits = 0;
            this.consecutiveMisses = 0;
            TargetManager.instance = this;
            this.manageTargets();
        }
        return TargetManager.instance;
    }

    getTargetsHit(){
        return this.totalTargetsHit;
    }

    getTargetsRemaining(){
        return this.totalTargets - this.totalTargetsHit;
    }

    manageTargets() {
        const targetsRemaining = this.totalTargets - this.targets.length;
        console.log("targetsRemaining: " + targetsRemaining);
        if (targetsRemaining <= 0)
        {
            console.log("No more targets to generate");
            return;
        }

        // this.clearTargets(); // Clear existing targets to manage new ones

        const config = trainerSettingsManager.getTrainerSettings().targets;
        // let targetsToGenerate = Math.min(this.totalTargets - this.totalTargetsHit, this.targetsOnScreen);
        const targetsToGenerate = Math.min(targetsRemaining, this.targetsOnScreen);

        // Determine the number of static and moving targets to generate
        let staticTargetsCount = 0, movingTargetsCount = 0;
        if (config.static && !config.moving) {
            staticTargetsCount = targetsToGenerate;
        } else if (!config.static && config.moving) {
            movingTargetsCount = targetsToGenerate;
        } else if (config.static && config.moving) {
            // Divide evenly between static and moving targets
            staticTargetsCount = Math.floor(targetsToGenerate / 2);
            movingTargetsCount = targetsToGenerate - staticTargetsCount;
        }

        if(staticTargetsCount > 0){
            this.generateStaticTargets(staticTargetsCount);
        }
        if(movingTargetsCount > 0){
            this.generateMovingTargets(movingTargetsCount);
        }

        this.totalTargets -= (staticTargetsCount + movingTargetsCount);
        this.showTargetsOnScreen();
    }

    generateStaticTargets(count) {
        for (let i = 0; i < count; i++) {
            const target = targetBuilder.buildTarget(); // Assuming buildTarget creates a static target
            this.setupTarget(target);
        }
    }

    generateMovingTargets(count) {
        for (let i = 0; i < count; i++) {
            const target = targetBuilder.buildTarget(); // Assuming an updated buildTarget method that accepts a boolean for moving targets
            this.setupTarget(target, true); // true indicates this is a moving target
        }
    }

    setupTarget(target, isMoving = false){
        let currentIndex = this.targets.length - 1; // Initialize currentIndex to the last target index

         // Highlight the first target initially
        if (trainerSettingsManager.getTrainerSettings().targets.targetMode === "Patterned" && this.targets.length === 1) {
            target.style.border = "4px solid red";
        }
        
        target.addEventListener('click', (event) => {
            if (!isGamePaused) {
                const targetRect = target.getBoundingClientRect();
                const targetWidth = targetRect.width;
                const targetCenterX = targetRect.left + targetRect.width / 2;
                const targetCenterY = targetRect.top + targetRect.height / 2;
                const containerRect = targetContainer.getBoundingClientRect();
                const containerCenterX = containerRect.left + containerRect.width / 2;
                const containerCenterY = containerRect.top + containerRect.height / 2;
                const distance = Math.sqrt(Math.pow(targetCenterX - containerCenterX, 2) + Math.pow(targetCenterY - containerCenterY, 2));

                // Calculate distance from the last hit position to the current target's center
                const lastHitPosition = gameRunManager.getInitStartPosition(); // or another method to get the last hit or start position
                const targetCenter = {
                    x: target.getBoundingClientRect().left + target.getBoundingClientRect().width / 2 + window.scrollX,
                    y: target.getBoundingClientRect().top + target.getBoundingClientRect().height / 2 + window.scrollY
                };
                const distance_fitts = FittsManager.distance(lastHitPosition, targetCenter);
                
                // Store the calculated distance
                gameRunManager.addTargetDistance(distance_fitts);
                // Capture click timestamp
                gameRunManager.captureClickTimestamp();
                

                this.handleHit(targetWidth, distance);
                this.removeTarget(target);
                score.increment(trainerSettingsManager.getTrainerSettings().scoring.successfulHit);
                this.totalTargetsHit++;
                
                // Add user mouse position
                const hitPosition = { x: event.clientX, y: event.clientY };
                gameRunManager.addHitPosition(hitPosition);

                // Find the index of the farthest target
                if (trainerSettingsManager.getTrainerSettings().targets.targetMode === "Patterned") {
                    const currentIndex = this.targets.indexOf(target);
                    let farthestDistance = 0;
                    let farthestIndex = 0;

                    this.targets.forEach((t, index) => {
                        if (index !== currentIndex) {
                            const targetRect = t.getBoundingClientRect();
                            const targetCenterX = targetRect.left + targetRect.width / 2;
                            const targetCenterY = targetRect.top + targetRect.height / 2;
                            const distance = Math.sqrt(Math.pow(targetCenterX - targetCenter.x, 2) + Math.pow(targetCenterY - targetCenter.y, 2));
                            
                            if (distance > farthestDistance) {
                                farthestDistance = distance;
                                farthestIndex = index;
                            }
                        }
                    });

                    // Remove highlight from all targets
                    this.targets.forEach(t => t.style.border = "none");

                    // Highlight the farthest target in red
                    if (this.targets.length > 0) {
                        this.targets[farthestIndex].style.border = "6px solid red";
                    }
                }
            }
        });
        this.targets.push(target);
        if (isMoving) {
            this.applyMovement(target); // Implement this method to apply movement logic
        }
    }    

    applyMovement(target) {
        const config = trainerSettingsManager.getTrainerSettings().targets;
        let velocity = config.speed;

        // Set random initial positions within the container bounds
        let posX = Math.random() * (targetContainer.offsetWidth - target.offsetWidth);
        let posY = Math.random() * (targetContainer.offsetHeight - target.offsetHeight);

        target.style.left = `${posX}px`;
        target.style.top = `${posY}px`;

        let directionX = Math.random() < 0.5 ? -1 : 1;
        let directionY = Math.random() < 0.5 ? -1 : 1;

        const move = () => {
            posX += velocity * directionX;
            posY += velocity * directionY;

            if (posX <= 0 || posX + target.offsetWidth >= targetContainer.offsetWidth) {
                directionX *= -1;
                posX = Math.max(0, Math.min(posX, targetContainer.offsetWidth - target.offsetWidth));
            }
            if (posY <= 0 || posY + target.offsetHeight >= targetContainer.offsetHeight) {
                directionY *= -1;
                posY = Math.max(0, Math.min(posY, targetContainer.offsetHeight - target.offsetHeight));
            }

            target.style.left = `${posX}px`;
            target.style.top = `${posY}px`;

            requestAnimationFrame(move);
        };

        move();
    }

    removeTarget(target) {
        targetContainer.removeChild(target);
        this.targets = this.targets.filter(t => t !== target);

        if(this.targets.length === 0) {
            this.manageTargets();
        }
    }

    handleHit() {
        // Existing handleHit logic remains unchanged
        this.consecutiveHits++;
        this.consecutiveMisses = 0;

        if (trainerSettingsManager.getTrainerSettings().encouragement.display && this.consecutiveHits >= 3) {
            encouragement.showRandomMessage();
        }
    }

    handleMiss() {
        this.consecutiveMisses++;
        this.consecutiveHits = 0;

        // Check for encouragement display
        if (trainerSettingsManager.getTrainerSettings().encouragement.display && this.consecutiveMisses >= 3) {
            encouragement.showRandomMessage();
        }
    }
    
    showTargetsOnScreen() {
        this.targets = this.shuffleArray(this.targets);
        targetContainer.innerHTML = '';
        const targetMode = trainerSettingsManager.getTrainerSettings().targets.targetMode;

    
        this.targets.forEach((target, index) => {
            let posX, posY;
            const containerRect = targetContainer.getBoundingClientRect();
            const maxX = containerRect.width - target.offsetWidth;
            const maxY = containerRect.height - target.offsetHeight;
    
            if (targetMode == "Patterned") {
                // Generate targets in a circle for patterned mode
                const centerX = containerRect.width / 2;
                const centerY = containerRect.height / 2;
                const radius = 200;
                const angleIncrement = (2 * Math.PI) / this.targets.length;
                const angle = index * angleIncrement;
    
                posX = centerX + radius * Math.cos(angle) - trainerSettingsManager.getTrainerSettings().targets.size / 2;
                posY = centerY + radius * Math.sin(angle) - trainerSettingsManager.getTrainerSettings().targets.size / 2;
            } else {
                // Generate random positions within the bounds of the targetContainer for random mode
                posX = Math.random() * maxX;
                posY = Math.random() * maxY;
            }
    
            // Ensure targets are always visible on screen
            posX = Math.max(0, Math.min(posX, maxX));
            posY = Math.max(0, Math.min(posY, maxY));
    
            target.style.position = 'absolute';
            target.style.left = `${posX}px`;
            target.style.top = `${posY}px`;
    
            targetContainer.appendChild(target);

    
            // Ensure the target has been rendered and positioned
            setTimeout(() => {
                const targetRect = target.getBoundingClientRect();
                const position = { x: targetRect.left + window.scrollX, y: targetRect.top + window.scrollY };
                gameRunManager.addTargetPosition(position);
            }, 0);
        });
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    clearTargets() {
        this.targets.forEach(target => targetContainer.removeChild(target));
        this.targets = []; // Clear the array of targets
    }

    reset() {
        this.totalTargetsHit = 0;
        this.totalTargets = trainerSettingsManager.getTrainerSettings().totalNumTargets;
        this.targetsOnScreen = trainerSettingsManager.getTrainerSettings().numTargetsOnScreen;
        this.targets = [];
        this.consecutiveHits = 0;
        this.consecutiveMisses = 0;
        this.clearTargets();
        this.manageTargets();
    }

}

const targetManager = new TargetManager();
