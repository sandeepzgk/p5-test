class RadioButton {
    constructor(name, value, label, id, checked = false) {
        this.name = name;
        this.value = value;
        this.label = label;
        this.id = id;
        this.checked = checked;
    }

    createRadio() {
        const radio = document.createElement('md-radio');
        radio.setAttribute('type', 'radio');
        radio.setAttribute('name', this.name);
        radio.setAttribute('value', this.value);
        radio.setAttribute('id', this.id);
        if (this.checked) {
            radio.setAttribute('checked', '');
        }

        const label = document.createElement('label');
        label.setAttribute('for', this.id);
        label.textContent = this.label;

        const container = document.createElement('div');
        container.appendChild(radio);
        container.appendChild(label);

        return container;
    }
}

// // Example usage:
// const catsRadioButton = new RadioButton('animals', 'cats', 'Cats');
// const dogsRadioButton = new RadioButton('animals', 'dogs', 'Dogs');
// const birdsRadioButton = new RadioButton('animals', 'birds', 'Birds', true);

// const form = document.createElement('form');
// form.appendChild(catsRadioButton.createRadio());
// form.appendChild(dogsRadioButton.createRadio());
// form.appendChild(birdsRadioButton.createRadio());

// // Append the form to the document body or any other container
// document.body.appendChild(form);
