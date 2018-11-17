import MaturityCard from './MaturityCard.js';
import MaturityClient from './MaturityClient.js';
import MaturityTable from '../maturity-table/MaturityTable.js';

export default class MaturityCards extends HTMLElement {

    connectedCallback() {
        window.onhashchange = _ => this.initialize();
        this.initialize();
    }

    initializeTeams() {
        this.team = undefined;
        this.detailTable = undefined;
        new MaturityClient().retrieveTeams()
            .then(teams => {
                this.cards = teams;
                this.render();
            });
    }

    initializeTeamMaturities(teamId) {
        this.teamMaturity = undefined;
        this.detailTable = undefined;
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
                    this.cards = teamMaturity.maturities;
                    this.detailTable = teamMaturity.maturities
                        .filter(detail => detail.id === detailId)[0];
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
        ${this.getTitle()}
        <div class="cards">
        </div>
        `;
        const cards = this.querySelector('.cards');
        this.cards
            .forEach(card => {
                const maturityCard = new MaturityCard(card.name);
                if (card.maturities) {
                    this.teamMaturity = card;
                    maturityCard.level = 2;
                    maturityCard.body = `
                    <p>Maturity-Level: ${maturityCard.level}<p>
                    <p>Minimum-Maturity: <i class="fas ${maturityCard.determineMinimumMaturity()}"></i></p>
                    `;
                    maturityCard.onclick = _ => this.displayDetailMaturity(card);
                } else if (card.maxLeadTimeInMs) {
                    const maxLeadTimeInMs = card.maxLeadTime.maxLeadTimeInMs;
                    const maxAllowedLeadTimeInMs = card.maxLeadTimeInMs;
                    maturityCard.minimumMaturity = maxAllowedLeadTimeInMs >= maxLeadTimeInMs;
                    maturityCard.body = `
                    <p>Fullfiled: <i class="fas ${maturityCard.determineMinimumMaturity()}"></i></p>
                    <p>Maximum allowed Lead Time: <br />
                    ${this.prettyPrintTime(maxAllowedLeadTimeInMs)}</p>
                    <p>Max Lead Time: <br />
                    ${this.prettyPrintTime(maxLeadTimeInMs)}</p>
                    `;
                } else if (card.maxCycleTimeInMs) {
                    const maxCycleTimeInMs = card.maxCycleTime.maxCycleTimeInMs;
                    const maxAllowedCycleTimeInMs = card.maxCycleTimeInMs;
                    maturityCard.minimumMaturity = maxAllowedCycleTimeInMs >= maxCycleTimeInMs;
                    maturityCard.body = `
                    <p>Fullfiled: <i class="fas ${maturityCard.determineMinimumMaturity()}"></i></p>
                    <p>Maximum allowed Cycle Time: <br />
                    ${this.prettyPrintTime(maxAllowedCycleTimeInMs)}</p>
                    <p>Max Cycle Time: <br />
                    ${this.prettyPrintTime(maxCycleTimeInMs)}</p>
                    `;
                } else if (card.minEfficiency) {
                    const currentMinEfficiency = card.minEfficiencyService.minEfficiency;
                    const minEfficiency = card.minEfficiency;
                    maturityCard.minimumMaturity = currentMinEfficiency >= minEfficiency;
                    maturityCard.body = `
                    <p>Fullfiled: <i class="fas ${maturityCard.determineMinimumMaturity()}"></i></p>
                    <p>Minimum Efficiency<br />
                    ${Math.trunc(100 * currentMinEfficiency)}%</p>
                    <p>Minimum allowed Efficiency<br />
                    ${Math.trunc(100 * minEfficiency)}%</p>
                    `;
                    maturityCard.onclick = e => this.displayDetailMaturityTable(card);
                } else {
                    maturityCard.level = 2;
                    maturityCard.body = `
                    <p>Maturity-Level: ${maturityCard.level}<p>
                    <p>Minimum-Maturity: <i class="fas ${maturityCard.determineMinimumMaturity()}"></i></p>
                    `;
                    maturityCard.onclick = _ => this.displayTeamMaturity(card);
                }
                cards.appendChild(maturityCard)
            });
        this.renderDetailTable();
    }

    renderDetailTable() {
        if (this.detailTable) {
            this.appendChild(new MaturityTable(this.detailTable.minEfficiency, this.detailTable.minEfficiencyService.versions));
        }
    }

    prettyPrintTime(timeInMs) {
        timeInMs = Math.trunc(timeInMs);
        if (timeInMs < 1000) {
            return `${timeInMs}ms`;
        }
        let seconds = Math.trunc(timeInMs / 1000);
        const ms = Math.trunc(timeInMs % 1000);
        if (seconds < 60) {
            return `${seconds}s${this.getMs(ms)}`;
        }
        let min = Math.trunc(seconds / 60);
        seconds = Math.trunc(seconds % 60);
        if (min < 60) {
            return `${min}min ${this.getSecond(seconds)}${this.getMs(ms)}`;
        }
        let h = Math.trunc(min / 60);
        min = Math.trunc(min % 60);
        if (h < 24) {
            return `${h}h ${this.getMin(min)}${this.getSecond(seconds)}`;
        }
        let day = Math.trunc(h / 24);
        h = Math.trunc(h % 24);
        return `${day}d ${this.getH(h)}${this.getMin(min)}`;
    }

    getH(h) {
        if (h === 0) {
            return '';
        } else {
            return ` ${h}h`;
        }
    }

    getMin(min) {
        if (min === 0) {
            return '';
        } else {
            return ` ${min}min`;
        }
    }

    getSecond(seconds) {
        if (seconds === 0) {
            return '';
        } else {
            return ` ${seconds}s`;
        }
    }

    getMs(ms) {
        if (ms === 0) {
            return '';
        } else {
            return ` ${ms}ms`;
        }
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
        if (this.teamMaturity) {
            title += `
            <a href="#teams/${this.team.id}">
                <h3>${this.teamMaturity.name}</h3>
            </a>`;
        }
        if (this.detailTable) {
            title += `
            <a href="#teams/${this.team.id}/maturities/${this.teamMaturity.id}">
                <h4>${this.detailTable.name}</h4>
            </a>`;
        }
        return title;
    }

    displayTeamMaturity(team) {
        window.location.hash = `#teams/${team.id}`;
    }

    displayDetailMaturity(detailMaturity) {
        window.location.hash = `#teams/${this.team.id}/maturities/${detailMaturity.id}`;
    }

    displayDetailMaturityTable(detailMaturity) {
        window.location.hash = `#teams/${this.team.id}/maturities/${this.teamMaturity.id}/details/${detailMaturity.id}`;
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
        const maturitiesPath = teamId.substring(maturityIdSeparator + 1, teamId.length);
        let maturityId = maturitiesPath.substring('maturities/'.length, maturitiesPath.length);
        teamId = teamId.substring(0, maturityIdSeparator);
        const detailIdSeparator = maturityId.indexOf('/');
        if (detailIdSeparator < 0) {
            this.initializeDetailMaturity(teamId, maturityId);
            return;
        }
        const detailsPath = maturityId.substring(detailIdSeparator + 1, maturityId.length);
        const detailId = detailsPath.substring('details/'.length, detailsPath.length);
        maturityId = maturityId.substring(0, detailIdSeparator);
        this.initializeDetailMaturityTable(teamId, maturityId, detailId);
    }
}

customElements.define('maturity-cards', MaturityCards);