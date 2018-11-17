export default class MaturityCard extends HTMLElement {

    constructor(title) {
        super();
        this.title = title;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.className = `card text-white ${this.determineBaseColor()} mb-3`;
        this.innerHTML = `
        <style>
        maturity-card {
            width: 18em;
        }
        </style>
        <div class="card-header">${this.title}</div>
        <div class="card-body">
        ${this.cardBody}
        </div>
        `;
    }

    set level(level) {
        this.maturityLevel = level;
        this.render();
    }

    get level() {
        return this.maturityLevel;
    }

    set minimumMaturity(minimum) {
        this.minimum = minimum;
        this.render();
    }

    get minimumMaturity() {
        return this.minimum;
    }

    set body(cardBody) {
        this.cardBody = cardBody;
        this.render();
    }

    get body() {
        return this.cardBody;
    }

    determineMinimumMaturity() {
        if (this.level > 2) {
            return 'fa-check';
        } else if (this.level <= 2) {
            return 'fa-times';
        } else if (this.minimumMaturity) {
            return 'fa-check';
        } else {
            return 'fa-times';
        }
    }

    determineBaseColor() {
        if (this.level > 2) {
            return 'bg-success';
        } else if (this.level === 2) {
            return 'bg-warning';
        } else if (this.level < 2) {
            return 'bg-danger';
        } else if (this.minimumMaturity) {
            return 'bg-success';
        } else {
            return 'bg-danger';
        }
    }
}

customElements.define('maturity-card', MaturityCard);