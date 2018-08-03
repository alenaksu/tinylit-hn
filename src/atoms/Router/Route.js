function updateComponentParams(component, params) {
    for(let key in params)
        component.setAttribute(key, params[key]);
}

class RouteElement extends HTMLElement {
    static get is() {
        return 'hn-route';
    }

    connectedCallback() {
        let component = document.createElement(this.getAttribute('component'));

        const path = this.getAttribute('path'),
            module = this.getAttribute('module');

        module && import(module);

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
