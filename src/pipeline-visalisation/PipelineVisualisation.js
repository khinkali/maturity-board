import {html, render} from '../libs/lit-html.js';

export default class PipelineVisualisation extends HTMLElement {

    constructor(version) {
        super();
        this.version = version;
        this.totalLeadTime = version.leadTimeInMs;
        this.totalCycleTime = version.cycleTimeInMs;
    }

    connectedCallback() {
        render(html`
        <h4>${this.version.name}</h4>
        cycle time:
        <div class="progress">
            ${this.version.stages
            .map(stage => this.toCycleTimeBar(stage))}  
        </div>
        lead time:
        <div class="progress">
            ${this.version.stages
            .map(stage => this.toLeadTimeBar(stage))}  
        </div>
        <ul>
            ${this.version.stages
            .map(stage => this.toListEntry(stage))} 
        </ul>
        `, this);
    }

    toLeadTimeBar(stage) {
        const widthLeadTime = (stage.leadTimeInMs / this.totalLeadTime) * 100;
        return this.createBar(stage.name, widthLeadTime);
    }

    toCycleTimeBar(stage) {
        const widthCycleTime = (stage.cycleTimeInMs / this.totalCycleTime) * 100;
        return this.createBar(stage.name, widthCycleTime);
    }

    createBar(title, widthInPercent) {
        if (this.color === 'bg-warning') {
            this.color = 'bg-info';
        } else {
            this.color = 'bg-warning';
        }
        return html`<div 
                class="progress-bar ${this.color} progress-bar-striped progress-bar-animated" 
                title="${title}"
                style="width: ${widthInPercent}%">
            </div>`;
    }

    toListEntry(stage) {
        return html`<li>${stage.name}</li>`;
    }
}

customElements.define('pipeline-visualization', PipelineVisualisation);