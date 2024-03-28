class CustomTextbox {
    constructor(id, rows = 3, labelText, dataTranslate) {
        this.id = id;
        this.rows = rows;
        this.labelText = labelText;
        this.dataTranslate = dataTranslate;
    }

    createTextbox() {
        const div = document.createElement('div');

        const label = document.createElement('label');
        label.setAttribute('for', this.id);
        if (this.dataTranslate) {
            label.setAttribute('data-translate', this.dataTranslate);
        }
        label.textContent = this.labelText;
        div.appendChild(label);
        div.appendChild(document.createElement('br'));

        const textbox = document.createElement('textarea');
        textbox.id = this.id;
        textbox.rows = this.rows;
        div.appendChild(textbox);

        return div;
    }
}

// // Example usage:
// const encouragementMessagesTextbox = new CustomTextbox('encouragementMessagesTextarea', 3, 'Encouragement Messages:', 'encouragementMessages');
// const generatedTextbox = encouragementMessagesTextbox.createTextbox();

// // Append the textbox to the document body or any other container
// document.body.appendChild(generatedTextbox);
