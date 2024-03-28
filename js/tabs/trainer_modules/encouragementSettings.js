const displayEncouragementChecbox = new CustomCheckbox('display-encouragement', false, 'Display Encouragement');
const generatedEncouragementCheckbox = displayEncouragementChecbox.createCheckboxWithLabel('Display Encouragement');

const encouragementMessagesTextbox = new CustomTextbox('encouragementMessagesTextarea', 3, 'Encouragement Messages:', 'encouragementMessages');
const generatedTextbox = encouragementMessagesTextbox.createTextbox();

const encouragementSettingsHeader = document.createElement('h2');
encouragementSettingsHeader.textContent = 'Encouragement';
trainerPanel.appendChild(encouragementSettingsHeader);
trainerPanel.appendChild(generatedEncouragementCheckbox);
trainerPanel.appendChild(document.createElement('br'));
trainerPanel.appendChild(generatedTextbox);

// Example of updating encouragement settings when the user interacts with the elements
generatedEncouragementCheckbox.addEventListener('change', (event) => {
    const displayEncouragement = event.target.checked;

    // Get the current trainer settings from local storage
    const currentSettings = trainerSettingsManager.getTrainerSettings()
    // Update only the trainerType.time property
    trainerSettingsManager.updateSettings({
        encouragement: {
            ...currentSettings.encouragement,
            display: displayEncouragement,
        },
    });

    // Update URL parameters
    updateURLParametersTrainer();
});

// Example of updating encouragement settings when the user interacts with the elements
generatedTextbox.addEventListener('input', (event) => {
    const encouragementMessages = event.target.value;

    // Get the current trainer settings from local storage
    const currentSettings = trainerSettingsManager.getTrainerSettings();
    // Update only the encouragement.messages property
    trainerSettingsManager.updateSettings({
        encouragement: {
            ...currentSettings.encouragement,
            messages: encouragementMessages.split('\n').map(message => message.trim()).filter(Boolean),
        },
    });

    // Update URL parameters
    updateURLParametersTrainer();
});


