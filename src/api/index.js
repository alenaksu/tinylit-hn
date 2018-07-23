const API_URL = 'https://api.hnpwa.com';
const VERSION = 'v0';

function apiCall(path) {
    return fetch(`${API_URL}/${VERSION}/${path}`)
        .then(res => res.json())
        .catch(err => {
            console.error(err)
        })
}

function list(type, page = 0) {
    return apiCall(`${type}/${page + 1}.json`);
}

function get(id) {
    return apiCall(`item/${id}`);
}

export default {
    list,
    get
};
