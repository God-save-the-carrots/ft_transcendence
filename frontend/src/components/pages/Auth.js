import Component from '../../core/Component.js';
import Router from '../../core/Router.js';
import Cookie from '../../core/Cookie.js';
import {pubEnv} from '../../const.js';
import Nav from '../Nav.js';

export default class Auth extends Component {
  _title;
  _params;
  constructor(params = null) {
    super(null, document.querySelector('#app'));
    this._title = 'Auth';
    this._params = params;
  }
  async template() {
    const auth_api = window.location.href;
    const code = auth_api.split('code=')[1];
    const login_api = `${pubEnv.API_SERVER}/api/login`;

    const res = await fetch(login_api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({code}),
    });
    if (res.ok == false) {
      alert('login failure');
      await Router.navigateTo('/');
      return;
    }
    const json = await res.json();
    Cookie.setToken(json);

    new Nav(document.querySelector('#nav'));
    const intraId = Cookie.getCookie(pubEnv.TOKEN_INTRA_ID);
    Router.navigateTo(`/user/${intraId}`);

    return ``;
  }
  async mounted() {}
}
