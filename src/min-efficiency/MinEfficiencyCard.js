import DetailMaturityCard from '../maturity-card/DetailMaturityCard.js';

export default class MinEfficiencyCard {

    constructor(maturity) {
        this.maturity = maturity;
    }

    getCard() {
        const currentMinEfficiency = this.maturity.minEfficiencyService.minEfficiency;
        const minEfficiency = this.maturity.minEfficiency;
        const card = new DetailMaturityCard(this.maturity.name, currentMinEfficiency >= minEfficiency);
        card.body = `
            <p>Fullfiled: <i class="fas ${(this.maturity.fullfiled) ? 'fa-check' : 'fa-times'}"></i></p>
            <p>Minimum Efficiency<br />
            ${Math.trunc(100 * currentMinEfficiency)}%</p>
            <p>Minimum allowed Efficiency<br />
            ${Math.trunc(100 * minEfficiency)}%</p>
            `;
        return card;
    }
}