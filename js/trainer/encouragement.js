class Encouragement {
    constructor(messages) {
        this.messages = messages;
        this.encouragementElement = document.createElement('div');
        this.encouragementElement.style.position = 'absolute';
        this.encouragementElement.style.top = '0';
        this.encouragementElement.style.width = '100%';
       // this.encouragementElement.style.textAlign = 'center';
        this.encouragementElement.style.color = 'black';
        this.encouragementElement.style.display = 'none'; // Hide by default
        document.getElementById('encouragementMessage').appendChild(this.encouragementElement);
    }

    showRandomMessage() {
        if (this.messages.length > 0) {
            const randomIndex = Math.floor(Math.random() * this.messages.length);
            console.log('Displaying encouragement message:', this.messages[randomIndex]);
    
            this.encouragementElement.textContent = this.messages[randomIndex];
            this.encouragementElement.style.display = 'block';
    
            // Hide the message after a few seconds
            setTimeout(() => {
                this.encouragementElement.style.display = 'none';
            }, 3000);
        }
    }

    hide() {
        this.encouragementElement.style.display = 'none';
    }
}
