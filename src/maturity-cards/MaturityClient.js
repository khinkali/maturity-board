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
}