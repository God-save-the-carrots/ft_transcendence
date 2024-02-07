import Component from '../../core/Component.js';

export default class UserStatistics extends Component {
  _title;
  _intra_id;
  constructor(target, params = null) {
    super(target);
    this._title = 'User Statistics';
    this._intra_id = params;
  }
  async template() {
    return `
      <h1> ${this._title} </h1>
      <h1> I am ${this._intra_id} </h1>
    `;
  }
  async mounted() {}
}


