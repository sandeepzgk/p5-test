class CustomPopup {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.popup = document.createElement('div');
        this.popup.className = 'popup-container';
        this.textArea = document.createElement('p');
        this.buttonArea = document.createElement('div');
        this.buttonArea.className = 'popup-buttons';
        this.closeButton = this.createCloseButton();

        this.popup.appendChild(this.closeButton);
        this.popup.appendChild(this.textArea);
        this.popup.appendChild(this.buttonArea);
        this.container.appendChild(this.popup);
    }

    createCloseButton() {
        const closeButton = document.createElement('md-filled-icon-button');
        closeButton.className = 'close-button';
        closeButton.setAttribute('aria-label', 'Close');
        closeButton.innerHTML = '<md-icon>close</md-icon>';
        closeButton.onclick = () => this.hide();
        return closeButton;
    }

    setText(message) {
        this.textArea.textContent = message;
    }

    addButton(text, onClick) {
        const button = document.createElement('md-filled-icon-button');
        button.textContent = text;
        button.onclick = onClick;
        this.buttonArea.appendChild(button);
    }

    show() {
        this.popup.style.display = 'flex';
    }

    hide() {
        this.popup.style.display = 'none';
    }
}
