// function to update URL parameters based on trainer settings
updateURLParametersTrainer = () => {
    // Add or update total targets parameter
    const totalTargets = trainerSettingsManager.getTrainerSettings().totalNumTargets;
    urlParameterManager.setParameterValue('totalNumTargets', totalTargets);

    // Add or update targets on screen parameter
    const targetsOnScreen = trainerSettingsManager.getTrainerSettings().numTargetsOnScreen;
    urlParameterManager.setParameterValue('numTargetsOnScreen', targetsOnScreen);

    // Add or update trainer type mode parameter
    const trainerTypeMode = trainerSettingsManager.getTrainerSettings().trainerType.mode;
    urlParameterManager.setParameterValue('trainerTypeMode', trainerTypeMode);

    // Add or update time parameter
    const time = trainerSettingsManager.getTrainerSettings().trainerType.time;
    urlParameterManager.setParameterValue('time', time);

    // Add or update encouragement parameter
    const displayEncouragement = trainerSettingsManager.getTrainerSettings().encouragement.display;
    urlParameterManager.setParameterValue('displayEncouragement', displayEncouragement);

    // Add or update encouragement messages parameter
    const encouragementMessages = trainerSettingsManager.getTrainerSettings().encouragement.messages;
    urlParameterManager.setParameterValue('encouragementMessages', encouragementMessages);

    const targetMode = trainerSettingsManager.getTrainerSettings().targets.targetMode;
    urlParameterManager.setParameterValue('targetMode', targetMode);

    // Add or update static target parameter
    const staticTarget = trainerSettingsManager.getTrainerSettings().targets.static;
    urlParameterManager.setParameterValue('staticTarget', staticTarget);

    // Add or update moving target parameter
    const movingTarget = trainerSettingsManager.getTrainerSettings().targets.moving;
    urlParameterManager.setParameterValue('movingTarget', movingTarget);

    // Add or update target size parameter
    const targetSize = trainerSettingsManager.getTrainerSettings().targets.size;
    urlParameterManager.setParameterValue('targetSize', targetSize);

    // Add or update target speed parameter
    const targetSpeed = trainerSettingsManager.getTrainerSettings().targets.speed;
    urlParameterManager.setParameterValue('targetSpeed', targetSpeed);

    // Add or update target color parameter
    const targetColor = trainerSettingsManager.getTrainerSettings().targets.color;
    urlParameterManager.setParameterValue('targetColor', targetColor);

    // Add or update target shape parameter
    const targetShape = trainerSettingsManager.getTrainerSettings().targets.shape;
    urlParameterManager.setParameterValue('targetShape', targetShape);

    // Add or update score type mode parameter
    const scoreTypeMode = trainerSettingsManager.getTrainerSettings().scoring.mode;
    urlParameterManager.setParameterValue('scoreTypeMode', scoreTypeMode);

    // Add or update successful hit score parameter
    const successfulHitScore = trainerSettingsManager.getTrainerSettings().scoring.successfulHit;
    urlParameterManager.setParameterValue('successfulHitScore', successfulHitScore);

    // Add or update unsuccessful hit score parameter
    const unsuccessfulHitScore = trainerSettingsManager.getTrainerSettings().scoring.missedHit;
    urlParameterManager.setParameterValue('unsuccessfulHitScore', unsuccessfulHitScore);

    // Add or update image parameter
    const image = trainerSettingsManager.getTrainerSettings().targets.image;
    urlParameterManager.setParameterValue('image', image);

    // add or update show negative score parameter
    const showNegative = trainerSettingsManager.getTrainerSettings().scoring.showNegative;
    urlParameterManager.setParameterValue('showNegative', showNegative);

    urlParameterManager.updateURL();
};

// Slider for total number of targets
const totalTargetsSlider = new CustomSlider('Total Targets', 'total-targets-slider', 1, 100, 1, 1);
const generatedTotalTargetsSlider = totalTargetsSlider.createSlider();

// Slider for targets on screen
const targetsOnScreenSlider = new CustomSlider('Targets on Screen', 'targets-on-screen-slider', 1, totalTargetsSlider.max, 1, 1);
const generatedTargetsOnScreenSlider = targetsOnScreenSlider.createSlider();

const trainerPanel = document.getElementById('trainer-panel');
trainerPanel.appendChild(generatedTotalTargetsSlider);
trainerPanel.appendChild(generatedTargetsOnScreenSlider);

// Example of updating settings when the user interacts with the elements
generatedTotalTargetsSlider.addEventListener('input', (event) => {
    const totalTargets = event.target.value;

    // Update the total targets in local storage
    trainerSettingsManager.updateSettings({ totalNumTargets: totalTargets });

    // Dynamically update the max value of targets on screen slider
    targetsOnScreenSlider.setMaxValue('targets-on-screen-slider', totalTargets);

    // Update URL parameters
    updateURLParametersTrainer();
});

// Example of updating settings when the user interacts with the elements
generatedTargetsOnScreenSlider.addEventListener('input', (event) => {
    const targetsOnScreen = event.target.value;

    // Update the targets on screen in local storage
    trainerSettingsManager.updateSettings({ numTargetsOnScreen: targetsOnScreen });

    // Update URL parameters
    updateURLParametersTrainer();
});

