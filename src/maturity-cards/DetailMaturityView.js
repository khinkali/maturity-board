import MaturityClient from './MaturityClient.js';
import MinEfficiencyCard from '../min-efficiency/MinEfficiencyCard.js';
import MaxCycleTimeCard from '../max-cycle-time/MaxCycleTimeCard.js';
import MaxLeadTimeCard from '../max-lead-time/MaxLeadTimeCard.js';

export default class DetailMaturityView {

    constructor() {
        this.client = new MaturityClient();
    }

    async retrieveDetailMaturities(teamId, baseMaturityId) {
        const cards = [];
        const detailMaturities = await this.client.retrieveTeamMaturities(teamId);
        const baseMaturity = detailMaturities
            .filter(maturity => maturity.id === baseMaturityId)[0];
        baseMaturity.maturities.forEach(maturity => {
            let card;
            if (maturity.id === 'maxLeadTime') {
                card = new MaxLeadTimeCard(maturity).getCard();
            } else if (maturity.id === 'maxCycleTime') {
                card = new MaxCycleTimeCard(maturity).getCard();
            } else if (maturity.id === 'minEfficiency') {
                card = new MinEfficiencyCard(maturity).getCard();
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