import Game from "./components/Game.js";
import Home from "./components/Home.js";
import Profiles from "./components/Profiles.js";
import Stats from "./components/Stats.js";
import Router from "./core/Router.js";

const routes = [
    { path: "/", view: Home },
    { path: "/profile/:id/:something", view: Profiles },
    { path: "/profile/:id", view: Profiles },
    { path: "/profile", view: Profiles },
    { path: "/game", view: Game },
    { path: "/stats", view: Stats },
  ];

let myRouter = new Router(routes);
let view = router.router();
window.addEventListener("popstate", view.render());
  
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", e => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      this.navigateTo(e.target.href);
    }
  });
  myRouter.router().render();
});