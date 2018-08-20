import { html, Element } from 'tiny-lit';
import api from '../../api';
import List from '../List';
import Loading from '../Loading';
import './styles';
import cn from '../../lib/classNames';

const PAGE_COUNT = {
    'news': 10,
    'newest': 12,
    'ask': 2,
    'show': 2,
    'jobs': 1
}

const Pagination = (type, page) => html`
<nav class="pagination">
    <a
        class=${cn(
            'pagination__link',
            page <= 0 && 'pagination__link--disabled'
        )}
        href=${page > 0 ? `/${type}/${(page || 0) - 1}` : ''}
    >
        &lt; Prev
    </a>

    <span class="pagination__page">${page + 1}</span>

    <a
        class=${cn(
            'pagination__link',
            page >= PAGE_COUNT[type] - 1 && 'pagination__link--disabled'
        )}
        href=${page < PAGE_COUNT[type] - 1 ? `/${type}/${(page || 0) + 1}` : ''}
    >
        Next &gt;
    </a>
</nav>
`


class FeedElement extends Element {
    static get is() {
        return 'hn-feed';
    }

    type = 'news';
    page = 0;
    state = {
        items : [],
        loading: false
    };

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

        api.feed.list(this.type, this.page)
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
        if (Number.isNaN(this.page)) this.page = 0;
        this.fetch();
    }

    getTemplate() {
        const { items, loading } = this.state;
        const { type, page } = this;

        return html`
            ${
                loading
                    ? Loading()
                    : html`
                        ${Pagination(type, page)}
                        ${List(items)}
                        ${Pagination(type, page)}
                    `
            }
        `;
    }
}
customElements.define(FeedElement.is, FeedElement);
