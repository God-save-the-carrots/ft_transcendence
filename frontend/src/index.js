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

// 페이지 초기화
document.addEventListener("DOMContentLoaded", async (e) => {
  const href = e.target.href;
  const view = await myRouter.navigateTo(href);
  view.render();
});

// 뒤로 가기 이벤트 핸들러
// window.addEventListener("popstate", () => myRouter.backNavi(location.pathname));
window.addEventListener("popstate", async (e) => {
  const view =  await myRouter.backNavi(location.pathname);
  view.render();
});

// 클릭 이벤트 핸들러
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", async (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      const href = e.target.href;

      const view = await myRouter.navigateTo(href);
      view.render();
    }
  });
});
