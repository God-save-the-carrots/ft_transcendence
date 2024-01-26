import Component from "../../core/Component.js";
import UserProfile from "./UserProfile.js";

export default class User extends Component {
	_title;
	_params;
	constructor(params = null) {
		super(document.querySelector("#app"));
		this._title = "User";
		this._params = params;
	}
	async template() {
		return `
    		<h1> ${this._title} </h1>
    		<h1> Hello ! ${this._params.intra_id} </h1>
    		<main data-component="profile-app"></main>
    	`;
	}

	async mounted() {
		const _test_app1 = this.$target.querySelector(
			'[data-component="profile-app"]'
		);
		if (this._params) {
			new UserProfile(_test_app1, this._params.intra_id);
		}
		// else {
		// 	new Test_app2(_test_app2);
		// }
	}
}
