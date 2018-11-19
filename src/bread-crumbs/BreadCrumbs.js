import MaturityCards from '../maturity-cards/MaturityCards.js';

export default class BreadCrumbs extends HTMLElement {

    connectedCallback() {
        this.onUpdateBreadCrumbs = e => this.updateBreadCrumbs(e.detail);
        document.addEventListener(MaturityCards.EVENTS.VIEW_UPDATED, this.onUpdateBreadCrumbs);
    }

    disconnectedCallback() {
        this.removeEventListener(MaturityCards.EVENTS.VIEW_UPDATED, this.onUpdateBreadCrumbs);
    }

    updateBreadCrumbs({team, teamMaturity, detailMaturity}) {
        if (team) {
            this.innerHTML = `
            <a href="#">
                <h2>${team.name}</h2>
            </a>`;
        }
        if (teamMaturity) {
            this.innerHTML += ` 
            <a href="#teams/${team.id}">
                <h3>${teamMaturity.name}</h3>
            </a>`;
        }
        if (detailMaturity) {
            this.innerHTML += `
            <a href="#teams/${team.id}/maturities/${teamMaturity.id}">
                <h4>${detailMaturity.name}</h4>
            </a>`;
        }
    }
}

customElements.define('bread-crumbs', BreadCrumbs);