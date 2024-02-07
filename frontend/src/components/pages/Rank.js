import Component from '../../core/Component.js';

export default class Rank extends Component {
  _title;
  _params;
  constructor() {
    super(document.querySelector('#app'));
    this._title = 'Rank';
  }
  async template() {
    return `
        <h1> ${this._title}</h1>
      `;
  }
}
