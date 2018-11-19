import MaturityClient from './MaturityClient.js';
import MaturityTable from '../maturity-table/MaturityTable.js';
import TeamView from './TeamView.js';
import BaseMaturitiesView from './BaseMaturitiesView.js';
import DetailMaturityView from './DetailMaturityView.js';

export default class MaturityCards extends HTMLElement {

    constructor() {
        super();
        this.client = new MaturityClient();
    }

    connectedCallback() {
        window.onhashchange = _ => this.initialize();
        this.initialize();
    }

    render() {
        this.innerHTML = `
        ${this.title}
        <div class="cards">
        </div>
        `;
        const cards = this.querySelector('.cards');
        this.cards.forEach(card => cards.appendChild(card));
    }

    renderDetailTable() {
        if (this.detailTable) {
            this.appendChild(new MaturityTable(this.detailTable.minEfficiency, this.detailTable.minEfficiencyService.versions));
        }
    }

    initialize() {
        const hash = window.location.hash.substring(1);
        const teamIdSeparator = hash.indexOf('/');
        if (teamIdSeparator < 0) {
            this.title = '';
            new TeamView()
                .retrieveTeams()
                .then(cards => {
                    this.cards = cards;
                    this.render();
                });
            return;
        }
        let teamId = hash.substring(teamIdSeparator + 1, hash.length);
        const maturityIdSeparator = teamId.indexOf('/');
        if (maturityIdSeparator < 0) {
            const retrieveBaseMaturities = new BaseMaturitiesView()
                .retrieveBaseMaturities(teamId);
            const retrieveTeam = this.client.retrieveTeam(teamId);
            Promise.all([retrieveTeam, retrieveBaseMaturities])
                .then(([team, cards]) => {
                    this.cards = cards;
                    this.title = `
                    <a href="#">
                        <h2>${team.name}</h2>
                    </a>`;
                    this.render();
                });
            return;
        }
        const maturitiesPath = teamId.substring(maturityIdSeparator + 1, teamId.length);
        let maturityId = maturitiesPath.substring('maturities/'.length, maturitiesPath.length);
        teamId = teamId.substring(0, maturityIdSeparator);
        const detailIdSeparator = maturityId.indexOf('/');
        if (detailIdSeparator < 0) {
            const retrieveDetailMaturities = new DetailMaturityView().retrieveDetailMaturities(teamId, maturityId);
            const retrieveTeam = this.client.retrieveTeam(teamId);
            const retrieveTeamMaturity = this.client.retrieveTeamMaturity(teamId, maturityId);
            Promise.all([retrieveTeam, retrieveTeamMaturity, retrieveDetailMaturities])
                .then(([team, maturity, cards]) => {
                    this.title = `
                    <a href="#">
                        <h2>${team.name}</h2>
                    </a>
                    <a href="#teams/${team.id}">
                        <h3>${maturity.name}</h3>
                    </a>`;
                    this.cards = cards;
                    this.render();
                });
            return;
        }
        const detailsPath = maturityId.substring(detailIdSeparator + 1, maturityId.length);
        const detailId = detailsPath.substring('details/'.length, detailsPath.length);
        maturityId = maturityId.substring(0, detailIdSeparator);
        const retrieveDetailMaturity = this.client.retrieveDetailMaturity(teamId, maturityId, detailId);
        const retrieveTeam = this.client.retrieveTeam(teamId);
        const retrieveTeamMaturity = this.client.retrieveTeamMaturity(teamId, maturityId);
        Promise.all([retrieveTeam, retrieveTeamMaturity, retrieveDetailMaturity])
            .then(([team, teamMaturity, detailMaturity]) => {
                this.title = `
                    <a href="#">
                        <h2>${team.name}</h2>
                    </a>
                    <a href="#teams/${team.id}">
                        <h3>${teamMaturity.name}</h3>
                    </a>
                    <a href="#teams/${team.id}/maturities/${teamMaturity.id}">
                        <h4>${detailMaturity.name}</h4>
                    </a>`;
                this.cards = [new MaturityTable(detailMaturity.minEfficiency, detailMaturity.minEfficiencyService.versions)];
                this.render();
            });
    }
}

customElements.define('maturity-cards', MaturityCards);