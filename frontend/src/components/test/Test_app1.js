import Component from "../../core/Component.js";

export default class Test_app1 extends Component {
	_title;
	constructor(target) {
		super(target);
		this._title = "item1";
	}
	template() {
		return `
      <h1> HI!! This is TEST 1 </h1>
    `;
	}

	render() {
		console.log(this);
		this.$target.innerHTML = this.template();
	}
}
