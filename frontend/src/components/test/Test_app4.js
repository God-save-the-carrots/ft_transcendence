import Component from "../../core/Component.js";

export default class Test_app4 extends Component {
	_title;
	constructor(target) {
		super(target);
		this._title = "item3";
	}
	async initState() {
		const data = await fetch("https://fakestoreapi.com/products").then((x) =>
			x.json()
		);
		return data[0];
	}
	async template() {
		const data = this.state;
		setTimeout(() => {
			data.rating = { ...data.rating, rate: 333333 };
		}, 2000);
		return `<div>${JSON.stringify(data)}</div>`;
	}
}
