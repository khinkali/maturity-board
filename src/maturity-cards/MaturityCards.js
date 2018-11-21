import MaturityClient from './MaturityClient.js';
import TeamView from './TeamView.js';
import BaseMaturitiesView from './BaseMaturitiesView.js';
import DetailMaturityView from './DetailMaturityView.js';
import MinEfficiencyTable from '../min-efficiency/MinEfficiencyTable.js';
import MaxCycleTimeTable from '../max-cycle-time/MaxCycleTimeTable.js';
import MaxLeadTimeTable from '../max-lead-time/MaxLeadTimeTable.js';

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

    initializeAdditionalInformation(teamId, teamMaturityId, detailId, versionId) {
        const retrieveDetailMaturity = this.client.retrieveDetailMaturity(teamId, teamMaturityId, detailId);
        const retrieveTeam = this.client.retrieveTeam(teamId);
        const retrieveTeamMaturity = this.client.retrieveTeamMaturity(teamId, teamMaturityId);
        Promise.all([retrieveTeam, retrieveTeamMaturity, retrieveDetailMaturity])
            .then(([team, teamMaturity, detailMaturity]) => {
                if (detailMaturity.id === 'minEfficiency') {
                    this.cards = [new MinEfficiencyTable(detailMaturity.service.versions, teamId, teamMaturityId, detailId, versionId, detailMaturity.minEfficiency)];
                } else if (detailMaturity.id === 'maxCycleTime') {
                    this.cards = [new MaxCycleTimeTable(detailMaturity.service.versions, teamId, teamMaturityId, detailId, versionId, detailMaturity.maxCycleTimeInMs)];
                } else if (detailMaturity.id === 'maxLeadTime') {
                    this.cards = [new MaxLeadTimeTable(detailMaturity.service.versions, teamId, teamMaturityId, detailId, versionId, detailMaturity.maxLeadTimeInMs)];
                }
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
        let detailId = detailsPath.substring('details/'.length, detailsPath.length);
        maturityId = maturityId.substring(0, detailIdSeparator);
        const versionIdSeparator = detailId.indexOf('/');
        if (versionIdSeparator < 0) {
            this.initializeAdditionalInformation(teamId, maturityId, detailId);
            return;
        }
        const versionPath = detailId.substring(versionIdSeparator + 1, detailId.length);
        const versionId = versionPath.substring('versions/'.length, versionPath.length);
        detailId = detailId.substring(0, versionIdSeparator);
        this.initializeAdditionalInformation(teamId, maturityId, detailId, versionId);
    }
}

customElements.define('maturity-cards', MaturityCards);