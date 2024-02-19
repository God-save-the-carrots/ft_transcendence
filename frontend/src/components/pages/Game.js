import Component from '../../core/Component.js';
import PongGame from '../../game/pong/PongGame.js';
import GameRound from './GameRound.js';
import GameTab from './GameTab.js';
import GameAlias from './GameAlias.js';

export default class Game extends Component {
  _title;
  _params;
  _my_css = '../../../public/assets/css/game.css';
  _tournamentData = {};
  constructor(params = null) {
    super(document.querySelector('#app'));
    this.game = null;
    this._title = 'Game';
    const randomUserToken = Math.random().toString(36).substring(2, 7);
    // const ratio = 1 / 2;
    // const width = window.innerWidth - 100;
    // const height = width * ratio;
    const width = 1000;
    const height = 600;
    this.game = new PongGame(width, height, randomUserToken);
    this.game.subscribeInfo((result) => {
      this.state.sessionResults = [...this.state.sessionResults, result];
    });
  }
  async initState() {
    return {
      sessionResults: [],
      _alias: null,
    };
  }
  async template() {
    return `
      <link rel="stylesheet" href="${this._my_css}" type="text/css" />
      <div class="game-wrap">
        <div class="content">
          <div class="game">
            <div id="game-content"></div>
          </div>
          <div class="tab">
            <div class="tab-component" data-component="tab_app"></div>
          </div>
          <div id="game-test"></div>
        </div>
      </div>
    `;
  }
  async mounted() {
    const gameDiv = document.getElementById('game-content');
    if (this.state._alias !== null) {
      gameDiv.appendChild(this.game.getRenderer().domElement);
      const tab_app = this.$target.querySelector(
          '[data-component="tab_app"]',
      );
      console.log(tab_app);
      new GameTab(tab_app);
      const resultDiv = document.getElementById('game-test');
      new GameRound(resultDiv, this.state.sessionResults);
    } else {
      const child = new GameAlias(gameDiv);
      child.props = (text) => {
        this.state._alias = text;
      };
      console.log(this.state._alias);
      child.render();
    }
  }
  async unmounted() {
    if (this.game) {
      this.game.destroy();
      this.game.unsubscribeInfoAll();
    }
  }
}
