import Component from "../core/Component.js";
import Router from "../core/Router.js";

export default class Nav extends Component {
	template() {
		return `
			<a href="/" class="nav__link" data-link>home</a>
			<a href="/profiles" class="nav__link" data-link>profile</a>
			<a href="/game" class="nav__link" data-link>game</a>
			<a href="/stats" class="nav__link" data-link>stats</a>
			<input type="button" value="login" />
			`;
	}
	setEvent() {
		this.addEvent("click", "[data-link]", async (e) => {
			if (e.target.matches("[data-link]")) {
				e.preventDefault();
				const href = e.target.href;
				const view = await Router.navigateTo(href);
				view.render();
			}
		});
	}
}
