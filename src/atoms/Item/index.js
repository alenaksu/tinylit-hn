import styles from './styles.css';
import { html, Element } from 'tiny-lit';
import api from '../../api';
import Loading from '../Loading';

const Comment = comment => html`
<li class="item__comment">
    <div class="item__meta">
        by <a class="item__by" href="" target="_blank" rel="noopener">
            ${comment.user}
        </a> |
        ${comment.time_ago}
    </div>

    <div class="item__text">
        ${html([comment.content])}
    </div>

    <ul class="item__comments">
        ${comment.comments.map(Comment)}
    </ul>
</li>
`

class ItemElement extends Element {
    static get is() {
        return 'hn-item'
    }

    static get properties() {
        return {
            itemid: Number
        }
    }

    state = {
        loading: false
    }

    fetch() {
        let request = setTimeout(() =>
            this.setState({ loading: true }),
        0);

        api.feed.get(this.itemid)
            .then(item =>  {
                clearTimeout(request);
                this.setState({
                    item,
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

    disconnectedCallback() {
        this.setState({ item: {} });
    }

    getTemplate() {
        const { item, loading } = this.state;

        return html`
            ${
                loading
                    ? Loading()
                    : html`
                    <article class="item">
                        <header class="item__header">
                            <a href=${item.url} target="_blank" rel="noopener">
                                <h1>${item.title}</h1>
                            </a>

                            <div class="item__domain">
                                ${item.domain}
                            </div>

                            <p class="item__meta">
                            ${item.points} points |
                            by <a class="item__by" href="" target="_blank" rel="noopener">
                                ${item.user}
                            </a> |
                            ${item.time_ago}
                            </p>
                        </header>

                        <section class="item__content">
                            <p class="item__comments-count">
                                ${item.comments_count} comments
                            </p>

                            <ul class="item__comments">
                                ${item.comments && item.comments.map(Comment)}
                            </ul>
                        </section>
                    </article>
                    `

            }
        `;
    }
}
customElements.define(ItemElement.is, ItemElement);
