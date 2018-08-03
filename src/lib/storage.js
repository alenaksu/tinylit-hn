const PREFIX = 'tinylit-hn';

export const Prefs = {

}

export function get(key, defaultValue = null) {
    let value = JSON.parse(localStorage.getItem(`${PREFIX}:${key}`));

    if (value !== null && value.expire < Date.now()) {
        return value.data;
    }

    return defaultValue;
}

export function set(key, value, expire = 0) {
    localStorage.setItem(
        `${PREFIX}:${key}`,
        JSON.stringify({
            expire: expire && Date.now(),
            data: value,
        })
    );
}

export default {
    Prefs,
    get,
    set,
    remove: localStorage.removeItem,
};
