import TemporalPrettyPrinter from '../temporal-pretty-printer/TemporalPrettyPrinter.js';
import DetailMaturityCard from '../maturity-card/DetailMaturityCard.js';

export default class MaxLeadTimeCard {

    constructor(maturity) {
        this.maturity = maturity;
        this.prettyPrinter = new TemporalPrettyPrinter();
    }

    getCard() {
        const maxLeadTimeInMs = this.maturity.maxLeadTime.maxLeadTimeInMs;
        const maxAllowedLeadTimeInMs = this.maturity.maxLeadTimeInMs;
        const card = new DetailMaturityCard(this.maturity.name, maxAllowedLeadTimeInMs >= maxLeadTimeInMs);
        card.body = `
            <p>Fullfiled: <i class="fas ${(card.fullfiled) ? 'fa-check' : 'fa-times'}"></i></p>
            <p>Maximum allowed Lead Time: <br />
            ${this.prettyPrinter.prettyPrintTime(maxAllowedLeadTimeInMs)}</p>
            <p>Max Lead Time: <br />
            ${this.prettyPrinter.prettyPrintTime(maxLeadTimeInMs)}</p>
            `;
        return card;
    }
}