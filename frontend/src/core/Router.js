import ErrorPage from "../components/ErrorPage.js";

export default class Router {

    routes;
    errorPage;
    constructor(routes = null){
        this.errorPage = {path: "/404", view: ErrorPage}
        if (this.routes === null)
            this.router = this.errorPage;
        this.routes = routes;

        // event 
        window.addEventListener("popstate", this.router);
  
        document.addEventListener("DOMContentLoaded", () => {
        document.body.addEventListener("click", e => {
            if (e.target.matches("[data-link]")) {
                e.preventDefault();
                this.navigateTo(e.target.href);
             }
           });
           this.router();
         });
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

    async navigateTo(url) {
        history.pushState(null, null, url);
        console.log(url);
        await this.router();
    }

    async router() {
        const potentialMatches = this.routes.map(route => {
            return {
                route: route,
                result: location.pathname.match(this.pathToRegex(route.path))
            };
        });

        let match = potentialMatches.find(potentialMatches => potentialMatches.result !== null);
        if (!match) {
            match = {
                route: this.errorPage,
                result: [location.pathname],
            };
        }
        const view = new match.route.view(this.getParams(match));
        document.querySelector('#app').innerHTML = await view.getHtml();
        view.render();
        // return view;
    }
}
