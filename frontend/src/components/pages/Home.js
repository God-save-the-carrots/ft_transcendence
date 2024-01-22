import Component from "../../core/Component.js";
import Test_app1 from "../test/Test_app1.js";
import Test_app2 from "../test/Test_app2.js";
import Test_app3 from "../test/Test_app3.js";

export default class Home extends Component {
	_title;
	_params;
	constructor(params = null) {
		super(document.querySelector("#app"));
		this._title = "Home";
		this._params = params;
	}
	template() {
		return `
    		<h1> ${this._title} </h1>
    		<main data-component="test-app1"></main>
    		<main data-component="test-app2"></main>
    		<main data-component="test-app3"></main>
    	`;
	}
	mounted() {
		const _test_app1 = this.$target.querySelector(
			'[data-component="test-app1"]',
		);
		const _test_app2 = this.$target.querySelector(
			'[data-component="test-app2"]',
		);
		const _test_app3 = this.$target.querySelector(
			'[data-component="test-app3"]',
		);

		new Test_app1(_test_app1);
		new Test_app2(_test_app2);
		new Test_app3(_test_app3);
	}
}
