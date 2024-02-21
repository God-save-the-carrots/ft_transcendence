import Component from '../../core/Component.js';
import PongGame from '../../game/pong/PongGame.js';
import GameRound from './GameRound.js';
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
    const width = 960;
    const height = 530;
    this.game = new PongGame(width, height, randomUserToken);
    this.game.subscribeInfo((result) => {
      if (result.cause == 'end_game_confirm') {
        this.state._alias = null;
        return;
      }
      this.state.sessionResults = [...this.state.sessionResults, result];
    });
  }
  async initState() {
    return {
      sessionResults: [],
      _alias: 'hello',
    };
  }
  async template() {
    return `
      <link rel="stylesheet" href="${this._my_css}" type="text/css" />
      <div class="game-wrap">
        <div class="content">
          <div id="game-alias"></div>
          <div class="game">
            <div id="game-content">
              <div id="game-body"></div>
              <div id="game-info"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }
  async mounted() {
    console.log(this.state.sessionResults);
    const gameDiv = document.getElementById('game-body');
    if (this.state._alias !== null) {
      this.game.setAlias(this.state._alias);
      gameDiv.appendChild(this.game.getRenderer().domElement);
      if (this.state.sessionResults.length == 0) {
        const gameContentDiv = document.getElementById('game-info');
        gameContentDiv.remove();
        document.getElementById('game-content').style.height = '45%';
        document.getElementById('game-content').style.paddingTop = '7%';
      } else {
        const resultDiv = document.getElementById('game-info');
        new GameRound(resultDiv, this.state.sessionResults);
      }
    } else {
      this.state.sessionResults = [];
      const aliasDiv = document.getElementById('game-alias');
      const child = new GameAlias(aliasDiv);
      const gameContentDiv = document.getElementById('game-content');
      gameContentDiv.remove();
      child.props = (text) => {
        this.state._alias = text;
      };
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
