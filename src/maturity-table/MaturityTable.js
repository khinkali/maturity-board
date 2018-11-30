import PrettyPrinter from '../pretty-printer/PrettyPrinter.js';
import {html, render} from '../libs/lit-html.js';
import PipelineVisualisation from '../pipeline-visualisation/PipelineVisualisation.js';
import MaturityClient from '../maturity-cards/MaturityClient.js';

export default class MaturityTable extends HTMLElement {

    constructor(versions, teamId, baseMaturityId, detailId, versionId) {
        super();
        this.versions = versions;
        this.teamId = teamId;
        this.baseMaturityId = baseMaturityId;
        this.detailId = detailId;
        this.prettyPrinter = new PrettyPrinter();

        if(versionId) {
             new MaturityClient()
                 .retrieveVersionDetails(teamId, baseMaturityId, detailId, versionId)
                 .then(version => this.drawPipeline(version));
        }
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
        this.changeHash(this.teamId, this.baseMaturityId, this.detailId, version.name);
    }

    drawPipeline(version) {
        const newChild = new PipelineVisualisation(version);
        if (this.oldChild) {
            this.removeChild(this.oldChild);
        }
        this.appendChild(newChild);
        this.oldChild = newChild;
    }

    changeHash(teamId, baseMaturityId, detailId, versionId) {
        window.location.hash = `#teams/${teamId}/maturities/${baseMaturityId}/details/${detailId}/versions/${versionId}`;
    }

    getRowStyle(version) {
        return '';
    }
}

customElements.define('maturity-table', MaturityTable);