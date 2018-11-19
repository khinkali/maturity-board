import PrettyPrinter from '../temporal-pretty-printer/PrettyPrinter.js';

export default class MaturityTable extends HTMLElement {

    constructor(versions) {
        super();
        this.versions = versions;
        this.prettyPrinter = new PrettyPrinter();
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
        <tr class="${this.getRowStyle(version)}">
          <th scope="row">${version.name}</th>
          <td>${this.prettyPrinter.prettyPrintTime(version.cycleTimeInMs)}</td>
          <td>${this.prettyPrinter.prettyPrintTime(version.leadTimeInMs)}</td>
          <td>${this.prettyPrinter.prettyPrintPercent(version.efficiency)}</td>
        </tr>
        `;
    }

    getRowStyle(version) {
        return '';
    }
}

customElements.define('maturity-table', MaturityTable);