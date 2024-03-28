class selectMenu {
    constructor(options, labelFor, selectId, showSelected = true) {
        this.options = options;
        this.labelFor = labelFor;
        this.selectId = selectId;
        this.showSelected = showSelected;
    }

    createSelect() {
        const selectElement = document.createElement('md-outlined-select');
        selectElement.id = this.selectId;

        this.options.forEach(option => {
            const selectOption = document.createElement('md-select-option');
            selectOption.setAttribute('aria-label', option.label);
            selectOption.value = option.label;  // Set the value attribute

            if (this.showSelected && option.selected) {
                selectOption.classList.add('selected-option');
                selectOption.setAttribute('selected', 'true');
            } else {
                selectOption.setAttribute('selected', 'false');
            }

            const div = document.createElement('div');
            div.setAttribute('slot', 'headline');
            div.textContent = option.label;

            selectOption.appendChild(div);
            selectElement.appendChild(selectOption);
        });

        const label = document.createElement('label');
        label.setAttribute('for', this.selectId);
        label.textContent = this.labelFor + ':';

        const settingDiv = document.createElement('div');
        settingDiv.classList.add('setting');
        settingDiv.appendChild(label);
        settingDiv.appendChild(selectElement);

        return settingDiv;
    }
}

// Example usage:
// const fontSelectOptions = [
//     { label: 'Arial', selected: true },
//     { label: 'Times New Roman' }
// ];

// const fontSelect = new selectMenu(fontSelectOptions, 'Select Font', 'font-select');
// const generatedFontSelect = fontSelect.createSelect();
// document.getElementById('visuals-panel').appendChild(generatedFontSelect);
