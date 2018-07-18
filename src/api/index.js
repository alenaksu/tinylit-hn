import firebase from 'firebase/app';
import 'firebase/database';

const DATABASE_URL = 'https://hacker-news.firebaseio.com';
const VERSION = 'v0';

const app = firebase.initializeApp({
    databaseURL: DATABASE_URL
}, 'hackernews');

const db = firebase.database(app);


function apiCall(path) {
    return new Promise((resolve, reject) => {
        db.ref(`${VERSION}/${path}`)
            .once('value', s => {
                resolve(s.val());
            }).catch(err => {
                console.error(err)
                reject(err)
            })
    });
}

function list(type, page = 0, itemsPerPage = 30) {
    let from = itemsPerPage * page,
        to = from + itemsPerPage;

    return apiCall(`${type}stories`).then(items => Promise.resolve(items.slice(from, to)));
}

function get(id) {
    return apiCall(`item/${id}`);
}

export default {
    list,
    get
};

/*

function apiCall(path) {
    return fetch(`${DATABASE_URL}/${VERSION}/${path}`).then(response => response.json());
}

function list(type) {
    return apiCall(`${type}stories.json`);
}

function get(id) {
    return apiCall(`item/${id}.json`);
}

export default {
    list,
    get
};*/
