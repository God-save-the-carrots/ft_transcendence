import {pubEnv} from '../../const.js';
import Component from '../../core/Component.js';
import ErrorPage from './ErrorPage.js';

const endpoint = pubEnv.API_SERVER;
export default class UserStatistics extends Component {
  _title;
  _intra_id;
  _my_css = '../../../public/assets/css/userStatistics.css';
  constructor(target, params = null) {
    super(target);
    this._title = 'User Statistics';
    this._intra_id = params;
  }
  async template() {
    const playtime_api =
      `${endpoint}/api/game/pong/score/${this._intra_id}/play-time`;
    const playtime_res = await fetch(playtime_api);
    if (playtime_res.status != 200) {
      new ErrorPage({code: playtime_res.status, msg: playtime_res.statusText});
      return;
    }
    const playtime_data = await playtime_res.json();
    let html = `
      <link rel="stylesheet" href="${this._my_css}" type="text/css" />
      <div class="boxs">
        <div class="playtime">
          <p class="title" data-detect='playtime'>Play time</p>
          <p align="center" class="playtime_hour"> 
            ${convertToHoursMinutes(playtime_data.minutes)}
          </p>
          <p align="center" class="playtime_day">
            ${convertToDaysHoursMinutes(playtime_data.minutes)}
          </p>
          <p align="center" data-detect='rank'>
          </p>
          <p align="center" class="playtime_rank">
            ${playtime_data.play_time_rank}
          </p>
        </div>
    `;

    const winning_api =
      `${endpoint}/api/game/pong/score/${this._intra_id}/winning-rate`;
    const winning_res = await fetch(winning_api);
    if (winning_res.status != 200) {
      new ErrorPage({code: winning_res.status, msg: winning_res.statusText});
      return;
    }
    const winning_data = await winning_res.json();
    const winning_ratio =
        calculateRatio(winning_data.winning_round, winning_data.losing_round);

    html += `
      <div class="winning">
        <p class="title"data-detect='winning_rate'> Winning Rate </p>
        <div class="winning_chart">
            <p class="title" 
              data-detect='total_rounds' style='float: left;'></p>
            <p class="title">  : ${winning_data.total_round} R</p>
          <div class="progress">
            <div class="progress-bar" role="progressbar"
              style="width: ${winning_ratio.value1Ratio}%;"
              aria-valuenow="${winning_ratio.value1Ratio}"
              aria-valuemin="0" aria-valuemax="100 ">
              <div style="display: flex;">
                <p data-detect='win' style='width: 50%; margin: 0;'></p>
                <p style='width: 50%; margin: 0;'>
                  ${winning_data.winning_round}R
                </p>
              </div>
            </div>
            <div class="progress-bar bg-info" role="progressbar" 
              style="width: ${winning_ratio.value2Ratio}%;" 
              aria-valuenow="${winning_ratio.value2Ratio}"
              aria-valuemin="0" aria-valuemax="100">
              <div style="display: flex;">
                <p data-detect='lose' style='width: 50%; margin: 0;'></p>
                <p style='width: 50%; margin: 0;'>
                  ${winning_data.losing_round}R
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    const goal_api =
      `${endpoint}/api/game/pong/score/${this._intra_id}/goals-against-average`;
    const goal_res = await fetch(goal_api);
    if (goal_res.status != 200) {
      new ErrorPage({code: goal_res.status, msg: goal_res.statusText});
      return;
    }
    const goal_data = await goal_res.json();
    const goal_ratio =
        calculateRatio(goal_data.user_score, goal_data.enemy_score);
    if (goal_ratio.value1Ratio == 0) {
      html += `
      <div class="goal-against">
        <p class="title" data-detect='goals_against_average'>
          Goals Against Average
        </p>
      </div>
    `;
    } else {
      html += `
        <div class="goal-against">
          <p class="title" data-detect='goals_against_average'> 
            Goals Against Average
          </p>
          <div class="goal_chart">
            <div class="progress">
              <div class="progress-bar" role="progressbar" 
                style="width: ${goal_ratio.value1Ratio}%;"
                aria-valuenow=${goal_ratio.value1Ratio} 
                aria-valuemin="0" aria-valuemax="100">
                ${goal_ratio.value1Ratio}%
              </div>
              <div class="progress-bar bg-info" role="progressbar" 
                style="width: ${goal_ratio.value2Ratio}%;"
                aria-valuenow=${goal_ratio.value2Ratio} 
                aria-valuemin="0" aria-valuemax="100">
                ${goal_ratio.value2Ratio}%
              </div>
            </div>
          </div>
        </div>
    `;
    }
    const wp_api =
      `${endpoint}/api/game/pong/score/${this._intra_id}/winning-percentage`;
    const wp_res = await fetch(wp_api);
    if (wp_res.status != 200) {
      new ErrorPage({code: wp_res.status, msg: wp_res.statusText});
      return;
    }
    const wp_data = await wp_res.json();
    html += `
<div class="winning-percent">
  <p id="title" data-detect='winning_percentage'> Winning Percentage </p>
  <div class="winning-percent-chart">
    <div class="progress">
      <div class="progress-bar user" role="progressbar"
        aria-valuenow="${wp_data.user_winning_percentage.winning_percentage}"
        aria-valuemin="0" aria-valuemax="100"
        style="width:${wp_data.user_winning_percentage.winning_percentage}%">
        ${wp_data.user_winning_percentage.intra_id}
          ${wp_data.user_winning_percentage.winning_percentage}%
      </div>
    </div>

    <div class="progress">
      <div class="progress-bar average" role="progressbar"
        aria-valuenow="${wp_data.average_winning_percentage}"
        aria-valuemin="0" aria-valuemax="100"
        style="width:${wp_data.average_winning_percentage}">
        <div style="display: flex;">
          <p data-detect='average' style='float: left;'></p>
          <p style='width: 50%; margin: 2%;'> 
            ${wp_data.average_winning_percentage}%
          </p>
        </div>
      </div>
    </div>

    <div class="progress">
      <div class="progress-bar highest" role="progressbar"
        aria-valuenow="${wp_data.highest_winning_percentage.winning_percentage}"
        aria-valuemin="0" aria-valuemax="100"
        style="width:${wp_data.highest_winning_percentage.winning_percentage}%">

        <div style="display: flex;">
          <p data-detect='highest' style='float: left;'></p>
          <p style='width: 50%; margin: 2%;'>
            ${wp_data.highest_winning_percentage.winning_percentage}%
          </p>
        <div>
      </div>
    </div>
  </div>
</div>
`;
    return (html);
  }
  async mounted() {}
}

// 분을 시간과 분으로 변환하는 함수
function convertToHoursMinutes(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return hours + 'H ' + remainingMinutes + 'M ';
}

// 분을 날짜, 시간, 분으로 변환하는 함수
function convertToDaysHoursMinutes(minutes) {
  const days = Math.floor(minutes / (60 * 24));
  const remainingHours = Math.floor((minutes % (60 * 24)) / 60);
  const remainingMinutes = minutes % 60;
  return days + 'D ' + remainingHours + 'H ' + remainingMinutes + 'M ';
}

// 두 값의 비율을 계산 해서 반환 해주는 함수
function calculateRatio(value1, value2) {
  // 두 값이 모두 0이면 비율 계산 불가
  if (value1 === 0 && value2 === 0) {
    return {
      value1Ratio: 0,
      value2Ratio: 0,
    };
  }
  // value1을 기준으로 비율 계산
  const ratio1 = value1 / (value1 + value2) * 100;

  // value2을 기준으로 비율 계산
  const ratio2 = value2 / (value1 + value2) * 100;

  return {
    value1Ratio: ratio1.toFixed(2),
    value2Ratio: ratio2.toFixed(2),
  };
}
