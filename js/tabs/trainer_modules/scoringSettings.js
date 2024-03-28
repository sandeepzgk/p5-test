// Radio button for score type mode
const scoredMode = new RadioButton('score-type-mode', 'scored', ' Scored', 'scored-button', true);
const generatedScoredModeButton = scoredMode.createRadio();

// non score mode
const nonScoredMode = new RadioButton('score-type-mode', 'non-scored', ' Non-Scored', 'non-scored-button');
const generatedNonScoredModeButton = nonScoredMode.createRadio();

// slider for successful hit score
const successfulHitScoreSlider = new CustomSlider('Successful Hit (Points)', 'successful-hit-score-slider', 1, 100, 1, 1);
const generatedSuccessfulHitScoreSlider = successfulHitScoreSlider.createSlider();

// slider for unsuccessful hit score
const unsuccessfulHitScoreSlider = new CustomSlider('Unsuccessful Hit (Points)', 'unsuccessful-hit-score-slider', 0, 100, 1, 1);
const generatedUnsuccessfulHitScoreSlider = unsuccessfulHitScoreSlider.createSlider();

// checkbox for showing negative score
const showNegativeCheckbox = new CustomCheckbox('show-negative-checkbox', false, 'Show Negative Scores');
const generatedShowNegativeCheckbox = showNegativeCheckbox.createCheckboxWithLabel('Show Negative Scores');

const scoreTypeHeader = document.createElement('h2');
scoreTypeHeader.textContent = 'Score Type';
trainerPanel.appendChild(scoreTypeHeader);
trainerPanel.appendChild(generatedScoredModeButton);
trainerPanel.appendChild(generatedNonScoredModeButton);
trainerPanel.appendChild(document.createElement('br'));
trainerPanel.appendChild(generatedSuccessfulHitScoreSlider);
trainerPanel.appendChild(generatedUnsuccessfulHitScoreSlider);
trainerPanel.appendChild(generatedShowNegativeCheckbox);

// Function to show/hide score sliders based on score mode
const toggleScoreSliderVisibility = (isVisible) => {
    generatedSuccessfulHitScoreSlider.style.display = isVisible ? 'block' : 'none';
    generatedUnsuccessfulHitScoreSlider.style.display = isVisible ? 'block' : 'none';
    generatedShowNegativeCheckbox.style.display = isVisible ? 'block' : 'none';
};

// Example of updating score type settings when the user interacts with the elements
generatedScoredModeButton.addEventListener('change', (event) => {
    const scoreTypeMode = event.target.value;

    // Get the current trainer settings from local storage
    const currentSettings = trainerSettingsManager.getTrainerSettings();

    trainerSettingsManager.updateSettings({
        scoring: {
            ...currentSettings.scoring,
            mode: scoreTypeMode,
        },
    });

    toggleScoreSliderVisibility(scoreTypeMode === 'scored');
    updateURLParametersTrainer();
});

// Example of updating score type settings when the user interacts with the elements
generatedNonScoredModeButton.addEventListener('change', (event) => {
    const scoreTypeMode = event.target.value;

    // Get the current trainer settings from local storage
    const currentSettings = trainerSettingsManager.getTrainerSettings();

    trainerSettingsManager.updateSettings({
        scoring: {
            ...currentSettings.scoring,
            mode: scoreTypeMode,
        },
    });

    toggleScoreSliderVisibility(scoreTypeMode === 'scored');
    updateURLParametersTrainer();
});

// Example of updating score type settings when the user interacts with the elements
generatedSuccessfulHitScoreSlider.addEventListener('input', (event) => {
    const successfulHitScore = event.target.value;

    // Get the current trainer settings from local storage
    const currentSettings = trainerSettingsManager.getTrainerSettings();

    trainerSettingsManager.updateSettings({
        scoring: {
            ...currentSettings.scoring,
            successfulHit: successfulHitScore,
        },
    });

    updateURLParametersTrainer();
});

// Example of updating score type settings when the user interacts with the elements
generatedUnsuccessfulHitScoreSlider.addEventListener('input', (event) => {
    const unsuccessfulHitScore = event.target.value;

    // Get the current trainer settings from local storage
    const currentSettings = trainerSettingsManager.getTrainerSettings();

    trainerSettingsManager.updateSettings({
        scoring: {
            ...currentSettings.scoring,
            missedHit: unsuccessfulHitScore,
        },
    });

    updateURLParametersTrainer();
});

generatedShowNegativeCheckbox.addEventListener('change', (event) => {
    const showNegative = event.target.checked;

    // Get the current trainer settings from local storage
    const currentSettings = trainerSettingsManager.getTrainerSettings();

    trainerSettingsManager.updateSettings({
        scoring: {
            ...currentSettings.scoring,
            showNegative: showNegative,
        },
    });

    updateURLParametersTrainer();
});
