import ErrorPage from "../components/pages/ErrorPage.js";
import Home from "../components/pages/Home.js";
import Game from "../components/pages/Game.js";
import Profiles from "../components/pages/Profiles.js";
import Stats from "../components/pages/Stats.js";

class Router {
	#routes;
	#errorPage;
	constructor() {
		this.#errorPage = { path: "/404", view: ErrorPage };
		this.#routes = [
			{ path: "/", view: Home },
			{ path: "/profiles/:id/:something", view: Profiles },
			{ path: "/profiles/:id", view: Profiles },
			{ path: "/profiles", view: Profiles },
			{ path: "/game", view: Game },
			{ path: "/stats", view: Stats },
		];
	}
	pathToRegex(path) {
		return new RegExp(
			"^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "(.+)") + "$"
		);
	}
	getParams(match) {
		const values = match.result.slice(1);
		const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
			(result) => result[1]
		);
		return Object.fromEntries(
			keys.map((key, i) => {
				return [key, values[i]];
			})
		);
	}

	async navigateTo(url, title = null) {
		history.pushState({}, title, url);
		let view = await this.router();
		return view;
	}

	async backNavi() {
		let view = await this.router();
		return view;
	}

	async router() {
		const potentialMatches = this.#routes.map((route) => {
			return {
				route: route,
				result: location.pathname.match(this.pathToRegex(route.path)),
			};
		});
		let match = potentialMatches.find(
			(potentialMatches) => potentialMatches.result !== null
		);
		if (!match) {
			match = {
				route: this.#errorPage,
				result: [location.pathname],
			};
		}
		let view = new match.route.view(this.getParams(match));
		return view;
	}
}

export default new Router();
