import { observable, observe } from "./observer.js";

export default class Component {
	$target;
	props;
	state = {};
	constructor($target) {
		this.$target = $target;
		this.setup();
	}

	async setup() {
		this.state = observable(await this.initState());
		observe(async () => {
			this.clearEvent();
			await this.render();
			this.setEvent();
			await this.mounted();
		});
	}

	async initState() {
		return {};
	}
	async mounted() {}

	async template() {
		return "";
	}

	async render() {
		this.$target.innerHTML = await this.template();
	}

	setEvent() {}

	clearEvent() {}

	addEvent(eventType, selector, callback) {
		this.$target.addEventListener(eventType, (event) => {
			if (!event.target.closest(selector)) return false;
			callback(event);
		});
	}
}
