import { Element, html } from 'tiny-lit';
import image404 from '../../static/404.png';
import './styles.css';

class NotFoundElement extends Element {
    static get is() {
 return 'hn-404'
}

    getTemplate() {
        return html`
            <img src=${image404} class="img404" />
        `
    }
}
customElements.define(NotFoundElement.is, NotFoundElement);
