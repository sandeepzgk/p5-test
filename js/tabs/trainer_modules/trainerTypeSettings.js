// Radio button for trainer type mode
const timedMode = new RadioButton('trainer-type-mode', 'timed', ' Timed', 'timed-button', true);
const generatedTimedModeButton = timedMode.createRadio();

const unlimitedTimeMode = new RadioButton('trainer-type-mode', 'unlimited-time', ' Unlimited Time', 'unlimited-time-button');
const generatedUnlimitedTimeModeButton = unlimitedTimeMode.createRadio();

// Slider for timed mode
const timeSlider = new CustomSlider('Time (s)', 'time-slider', 1, 120, 1, 1);
const generatedTimeSlider = timeSlider.createSlider();

const trainerTypeHeader = document.createElement('h2');
trainerTypeHeader.textContent = 'Trainer Type';
trainerPanel.appendChild(trainerTypeHeader);
trainerPanel.appendChild(generatedTimedModeButton);
trainerPanel.appendChild(generatedUnlimitedTimeModeButton);
const space = document.createElement('br');
trainerPanel.appendChild(space);
trainerPanel.appendChild(generatedTimeSlider); // Initially, add the time slider to the panel

// Function to show/hide time slider based on trainer mode
const toggleTimeSliderVisibility = (isVisible) => {
    generatedTimeSlider.style.display = isVisible ? 'block' : 'none';
};

// Example of updating trainer type settings when the user interacts with the elements
generatedTimedModeButton.addEventListener('change', (event) => {
    const trainerTypeMode = event.target.value;

    // Get the current trainer settings from local storage
    const currentSettings = trainerSettingsManager.getTrainerSettings();

    trainerSettingsManager.updateSettings({
        trainerType: {
            ...currentSettings.trainerType,
            mode: trainerTypeMode,
        },
    });

    toggleTimeSliderVisibility(trainerTypeMode === 'timed');
    updateURLParametersTrainer();
});

// Example of updating trainer type settings when the user interacts with the elements
generatedUnlimitedTimeModeButton.addEventListener('change', (event) => {
    const trainerTypeMode = event.target.value;

    // Get the current trainer settings from local storage
    const currentSettings = trainerSettingsManager.getTrainerSettings();

    trainerSettingsManager.updateSettings({
        trainerType: {
            ...currentSettings.trainerType,
            mode: trainerTypeMode,
        },
    });

    toggleTimeSliderVisibility(trainerTypeMode === 'timed');
    updateURLParametersTrainer();
});

// Example of updating trainer type settings when the user interacts with the elements
generatedTimeSlider.addEventListener('input', (event) => {
    const time = event.target.value;

    // Get the current trainer settings from local storage
    const currentSettings = trainerSettingsManager.getTrainerSettings();

    trainerSettingsManager.updateSettings({
        trainerType: {
            ...currentSettings.trainerType,
            time: time,
        },
    });

    // Update URL parameters
    updateURLParametersTrainer();
});

// Initial visibility of the time slider based on the default trainer mode
const initialTrainerMode = trainerSettingsManager.getTrainerSettings().trainerType.mode;
toggleTimeSliderVisibility(initialTrainerMode === 'timed');
