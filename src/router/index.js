import createHistory from 'history/createBrowserHistory';

const ParamsRegex = /(?<isParam>\/:(?<name>\w+)(?<optional>\?)?)|(?:\/(?<isList>{(?<values>[\w,]+)}))/g;

function pathToRegex(path) {
    let m, pattern = path;

    if (path === '*') {
        return /.*/;
    }

    while(m = ParamsRegex.exec(path)) {
        if (m.groups.isParam) {
            pattern = pattern.replace(m[0], `(?:\\/(?<${m.groups.name}>[^/]+))${m.groups.optional ? '?' : ''}`);
        } else if(m.groups.isList) {
            pattern = pattern.replace(m[0], `(?:\\/(${m.groups.values.split(',').join('|')}))`);
        }
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
