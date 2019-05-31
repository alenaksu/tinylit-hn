import { apiCall } from './common';
import { favorites } from '../lib/storage';

export function list(type, page = 0) {
    // TODO
    return type === 'favorites'
        ? favorites[0]()
        : apiCall(`${type}/${page + 1}.json`).then(items =>
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
