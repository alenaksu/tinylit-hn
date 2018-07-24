import { html } from 'tiny-lit';
import './styles.css';

const dateFormat = new Intl.DateTimeFormat().format;

const ListItem = (item) => html`
<div class="listItem">
    <span class="score">${item.points}</span>
    <a class="link" href=${item.url} rel="noopener" target="_blank">
        <span>${item.title}</span>
        ${item.domain ? html`<span class="meta">(${item.domain})</span>` : null}
    </a>
    <div class="meta">
        <span class="by">
            by <a href="#">${item.user}</a>
        </span>
        <span class="time">
            ${item.time_ago}
        </span> |
        <span class="comments">
            <a href="#">${item.comments_count} comments</a>
        </span>
    </div>
</div>
`.withKey(item.id);

export default (items) => html`
    <section class="list">
        ${items.map(ListItem)}
    </section>
`
