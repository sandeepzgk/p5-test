// target mode
const targetModeOptions = [
    { label: 'Random', selected: true },
    { label: 'Patterned'}
];
const targetMode = new selectMenu(targetModeOptions, 'Select Target Mode', 'target-mode-select');
const generatedTargetMode = targetMode.createSelect();

// static targets
const staticTargetCheckbox = new CustomCheckbox('static-target', true, 'Static Target');
const generatedStaticTargetCheckbox = staticTargetCheckbox.createCheckboxWithLabel('Static Target');

// moving targets
const movingTargetCheckbox = new CustomCheckbox('moving-target', false, 'Moving Target');
const generatedMovingTargetCheckbox = movingTargetCheckbox.createCheckboxWithLabel('Moving Target');

// size slider
const targetSizeSlider = new CustomSlider('Target Size (px)', 'target-size-slider', 10, 100, 50, 1);
const generatedTargetSizeSlider = targetSizeSlider.createSlider();

// speed slider
const targetSpeedSlider = new CustomSlider('Target Speed (px/s)', 'target-speed-slider', 0, 2, 0, 0.1);
const generatedTargetSpeedSlider = targetSpeedSlider.createSlider();

// color select menu
const targetColorSelectOptions = [
    { label: 'Red'},
    { label: 'Green' },
    { label: 'Blue', selected: true },
    { label: 'Yellow' },
];
const targetColorSelect = new selectMenu(targetColorSelectOptions, 'Select Target Color', 'target-color-select');
const generatedTargetColorSelect = targetColorSelect.createSelect();

// target shape select menu
const targetShapeSelectOptions = [
    { label: 'Square'},
    { label: 'Circle', selected: true },
];
const targetShapeSelect = new selectMenu(targetShapeSelectOptions, 'Select Target Shape', 'target-shape-select');
const generatedTargetShapeSelect = targetShapeSelect.createSelect();

// Image Upload Section
const imageUploadContainer = document.createElement('div');
imageUploadContainer.classList.add('image-upload-container');
imageUploadContainer.textContent = 'Click "Choose a File" to select an image for the target.';

// Input for file upload
const imageUploadInput = document.createElement('input');
imageUploadInput.setAttribute('type', 'file');
imageUploadInput.setAttribute('accept', 'image/jpeg, image/png');
imageUploadInput.style.display = 'block'; // Hide the input element but keep it functional

// Append children
imageUploadContainer.appendChild(imageUploadInput);

const targetsSettingHeader = document.createElement('h2');
targetsSettingHeader.textContent = 'Target Creator';
trainerPanel.appendChild(targetsSettingHeader);
trainerPanel.appendChild(generatedTargetMode);
trainerPanel.appendChild(document.createElement('br'));
trainerPanel.appendChild(generatedStaticTargetCheckbox);
trainerPanel.appendChild(document.createElement('br'));
trainerPanel.appendChild(generatedMovingTargetCheckbox);
trainerPanel.appendChild(document.createElement('br'));
trainerPanel.appendChild(document.createElement('br'));
trainerPanel.appendChild(generatedTargetSizeSlider);
trainerPanel.appendChild(generatedTargetSpeedSlider);
trainerPanel.appendChild(generatedTargetColorSelect);
trainerPanel.appendChild(document.createElement('br'));
trainerPanel.appendChild(generatedTargetShapeSelect);
trainerPanel.appendChild(document.createElement('br'));
trainerPanel.appendChild(imageUploadContainer);
trainerPanel.appendChild(document.createElement('br'));

// Example of updating target mode settings when the user interacts with the elements
generatedTargetMode.addEventListener('change', (event) => {
    const mode = event.target.value;

    // Get the current trainer settings from local storage
    const currentSettings = trainerSettingsManager.getTrainerSettings()
    // Update only the encouragement.messages property
    trainerSettingsManager.updateSettings({
        targets: {
            ...currentSettings.targets,
            targetMode: mode,
        },
    });

    // Update URL parameters
    updateURLParametersTrainer();
});

// Example of updating static target settings when the user interacts with the elements
generatedStaticTargetCheckbox.addEventListener('change', (event) => {
    const staticTarget = event.target.checked;
    const movingTargetCheckbox = document.getElementById('moving-target');

    // If both static and moving targets are unchecked, check static target back as default
    if (!staticTarget && !movingTargetCheckbox.checked) {
        event.target.checked = true;
        // Update the moving target checkbox status to ensure one of them is always checked
        trainerSettingsManager.updateSettings({
            targets: {
                static: true,
                moving: false,
            },
        });
        // Update UI for moving target checkbox
        movingTargetCheckbox.checked = false;
    } else {
        // Update settings for static target
        const currentSettings = trainerSettingsManager.getTrainerSettings();
        trainerSettingsManager.updateSettings({
            targets: {
                ...currentSettings.targets,
                static: staticTarget,
            },
        });
    }

    // Update URL parameters
    updateURLParametersTrainer();
});

// Example of updating moving target settings when the user interacts with the elements
generatedMovingTargetCheckbox.addEventListener('change', (event) => {
    const movingTarget = event.target.checked;
    const staticTargetCheckbox = document.getElementById('static-target');

    // If both static and moving targets are unchecked, check moving target back as default
    if (!staticTargetCheckbox.checked && !movingTarget) {
        event.target.checked = true;
        // Update the static target checkbox status to ensure one of them is always checked
        trainerSettingsManager.updateSettings({
            targets: {
                static: false,
                moving: true,
            },
        });
        // Update UI for static target checkbox
        staticTargetCheckbox.checked = false;
    } else {
        // Update settings for moving target
        const currentSettings = trainerSettingsManager.getTrainerSettings();
        trainerSettingsManager.updateSettings({
            targets: {
                ...currentSettings.targets,
                moving: movingTarget,
            },
        });
    }

    // Update URL parameters
    updateURLParametersTrainer();
});

// Example of updating encouragement settings when the user interacts with the elements
generatedTargetSizeSlider.addEventListener('input', (event) => {
    const targetSize = event.target.value;

    // Get the current trainer settings from local storage
    const currentSettings = trainerSettingsManager.getTrainerSettings()
    // Update only the encouragement.messages property
    trainerSettingsManager.updateSettings({
        targets: {
            ...currentSettings.targets,
            size: targetSize,
        },
    });

    // Update URL parameters
    updateURLParametersTrainer();
});

// Example of updating encouragement settings when the user interacts with the elements
generatedTargetSpeedSlider.addEventListener('input', (event) => {
    const targetSpeed = event.target.value;

    // Get the current trainer settings from local storage
    const currentSettings = trainerSettingsManager.getTrainerSettings()
    // Update only the encouragement.messages property
    trainerSettingsManager.updateSettings({
        targets: {
            ...currentSettings.targets,
            speed: targetSpeed,
        },
    });

    // Update URL parameters
    updateURLParametersTrainer();
});

// Example of updating encouragement settings when the user interacts with the elements
generatedTargetColorSelect.addEventListener('change', (event) => {
    const targetColor = event.target.value;

    // Get the current trainer settings from local storage
    const currentSettings = trainerSettingsManager.getTrainerSettings()
    // Update only the encouragement.messages property
    trainerSettingsManager.updateSettings({
        targets: {
            ...currentSettings.targets,
            color: targetColor,
        },
    });

    // Update URL parameters
    updateURLParametersTrainer();
});

// Example of updating encouragement settings when the user interacts with the elements
generatedTargetShapeSelect.addEventListener('change', (event) => {
    const targetShape = event.target.value;

    // Get the current trainer settings from local storage
    const currentSettings = trainerSettingsManager.getTrainerSettings()
    // Update only the encouragement.messages property
    trainerSettingsManager.updateSettings({
        targets: {
            ...currentSettings.targets,
            shape: targetShape,
        },
    });

    // Update URL parameters
    updateURLParametersTrainer();
});

// Example of updating encouragement settings when the user interacts with the elements
imageUploadInput.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (file) {
        // Remove existing file name display and image preview
        let existingFileNameDisplay = document.getElementById('file-name-display');
        let existingImagePreview = document.getElementById('image-preview');
        if (existingFileNameDisplay) existingFileNameDisplay.remove();
        if (existingImagePreview) existingImagePreview.remove();

        // Display file name
        const fileNameDisplay = document.createElement('div');
        fileNameDisplay.id = 'file-name-display';
        fileNameDisplay.textContent = file.name; // Display the file name
        imageUploadContainer.appendChild(fileNameDisplay);

        // Preview image
        const imagePreview = document.createElement('img');
        imagePreview.id = 'image-preview';
        imagePreview.style.maxWidth = '200px'; // Set a max width for the preview
        imageUploadContainer.appendChild(imagePreview);

        const reader = new FileReader();
        reader.onload = function(e) {
            const imageUrl = e.target.result;
            imagePreview.src = imageUrl; // Set image source for preview

            // Update settings with the new image URL and file name
            const currentSettings = trainerSettingsManager.getTrainerSettings();
            trainerSettingsManager.updateSettings({
                targets: {
                    ...currentSettings.targets,
                    image: imageUrl,
                    fileName: file.name,
                },
            });
        };
        reader.readAsDataURL(file);
    }

    updateURLParametersTrainer();
});

