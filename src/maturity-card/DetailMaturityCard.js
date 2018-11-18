import MaturityCard from './MaturityCard.js';

export default class DetailMaturityCard extends MaturityCard {

    constructor(title, fullfiled) {
        super(title);
        this.maturityFullfiled = fullfiled;
    }

    get fullfiled() {
        return this.maturityFullfiled;
    }

    determineBaseColor() {
        if (this.maturityFullfiled) {
            return 'bg-success';
        } else {
            return 'bg-danger';
        }
    }
}

customElements.define('detail-card', DetailMaturityCard);