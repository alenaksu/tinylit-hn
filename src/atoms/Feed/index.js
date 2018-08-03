import { html, Element } from 'tiny-lit';
import api from '../../api';
import List from '../List';
import Loading from '../Loading';
import './styles';

class FeedElement extends Element {
    static get is() {
        return 'hn-feed';
    }

    type = 'news';
    page = 1;
    state = {
        items : [],
        loading: false
    };

    constructor() {
        super();
        console.log("pippo");
    }

    static get properties() {
        return {
            page: Number,
            type: String
        }
    }

    fetch() {
        let request = setTimeout(() =>
            this.setState({ loading: true }),
        500);

        api.feed.list(this.type || 'news', this.page || 1)
            .then(items =>  {
                clearTimeout(request);
                this.setState({
                    items,
                    loading: false
                });
            });
    }

    onRouteUpdate() {
        this.fetch();
        document.scrollingElement.scrollTo(0, 0);
    }

    connectedCallback() {
        this.fetch();
    }

    getTemplate() {
        const { items, loading } = this.state;

        return html`
            ${
                loading
                    ? Loading()
                    : html`
                        ${List(items)}
                        <nav class="pagination">
                            <a href=${`/${this.type}/${(this.page || 1) + 1}`}>More...</a>
                        </nav>
                    `

            }
        `;
    }
}
customElements.define(FeedElement.is, FeedElement);
