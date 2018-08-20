import storage from '../lib/storage';

const API_URL = 'https://api.hnpwa.com';
const VERSION = 'v0';
const EXPIRE = 15 * 60 * 1000;

export function apiCall(path, useCache = true) {
    const url = `${API_URL}/${VERSION}/${path}`;
    let data;

    return useCache && (data = storage.get(url))
        ? Promise.resolve(data)
        : fetch(url)
            .then(res => res.json())
            .then(data => {
                if (useCache) {
                    storage.set(url, data, EXPIRE);
                }
                return Promise.resolve(data);
            })
}
