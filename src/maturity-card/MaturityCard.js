export default class MaturityCard extends HTMLElement {

    connectedCallback() {
        const title = this.getAttribute('title');
        const maturityLevel = Math.trunc(this.getAttribute('level'));
        this.className = `card text-white ${this.determineBaseColor(maturityLevel)} mb-3`;
        this.innerHTML = `
        <style>
        maturity-card {
            width: 18em;
        }
        </style>
        <div class="card-header">${title}</div>
        <div class="card-body">
            <p>Maturity-Level: ${maturityLevel} 
            <p>
            <p>Minimum-Maturity: <i class="fas ${this.determineMinimumMaturity(maturityLevel)}"></i></p>
        </div>
        `;
    }

    determineMinimumMaturity(level) {
        if (level > 2) {
            return 'fa-check'
        } else {
            return 'fa-times'
        }
    }

    determineBaseColor(level) {
        if (level > 2) {
            return 'bg-success';
        } else if (level === 2) {
            return 'bg-warning';
        } else {
            return 'bg-danger';
        }
    }
}

customElements.define('maturity-card', MaturityCard);