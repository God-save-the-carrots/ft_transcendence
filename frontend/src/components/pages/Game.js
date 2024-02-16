import Component from '../../core/Component.js';
import PongGame from '../../game/pong/PongGame.js';
import GameRound from './GameRound.js';

export default class Game extends Component {
  _title;
  _params;
  constructor() {
    super(document.querySelector('#app'));
    this.game = null;
    this._title = 'Game';
    const randomUserToken = Math.random().toString(36).substring(2, 7);
    const ratio = 1 / 2;
    const width = window.innerWidth - 100;
    const height = width * ratio;
    this.game = new PongGame(width, height, randomUserToken);
    this.game.subscribeInfo(result => {
      this.state.sessionResults = [...this.state.sessionResults, result];
    });
  }
  async initState() {
    return {
      sessionResults: []
    }
  }
  async template() {
    return `
      <div id="game-content"></div>
      <div id="game-test"></div>
    `;
  }
  async mounted() {
    const gameDiv = document.getElementById('game-content');
    gameDiv.appendChild(this.game.getRenderer().domElement);

    const resultDiv = document.getElementById('game-test');
    new GameRound(resultDiv, this.state.sessionResults);
  }
  async unmounted() {
    if (this.game) {
      this.game.destroy();
      this.game.unsubscribeInfoAll();
    }
  }
}
