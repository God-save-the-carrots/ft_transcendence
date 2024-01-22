import Component from "../../core/Component.js";

export default class Test_app5 extends Component {
	_title;
	constructor(target) {
		super(target);
		this._title = "item3";
	}
	async initState() {
		const data = await fetch("https://fakestoreapi.com/products").then((x) =>
			x.json()
		);
		return data[1];
	}
	async template() {
		const data = this.state;
		setTimeout(() => {
			data.id = 33333333;
			console.log(data.id);
		}, 1000);
		return `<div>${JSON.stringify(data)}</div>`;
	}
}
