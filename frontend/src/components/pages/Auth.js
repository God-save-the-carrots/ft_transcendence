import Component from '../../core/Component.js';
import Router from '../../core/Router.js';

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
        .then((data) => checkCookie(data));
    return ``;
  }
  async mounted() {}
}

function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    expires: new Date(),
    'max-age': new Date(),
    life: 14 // day
  };

  if (options.expires instanceof Date) {
    options.expires.setTime(options.expires.getTime() + (options.life * 24 * 60 * 60 * 1000));
    options.expires = options.expires.toUTCString();
  }
  if (options['max-age'] instanceof Date) {
    options['max-age'].setTime(options['max-age'].getTime() + (options.life * 24 * 60 * 60 * 1000));
    options['max-age'] = options['max-age'].toUTCString();
  }

  let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

  for (let optionKey in options) {
    updatedCookie += '; ' + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += '=' + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

export function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

function deleteCookie() {
  setCookie('access', "", {
    'max-age': -1,
    expires: -1
  });
  setCookie('refresh', "", {
    'max-age': -1,
    expires: -1
  });
}

function setToken(data) {
  const token_arr = Object.entries(data);
  const access = token_arr[0];
  const refresh = token_arr[1];
  setCookie(access[0], access[1]);
  setCookie(refresh[0], refresh[1]);
}

function checkCookie(data) {
  let access = getCookie('access');
  let redirection_uri = 'http://localhost/';
  if (access === undefined) {
    console.log('set cookie');
    setToken(data);
  }
  access = getCookie('access');
  const uri = `http://localhost:8000/api/game/pong/rank/`;
  fetch(uri, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access}`,
    }
  })
    .then(function(response) {
      if (response.ok) {
        console.log('response ok', response);
        redirection_uri = `http://localhost/rank/`;
        //Response.redirect(redirection_uri);
        Router.navigateTo('/rank');
      }
    })
}
