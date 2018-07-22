function updateComponentParams(component, params) {
    for(let key in params)
        component[key] = params[key];
}

class RouteElement extends HTMLElement {
    static get is() {
        return 'hn-route';
    }

    connectedCallback() {
        let component = document.createElement(this.getAttribute('component'));

        let path = this.getAttribute('path');

        this.router = this.closest('hn-router').router;
        this.router.on(path, {
            onEnter: params => {
                updateComponentParams(
                    component,
                    params
                );

                this.appendChild(component);

                component.onRouteEnter && component.onRouteEnter();
            },
            onUpdate: params => {
                updateComponentParams(
                    component,
                    params
                );

                component.onRouteUpdate && component.onRouteUpdate();
            },
            onLeave: () => {
                this.removeChild(component);

                component.onRouteLeave && component.onRouteLeave();
            }
        });
    }
}

customElements.define(RouteElement.is, RouteElement);
