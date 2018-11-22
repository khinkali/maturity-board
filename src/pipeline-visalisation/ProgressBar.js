export default class ProgressBar extends HTMLElement {

    constructor(color, widthInPercent) {
        super();
        this.color = color;
        this.widthInPercent = widthInPercent;
    }

    connectedCallback() {
        this.color = this.getAttribute('color');
        this.widthInPercent = this.getAttribute('bar-width');
        this.className = `progress-bar ${this.color} progress-bar-striped progress-bar-animated`;
        this.setAttribute('style', `width: ${this.widthInPercent}%`);
        this.removeAttribute('color');
        this.removeAttribute('bar-width');
    }
}

customElements.define('progress-bar', ProgressBar);