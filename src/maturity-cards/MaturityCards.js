import MaturityClient from './MaturityClient.js';
import MaturityTable from '../maturity-table/MaturityTable.js';
import TeamView from './TeamView.js';
import BaseMaturitiesView from './BaseMaturitiesView.js';
import TemporalPrettyPrinter from '../temporal-pretty-printer/TemporalPrettyPrinter.js';
import DetailMaturityView from './DetailMaturityView.js';

export default class MaturityCards extends HTMLElement {

    constructor() {
        super();
        this.client = new MaturityClient();
        this.prettyPrinter = new TemporalPrettyPrinter();
    }

    connectedCallback() {
        window.onhashchange = _ => this.initialize();
        this.initialize();
    }

    initializeDetailMaturityTable(teamId, maturityId, detailId) {
        if (!this.detailTable) {
            const retrieveTeamMaturities = new MaturityClient().retrieveTeamMaturities(teamId);
            const retrieveTeam = new MaturityClient().retrieveTeam(teamId);
            Promise.all([retrieveTeam, retrieveTeamMaturities])
                .then(([team, maturities]) => {
                    this.team = team;
                    let teamMaturity = maturities
                        .filter(maturity => maturity.id === maturityId)[0];
                    this.teamMaturity = teamMaturity;
                    this.cards = teamMaturity.maturities
                        .filter(detail => detail.id === detailId);
                    this.detailTable = this.cards[0];
                    this.render();
                });
        } else {
            this.cards = this.teamMaturity.maturities;
            this.render();
        }
    }

    initializeDetailMaturity(teamId, maturityId) {
        this.detailTable = undefined;
        if (!this.teamMaturity) {
            const retrieveTeamMaturities = new MaturityClient().retrieveTeamMaturities(teamId);
            const retrieveTeam = new MaturityClient().retrieveTeam(teamId);
            Promise.all([retrieveTeam, retrieveTeamMaturities])
                .then(([team, maturities]) => {
                    this.team = team;
                    let teamMaturity = maturities
                        .filter(maturity => maturity.id === maturityId)[0];
                    this.teamMaturity = teamMaturity;
                    this.cards = teamMaturity.maturities;
                    this.render();
                });
        } else {
            this.cards = this.teamMaturity.maturities;
            this.render();
        }
    }

    render() {
        this.innerHTML = `
        ${this.title}
        <div class="cards">
        </div>
        `;
        const cards = this.querySelector('.cards');
        this.cards
            .forEach(card => cards.appendChild(card));
        this.renderDetailTable();
    }

    renderDetailTable() {
        if (this.detailTable) {
            this.appendChild(new MaturityTable(this.detailTable.minEfficiency, this.detailTable.minEfficiencyService.versions));
        }
    }

    getTitle() {
        let title;
        if (this.team) {
        } else {
            return '';
        }
        if (this.teamMaturity) {
        }
        if (this.detailTable) {
            title += `
            <a href="#teams/${this.team.id}/maturities/${this.teamMaturity.id}">
                <h4>${this.detailTable.name}</h4>
            </a>`;
        }
        return title;
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
        this.initializeDetailMaturityTable(teamId, maturityId, detailId);
    }
}

customElements.define('maturity-cards', MaturityCards);