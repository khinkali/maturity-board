import {html, render} from '../libs/lit-html.js';
import moment from '../libs/moment.js';
import PrettyPrinter from '../pretty-printer/PrettyPrinter.js';

export default class PipelineVisualisation extends HTMLElement {

    constructor(version) {
        super();
        this.version = version;
        this.totalLeadTime = version.leadTimeInMs;
        this.totalCycleTime = version.cycleTimeInMs;
        this.prettyPrinter = new PrettyPrinter();
    }

    connectedCallback() {
        render(html`
        <h4>${this.version.name}</h4>
        cycle time:
        <div class="progress">
            ${this.version.stages
            .sort((l, r) => this.sortStages(l, r))
            .flatMap(stage => this.toCycleTimeBar(stage))}  
        </div>
        lead time:
        <div class="progress">
            ${this.version.stages
            .sort((l, r) => this.sortStages(l, r))
            .flatMap(stage => this.toLeadTimeBar(stage))}  
        </div>
        <ul>
            ${this.version.stages
            .sort((l, r) => this.sortStages(l, r))
            .flatMap(stage => this.toListEntry(stage))} 
        </ul>
        `, this);
    }

    sortStages(leftStage, rightStage) {
        const left = moment(leftStage.start.start, PrettyPrinter.DATE_FORMAT).valueOf();
        const right = moment(rightStage.start.start, PrettyPrinter.DATE_FORMAT).valueOf();
        return left - right;
    }

    toLeadTimeBar(stage) {
        const bars = [];
        const widthLeadTime = (stage.leadTimeInMs / this.totalLeadTime) * 100;
        const startTime = moment(stage.start.start, PrettyPrinter.DATE_FORMAT);
        if (this.lastLeadTimeStage) {
            const lastEndTime = moment(this.lastLeadTimeStage.end.end, PrettyPrinter.DATE_FORMAT);
            const lastEndTimeWithPuffer = lastEndTime.add(1, 's');
            const isBreak = lastEndTimeWithPuffer.isBefore(startTime);
            if (isBreak) {
                const breakTimeInMs = moment.duration(startTime.diff(lastEndTimeWithPuffer)).as('ms');
                const widthBreak = (breakTimeInMs / this.totalLeadTime) * 100;
                bars.push(this.createBar(`waiting for ${this.prettyPrinter.prettyPrintTime(breakTimeInMs)}`, widthBreak, 'bg-danger'));
            }
        }
        bars.push(this.createBar(`${stage.name} :: ${this.prettyPrinter.prettyPrintTime(stage.leadTimeInMs)}`, widthLeadTime));
        this.lastLeadTimeStage = stage;
        return bars;
    }

    toCycleTimeBar(stage) {
        const widthCycleTime = (stage.cycleTimeInMs / this.totalCycleTime) * 100;
        return this.createBar(`${stage.name} :: ${this.prettyPrinter.prettyPrintTime(stage.cycleTimeInMs)}`, widthCycleTime);
    }

    createBar(title, widthInPercent, color) {
        if (!color) {
            if (this.color === 'bg-warning') {
                this.color = 'bg-info';
            } else {
                this.color = 'bg-warning';
            }
            color = this.color
        }
        return html`<div 
                class="progress-bar ${color} progress-bar-striped progress-bar-animated" 
                data-tooltip
                title="${title}"
                style="width: ${widthInPercent}%">
            </div>`;
    }

    toListEntry(stage) {
        return html`<li>${stage.name}</li>`;
    }
}

customElements.define('pipeline-visualization', PipelineVisualisation);