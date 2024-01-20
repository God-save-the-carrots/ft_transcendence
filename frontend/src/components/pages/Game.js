import Component from "../../core/Component.js";

export default class Game extends Component {
	_title;
	_params;
	constructor() {
		super(document.querySelector("#app"));
		this._title = "Game";
	}
	template() {
		return `
        <h1> ${this._title}</h1>
      `;
	}
}
