import MaturityCard from './MaturityCard.js';
import MaturityClient from './MaturityClient.js';

export default class MaturityCards extends HTMLElement {

    connectedCallback() {
        new MaturityClient().retrieveTeams()
            .then(teams => {
                this.teams = teams;
                this.render();
            });
        this.className = 'cards';
    }

    render() {
        this.teams
            .forEach(team => {
                const maturityCard = new MaturityCard();
                maturityCard.setAttribute('title', team.name);
                maturityCard.setAttribute('level', 2);
                this.appendChild(maturityCard)
            });
    }
}

customElements.define('maturity-cards', MaturityCards);