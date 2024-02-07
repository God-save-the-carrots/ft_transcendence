import Component from '../../core/Component.js';

export default class Test_app2 extends Component {
  _title;
  constructor(target) {
    super(target);
    this._title = 'item2';
  }
  async template() {
    return `
      <h1> HI!! This is TEST 2 </h1>
    `;
  }
}
