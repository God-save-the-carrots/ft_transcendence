import Component from '../../core/Component.js';
import Router from '../../core/Router.js';
import Cookie from '../../core/Cookie.js';
import {pubEnv} from '../../const.js';

const endpoint = pubEnv.API_SERVER;
const access_token = pubEnv.TOKEN_ACCESS;
const refresh_token = pubEnv.TOKEN_REFRESH;

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

    console.log(code);
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

function setToken(data) {
  const token_arr = Object.entries(data);
  token_arr.forEach((arr) => {
    Cookie.setCookie(arr[0], arr[1],
        {
          'expires': new Date(),
          'max-age': new Date(),
        },
    );
  });
}

function isCookieExist() {
  const access = Cookie.getCookie(access_token);
  const refresh = Cookie.getCookie(refresh_token);
  const intra_id = Cookie.getCookie('intra_id');
  if (access === undefined || refresh === undefined || intra_id === undefined) {
    return false;
  }
  return true;
}

async function verifyCookie(data) {
  if (isCookieExist() === false) {
    console.log('create cookie');
    setToken(data);
  }
  const verify_api = `${endpoint}/api/token/verify/`;
  const access = Cookie.getCookie(access_token);
  const refresh = Cookie.getCookie(refresh_token);
  const intra_id = Cookie.getCookie('intra_id');
  console.log(access, refresh);
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
    Router.navigateTo(`/user/${intra_id}`);
    return;
  }
  const response_data = await res.json();
  if (res.status === 201) {
    console.log('201 resetting data');
    console.log(response_data.data);
    verifyCookie(response_data.data);
    return;
  } else if (res.status === 401) {
    Cookie.deleteCookie(access_token);
    Cookie.deleteCookie(refresh_token);
    Cookie.deleteCookie('intra_id');
    Router.navigateTo('/');
  }
}
