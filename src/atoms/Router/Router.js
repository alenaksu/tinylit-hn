import Navigo from 'navigo';

class Router extends HTMLElement {
    static get is() {
        return 'hn-router';
    }
    constructor() {
        super();

        document.addEventListener('click', this.handleClick.bind(this), true);

        this.router = new Navigo();

        requestAnimationFrame((() => this.router.resolve()))
    }

    handleClick(e) {
        const target = e.target;
        if (target.nodeName === 'A' && ~target.href.indexOf(location.hostname)) {
            e.preventDefault();
            e.stopImmediatePropagation();

            this.router.navigate(target.href, true);
        }
    }
}
customElements.define(Router.is, Router);
