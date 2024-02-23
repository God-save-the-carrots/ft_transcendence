import Component from '../../core/Component.js';
export default class EmptyUserStatistics extends Component {
  _title;
  _intra_id;
  _my_css = '../../../public/assets/css/userStatistics.css';
  constructor(target, params = null) {
    super(target);
    this._title = 'User Statistics';
    this._intra_id = params;
  }
  async template() {
    const html = `
      <link rel="stylesheet" href="${this._my_css}" type="text/css" />
      <div class="boxs">
        <div class="empty"></div>
        <div class="playtime">
          <p class="title"> Playtime </p>
          <p align="center" class="playtime_hour"> 
              empty
          </p>
        </div>

      <div class="winning">
        <p class="title"> Winning Rate </p>
        <p align="center" class="playtime_hour"> 
            empty
        </p>

      </div>

      <div class="goal-against">
        <p class="title"> Goals Against Average </p>
        <p align="center" class="playtime_hour"> 
            empty
        </p>
      </div>

      <div class="winning-percent">
        <p id="title"> Winning Percentage </p>
        <p align="center" class="playtime_hour"> 
            empty
        </p>
      </div>
      </div>
    `;
    return (html);
  }
  async mounted() {}
}
