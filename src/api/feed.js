import { apiCall } from './common';

export function list(type, page = 0) {
    return apiCall(`${type}/${page + 1}.json`);
}

export function get(id) {
    return apiCall(`item/${id}`);
}

export default {
    list, get
}
