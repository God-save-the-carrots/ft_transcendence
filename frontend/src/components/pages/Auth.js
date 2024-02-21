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
    const login_api = `http://localhost/auth/ft/redirection`;
    
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
