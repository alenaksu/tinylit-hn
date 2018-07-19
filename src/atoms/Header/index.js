import logo from '../../static/app-logo.png';
import styles from './styles.css';
import { html } from 'tiny-lit';

export default html`
<header class=${styles.header}>
    <img src=${logo} />

    <nav class=${styles.menu}>
        <a href="/top/0">Top</a>
        <a href="/new">New</a>
        <a href="/ask">Ask</a>
        <a href="/show">Show</a>
        <a href="/jobs">Jobs</a>
    </nav>
</header>
`
