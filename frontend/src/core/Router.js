import ErrorPage from "../components/ErrorPage.js";

export default class Router {

    routes;
    errorPage;
    constructor(routes = null){
        this.errorPage = {path: "/404", view: ErrorPage}
        if (this.routes === null)
            this.router = this.errorPage;
        this.routes = routes;
    }
    addRoutes(route) {
        this.routes.push(route);
    }
    pathToRegex(path) {
        return new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$");
    }

    getParams(match) {
        const values = match.result.slice(1);
        const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(result => result[1]);

        return Object.fromEntries(keys.map((key, i) => {
            return [key, values[i]];
        }));
    }

    async navigateTo(url, title = null) {
        history.pushState({}, title, url);
        let view = await this.router();
        return view;
    }
    async backNavi(url) {
        let view = await this.router();
        return view;
    }

    async router() {
        const potentialMatches = this.routes.map(route => {
            return {
                route: route,
                result: location.pathname.match(this.pathToRegex(route.path))
            };
        });

        let match = potentialMatches.find(potentialMatches => potentialMatches.result !== null);
        console.log("match: ", match);
        if (!match) {
            match = {
                route: this.errorPage,
                result: [location.pathname],
            };
        }
        const view = new match.route.view(this.getParams(match));
        return view;
    }
}
