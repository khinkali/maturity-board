import PrettyPrinter from '../temporal-pretty-printer/PrettyPrinter.js';
import {html, render} from '../libs/lit-html.js';
import PipelineVisualisation from '../pipeline-visalisation/PipelineVisualisation.js';

export default class MaturityTable extends HTMLElement {

    constructor(versions) {
        super();
        this.versions = versions;
        this.prettyPrinter = new PrettyPrinter();
    }

    connectedCallback() {
        render(html`
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
            .map(version => this.createRow(version))}
          </tbody>
        </table>
        `, this);
    }

    createRow(version) {
        return html`
        <tr @click="${_ => this.onRowClick(version)}" class="${this.getRowStyle(version)}">
          <th scope="row">${version.name}</th>
          <td>${this.prettyPrinter.prettyPrintTime(version.cycleTimeInMs)}</td>
          <td>${this.prettyPrinter.prettyPrintTime(version.leadTimeInMs)}</td>
          <td>${this.prettyPrinter.prettyPrintPercent(version.efficiency)}</td>
        </tr>
        `;
    }

    onRowClick(version) {
        const newChild = new PipelineVisualisation(version);
        if(this.oldChild){
            this.removeChild(this.oldChild);
        }
        this.appendChild(newChild);
        this.oldChild = newChild;
    }

    getRowStyle(version) {
        return '';
    }
}

customElements.define('maturity-table', MaturityTable);