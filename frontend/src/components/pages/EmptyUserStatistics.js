import Component from '../../core/Component.js';
export default class EmptyUserStatistics extends Component {
  _title;
  _intra_id;
  _my_css = '../../../public/assets/css/userStatistics.css';
  constructor(parent, target, params = null) {
    super(parent, target);
    this._title = 'User Statistics';
    this._intra_id = params;
  }
  async template() {
    const html = `
      <link rel="stylesheet" href="${this._my_css}" type="text/css" />
      <div class="boxs">
        <div class="empty"></div>
        <div class="playtime">
          <p class="title" data-detect='playtime'>Play time</p>
          <p align="center" class="playtime_hour" data-detect='empty'> 
              empty
          </p>
        </div>

      <div class="winning">
        <p class="title"data-detect='winning_rate'> Winning Rate </p>
        <p align="center" class="playtime_hour" data-detect='empty'> 
            empty
        </p>

      </div>

      <div class="goal-against">
        <p class="title" data-detect='goals_against_average'></p>
        <p align="center" class="playtime_hour" data-detect='empty'> 
            empty
        </p>
      </div>

      <div class="winning-percent">
        <p id="title" data-detect='winning_percentage'></p>
        <p align="center" class="playtime_hour" data-detect='empty'> 
        </p>
      </div>
      </div>
    `;
    return (html);
  }
  async mounted() {}
}
