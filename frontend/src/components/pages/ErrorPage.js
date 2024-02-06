import Component from '../../core/Component.js';

export default class ErrorPage extends Component {
  _title;
  _params;
  constructor() {
    super(document.querySelector('#app'));
    this._title = 'Error';
  }
  async template() {
    return `
      <h1> This is errorPage </h1>
    `;
  }
}
