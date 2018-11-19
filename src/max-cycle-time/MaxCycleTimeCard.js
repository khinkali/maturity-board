import DetailMaturityCard from '../maturity-card/DetailMaturityCard.js';
import PrettyPrinter from '../temporal-pretty-printer/PrettyPrinter.js';

export default class MaxCycleTimeCard {

    constructor(maturity) {
        this.maturity = maturity;
        this.prettyPrinter = new PrettyPrinter();
    }

    getCard() {
        const maxCycleTimeInMs = this.maturity.maxCycleTime.maxCycleTimeInMs;
        const maxAllowedCycleTimeInMs = this.maturity.maxCycleTimeInMs;
        const card = new DetailMaturityCard(this.maturity.name, maxAllowedCycleTimeInMs >= maxCycleTimeInMs);
        card.body = `
            <p>Fullfiled: <i class="fas ${(card.fullfiled) ? 'fa-check' : 'fa-times'}"></i></p>
            <p>Maximum allowed Cycle Time: <br />
            ${this.prettyPrinter.prettyPrintTime(maxAllowedCycleTimeInMs)}</p>
            <p>Max Cycle Time: <br />
            ${this.prettyPrinter.prettyPrintTime(maxCycleTimeInMs)}</p>
            `;
        return card;
    }
}