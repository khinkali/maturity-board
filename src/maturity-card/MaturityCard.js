export default class MaturityCard extends HTMLElement {

    constructor(title) {
        super();
        this.title = title;
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
        <style>
        .maturity-card {
            width: 20em;
        }
        </style>
        <div class="maturity-card card text-white ${this.determineBaseColor()} mb-3">
            <div class="card-header">${this.title}</div>
            <div class="card-body">
            ${this.cardBody}
            </div>
        </div>
        `;
    }

    set body(cardBody) {
        this.cardBody = cardBody;
        this.render();
    }

    get body() {
        return this.cardBody;
    }

    determineBaseColor() {
        return 'bg-secondary';
    }

}

customElements.define('maturity-card', MaturityCard);