import Component from "../../core/Component.js";

export default class Test_app3 extends Component {
	_title;
	constructor(target) {
		super(target);
		this._title = "item3";
		this.render();
	}
	initState() {
		return {
			a: 10,
			b: 20,
		};
	}
	template() {
		const { a, b } = this.state;
		return `
      <input id="stateA" value = "${a}" size="5" />
      <input id="stateB" value = "${b}" size="5" />
      <p> a + b = ${a + b} </p>
    `;
	}
	setEvent() {
		const { $target, state } = this;
		$target
			.querySelector("#stateA")
			.addEventListener("change", ({ target }) => {
				state.a = Number(target.value);
			});
		$target
			.querySelector("#stateB")
			.addEventListener("change", ({ target }) => {
				state.b = Number(target.value);
			});
	}
}
