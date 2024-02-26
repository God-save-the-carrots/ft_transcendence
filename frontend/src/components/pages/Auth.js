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
    if (isCookieExist() === false) {
      const auth_api = window.location.href;
      const code = auth_api.split('code=');
      // const login_api = `${endpoint}:8000/api/login`;
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
    } else { // debug
      const verify_api = `http://localhost:8000/api/token/verify/`;
      const access = Cookie.getCookie(access_token);
      const refresh = Cookie.getCookie(refresh_token);
      const intra_id = Cookie.getCookie('intra_id');
      console.log(access, refresh);
      fetch(verify_api, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access: `${access}`,
          refresh: `${refresh}`,
        }),
      })
          .then((response) => {
            if (response.ok) {
              console.log(response.json);
              // Router.navigateTo(`/rank`);
              // Router.navigateTo(`/user/${intra_id}`);
            } else if (response.status == 201) {
              console.log(response.json);
            } else if (response.status == 401 || response.status == 400) {
              // Cookie.deleteCookie(access_token);
              // Cookie.deleteCookie(refresh_token);
              // Cookie.deleteCookie('intra_id');
              Router.navigateTo('/');
            }
          });
    }
    return ``;
  }
  async mounted() {}
}

function setToken(data) {
  const token_arr = Object.entries(data);
  token_arr.forEach((arr) => {
    // console.log(arr[0]);
    // console.log(arr[1]);
    Cookie.setCookie(arr[0], arr[1],
        {
          'expires': new Date(),
          'max-age': new Date(),
        },
    );
  },
  );
}

function isCookieExist() {
  const access = Cookie.getCookie(access_token);
  const refresh = Cookie.getCookie(refresh_token);
  const intra_id = Cookie.getCookie('intra_id');
  if (access === undefined || refresh === undefined || intra_id === undefined) {
    console.log('isCookie not exist');
    return false;
  }
  console.log('cookie exist');
  return true;
  // access = getCookie(${access_token});
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
    console.log('create cookie');
    setToken(data);
  }
  const verify_api = `http://localhost:8000/api/token/verify/`;
  const access = Cookie.getCookie(access_token);
  const refresh = Cookie.getCookie(refresh_token);
  const intra_id = Cookie.getCookie('intra_id');
  console.log(access, refresh);
  fetch(verify_api, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      access: `${access}`,
      refresh: `${refresh}`,
    }),
  })
      .then((response) => {
        if (response.ok) {
          console.log(response.json);
          // Router.navigateTo(`/rank`);
          // Router.navigateTo(`/user/${intra_id}`);
        } else if (response.status == 201) {
          console.log(response.json);
        } else if (response.status == 401 || response.status == 400) {
          // Cookie.deleteCookie(access_token);
          // Cookie.deleteCookie(refresh_token);
          // Cookie.deleteCookie('intra_id');
          // Router.navigateTo('/');
        }
      });
}
