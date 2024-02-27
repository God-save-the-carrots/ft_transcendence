import Component from '../../core/Component.js';
import Router from '../../core/Router.js';
import Cookie from '../../core/Cookie.js';
import {pubEnv} from '../../const.js';
import Nav from '../Nav.js';
import {isCookieExist} from '../../core/Utils.js';

const endpoint = pubEnv.API_SERVER;
const access_token = pubEnv.TOKEN_ACCESS;
const refresh_token = pubEnv.TOKEN_REFRESH;
const intra_token = pubEnv.TOKEN_INTRA_ID;

export default class Auth extends Component {
  _title;
  _params;
  constructor(params = null) {
    super(document.querySelector('#app'));
    this._title = 'Auth';
    this._params = params;
  }
  async template() {
    const auth_api = window.location.href;
    const code = auth_api.split('code=')[1];
    const login_api = `${endpoint}/api/login`;

    fetch(login_api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({code}),
    })
        .then((x) => x.json())
        .then((data) => verifyCookie(data));
    return ``;
  }
  async mounted() {}
}

async function verifyCookie(data) {
  if (isCookieExist() === false) {
    Cookie.setToken(data);
  }
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
  if (res.ok) {
    new Nav(document.querySelector('#nav'));
    Router.navigateTo(`/user/${intra_id}`);
    return;
  }
  const res_data = await res.json();
  if (res.status === 201) {
    Cookie.deleteCookie(access_token, refresh_token, intra_token);
    verifyCookie(res_data.data);
    return;
  } else if (res.status === 401) {
    Cookie.deleteCookie(access_token, refresh_token, intra_token);
    Router.navigateTo('/');
  }
}
