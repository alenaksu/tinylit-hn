import { html } from 'tiny-lit';
import styles from './styles.css';

const dateFormat = new Intl.DateTimeFormat().format;

const ListItem = (item) => html`
<div class="listItem">
    <span class="score">${item.score}</span>
    <a class="link" href=${item.url} target="_blank">
        <span>${item.title}</span>
    </a>
    <div class="meta">
        <span class="by">
            by <a href="#">${item.by}</a>
        </span> |
        <span class="time">
            ${dateFormat(new Date(item.time * 1000))}
        </span> |
        <span class="comments">
            <a href="#">${item.kids ? item.kids.length : '0'} comments</a>
        </span>
    </div>
</div>
`.withKey(item.id);

export default (items) => html`
    <section class="list">
        ${items.map(ListItem)}
    </section>
`
