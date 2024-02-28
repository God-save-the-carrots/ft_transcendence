import {pubEnv} from '../../const.js';
import Component from '../../core/Component.js';
import ErrorPage from './ErrorPage.js';
import Router from '../../core/Router.js';
import Cookie from '../../core/Cookie.js';

const endpoint = pubEnv.API_SERVER;
const access_token = pubEnv.TOKEN_ACCESS;
const refresh_token = pubEnv.TOKEN_REFRESH;
const intra_token = pubEnv.TOKEN_INTRA_ID;
const lang_token = pubEnv.TOKEN_LANG;

export default class UserHistory extends Component {
  _title;
  _intra_id;
  _my_css = '../../../public/assets/css/userHistory.css';
  constructor(target, params = null) {
    super(target);
    this._title = 'User History';
    this._intra_id = params;
  }
  async initState() {
    return {
      current_page: 1,
    };
  }
  async template() {
    await verifyCookie(this._intra_id);
    const _current_page = this.state.current_page;
    let html = '';
    const history_api = `${endpoint}/api/game/pong/score/${this._intra_id}`;
    const access = Cookie.getCookie('access');
    const res = await fetch(
        history_api + '?' + `page=${_current_page}&page_size=1`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${access}`,
          },
        },
    );
    if (res.status != 200) {
      new ErrorPage({code: res.status, msg: res.statusText});
      return;
    }
    const data = await res.json();
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
    const history_api = `${endpoint}/api/game/pong/matches/${match_id}`;
    const access = Cookie.getCookie('access');
    const res = await fetch(history_api, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access}`,
      },
    });
    if (res.status != 200) {
      new ErrorPage({code: res.status, msg: res.statusText});
      return;
    }
    const data = await res.json();
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

async function verifyCookie(intra_id) {
  const verify_api = `${endpoint}/api/token/verify/`;
  const access = Cookie.getCookie(access_token);
  const refresh = Cookie.getCookie(refresh_token);
  const res = await fetch(verify_api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access: `${access}`,
      refresh: `${refresh}`,
    }),
  });
  const res_data = await res.json();
  if (res.status === 201) {
    Cookie.deleteCookie(access_token, refresh_token, intra_token, lang_token);
    Cookie.setToken(res_data);
    Router.navigateTo(`/user/${intra_id}`);
    return;
  } else if (res.status === 401) {
    Cookie.deleteCookie(access_token, refresh_token, intra_token, lang_token);
    Router.navigateTo('/');
  }
}
