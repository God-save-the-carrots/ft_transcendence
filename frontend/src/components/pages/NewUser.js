import Component from '../../core/Component.js';
import UserProfile from './UserProfile.js';
import UserProfileLogined from './UserProfileLogined.js';
import EmptyUserStatistics from './EmptyUserStatistics.js';
import Cookie from '../../core/Cookie.js';
import {pubEnv} from '../../const.js';


export default class NewUser extends Component {
  _title;
  _params;
  _myCss = '../../../public/assets/css/user.css';
  constructor(params = null) {
    super(document.querySelector('#app'));
    this._title = 'User';
    this._params = params;
  }
  async template() {
    return `
      <link rel="stylesheet" href="${this._myCss}" type="text/css" />
      <main>
        <div class="page-profile" data-component="test-app1"></div>
        <div class="user-page" data-component="test-app2"></div>
      </main>
    `;
  }

  async mounted() {
    const _test_app1 = this.$target.querySelector(
        '[data-component="test-app1"]',
    );
    const _test_app2 = this.$target.querySelector(
        '[data-component="test-app2"]',
    );
    if (Cookie.getCookie(pubEnv.TOKEN_INTRA_ID) === this._params.intra_id) {
      new UserProfileLogined(_test_app1, this._params.intra_id);
    } else {
      new UserProfile(_test_app1, this._params.intra_id);
    }
    new EmptyUserStatistics(_test_app2, this._params.intra_id);
  }
}
