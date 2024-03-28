class CustomCheckbox {
    constructor(id, checked = false, ariaLabel) {
        this.id = id;
        this.checked = checked;
        this.ariaLabel = ariaLabel;
    }

    createCheckbox() {
        const checkbox = document.createElement('md-checkbox');
        checkbox.setAttribute('touch-target', 'wrapper');
        checkbox.id = this.id;
        checkbox.checked = this.checked;

        if (this.ariaLabel) {
            checkbox.setAttribute('aria-label', this.ariaLabel);
        }

        return checkbox;
    }

    createCheckboxWithLabel(labelText) {
        const label = document.createElement('label');
        
        const checkbox = this.createCheckbox();
        label.appendChild(checkbox);

        const labelTextNode = document.createTextNode(`${labelText}`);
        label.appendChild(labelTextNode);

        return label;
    }
}

// Example usage:
// const checkbox1 = new Checkbox('checkbox-one');
// const generatedCheckbox1 = checkbox1.createCheckboxWithLabel('Checkbox one');

// const checkbox2 = new Checkbox('checkbox-two', true, 'Checkbox two');
// const generatedCheckbox2 = checkbox2.createCheckboxWithLabel('Checkbox two');

// // Append the checkboxes to the document body or any other container
// document.body.appendChild(generatedCheckbox1);
// document.body.appendChild(generatedCheckbox2);
