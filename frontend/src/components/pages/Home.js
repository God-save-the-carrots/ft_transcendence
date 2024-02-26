import Component from '../../core/Component.js';
import {pubEnv} from '../../const.js';

const endpoint = pubEnv.API_SERVER;

export default class Home extends Component {
  _title;
  _params;
  _my_css;
  constructor(params = null) {
    super(document.querySelector('#app'));
    this._title = 'Home';
    this._params = params;
    this._my_css = '../../public/assets/css/home.css';
  }
  async template() {
    return `
<link rel="stylesheet" href="${this._my_css}" type="text/css">
<div class="background">
    <img class="map" src="../../public/assets/image/map.svg" alt="map"
      draggable="false">
    <div class="content">
      <div class="img-wrap">
        <img src="../../public/assets/image/monster.svg" alt=""
          class="one" draggable="false">
        <img src="../../public/assets/image/star.svg" alt=""
          class="two" draggable="false">
        <img src="../../public/assets/image/monster.svg" alt=""
          class="three" draggable="false">
      </div>
      <p>
        <span>Welcome</span>
        <span>to</span>
        <span class="title">LIBFT!</span>
      </p>
      <button class="login-btn" login>42 login</button>
    </div>
  </div>
    `;
  }
  async mounted() {}

  setEvent() {
    this.addEvent('click', '[login]', async (e) => {
      const client_id = `${pubEnv.API_KEY}`;
      const redirect_uri = `http://localhost/auth/ft/redirection`;
      // const redirect_uri = `${endpoint}/auth/ft/redirection`;
      const login_api = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;
      location.href = login_api;
    });
  }
}
