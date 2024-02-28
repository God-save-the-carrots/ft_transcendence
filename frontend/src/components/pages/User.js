import Component from '../../core/Component.js';
import UserProfile from './UserProfile.js';
import UserProfileLogined from './UserProfileLogined.js';
import UserStatistics from './UserStatistics.js';
import UserHistory from './UserHistory.js';
import NewUser from './NewUser.js';
import {pubEnv} from '../../const.js';
import Cookie from '../../core/Cookie.js';

const intra_token = pubEnv.TOKEN_INTRA_ID;

export default class User extends Component {
  _title;
  _params;
  _myCss = '../../../public/assets/css/user.css';
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
    const uri = `/api/game/pong/score/${this._params.intra_id}/play-time/`;
    const [res, data] = await this.authReq('get', uri);
    if (res.status !== 200) {
      // TODO: load error page;
      return;
    }
    if (data.play_time_rank == -1) {
      this.addComponent(new NewUser(this._params));
      return;
    }
    const _test_app1 = this.$target.querySelector(
        '[data-component="test-app1"]',
    );
    const _test_app2 = this.$target.querySelector(
        '[data-component="test-app2"]',
    );
    const isMyPage = Cookie.getCookie(intra_token) === this._params.intra_id;
    const child = isMyPage ?
      new UserProfileLogined(_test_app1, this._params.intra_id):
      new UserProfile(_test_app1, this._params.intra_id);
    this.addComponent(child);
    this.addComponent(new UserStatistics(_test_app2, this._params.intra_id));
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

        this.popComponent();
        const child = href === "history" ?
          new UserHistory(_test_app2, intra_id):
          new UserStatistics(_test_app2, this._params.intra_id);
        this.addComponent(child);
      }
    });
  }
}


