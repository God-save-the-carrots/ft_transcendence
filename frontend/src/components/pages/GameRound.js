import Component from '../../core/Component.js';

export default class GameRound extends Component {
  _title;
  _params;
  _my_css = '../../../public/assets/css/gameInfo.css';
  constructor(target, params = null) {
    super(target);
    this._params = params;
  }
  async template() {
    // return `<div>${JSON.stringify(this._params)}</div>`;
    return `
      <link rel="stylesheet" href="${this._my_css}" type="text/css" />
      <div class='info-card'>
        ${this.createDivInfoHead(this._params[0])}
        <div class='info-body'>
          <div class="card-body body-history">
            <div class="item">
              <div class="item-parent">
                ${this.createDivItemCard(
      this._params.filter((val) => val.tag === 'round_2_1').at(-1))}
              </div>
              <div class="item-childrens">
                <div class="item-child">
                  ${this.createDivItemCard(
      this._params.filter((val) => val.tag === 'round_1_1').at(-1))}</div>
                <div class="item-child">
                  ${this.createDivItemCard(
      this._params.filter((val) => val.tag === 'round_1_2').at(-1))}</div>
              </div>
            </div>
          </div>
        </div>
        <div class='info-foot'></div>
      </div>
`;
  }

  createDivInfoHead(info) {
    return `
    <div class='info-head'>
      <div class="avatar-group">
        <div class='card'>
          <img class="avatar card-front" alt="Avatar"
            src="/public/assets/profile/${info.players[0].photo_id}.png" />
          <h class='card-back'>${info.players[0].intra_id}</h>
        </div>
        <div class='card'>
          <img class="avatar card-front" alt="Avatar"
            src="/public/assets/profile/${info.players[1].photo_id}.png" />
          <h class='card-back'>
          ${info.players[1].intra_id}
          </h>
        </div>
        <div class='card'>
          <img class="avatar card-front" alt="Avatar"
            src="/public/assets/profile/${info.players[2].photo_id}.png" />
          <h class='card-back'>${info.players[2].intra_id}</h>
        </div>
        <div class='card'>
          <img class="avatar card-front" alt="Avatar"
            src="/public/assets/profile/${info.players[3].photo_id}.png" />
          <h class='card-back'>${info.players[3].intra_id}</h>
        </div>
      </div>
    </div>
    `;
  }
  createDivItemCard(info) {
    let time;
    let score;
    let photo1;
    let photo2;
    if (info == null) {
      photo1 = 1;
      photo2 = 1;
      time = 'ready';
      score = 'ready';
    } else if (info.cause === 'start_session') {
      photo1 = info.players[0].photo_id;
      photo2 = info.players[1].photo_id;
      time = 'playing';
      score = 'playing';
    } else {
      time = convertSecondsToMMSS(info.play_time);
      score = `${info.result[0].score} : ${info.result[1].score}`;
      photo1 = info.result[0].photo_id;
      photo2 = info.result[1].photo_id;
    }
    return `
    <div class="item-card">
      <div class="item-card-head">
        <img class="avatar" alt="Avatar"
        src="/public/assets/profile/${photo1}.png" />
        <div class="item-time">
          <div>TIME</div>
          <p>${time}</p>
        </div>
        <img class="avatar" alt="Avatar"
        src="/public/assets/profile/${photo2}.png" />
      </div>
      <div class="item-card-body">
        <p>${score}</p>
      </div>
    </div>
    `;
  }
}

function convertSecondsToMMSS(seconds) {
  const minutes = Math.floor(seconds / 60);
  let second = seconds % 60;
  if (second < 10) {
    second = '0' + second;
  }
  return minutes + ':' + Math.floor(second);
}
