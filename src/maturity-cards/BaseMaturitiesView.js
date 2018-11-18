import MaturityClient from './MaturityClient.js';
import BasicMaturityCard from '../maturity-card/BasicMaturityCard.js'; 

export default class BaseMaturitiesView {

    constructor() {
        this.client = new MaturityClient();
    }

    async retrieveBaseMaturities(teamId) {
        const cards = [];
        const baseMaturities = await this.client.retrieveTeamMaturities(teamId);
        baseMaturities.forEach(maturity => {
            const maturityCard = new BasicMaturityCard(maturity.name, 2, 1);
            maturityCard.onclick = _ => this.changeHash(teamId, maturity.id);
            cards.push(maturityCard);
        });
        return cards;
    }

    changeHash(teamId, maturityId) {
        window.location.hash = `#teams/${teamId}/maturities/${maturityId}`;
    }
}