import {html, render} from '../libs/lit-html.js';
import moment from '../libs/moment.js';
import PrettyPrinter from '../pretty-printer/PrettyPrinter.js';

export default class ExecutionStepVisualisation extends HTMLElement {

    constructor(stage) {
        super();
        this.stage = stage;
        this.totalLeadTime = stage.leadTimeInMs;
        this.totalCycleTime = stage.cycleTimeInMs;
        this.prettyPrinter = new PrettyPrinter();
    }

    connectedCallback() {
        render(html`
        <h4>${this.stage.name}</h4>
        cycle time:
        <div class="progress">
            ${this.stage.executionSteps
            .sort((l, r) => this.sortSteps(l, r))
            .flatMap(step => this.toCycleTimeBar(step))}  
        </div>
        lead time:
        <div class="progress">
            ${this.stage.executionSteps
            .sort((l, r) => this.sortSteps(l, r))
            .flatMap(stage => this.toLeadTimeBar(stage))}  
        </div>
        <ul>
            ${this.stage.executionSteps
            .sort((l, r) => this.sortSteps(l, r))
            .flatMap(stage => this.toListEntry(stage))} 
        </ul>
        `, this);
    }

    sortSteps(leftStep, rightStep) {
        const left = moment(leftStep.start, PrettyPrinter.DATE_FORMAT).valueOf();
        const right = moment(rightStep.start, PrettyPrinter.DATE_FORMAT).valueOf();
        return left - right;
    }

    toLeadTimeBar(step) {
        const bars = [];
        const widthLeadTime = (step.timeInMs / this.totalLeadTime) * 100;
        const startTime = moment(step.start, PrettyPrinter.DATE_FORMAT);
        if (this.lastLeadTimeStep) {
            const lastEndTime = moment(this.lastLeadTimeStep.end, PrettyPrinter.DATE_FORMAT);
            const lastEndTimeWithPuffer = lastEndTime.add(1, 's');
            const isBreak = lastEndTimeWithPuffer.isBefore(startTime);
            if (isBreak) {
                const breakTimeInMs = moment.duration(startTime.diff(lastEndTimeWithPuffer)).as('ms');
                const widthBreak = (breakTimeInMs / this.totalLeadTime) * 100;
                bars.push(this.createBar(`waiting for ${this.prettyPrinter.prettyPrintTime(breakTimeInMs)}`, widthBreak, 'bg-danger'));
            }
        }
        bars.push(this.createBar(`${step.name} :: ${this.prettyPrinter.prettyPrintTime(step.timeInMs)}`, widthLeadTime));
        this.lastLeadTimeStep = step;
        return bars;
    }

    toCycleTimeBar(step) {
        const widthCycleTime = (step.timeInMs / this.totalCycleTime) * 100;
        return this.createBar(`${step.name} :: ${this.prettyPrinter.prettyPrintTime(step.timeInMs)}`, widthCycleTime);
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

    toListEntry(step) {
        return html`<li>${step.name}</li>`;
    }
}

customElements.define('step-visualisation', ExecutionStepVisualisation);
