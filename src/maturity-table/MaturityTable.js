export default class MaturityTable extends HTMLElement {

    constructor(minEfficiency, versions) {
        super();
        this.minEfficiency = minEfficiency;
        this.versions = versions;
    }

    connectedCallback() {
        this.innerHTML = `
        <table class="table table-hover table-dark">
          <thead>
            <tr>
              <th scope="col">Version</th>
              <th scope="col">Cycle Time</th>
              <th scope="col">Lead Time</th>
              <th scope="col">Efficiency</th>
            </tr>
          </thead>
          <tbody>
          ${this.versions
            .map(version => this.createRow(version))
            .join('')}
          </tbody>
        </table>
        `;
    }

    createRow(version) {
        return `
        <tr class="${(version.efficiency <= this.minEfficiency) ? 'bg-danger' : 'bg-success'}">
          <th scope="row">${version.name}</th>
          <td>${version.cycleTimeInMs}</td>
          <td>${version.leadTimeInMs}</td>
          <td>${version.efficiency}</td>
        </tr>
        `;
    }
}

customElements.define('maturity-table', MaturityTable);