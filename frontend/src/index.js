import Game from "./components/Game.js";
import Home from "./components/Home.js";
import Profiles from "./components/Profiles.js";
import Stats from "./components/Stats.js";
import Router from "./core/Router.js";

const routes = [
    { path: "/", view: Home },
    { path: "/profiles/:id/:something", view: Profiles },
    { path: "/profiles/:id", view: Profiles },
    { path: "/profiles", view: Profiles },
    { path: "/game", view: Game },
    { path: "/stats", view: Stats },
  ];

let myRouter = new Router(routes);
let view = myRouter.router();

window.addEventListener("popstate", view.render());
  
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", e => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      myRouter.navigateTo(e.target.href);
    }
  });
  myRouter.router().render();
});
