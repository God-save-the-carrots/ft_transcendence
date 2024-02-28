import Component from '../../core/Component.js';

export default class GameAlias extends Component {
  _title;
  _intra_id;
  _my_css = '../../../public/assets/css/gameAlias.css';

  constructor(parent, target) {
    super(parent, target);
    this._title = 'GameAlias';
  }

  setEvent() {
    document.getElementById('textInput')
        .addEventListener('keypress', this.handleKeyPress.bind(this));
  }

  async template() {
    return `
    <link rel="stylesheet" href="${this._my_css}" type="text/css" />
    <div class='alias inputbox'> 
      <div class='typewriter'>
        <h1 data-detect='input_your_nick'>Input your nickname....!</h1>
      </div>
      <div class="nickname-box">
        <input type="text" id='textInput' class="form-control form-control-lg"
          placeholder="NickName" aria-label=".form-control-lg example">
      </div>
    </div>
    `;
  }

  handleKeyPress(event) {
    if (event.keyCode === 13) {
      const inputText = event.target.value;
      this.props(inputText);
    }
  }
}
