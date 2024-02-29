import Component from '../../core/Component.js';
import {pubEnv} from '../../const.js';
import {isCookieExist} from '../../core/Utils.js';
import Cookie from '../../core/Cookie.js';
import Nav from '../Nav.js';

const endpoint = pubEnv.API_SERVER;
const access_token = pubEnv.TOKEN_ACCESS;
const refresh_token = pubEnv.TOKEN_REFRESH;
const intra_token = pubEnv.TOKEN_INTRA_ID;
const lang_token = pubEnv.TOKEN_LANG;

export default class Home extends Component {
  _title;
  _params;
  constructor($target, params = null) {
    super(null, $target);
    this._title = 'Home';
    this._params = params;
    this._my_css = '../../public/assets/css/home.css';
  }
  async template() {
    if (isCookieExist() === true) {
      Cookie.deleteCookie(access_token, refresh_token, intra_token, lang_token);
      new Nav(document.querySelector('#nav'));
    }
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
      const redirect_uri = `${endpoint}/auth/ft/redirection`;
      const login_api = `https://api.intra.42.fr/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code`;
      location.href = login_api;
    });
  }
}
