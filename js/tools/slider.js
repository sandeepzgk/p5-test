class CustomSlider {
    constructor(labelFor, sliderId, min, max, value, step) {
        this.labelFor = labelFor;
        this.sliderId = sliderId;
        this.min = min;
        this.max = max;
        this.value = value;
        this.step = step;
    }

    createSlider() {
        const slider = document.createElement('md-slider');
        slider.id = this.sliderId;
        slider.setAttribute('min', this.min);
        slider.setAttribute('max', this.max);
        slider.setAttribute('value', this.value);
        slider.setAttribute('step', this.step);
        slider.setAttribute('ticks', '');
        slider.setAttribute('labeled', '');

        const label = document.createElement('label');
        label.setAttribute('for', this.sliderId);
        label.textContent = this.labelFor + ':';

        const settingDiv = document.createElement('div');
        settingDiv.classList.add('setting');
        settingDiv.appendChild(label);
        settingDiv.appendChild(slider);

        return settingDiv;
    }

    setMaxValue(sliderId, maxValue) {
        const slider = document.getElementById(sliderId);
        slider.setAttribute('max', maxValue);
    }

    overrideValue(newValue) {
        const slider = document.getElementById(this.sliderId);
        slider.setAttribute('value', newValue);
    }
}

// Example usage:
// const fontSelectOptions = [
//     { label: 'Arial' },
//     { label: 'Times New Roman' }
// ];

// const fontSelect = new OutlinedSelect(fontSelectOptions, 'Select Font', 'font-select');
// const generatedFontSelect = fontSelect.createSelect();
// document.getElementById('visuals-panel').appendChild(generatedFontSelect);

// const textSizeSlider = new Slider('Text Size', 'text-size-slider', 16, 32, 16, 1);
// const generatedTextSizeSlider = textSizeSlider.createSlider();
// document.getElementById('visuals-panel').appendChild(generatedTextSizeSlider);
