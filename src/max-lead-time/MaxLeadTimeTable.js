import MaturityTable from '../maturity-table/MaturityTable.js';

export default class MaxLeadTimeTable extends MaturityTable{

    constructor(versions, teamId, teamMaturityId, detailId, maxLeadTime) {
        super(versions, teamId, teamMaturityId, detailId);
        this.maxLeadTime = maxLeadTime;
    }

    getRowStyle(version) {
        if (version.leadTimeInMs >= this.maxLeadTime) {
            return 'bg-danger';
        } else {
            return 'bg-success';
        }
    }
}

customElements.define('max-lead-time-table', MaxLeadTimeTable);
