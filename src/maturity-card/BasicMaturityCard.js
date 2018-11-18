import MaturityCard from './MaturityCard.js';

export default class BasicMaturityCard extends MaturityCard {

    constructor(title, level, minimumLevel = 2) {
        super(title);
        this.level = level;
        this.minimumLevel = minimumLevel;

        this.body = `
        <p>Maturity-Level: ${this.level}<p>
        <p>Minimum-Maturity: <i class="fas ${this.determineMinimumMaturity()}"></i></p>
        `;
    }

    determineMinimumMaturity() {
        if (this.level > this.minimumLevel) {
            return 'fa-check';
        } else {
            return 'fa-times';
        }
    }

    determineBaseColor() {
        if (this.level > this.minimumLevel) {
            return 'bg-success';
        } else if (this.level === this.minimumLevel) {
            return 'bg-warning';
        } else {
            return 'bg-danger';
        }
    }
}

customElements.define('basic-card', BasicMaturityCard);