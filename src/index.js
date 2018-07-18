/// <reference path='./index.d.ts'/>

import { html, Element } from 'tiny-lit';
import styles from './styles.css';
import Header from './atoms/Header';
import api from './api';
import List from './atoms/List';

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

        api.list('top', 0)
            .then(items => 
                Promise.all(items.map(api.get))
                    .then(items => this.setState({ 
                        items: items.sort((a, b) => b.time - a.time), 
                        loading: false 
                    })
                )
        );
    }

    getTemplate() { 
        const { items, loading } = this.state;
        return html`
        <main>
            ${Header}
            ${
                loading 
                    ? html`<div class=${styles.loading}>Loading...</div>`
                    : List(items) 
            }
        </main>
        `;
    } 
}
customElements.define(HackerNewsApp.is, HackerNewsApp);