// Function to update URL parameters based on visual settings
const updateURLParametersVisuals = () => {
    // Add or update font parameter
    const selectedFont = visualSettingsManager.getVisualSettings().textFont;
    urlParameterManager.setParameterValue('textFont', selectedFont);

    // Add or update text size parameter
    const textSize = visualSettingsManager.getVisualSettings().textSize;
    urlParameterManager.setParameterValue('textSize', textSize);

    // Update the URL
    urlParameterManager.updateURL();
};

// Define your options for the select menu and slider
const fontSelectOptions = [
    { label: 'Arial' },
    { label: 'Times New Roman' },
    { label: 'Courier New' },
    { label: 'Montserrat' },
];

// Create an instance of OutlinedSelect for font selection
const fontSelect = new selectMenu(fontSelectOptions, 'Select Font', 'font-select');
const generatedFontSelect = fontSelect.createSelect();

// Create an instance of Slider for text size adjustment
const textSizeSlider = new CustomSlider('Text Size (px)','text-size-slider', 16, 32, 16, 1);
const generatedTextSizeSlider = textSizeSlider.createSlider();

// Append the generated elements to the visuals-panel in settings.html
const visualsPanel = document.getElementById('visuals-panel');
visualsPanel.appendChild(generatedFontSelect);
visualsPanel.appendChild(generatedTextSizeSlider);

// Example of updating settings when the user interacts with the elements
generatedFontSelect.addEventListener('input', (event) => {
    const selectedFont = event.target.value;

    // Update the selected font in local storage
    visualSettingsManager.updateSettings({ textFont: selectedFont });

    // Apply visual settings to the whole website
    visualSettingsManager.applyVisualSettings();

    // Update URL parameters
    updateURLParametersVisuals();
});

generatedTextSizeSlider.addEventListener('input', (event) => {
    const textSize = event.target.value;

    // Update the text size in local storage
    visualSettingsManager.updateSettings({ textSize: textSize });

    // Apply visual settings to the whole website
    visualSettingsManager.applyVisualSettings();

    // Update URL parameters
    updateURLParametersVisuals();
});

