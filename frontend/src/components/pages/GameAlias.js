import Component from '../../core/Component.js';

export default class GameAlias extends Component {
  _title;
  _intra_id;
  _my_css = '../../../public/assets/css/gameAlias.css';
  constructor(target) {
    super(target);
    this._title = 'GameAlias';
  }
  // async mounted() {
  //   setTimeout(() => {
  //     this.props('test');
  //   }, 1000);
  // }
  async template() {
    return `
    <link rel="stylesheet" href="${this._my_css}" type="text/css" />
    <div class='alias inputbox'> 
      <div class='title'> Setting Alias </div>
      <h1> Please, input your nickname</h1>
      <div class="nickname-box">
        <input type="password" class="form-control" id="inputPassword" placeholder="Password">
      </div>
    </div>
    `;
  }
}
