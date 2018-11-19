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

    static get EVENTS() {
        return {
            VIEW_UPDATED: 'view-updated'
        };
    }

    render(team, teamMaturity, detailMaturity) {
        this.innerHTML = `
        <bread-crumbs></bread-crumbs>
        <div class="cards">
        </div>
        `;
        const cards = this.querySelector('.cards');
        this.cards.forEach(card => cards.appendChild(card));
        this.dispatchEvent(new CustomEvent(MaturityCards.EVENTS.VIEW_UPDATED, {
            detail: {
                team: team,
                teamMaturity: teamMaturity,
                detailMaturity: detailMaturity
            },
            bubbles: true
        }));
    }

    initializeTeamsView() {
        new TeamView()
            .retrieveTeams()
            .then(cards => {
                this.cards = cards;
                this.render();
            });
    }

    initializeTeamMaturities(teamId) {
        const retrieveBaseMaturities = new BaseMaturitiesView()
            .retrieveBaseMaturities(teamId);
        const retrieveTeam = this.client.retrieveTeam(teamId);
        Promise.all([retrieveTeam, retrieveBaseMaturities])
            .then(([team, cards]) => {
                this.cards = cards;
                this.render(team);
            });
    }

    initializeDetailMaturities(teamId, teamMaturityId) {
        const retrieveDetailMaturities = new DetailMaturityView().retrieveDetailMaturities(teamId, teamMaturityId);
        const retrieveTeam = this.client.retrieveTeam(teamId);
        const retrieveTeamMaturity = this.client.retrieveTeamMaturity(teamId, teamMaturityId);
        Promise.all([retrieveTeam, retrieveTeamMaturity, retrieveDetailMaturities])
            .then(([team, teamMaturity, cards]) => {
                this.cards = cards;
                this.render(team, teamMaturity);
            });
    }

    initializeAdditionalInformation(teamId, teamMaturityId, detailId) {
        const retrieveDetailMaturity = this.client.retrieveDetailMaturity(teamId, teamMaturityId, detailId);
        const retrieveTeam = this.client.retrieveTeam(teamId);
        const retrieveTeamMaturity = this.client.retrieveTeamMaturity(teamId, teamMaturityId);
        Promise.all([retrieveTeam, retrieveTeamMaturity, retrieveDetailMaturity])
            .then(([team, teamMaturity, detailMaturity]) => {
                this.cards = [new MaturityTable(detailMaturity.minEfficiency, detailMaturity.minEfficiencyService.versions)];
                this.render(team, teamMaturity, detailMaturity);
            });
    }

    initialize() {
        const hash = window.location.hash.substring(1);
        const teamIdSeparator = hash.indexOf('/');
        if (teamIdSeparator < 0) {
            this.initializeTeamsView();
            return;
        }
        let teamId = hash.substring(teamIdSeparator + 1, hash.length);
        const maturityIdSeparator = teamId.indexOf('/');
        if (maturityIdSeparator < 0) {
            this.initializeTeamMaturities(teamId);
            return;
        }
        const maturitiesPath = teamId.substring(maturityIdSeparator + 1, teamId.length);
        let maturityId = maturitiesPath.substring('maturities/'.length, maturitiesPath.length);
        teamId = teamId.substring(0, maturityIdSeparator);
        const detailIdSeparator = maturityId.indexOf('/');
        if (detailIdSeparator < 0) {
            this.initializeDetailMaturities(teamId, maturityId);
            return;
        }
        const detailsPath = maturityId.substring(detailIdSeparator + 1, maturityId.length);
        const detailId = detailsPath.substring('details/'.length, detailsPath.length);
        maturityId = maturityId.substring(0, detailIdSeparator);
        this.initializeAdditionalInformation(teamId, maturityId, detailId);
    }
}

customElements.define('maturity-cards', MaturityCards);