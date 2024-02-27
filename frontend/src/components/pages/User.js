import Component from '../../core/Component.js';
import UserProfile from './UserProfile.js';
import UserProfileLogined from './UserProfileLogined.js';
import UserStatistics from './UserStatistics.js';
import UserHistory from './UserHistory.js';
import NewUser from './NewUser.js';
import {pubEnv} from '../../const.js';
import Cookie from '../../core/Cookie.js';
import Router from '../../core/Router.js';

const g_logined_test = true;
const endpoint = pubEnv.API_SERVER;
const access_token = pubEnv.TOKEN_ACCESS;
const refresh_token = pubEnv.TOKEN_REFRESH;
const intra_token = pubEnv.TOKEN_INTRA_ID;

export default class User extends Component {
  _title;
  _params;
  _myCss = '../../../public/assets/css/user.css';
  _statistics = null;
  _history = null;
  constructor($target, params = null) {
    super($target);
    this._title = 'User';
    this._params = params;
  }
  async template() {
    return `
      <link rel="stylesheet" href="${this._myCss}" type="text/css" />
      <main>
        <div class="page-profile" data-component="test-app1"></div>
        <div class="user-menu">
          <div class="stats_test"> </div>
          <div class="stats_link">
            <a href="statistics" data-detect='statistics'
              userpage-link>statistics</a>
          </div>
          <div class="history_link">
            <a href="history" data-detect='history' userpage-link>history</a>
          </div>
        </div>
        <div class="user-page" data-component="test-app2"></div>
      </main>
    `;
  }

  async mounted() {
    await verifyCookie();
    const endpoint = pubEnv.API_SERVER;
    const profile_api =
      `${endpoint}/api/game/pong/score/${this._params.intra_id}/play-time`;
    const access = Cookie.getCookie('access');
    const res = await fetch(profile_api, {
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
    if (data.play_time_rank == -1) {
      new NewUser(this._params);
      return;
    }
    const _test_app1 = this.$target.querySelector(
        '[data-component="test-app1"]',
    );
    const _test_app2 = this.$target.querySelector(
        '[data-component="test-app2"]',
    );
    if (g_logined_test == true) {
      new UserProfileLogined(_test_app1, this._params.intra_id);
    } else {
      new UserProfile(_test_app1, this._params.intra_id);
    }
    if (this._statistics == null) {
      this._statistics = new UserStatistics(_test_app2, this._params.intra_id);
    } else {
      this._statistics.render();
    }
  }

  setEvent() {
    this.addEvent('click', '[userpage-link]', async (e) => {
      const _test_app2 = this.$target.querySelector(
          '[data-component="test-app2"]',
      );
      if (e.target.matches('[userpage-link]')) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        const intra_id = this._params.intra_id;
        if (href === 'history') {
          if (this._history == null) {
            this._history = new UserHistory(_test_app2, intra_id);
          } else this._history.render();
        } else this._statistics.render();
      }
    });
  }
}

async function verifyCookie() {
  const verify_api = `${endpoint}/api/token/verify/`;
  const access = Cookie.getCookie(access_token);
  const refresh = Cookie.getCookie(refresh_token);
  const intra_id = Cookie.getCookie(intra_token);
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
  console.log(res.status);
  if (res.status === 201) {
    console.log('201 resetting data');
    console.log(res_data);
    Cookie.setToken(res_data);
    Router.navigateTo(`/user/${intra_id}`);
  } else if (res.status === 401) {
    Cookie.deleteCookie(access_token, refresh_token, intra_token);
    Router.navigateTo('/');
  }
}
