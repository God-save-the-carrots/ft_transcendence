import Component from "../../core/Component.js";

export default class Stats extends Component {
	_title;
	_params;
	constructor() {
		super(document.querySelector("#app"));
		this._title = "Stats";
	}
	template() {
		return `
        <h1> ${this._title}</h1>
      `;
	}
}
