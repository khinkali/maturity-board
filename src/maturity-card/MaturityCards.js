import MaturityCard from './MaturityCard.js';
import MaturityClient from './MaturityClient.js';

export default class MaturityCards extends HTMLElement {

    connectedCallback() {
        window.onhashchange = _ => this.initialize();
        this.initialize();
    }

    initializeTeams() {
        this.team = undefined;
        new MaturityClient().retrieveTeams()
            .then(teams => {
                this.cards = teams;
                this.render();
            });
    }

    render() {
        this.innerHTML = `
        <p id="cards-title"></p>
        <div class="cards">
        </div>
        `;
        const cards = this.querySelector('.cards');
        const cardsTitle = this.querySelector('#cards-title');
        if (this.team) {
            cardsTitle.innerHTML = `<a href="#"><h2>${this.team.name}</h2></a>`;
        }
        this.cards
            .forEach(card => {
                const maturityCard = new MaturityCard();
                maturityCard.setAttribute('title', card.name);
                maturityCard.setAttribute('level', 2);
                if (card.id) {
                    maturityCard.onclick = _ => this.displayTeamMaturity(card);
                }
                cards.appendChild(maturityCard)
            });
    }

    displayTeamMaturity(team) {
        window.location.hash = `#teams/${team.id}`;
    }

    initialize() {
        const hash = window.location.hash.substring(1);
        const teamIdSeparator = hash.indexOf('/');
        if (teamIdSeparator < 0) {
            this.initializeTeams();
            return;
        }
        const teamId = hash.substring(teamIdSeparator + 1, hash.length);
        const maturityClient = new MaturityClient();
        const retrieveTeam = maturityClient.retrieveTeam(teamId);
        const retriveTeamMaturities = maturityClient.retrieveTeamMaturities(teamId);
        Promise.all([retrieveTeam, retriveTeamMaturities])
            .then(([team, maturities]) => {
                this.team = team;
                this.cards = maturities;
                this.render();
            });
    }
}

customElements.define('maturity-cards', MaturityCards);