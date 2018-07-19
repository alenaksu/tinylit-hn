class Route extends HTMLElement {
    static get is() {
        return 'hn-route';
    }

    connectedCallback() {
        this.component = document.createElement(this.getAttribute('component'));

        this.router = this.closest('hn-router').router;
        this.router.on(this.getAttribute('path'), () => {}, {
            after: params => {
                debugger;
                for(let key in params) {
                    this.component[key] = params[key];
                }
                this.appendChild(this.component);
            },
            leave: () => {
                this.removeChild(this.component);
            }
        })
    }
}

customElements.define(Route.is, Route);
