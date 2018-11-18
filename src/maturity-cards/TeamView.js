import MaturityClient from './MaturityClient.js';
import BasicMaturityCard from '../maturity-card/BasicMaturityCard.js';

export default class TeamView {

    constructor() {
        this.client = new MaturityClient();
    }

    async retrieveTeams() {
        const cards = [];
        const teams = await this.client.retrieveTeams();
        teams.forEach(team => {
            const teamCard = new BasicMaturityCard(team.name, 2);
            teamCard.onclick = _ => this.changeHash(team.id);
            cards.push(teamCard);
        });
        return cards;
    }

    changeHash(teamId) {
        window.location.hash = `#teams/${teamId}`;
    }

}