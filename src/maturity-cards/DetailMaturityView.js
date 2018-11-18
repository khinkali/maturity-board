import MaturityClient from './MaturityClient.js';
import TemporalPrettyPrinter from '../temporal-pretty-printer/TemporalPrettyPrinter.js';
import DetailMaturityCard from '../maturity-card/DetailMaturityCard.js';

export default class DetailMaturityView {

    constructor() {
        this.client = new MaturityClient();
        this.prettyPrinter = new TemporalPrettyPrinter();
    }

    async retrieveDetailMaturities(teamId, baseMaturityId) {
        const cards = [];
        const detailMaturities = await this.client.retrieveTeamMaturities(teamId);
        const baseMaturity = detailMaturities
            .filter(maturity => maturity.id === baseMaturityId)[0];
        baseMaturity.maturities.forEach(maturity => {
            let card;
            if (maturity.id === 'maxLeadTime') {
                const maxLeadTimeInMs = maturity.maxLeadTime.maxLeadTimeInMs;
                const maxAllowedLeadTimeInMs = maturity.maxLeadTimeInMs;
                card = new DetailMaturityCard(maturity.name, maxAllowedLeadTimeInMs >= maxLeadTimeInMs);
                card.body = `
                    <p>Fullfiled: <i class="fas ${(card.fullfiled) ? 'fa-ceck' : 'fa-times'}"></i></p>
                    <p>Maximum allowed Lead Time: <br />
                    ${this.prettyPrinter.prettyPrintTime(maxAllowedLeadTimeInMs)}</p>
                    <p>Max Lead Time: <br />
                    ${this.prettyPrinter.prettyPrintTime(maxLeadTimeInMs)}</p>
                    `;
            } else if (maturity.id === 'maxCycleTime') {
                const maxCycleTimeInMs = maturity.maxCycleTime.maxCycleTimeInMs;
                const maxAllowedCycleTimeInMs = maturity.maxCycleTimeInMs;
                card = new DetailMaturityCard(maturity.name, maxAllowedCycleTimeInMs >= maxCycleTimeInMs);
                card.body = `
                    <p>Fullfiled: <i class="fas ${(card.fullfiled) ? 'fa-ceck' : 'fa-times'}"></i></p>
                    <p>Maximum allowed Cycle Time: <br />
                    ${this.prettyPrinter.prettyPrintTime(maxAllowedCycleTimeInMs)}</p>
                    <p>Max Cycle Time: <br />
                    ${this.prettyPrinter.prettyPrintTime(maxCycleTimeInMs)}</p>
                    `;
            } else if (maturity.id === 'minEfficiency') {
                const currentMinEfficiency = maturity.minEfficiencyService.minEfficiency;
                const minEfficiency = maturity.minEfficiency;
                card = new DetailMaturityCard(maturity.name, currentMinEfficiency >= minEfficiency);
                card.body = `
                    <p>Fullfiled: <i class="fas ${(maturity.fullfiled) ? 'fa-ceck' : 'fa-times'}"></i></p>
                    <p>Minimum Efficiency<br />
                    ${Math.trunc(100 * currentMinEfficiency)}%</p>
                    <p>Minimum allowed Efficiency<br />
                    ${Math.trunc(100 * minEfficiency)}%</p>
                    `;
            }
            card.onclick = _ => this.changeHash(teamId, baseMaturityId, maturity.id);
            cards.push(card);
        });
        return cards;
    }

    changeHash(teamId, baseMaturityId, leadTimeId) {
        window.location.hash = `#teams/${teamId}/maturities/${baseMaturityId}/details/${leadTimeId}`;
    }
}