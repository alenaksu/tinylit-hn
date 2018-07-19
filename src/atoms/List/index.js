import { html } from 'tiny-lit';
import styles from './styles.css';

const dateFormat = new Intl.DateTimeFormat().format;

const ListItem = (item) => html`
<div class=${styles.listItem}>
    <span class=${styles.score}>${item.score}</span>
    <a class=${styles.link} href=${item.url} target="_blank">
        <span>${item.title}</span>
    </a>
    <div class=${styles.meta}>
        <span class=${styles.by}>
            by <a href="#">${item.by}</a>
        </span> |
        <span class=${styles.time}>
            ${dateFormat(new Date(item.time * 1000))}
        </span> |
        <span class=${styles.comments}>
            <a href="#">${item.kids ? item.kids.length : '0'} comments</a>
        </span>
    </div>
</div>
`.withKey(item.id);

export default (items) => html`
    <section class=${styles.list}>
        ${items.map(ListItem)}
    </section>
`
