import Component from "../../core/Component.js";

export default class Profiles extends Component {
	_title;
	_params;
	constructor() {
		super(document.querySelector("#app"));
		this._title = "Profiles";
	}
	template() {
		return `
        <h1> ${this._title}</h1>
      `;
	}
}
