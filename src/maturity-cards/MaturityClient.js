export default class MaturityClient {

    retrieveTeams() {
        return fetch('http://localhost:9080/sink/resources/teams')
            .then(res => res.json());
    }

    retrieveTeam(teamId) {
        return fetch(`http://localhost:9080/sink/resources/teams/${teamId}`)
            .then(res => res.json());
    }

    retrieveTeamMaturities(teamId) {
        return fetch(`http://localhost:9080/sink/resources/teams/${teamId}/maturities`)
            .then(res => res.json());
    }

    async retrieveTeamMaturity(teamId, maturityId) {
        const maturities = await fetch(`http://localhost:9080/sink/resources/teams/${teamId}/maturities`)
            .then(res => res.json());
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