import Component from '../../core/Component.js';
import PongGame from '../../game/pong/PongGame.js';

export default class Game extends Component {
  _title;
  _params;
  constructor() {
    super(document.querySelector('#app'));
    this.game = null;
    this._title = 'Game';
  }
  async template() {
    return `<div id="game-content"></div>`;
  }
  async mounted() {
    const randomUserToken = Math.random().toString(36).substring(2, 7);
    const ratio = 1 / 2;
    const width = window.innerWidth - 100;
    const height = width * ratio;
    this.game = new PongGame(width, height, randomUserToken);
    const $target = document.getElementById('game-content');
    $target.appendChild(this.game.getRenderer().domElement);
    this.game.subscribeInfo(console.log);
  }
  async unmounted() {
    if (this.game) {
      this.game.destroy();
      this.game.unsubscribeInfoAll();
    }
  }
}
