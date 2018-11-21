import DetailMaturityCard from '../maturity-card/DetailMaturityCard.js';
import PrettyPrinter from '../pretty-printer/PrettyPrinter.js';

export default class MinEfficiencyCard {

    constructor(maturity) {
        this.maturity = maturity;
        this.prettyPrinter = new PrettyPrinter();
    }

    getCard() {
        const currentMinEfficiency = this.maturity.service.minEfficiency;
        const minEfficiency = this.maturity.minEfficiency;
        const card = new DetailMaturityCard(this.maturity.name, currentMinEfficiency >= minEfficiency);
        card.body = `
            <p>Fullfiled: <i class="fas ${(this.maturity.fullfiled) ? 'fa-check' : 'fa-times'}"></i></p>
            <p>Minimum Efficiency<br />
            ${this.prettyPrinter.prettyPrintPercent( currentMinEfficiency)}</p>
            <p>Minimum allowed Efficiency<br />
            ${this.prettyPrinter.prettyPrintPercent( minEfficiency)}</p>
            `;
        return card;
    }
}