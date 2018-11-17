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

    initializeTeamMaturities(teamId) {
        this.devOps = undefined;
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

    render() {
        this.innerHTML = `
        ${this.getTitle()}
        <div class="cards">
        </div>
        `;
        const cards = this.querySelector('.cards');
        this.cards
            .forEach(card => {
                const maturityCard = new MaturityCard();
                maturityCard.setAttribute('title', card.name);
                maturityCard.setAttribute('level', 2);
                if (card.maturities) {
                    this.devOps = card;
                    maturityCard.onclick = _ => this.displayDevOpsMaturity(card);
                } else if (card.id) {
                    maturityCard.onclick = _ => this.displayTeamMaturity(card);
                }
                cards.appendChild(maturityCard)
            });
    }

    getTitle() {
        let title;
        if (this.team) {
            title = `
            <a href="#">
                <h2>${this.team.name}</h2>
            </a>`;
        } else {
            return '';
        }
        if (this.devOps) {
            title += `
            <a href="#teams/${this.team.id}">
                <h3>${this.devOps.name}</h3>
            </a>`;
        }
        return title;
    }

    displayDevOpsMaturity(maturities) {
        window.location.hash = `#teams/${this.team.id}/maturities/devOps`;
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
        let teamId = hash.substring(teamIdSeparator + 1, hash.length);
        const maturityIdSeparator = teamId.indexOf('/');
        if (maturityIdSeparator < 0) {
            this.initializeTeamMaturities(teamId);
            return;
        }
        const maturityId = teamId.substring(maturityIdSeparator + 1, teamId.length);
        teamId = teamId.substring(0, maturityIdSeparator);

        this.cards = this.devOps.maturities;
        this.render();
    }
}

customElements.define('maturity-cards', MaturityCards);