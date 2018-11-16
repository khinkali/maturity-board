export default class MaturityClient {

    retrieveTeams() {
        return fetch('http://localhost:9080/sink/resources/teams')
            .then(res => res.json());
    }
}