import Component from '../../core/Component.js';
import Router from '../../core/Router.js';
import Cookie from '../../core/Cookie.js';

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
    const code = auth_api.split('code=');
    const login_api = `http://localhost:8000/api/login`;

    console.log(auth_api);
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
  token_arr.forEach((arr) => Cookie.setCookie(arr[0], arr[1]));
}

function isCookieExist() {
  const access = Cookie.getCookie('access');
  const refresh = Cookie.getCookie('refresh');
  const intra_id = Cookie.getCookie('intra_id');
  if (access === undefined || refresh === undefined || intra_id === undefined) {
    return false;
  }
  return true;
  // access = getCookie('access');
  // const uri = `http://localhost:8000/api/game/pong/rank/`;
  // fetch(uri, {
  //   method: 'GET',
  //   headers: {
  //     'Authorization': `Bearer ${access}`,
  //   }
  // })
  //   .then(function(response) {
  //     if (response.ok) {
  //       console.log('response ok', response);
  //       redirection_uri = `http://localhost/rank/`;
  //       //Response.redirect(redirection_uri);
  //       Router.navigateTo('/rank');
  //     }
  //   })
}

function verifyCookie(data) {
  if (isCookieExist() === false) {
    setToken(data);
  }
  const verify_api = `http://localhost:8000/api/token/verify/`;
  const access = Cookie.getCookie('access');
  const refresh = Cookie.getCookie('refresh');
  const intra_id = Cookie.getCookie('intra_id');
  fetch(verify_api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access: `${access}`,
      refresh: `${refresh}`,
    })
  })
    .then((response) => {
      if (response.ok) {
        console.log(response.json);
        Router.navigateTo(`/rank`);
        // Router.navigateTo(`/user/${intra_id}`);
      } else if (response.status == 201) {
        console.log(response.json);
      }
    });
  }
  