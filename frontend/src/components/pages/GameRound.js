import Component from '../../core/Component.js';

export default class GameRound extends Component {
  _title;
  _params;
  constructor(target, params = null) {
    super(target);
    this._params = params;
  }
  async template() {
    return `<div>${JSON.stringify(this._params)}</div>`;
  }
}
