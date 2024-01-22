import Nav from "./components/Nav.js";
import Router from "./core/Router.js";

async function main() {
	let nav = new Nav(document.querySelector("#nav"));
	//nav.render();

	// 페이지 초기화
	document.addEventListener("DOMContentLoaded", async (e) => {
		const href = e.target.href;
		const view = await Router.navigateTo(href);
		view.clearEvent();
		view.render();
		view.setEvent();
		view.mounted();
	});

	// 뒤로 가기
	window.addEventListener("popstate", async (e) => {
		const view = await Router.backNavi(location.pathname);
		view.clearEvent();
		view.render();
		view.setEvent();
		view.mounted();
	});
}

main();
