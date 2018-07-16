/// <reference path='./index.d.ts'/>

import { html, Element } from 'tiny-lit';
import logo from './static/app-logo.png';
import styles from './styles.css';

//https://github.com/HackerNews/API
class HackerNewsApp extends Element {
    constructor() {
        super();

        this.state = {
            items : [],
            loading: false
        };
    }

    static get is() {
        return 'hn-app';
    }

    connectedCallback() {
        this.setState({ loading: true });
        fetch("https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty")
            .then(response => response.json())
            .then(items => Promise.all(items.slice(0, 30).map(item => {
                return fetch(`https://hacker-news.firebaseio.com/v0/item/${item}.json?print=pretty`)
                    .then(response => response.json());
            }))).then(items => this.setState({ items, loading: false }))
    }

    getTemplate() { 
        const { items, loading } = this.state;
        return html`
        <main>
            <header class=${styles.header}>
                <img src=${logo} />

                <nav class=${styles.menu}>
                    <a href="/top">Top</a>
                    <a href="/new">New</a>
                    <a href="/ask">Ask</a>
                    <a href="/show">Show</a>
                    <a href="/jobs">Jobs</a>
                </nav>
            </header>

            <section class=${styles.list}>
                ${loading ? html`Loading...` :
                items.map(item => html`
                    <div class=${styles.listItem}>
                        <a class=${styles.link} href=${item.url} target="_blank">${item.title}</a>
                    </div>
                `.withKey(item.id))}
            </section>
        </main>
        `;
    } 
}
customElements.define(HackerNewsApp.is, HackerNewsApp);