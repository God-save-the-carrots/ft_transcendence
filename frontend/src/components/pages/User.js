import Component from '../../core/Component.js';
import UserProfile from './UserProfile.js';
import UserStatistics from './UserStatistics.js';
import UserHistory from './UserHistory.js';

export default class User extends Component {
  _title;
  _params;
  constructor(params = null) {
    super(document.querySelector('#app'));
    this._title = 'User';
    this._params = params;
  }
  async template() {
    return `
      <h1> ${this._title} </h1>
      <main data-component="test-app1"></main>
      <a href="statistics" class="user__link" data-link>statistics</a>
      <a href="history" class="user__link" data-link>history</a>
      <main data-component="test-app2"></main>
    `;
  }

  async mounted() {
    const _test_app1 = this.$target.querySelector(
        '[data-component="test-app1"]',
    );
    const _test_app2 = this.$target.querySelector(
        '[data-component="test-app2"]',
    );
    new UserProfile(_test_app1, this._params.intra_id);
    new UserStatistics(_test_app2, this._params.intra_id);
  }

  setEvent() {
    this.addEvent('click', '[data-link]', async (e) => {
      const _test_app2 = this.$target.querySelector(
          '[data-component="test-app2"]',
      );
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        const href = e.target.getAttribute('href');
        const intra_id = this._params.intra_id;
        if (href === 'history') new UserHistory(_test_app2, intra_id);
        else new UserStatistics(_test_app2, intra_id);
      }
    });
  }
}
