import Component from '../../core/Component.js';
import Router from '../../core/Router.js';

const authReq = Component.prototype.authReq;

export default class UserHistory extends Component {
  _title;
  _intra_id;
  _my_css = '../../../public/assets/css/userHistory.css';
  constructor(parent, target, params = null) {
    super(parent, target);
    this._title = 'User History';
    this._intra_id = params;
  }
  async initState() {
    return {
      current_page: 1,
    };
  }
  async template() {
    const _current_page = this.state.current_page;
    let html = '';
    const history_api = `/api/game/pong/score/${this._intra_id}`;
    const paging_api = history_api + '?' + `page=${_current_page}&page_size=1`;
    const [res, data] = await this.authReq('get', paging_api);
    if (res.status !== 200) {
      Router.navigateTo(`/error/${res.status}`);
      throw new Error();
    }
    const last_page_index = data.last_page_index;
    html += `
     <link rel="stylesheet" href="${this._my_css}" type="text/css" />
      <div class="history-page">
      ${await createHistoryContents(data.data)}
      </div>
    `;
    html += createHistoryPagination(_current_page, last_page_index);
    return html;
  }
  async mounted() {}

  setEvent() {
    this.addEvent('click', '.history-page-item', async (e) => {
      if (isNaN(e.target.dataset.page)) return;
      if (e.target.dataset.page != '+') {
        this.state.current_page = e.target.dataset.page;
      }
    });

    this.addEvent('click', '[history-link]', async (e) => {
      const parent = e.target.parentElement;
      e.preventDefault();
      if (e.target.matches('[history-link]')) {
        e.preventDefault();
        const href = e.target.href;
        await Router.navigateTo(href);
      } else if (parent.matches('[history-link]')) {
        e.preventDefault();
        const href = parent.href;
        await Router.navigateTo(href);
      }
    });
  }
}

function createHistoryPagination(current, last) {
  let list_HTML = `
  <div class="pagination-outer">
    <ul class="pagination pagination-circle">`;

  for (let i = current - 2; i != current; i ++) {
    let index;
    if (i > 0) index = i;
    else index = '+';
    list_HTML +=`
      <li class="history-page-item">
        <a class="page-link" data-page=${index}>${index}</a>
      </li>
  `;
  }

  for (let i = Number(current); i <= Number(current) + 2; i ++) {
    let index;
    if (i > last) index = '+';
    else index = i;
    list_HTML += `
      <li class="history-page-item">
        <a class="page-link" data-page=${index}>${index}</a>
      </li>
    `;
  }
  list_HTML += `
      </ul>
    </div>
    `;
  return list_HTML;
}

async function createHistoryContents(jsonData) {
  let list_HTML = '';
  for (const item of jsonData) {
    const match_id = item.match_id;
    // heder
    list_HTML += `
        <div class="card history-card">
          <div class="card-header header-history">
            <div class="avatar-group">
    `;
    item.score.forEach(function(scoreItem) {
      const user = scoreItem.user.intra_id;
      const photo = scoreItem.user.photo_id;

      if (scoreItem.rank === 1) {
        list_HTML += `
              <a class="parent-image" href="/user/${user}" history-link>
                <img class="avatar" alt="Avatar"
                src="/public/assets/profile/${photo}.png" />
                <img class="crown-icon"
                src="/public/assets/image/crown.png" />
              </a>
        `;
      } else {
        list_HTML += `
              <a href="/user/${user}" history-link>
              <img class="avatar" alt="Avatar"
              src="/public/assets/profile/${photo}.png" /></a>
        `;
      }
    });
    list_HTML += `
            </div>
          </div>
    `;
    // heder
    // body
    list_HTML += `
          <div class="card-body body-history">
            <div class="item">
`;
    const history_api = `/api/game/pong/matches/${match_id}/`;
    const [res, data] = await authReq('get', history_api);
    if (res.status !== 200) {
      Router.navigateTo(`/error/${res.status}`);
      throw new Error();
    }
    const r2 = data.game[0];
    const r1_1 = data.game[1];
    const r1_2 = data.game[2];
    // R2
    list_HTML += `
    <div class="item-parent">
      <div class="card item-card">
        <div class="item-card-head">
          <img class="avatar" alt="Avatar"
          src="/public/assets/profile/${r2.round[0].user.photo_id}.png" />
          <div class="item-time">
            <div data-detect='time'>TIME</div>
            <p>${convertSecondsToMMSS(r2.second)}</p>
          </div>
          <img class="avatar" alt="Avatar"
          src="/public/assets/profile/${r2.round[1].user.photo_id}.png" />
        </div>
        <div class="item-card-body">
          <p>${r2.round[0].score} : ${r2.round[1].score}</p>
        </div>
      </div>
    </div>
    `;
    list_HTML += `
    <div class="item-childrens">

      <div class="item-child">
        <div class="card item-card">
          <div class="item-card-head">
            <img class="avatar" alt="Avatar"
            src="/public/assets/profile/${r1_1.round[0].user.photo_id}.png" />
            <div class="item-time">
              <div data-detect='time'>TIME</div>
              <p>${convertSecondsToMMSS(r1_1.second)}</p>
            </div>
            <img class="avatar" alt="Avatar"
            src="/public/assets/profile/${r1_1.round[1].user.photo_id}.png" />
          </div>
          <div class="item-card-body">
            <p>${r1_1.round[0].score} : ${r1_1.round[1].score}</p>
          </div>
        </div>
      </div>
        <div class="item-child">
          <div class="card item-card">
            <div class="item-card-head">
              <img class="avatar" alt="Avatar"
              src="/public/assets/profile/${r1_2.round[0].user.photo_id}.png" />
              <div class="item-time">
                <div data-detect='time'>TIME</div>
                <p>${convertSecondsToMMSS(r1_2.second)}</p>
              </div>
              <img class="avatar" alt="Avatar"
              src="/public/assets/profile/${r1_2.round[1].user.photo_id}.png" />
            </div>
            <div class="item-card-body">
              <p>${r1_2.round[0].score} : ${r1_2.round[1].score}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `;
  // body
  }
  return list_HTML;
}

function convertSecondsToMMSS(seconds) {
  const minutes = Math.floor(seconds / 60);
  let second = seconds % 60;
  if (second < 10) {
    second = '0' + second;
  }
  return minutes + ':' + second;
}

