import { createStore } from '@tiny-lit/store';
import { favorites } from './storage';

const [getFavorites, addFavorite, removeFavorite] = favorites;

const consolePlugin = store => store.subscribe(console.log);
export default createStore({
    actions: {
        toggleFavorite(store, data) {
            if (data.id in store.state.favorites) {
                store.commit('removeFavorite', data);
                removeFavorite(data.id);
            } else {
                store.commit('addFavorite', data);
                addFavorite(data.id, data);
            }
        },
        loadFavorites(store) {
            store.commit('loading', true);
            getFavorites()
                .then(favorites => store.commit('setFavorites', favorites))
                .then(() => store.commit('loading', false));
        }
    },
    mutations: {
        addFavorite(state, favorite) {
            return {
                favorites: {
                    ...state.favorites,
                    [favorite.id]: favorite
                }
            };
        },
        removeFavorite(state, favorite) {
            const favorites = { ...state.favorites };
            delete favorites[favorite.id];

            return {
                ...state,
                favorites
            };
        },
        setFavorites(state, favorites) {
            favorites = favorites.reduce((acc, favorite) => {
                acc[favorite.id] = favorite;
                return acc;
            }, {});

            return {
                ...state,
                favorites
            };
        },
        loading(state, isLoading) {
            return {
                ...state,
                loading: isLoading
            };
        }
    },
    initialState: {
        favorites: {}
    },
    plugins: [consolePlugin]
});
