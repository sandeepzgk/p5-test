
// Dialog Module
const DialogModule = (() => {
  const displayInfoDialog = (step) => {
    const infoDialog = document.getElementById('infoDialog');
    const overlay = document.getElementById('overlay'); // Ensure you have this element in your HTML
    const mainMenu = document.querySelector('.main_menu'); // Get the main menu

    overlay.style.display = 'block'; // Show the overlay
    mainMenu.classList.add('disabled'); // Disable main menu interaction
    const content = [
      "<h2>Welcome!</h2><p>This is a walkthrough of the trainer. Follow the arrows to navigate:</p>",
      "<p>Click 'Start' to begin the trainer.</p>",
      "<p>Access 'Settings' to customize the trainer.</p>",
      "<p>View 'Leaderboard' for high scores.</p>",
      "<p>Click 'Info' to open this dialog.</p>"
    ];
    const currentStep = step || 0;

    const infoContent = createDialogContent(content[currentStep]);
    displayDialogContent(infoDialog, infoContent, currentStep, content.length);
    attachDialogButtons(infoDialog, currentStep, content.length);
  };

  const createDialogContent = (content) => {
    return `
      ${content}
      <md-filled-icon-button class="close-button" aria-label="Close">
        <md-icon>close</md-icon>
      </md-filled-icon-button>

      <md-filled-icon-button class="prev-button" aria-label="Back">
        <md-icon>arrow_back</md-icon>
      </md-filled-icon-button>

      <md-filled-icon-button class="next-button" aria-label="Continue">
        <md-icon>arrow_forward</md-icon>
      </md-filled-icon-button>
    `;
  };

  const displayDialogContent = (dialogElement, content, step, totalSteps) => {
    dialogElement.innerHTML = content;
    dialogElement.style.display = 'block';
    adjustDialogButtonsVisibility(dialogElement, step, totalSteps);
  };

  const adjustDialogButtonsVisibility = (dialogElement, step, totalSteps) => {
    const prevButton = dialogElement.querySelector('.prev-button');
    const nextButton = dialogElement.querySelector('.next-button');

    prevButton.style.display = step === 0 ? 'none' : 'inline-block';
    nextButton.style.display = step === totalSteps - 1 ? 'none' : 'inline-block';
  };

  const attachDialogButtons = (dialogElement, step, totalSteps) => {
    dialogElement.addEventListener('click', (event) => {
      const mainMenu = document.querySelector('.main_menu'); // Get the main menu

      if (event.target.classList.contains('close-button')) {
        dialogElement.style.display = 'none';
        document.getElementById('overlay').style.display = 'none'; // Hide the overlay
        mainMenu.classList.remove('disabled'); // Re-enable main menu interaction
      } else if (event.target.classList.contains('prev-button') && step > 0) {
        displayInfoDialog(step - 1);
      } else if (event.target.classList.contains('next-button') && step < totalSteps - 1) {
        displayInfoDialog(step + 1);
      }
    });
  };

  return {
    displayInfoDialog,
  };
})();

// Navigation Module
const NavigationModule = (() => {
  const handleNavigation = (button, destination) => {
    button.addEventListener('click', () => {
      window.location.href = destination;
    });
  };

  return {
    handleNavigation,
  };
})();

// Event Bus for Observer Pattern
const EventBus = (() => {
  const events = {};

  const subscribe = (eventName, fn) => {
    events[eventName] = events[eventName] || [];
    events[eventName].push(fn);
  };

  const publish = (eventName, data) => {
    if (events[eventName]) {
      events[eventName].forEach((fn) => fn(data));
    }
  };

  return {
    subscribe,
    publish,
  };
})();

document.addEventListener('DOMContentLoaded', () => {
  // load the default settings
  storageManager.loadDefaultSettings();

  // update the local storage if we have URL parameters
  urlParameterManager.parseURLParameters();

  visualSettingsManager.applyVisualSettings();

  const infoButton = document.querySelector('.main_menu md-fab[aria-label="Info"]');
  const settingsButton = document.querySelector('.main_menu md-fab[aria-label="Settings"]');
  const leaderboardButton = document.querySelector('.main_menu md-fab[aria-label="Leaderboard"]');
  const startButton = document.querySelector('.main_menu md-fab[aria-label="Start Prototype"]');

  EventBus.subscribe('infoButtonClick', DialogModule.displayInfoDialog);

  NavigationModule.handleNavigation(settingsButton, 'settings.html');
  NavigationModule.handleNavigation(leaderboardButton, 'leaderboard.html');
  NavigationModule.handleNavigation(startButton, 'trainer.html');
  
  infoButton.addEventListener('click', () => {
    EventBus.publish('infoButtonClick', 0);
  });
});