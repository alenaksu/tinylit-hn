import { apiCall } from './common';

export function list(type, page = 0) {
    return apiCall(`${type}/${page + 1}.json`).then(items =>
        items.map(item => ({
            ...item,
            url: item.url.replace(/item\?id=(\d+)/, '/item/$1')
        }))
    );
}

export function get(id) {
    return apiCall(`item/${id}.json`);
}

export default {
    list,
    get
};
