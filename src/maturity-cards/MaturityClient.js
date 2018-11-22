export default class MaturityClient {

    async getBaseUrl() {
        const baseUrl = await fetch('config/config.json')
            .then(res => res.json())
        return `${baseUrl.baseUrl}/sink/resources/teams`
    }

    async retrieveTeams() {
        const baseUrl = await this.getBaseUrl();
        return fetch(baseUrl)
            .then(res => res.json());
    }

    async retrieveTeam(teamId) {
        const baseUrl = await this.getBaseUrl();
        return fetch(`${baseUrl}/${teamId}`)
            .then(res => res.json());
    }

    async retrieveTeamMaturities(teamId) {
        const baseUrl = await this.getBaseUrl();
        return fetch(`${baseUrl}/${teamId}/maturities`)
            .then(res => res.json());
    }

    async retrieveTeamMaturity(teamId, maturityId) {
        const maturities = await this.retrieveTeamMaturities(teamId);
        return maturities
            .filter(maturity => maturity.id === maturityId)[0];
    }

    async retrieveDetailMaturity(teamId, maturityId, detailId) {
        const teamMaturity = await this.retrieveTeamMaturity(teamId, maturityId);
        return teamMaturity
            .maturities
            .filter(maturity => maturity.id === detailId)[0];
    }

    async retrieveVersionDetails(teamId, maturityId, detailId, versionId) {
        const detail = await this.retrieveDetailMaturity(teamId, maturityId, detailId);
        return detail
            .service
            .versions
            .filter(version => version.name === versionId)[0];
    }
}