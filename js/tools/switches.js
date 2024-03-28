class CustomSwitch {
    constructor(labelFor, switchId) {
        this.labelFor = labelFor;
        this.switchId = switchId;
    }

    createSwitch() {
        const switchElement = document.createElement('md-switch');
        switchElement.setAttribute('icons', '');
        switchElement.setAttribute('aria-label', 'Switch');
        switchElement.id = this.switchId;

        const label = document.createElement('label');
        label.setAttribute('for', this.labelFor);
        label.textContent = this.labelFor + ':';

        const settingDiv = document.createElement('div');
        settingDiv.classList.add('setting');
        settingDiv.appendChild(label);
        settingDiv.appendChild(switchElement);

        return settingDiv;
    }
}

// Example usage:
// const staticSwitch = new CustomSwitch('Static', 'staticSwitch');
// const generatedStaticSwitch = staticSwitch.createSwitch();
// document.getElementById('configurables-panel').appendChild(generatedStaticSwitch);
