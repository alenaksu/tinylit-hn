import {Router} from '../../router';

class RouterElement extends HTMLElement {
    static get is() {
        return 'hn-router';
    }

    connectedCallback() {
        this.router = new Router({ interceptLocal: true });
        requestAnimationFrame(() => this.router.resolve());
    }
}
customElements.define(RouterElement.is, RouterElement);
