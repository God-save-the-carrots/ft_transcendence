import Component from "../../core/Component.js";

export default class UserProfile extends Component {
	_title;
	_intra_id;
	constructor(target, intra_id) {
		super(target);
		this._intra_id = intra_id;
		this._title = "UserProfile";
	}
	async initState() {
		return {
			data: {},
		};
	}
	async template() {
		this.state.data = await fetch(
			`http://localhost/api/user/${this._intra_id}`
		).then((x) => x.json());
		const data = this.state.data;
		return `<div>${JSON.stringify(data)}</div>
				<img src= "/public/assets/${data.photo_id}.png" />`;
	}
}
