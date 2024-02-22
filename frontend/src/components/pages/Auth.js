import Component from '../../core/Component.js';

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
        .then((data) => console.log(data));
    return ``;
  }
  async mounted() {}
}

function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    'max-age': '3600',
    expires: 3600
  };

  if (options.expires instanceof Date) {
    options.expires = options.expires.toUTCString();
  }
  if (options['max-age'] instanceof Date) {
    options['max-age'] = options.expires.toUTCString();
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

function setToken(data) {
  const token_arr = Object.entries(data);
  const access = token_arr[0];
  const refresh = token_arr[1];
  setCookie(access[0], access[1]);
  setCookie(refresh[0], refresh[1]);
}
