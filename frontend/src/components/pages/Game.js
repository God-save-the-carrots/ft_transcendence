import Component from "../../core/Component.js";
import PhongGame from "../../game/phong/PhongGame.js";

export default class Game extends Component {
	_title;
	_params;
	constructor() {
		super(document.querySelector("#app"));
		this._title = "Game";
	}
	async template() {
		return `<div id="game-content"></div>`;
	}
    async mounted() {
        const randomUserToken = Math.random().toString(36).substring(2,7);
        const ratio = 1 / 2;
        const width = window.innerWidth - 100;
        const height = width * ratio;
        const game = new PhongGame(width, height, randomUserToken);
        const $target = document.getElementById("game-content");
        $target.appendChild(game.getRenderer().domElement);
    }
}
