import { observable, observe } from "./observer.js";

export default class Component {
	$target;
	// props;
	state = {};
	constructor($target) {
		this.$target = $target;
		// this.props = props;
		this.setup();
		// this.setEvent();
	}

	async setup() {
		// this.state = observable(this.initState());
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
	// setState(newState) {
	// 	this.state = { ...this.state, ...newState };
	// 	this.render();
	// }
	//
	clearEvent() {}

	addEvent(eventType, selector, callback) {
		//const children = [...this.$target.querySelectorAll(selector)]
		this.$target.addEventListener(eventType, (event) => {
			if (!event.target.closest(selector)) return false;
			callback(event);
		});
	}
}
