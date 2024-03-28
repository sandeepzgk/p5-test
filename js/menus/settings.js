document.addEventListener("DOMContentLoaded", function() {
    // Apply visual settings to the whole website
    visualSettingsManager.applyVisualSettings();

    const tabs = document.querySelectorAll('md-primary-tab');
    const panels = document.querySelectorAll('[role="tabpanel"]');
    const closeButton = document.querySelector('.close-button');
    const popupContainer = document.getElementById("popup-container");
    const exitButton = document.querySelector('.exit-button');
    const cancelButton = document.querySelector('.cancel-button');
    const confirmButton = document.querySelector('.confirm-button');
    const popupMessage = document.getElementById("popup-message");

    // Get the advanced tab element
    const advancedTab = document.getElementById('advanced-tab');
    // Flag to track if advanced tab is currently visible
    let advancedTabVisible = false;

    // Function to toggle visibility of the advanced tab
    function toggleAdvancedTabVisibility() {
        advancedTabVisible = !advancedTabVisible;
        advancedTab.style.display = advancedTabVisible ? 'block' : 'none';
    }

    // Function to handle keydown event
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.shiftKey && event.keyCode == 81) { // 81 is the keyCode for 'Q'
            // Toggle visibility of advanced tab
            toggleAdvancedTabVisibility();
        }
    });

    // Function to hide advanced tab when settings menu is closed
    closeButton.addEventListener('click', function() {
         // Hide advanced tab when closing settings menu
         advancedTab.style.display = 'none';
         advancedTabVisible = false;
    });

    // Get the input field and buttons elements
    const participantIdInput = document.getElementById("participant-id-input");
    const keyboardInfoInput = document.getElementById("keyboard-info-input");
    const copyConfigLinkButton = document.getElementById("copy-config-link-button"); 
    const confirmKeyboardInfoButton = document.getElementById("confirm-keyboard-info-button");

    // Retrieve stored values from local storage
    const storedUsername = localStorage.getItem('username');
    const storedKeyboardInfo = localStorage.getItem('keyboardInfo');

    // Set the input fields to stored values, if they exist
    if (storedUsername) {
        usernameParticipantIdInput.value = storedUsername;
    }
    if (storedKeyboardInfo) {
        keyboardInfoInput.value = storedKeyboardInfo;
    }

    // Event listener for the "Copy Config Link" button
    copyConfigLinkButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the menu from closing
        // Retrieve the current URL parameters
        const currentParams = urlParameterManager.getURLParameters();

        // Update the 'username' or 'participantId' parameter with the value from the input field
        currentParams['participantId'] = participantIdInput.value;

        // Generate a new URL with the updated parameters
        const newURL = generateURLWithParameters(currentParams);

        // Copy the new URL to the clipboard
        copyToClipboard(newURL);

        // Optionally, display a message indicating the URL has been copied
        alert("Config link copied to clipboard!");
    });

    // Event listener for the "Confirm Keyboard Info" button
    confirmKeyboardInfoButton.addEventListener('click', function(event) {
        event.stopPropagation(); // Prevent the menu from closing
        const keyboardInfo = keyboardInfoInput.value;
        localStorage.setItem('keyboardInfo', keyboardInfo); // Store keyboard info in local storage
        alert("Keyboard info confirmed and stored!");
    });
    
    // Attach event listeners to reset buttons in each tab
    document.querySelectorAll('.reset-button').forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-reset');
            resetTabSettings(tabName);
            // Optionally, refresh or reapply the settings to the UI after reset
            //window.location.reload();
        });
    });

    // Set up a map to store tab settings managers
     const tabSettingsManagers = {
        visuals: visualSettingsManager,
        trainer: trainerSettingsManager,
        // Add other tab settings managers here
    };

    // Function to show the content of a specific tab
    function showTabPanel(tabName) {
        // Hide all panels
        panels.forEach(panel => {
            panel.style.display = 'none';
        });

        // Show the specified tab's panel
        document.getElementById(`${tabName}-panel`).style.display = 'block';

        // Customize based on your specific tab content and initialization
        if(tabName == 'visuals') {
            tabSettingsManagers[tabName].updateVisualSettingsUI(); // Update the UI based on the current settings
        }
        if(tabName == 'trainer'){
            tabSettingsManagers[tabName].updateTrainerSettingsUI(); // Update the UI based on the current settings
        }
    }

    // Set the initial active tab and show its panel on page load
    const initialTab = tabs[0].id.replace('-tab', ''); // Assuming the first tab is initially active
    showTabPanel(initialTab);

    // Attach event listeners to tab clicks
    tabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            const tabName = tab.id.replace('-tab', '');
    
            // Remove 'active' class from all tabs
            tabs.forEach(tab => {
                tab.classList.remove('active');
            });
    
            // Add 'active' class to the clicked tab
            tab.classList.add('active');
    
            // Show the panel corresponding to the clicked tab
            showTabPanel(tabName);
        });
    });
    

    // Function to show the popup with dynamic content
    function showPopup(message) {
        popupMessage.textContent = message;
        popupContainer.style.display = "flex";
    }

    // Close the popup
    function closePopup() {
        popupContainer.style.display = "none";
        // Go back to the main menu after closing the popup
        window.location.href = 'index.html';
    }

    closeButton.addEventListener('click', function() {
        const settingsChanged = visualSettingsManager.hasChanges() || trainerSettingsManager.hasChanges();

        if (settingsChanged) {
            // Show popup with confirmation message
            showPopup("Would you like to save your changes before exiting?");
            document.getElementById('overlay').style.display = 'block'; // Show the overlay
        } else {
            window.location.href = 'index.html';
        }
    });

    cancelButton.addEventListener('click', function() {
        storageManager.resetData();
        closePopup();
        document.getElementById('overlay').style.display = 'none'; // Hide the overlay
    });

    confirmButton.addEventListener('click', function() {
        // Handle 'Confirm' button click here
        console.log("User clicked Confirm");
        closePopup();
        document.getElementById('overlay').style.display = 'none'; // Hide the overlay
    });

    exitButton.addEventListener('click', function() {
        // Close the popup and stay in the current window
        popupContainer.style.display = "none";
        document.getElementById('overlay').style.display = 'none'; // Hide the overlay
    });

    // Function to reset settings for a specific tab
    function resetTabSettings(tabName) {
        const tabSettingsManager = tabSettingsManagers[tabName];
        if (tabSettingsManager) {
            tabSettingsManager.resetToDefault();
            if(tabName == 'visuals'){
                tabSettingsManager.applyVisualSettings();
            }
            urlParameterManager.resetTabURLParameters(tabName); // Reset URL parameters for the specific tab
        } else {
            console.warn('Unknown tab for reset:', tabName);
        }
    }

    // Function to generate a URL with parameters
    function generateURLWithParameters(params) {
        const baseUrl = 'https://kamero0n.github.io/Prototype5_Test/'; // Set the base URL to the main menu page
        const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
        return baseUrl + '?' + queryString;
    }


    // Function to copy a string to the clipboard
    function copyToClipboard(text) {
        const dummyElement = document.createElement('textarea');
        dummyElement.value = text;
        document.body.appendChild(dummyElement);
        dummyElement.select();
        document.execCommand('copy');
        document.body.removeChild(dummyElement);
    }
});
