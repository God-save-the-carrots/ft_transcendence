import Component from "../../core/Component.js";

export default class Home extends Component {
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
    	`;
	}
	async mounted() {}
}
