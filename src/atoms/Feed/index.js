import { html, Element } from 'tiny-lit';
import api from '../../api';
import List from '../List';
import styles from './styles';

class FeedElement extends Element {
    static get is() {
        return 'hn-feed';
    }

    get properties() {
        return {
            type: 'top',
            page: 0
        }
    }

    state = {
        items : [],
        loading: false
    };


    fetch() {
        this.setState({ loading: true });

        api.list(this.type || 'top', this.page)
            .then(items =>
                Promise.all(items.map(api.get))
                    .then(items => this.setState({
                        items: items.filter(Boolean).sort((a, b) => b.time - a.time),
                        loading: false
                    })
                )
        );
    }

    onRouteUpdate() {
        this.fetch();
    }

    connectedCallback() {
        this.fetch();
    }

    getTemplate() {
        const { items, loading } = this.state;

        return html`
            ${
                loading
                    ? html`<div class="loading">Loading...</div>`
                    : html`
                        ${List(items)}
                        <nav class="pagination">
                            <a href=${`/${this.type}/${Number(this.page || 0) + 1}`}>More...</a>
                        </nav>
                    `

            }
        `;
    }
}

customElements.define(FeedElement.is, FeedElement);
