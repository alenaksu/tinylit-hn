import { html } from '@tiny-lit/core';
import { Element } from '@tiny-lit/element';
import api from '../../api';
import List from '../List';
import Loading from '../Loading';
import './styles';
import cn from '../../lib/classNames';
import { withStore } from '@tiny-lit/store';
import store from '../../lib/store';

const PAGE_COUNT = {
    news: 10,
    newest: 12,
    ask: 2,
    show: 2,
    jobs: 1
};

store.dispatch('loadFavorites');

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
            href=${page < PAGE_COUNT[type] - 1
                ? `/${type}/${(page || 0) + 1}`
                : ''}
        >
            Next &gt;
        </a>
    </nav>
`;

class FeedElement extends withStore(Element) {
    static get is() {
        return 'hn-feed';
    }

    type = 'news';
    page = 0;
    favorites = [];
    state = {
        items: [],
        loading: true
    };

    static get properties() {
        return {
            page: Number,
            type: String,
            favorites: value =>
                typeof value === 'string' ? JSON.parse(value) : value
        };
    }

    connectedCallback() {
        this.unsubscribeStore = store.subscribe(this.handleStateChange);
    }

    disconnectedCallback() {
        this.unsubscribeStore();
    }

    handleStateChange = state => {
        this.favorites = state.favorites;
    };

    onRouteEnter(params = {}) {
        this.onRouteUpdate(params);
    }

    fetch() {
        let request = setTimeout(() => this.setState({ loading: true }), 0);

        api.feed.list(this.type, this.page).then(items => {
            clearTimeout(request);
            this.setState({
                items,
                loading: false
            });
        });
    }

    onRouteUpdate(params = {}) {
        this.page = params.page || 0;
        this.type = params.type || 'news';

        this.fetch();
        document.scrollingElement.scrollTo(0, 0);
    }

    handleFavoriteToggle(item) {
        store.dispatch('toggleFavorite', item);
    }

    render() {
        const { items, loading } = this.state;
        const { type, page, favorites, handleFavoriteToggle } = this;

        return html`
            ${loading
                ? Loading()
                : html`
                      ${Pagination(type, page)}
                      ${List({
                          items,
                          favorites,
                          onFavoriteToggle: handleFavoriteToggle
                      })}
                      ${Pagination(type, page)}
                  `}
        `;
    }
}
customElements.define(FeedElement.is, FeedElement);
