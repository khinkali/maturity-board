import MaturityTable from '../maturity-table/MaturityTable.js';

export default class MinEfficiencyTable extends MaturityTable {

    constructor(versions, minEfficiency) {
        super(versions);
        this.minEfficiency = minEfficiency;
    }

    getRowStyle(version) {
        if (version.efficiency <= this.minEfficiency) {
            return 'bg-danger';
        } else {
            return 'bg-success';
        }
    }
}

customElements.define('min-efficiency-table', MinEfficiencyTable);