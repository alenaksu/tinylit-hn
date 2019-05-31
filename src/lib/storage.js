const PREFIX = 'tinylit-hn';

export const Prefs = {};

export function get(key, defaultValue) {
    let value = JSON.parse(localStorage.getItem(`${PREFIX}:${key}`));

    if (
        value !== null &&
        Number.isInteger(value.expire) &&
        value.expire > Date.now()
    ) {
        return value.data;
    }

    return defaultValue;
}

export function set(key, value, expire = 0) {
    localStorage.setItem(
        `${PREFIX}:${key}`,
        JSON.stringify({
            expire: expire && Date.now() + expire,
            data: value
        })
    );
}

export const createBucket = (name, version) => {
    const dbPromise = new Promise((resolve, reject) => {
        const openRequest = window.indexedDB.open(name, version);

        openRequest.onsuccess = ({ target }) => {
            resolve(target.result);
        };
        openRequest.onupgradeneeded = ({ target }) => {
            target.result.createObjectStore(name, { keyPath: 'id' });
        };
        openRequest.onerror = error => {
            reject(error);
        };
    });

    const get = (id = void 0) =>
        new Promise(resolve => {
            dbPromise.then(db => {
                const objectStore = db.transaction(name).objectStore(name);

                objectStore[id ? 'get' : 'getAll'](id).onsuccess = ({
                    target: { result }
                }) => resolve(result);
            });
        });

    const set = (id, item) =>
        new Promise(resolve => {
            dbPromise.then(db => {
                const objectStore = db
                    .transaction(name, 'readwrite')
                    .objectStore(name);
                objectStore.add(item);
                objectStore.onsuccess = () => resolve();
            });
        });

    const remove = id =>
        new Promise(resolve => {
            dbPromise.then(db => {
                const objectStore = db
                    .transaction(name, 'readwrite')
                    .objectStore(name);
                objectStore.delete(id);
                objectStore.onsuccess = () => resolve();
            });
        });

    return [get, set, remove];
};

export const favorites = createBucket('favorites', 1);

export default {
    Prefs,
    get,
    set,
    remove: localStorage.removeItem,
    createBucket,
    favorites
};
