import {IssueTokenError, RequestError, RequireLoginError} from '../connect.js';
import * as Utils from './Utils.js';

class Router {
  #routes;
  #errorPage;
  #view;
  constructor() {
    this.#errorPage = {path: '/404', view: 'ErrorPage'};
    this.#routes = [
      {path: '/', view: 'Home'},
      {path: '/user/:intra_id', view: 'User'},
      {path: '/game', view: 'Game'},
      {path: '/rank', view: 'Rank'},
      {path: '/login', view: 'Login'},
      {path: '/auth/ft/redirection', view: 'Auth'},
      {path: '/error/:code', view: 'ErrorPage'},
    ];
  }
  pathToRegex(path) {
    return new RegExp(
        '^' + path.replace(/\//g, '\\/').replace(/:\w+/g, '(.+)') + '$',
    );
  }
  getParams(match) {
    const values = match.result.slice(1);
    const keys = Array.from(match.route.path.matchAll(/:(\w+)/g)).map(
        (result) => result[1],
    );
    return Object.fromEntries(
        keys.map((key, i) => {
          return [key, values[i]];
        }),
    );
  }

  async navigateTo(url, title = null) {
    if (url != undefined && url !== location.href) {
      history.pushState({}, title, url);
    } else {
      history.replaceState({}, title, url);
    }
    const view = await this.router();
    return view;
  }

  async backNavi() {
    if (this.#view != null) this.#view.unmounted();
    const view = await this.router();
    return view;
  }

  async router() {
    if (this.#view != null) {
      this.#view.unmounted();
      if (this.#view._title == 'Game') this.#view.game_unmounted();
    }
    const potentialMatches = this.#routes.map((route) => {
      return {
        route: route,
        result: location.pathname.match(this.pathToRegex(route.path)),
      };
    });
    let match = potentialMatches.find(
        (potentialMatches) => potentialMatches.result !== null,
    );
    if (!match) {
      match = {
        route: this.#errorPage,
        result: [location.pathname],
      };
    }
    const params = this.getParams(match);
    if (match.route.view === 'User' &&
      await Utils.isValidIntra(params.intra_id) === false) {
      this.#view =
        await import(`../components/pages/${this.#errorPage.view}.js`)
            .then(async ({default: Page}) => {
              return new Page(document.querySelector('#app'), {code: 404});
            });
      return this.#view;
    }
    this.#view = await import(`../components/pages/${match.route.view}.js`)
        .then(async ({default: Page}) => {
          return new Page(document.querySelector('#app'), params);
        });
    return this.#view;
  }
}

export default new Router();
