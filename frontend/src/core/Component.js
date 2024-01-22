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
		// this.render();
	}

	setup() {
		// this.state = observable(this.initState());
		this.state = observable(this.initState());
		observe(() => {
			this.clearEvent();
			this.render();
			this.setEvent();
			this.mounted();
		});
	}

	initState() {
		return {};
	}
	mounted() {}

	template() {
		return "";
	}

	render() {
		this.$target.innerHTML = this.template();
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
