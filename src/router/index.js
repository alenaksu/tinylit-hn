import createHistory from 'history/createBrowserHistory';

const ParamsRegex = /(?:\/:(?<name>\w+)(?:(?<hasList>{(?<values>[\w,]+)}))?(?<optional>\?)?)/g;

/**
 * Valid paths:
 * Required
 * /:param
 *
 * Optional
 * /:param?
 *
 * Required matching list
 * /:param{test1,test2}
 *
 * Optional matching list
 * /:param{test1,test2}?
 * @param {*} path
 */
function pathToRegex(path) {
    let m, pattern = path;

    if (path === '*') {
        return /.*/;
    }

    while(m = ParamsRegex.exec(path)) {
        let paramRegex = m.groups.hasList
            ? `${m.groups.values.split(',').join('|')}`
            : '[^/]+';

        pattern = pattern.replace(m[0], `(?:\\/(?<${m.groups.name}>${paramRegex}))${m.groups.optional ? '?' : ''}`);
    }

    return new RegExp(`^${pattern}$`);
}

export class Router {
    routes = [];
    current = {};
    history = createHistory();

    constructor({ interceptLocal }) {
        this.history.listen(this.handleHistoryChange);

        if (interceptLocal) {
            document.addEventListener('click', this.handleLocalClick, true);
        }
    }

    handleLocalClick = e => {
        const target = e.target;
        if (target.nodeName === 'A' && target.href.indexOf(location.origin) === 0) {
            e.preventDefault();
            e.stopImmediatePropagation();

            this.goTo(target.getAttribute('href'));
        }
    }

    handleHistoryChange = (location, action) => {
        this.resolve();
    }

    on(path, { onEnter, onLeave, onUpdate }) {
        this.routes.push({
            regex: pathToRegex(path),
            onEnter,
            onLeave,
            onUpdate
        });
        this.resolve();

        return this;
    }

    resolve() {
        const path = location.pathname,
            current = this.current;

        this.routes.some(route => {
            let match = path.match(route.regex);
            if (match) {
                if (current !== route) {
                    this.current = route;
                    current.onLeave && current.onLeave(match.groups);
                    route.onEnter && route.onEnter(match.groups);
                } else {
                    route.onUpdate && route.onUpdate(match.groups);
                }

                return true;
            }
        });

        return this;
    }

    goTo(path) {
        this.history.push(path);
        return this;
    }
}
