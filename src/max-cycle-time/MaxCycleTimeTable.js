import MaturityTable from '../maturity-table/MaturityTable.js';

export default class MaxCycleTimeTable extends MaturityTable{

    constructor(versions, teamId, teamMaturityId, detailId, versionId, maxCycleTime) {
        super(versions, teamId, teamMaturityId, detailId, versionId);
        this.maxCycleTime = maxCycleTime;
    }

    getRowStyle(version) {
        if (version.cycleTime >= this.maxCycleTime) {
            return 'bg-danger';
        } else {
            return 'bg-success';
        }
    }
}

customElements.define('max-cycle-time-table', MaxCycleTimeTable);