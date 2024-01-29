import Component from "../../core/Component.js";
import Test_app1 from "../test/Test_app1.js";
import Test_app2 from "../test/Test_app2.js";
import Test_app3 from "../test/Test_app3.js";
import Test_app4 from "../test/Test_app4.js";
import Test_app5 from "../test/Test_app5.js";

export default class Test extends Component {
	_title;
	_params;
	constructor(params = null) {
		super(document.querySelector("#app"));
		this._title = "Home";
		this._params = params;
	}
	async template() {
		return `
    		<h1> ${this._title} </h1>
    		<main data-component="test-app1"></main>
    		<main data-component="test-app2"></main>
    		<main data-component="test-app3"></main>
    		<main data-component="test-app4"></main>
    		<main data-component="test-app5"></main>
    	`;
	}
	async mounted() {
		const _test_app1 = this.$target.querySelector(
			'[data-component="test-app1"]',
		);
		const _test_app2 = this.$target.querySelector(
			'[data-component="test-app2"]',
		);
		const _test_app3 = this.$target.querySelector(
			'[data-component="test-app3"]',
		);
		const _test_app4 = this.$target.querySelector(
			'[data-component="test-app4"]',
		);
		const _test_app5 = this.$target.querySelector(
			'[data-component="test-app5"]',
		);

		new Test_app1(_test_app1);
		new Test_app2(_test_app2);
		new Test_app3(_test_app3);
		new Test_app4(_test_app4);
		new Test_app5(_test_app5);
	}
}
