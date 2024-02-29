import {pubEnv} from '../const.js';
import Component from '../core/Component.js';
import Cookie from '../core/Cookie.js';
import Router from '../core/Router.js';
import * as Lang from '../Lang.js';
import {isCookieExist} from '../core/Utils.js';

const intra_token = pubEnv.TOKEN_INTRA_ID;

class Nav extends Component {
  constructor($target) {
    super(null, $target);
  }
  async template() {
    if (isCookieExist() === false) {
      return `
<link rel="stylesheet" type="text/css" href="../../public/assets/css/nav.css" />
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
      <a class="navbar-brand" href="/" data-link>LIBFT</a>
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <img src="../../public/assets/image/heart.svg" draggable="false"/>
        </li>
        <li class="nav-item">
          <img src="../../public/assets/image/heart.svg" draggable="false"/>
        </li>
        <li class="nav-item">
          <img src="../../public/assets/image/heart.svg" draggable="false"/>
        </li>
      </ul>
    </div>
  </div>
</nav>
      `;
    } else {
      const intra_id = Cookie.getCookie(intra_token);
      const profile_api = `/api/game/pong/score/${intra_id}/profile/`;
      const [, data] = await this.authReq('GET', profile_api);
      return `
<link rel="stylesheet" type="text/css" href="../../public/assets/css/nav.css" />
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
      <a class="navbar-brand" href="/user/${data.user.intra_id}"
        nav-link>LIBFT</a>
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" href="/game" nav-link>
            <img src="../../public/assets/image/game.svg" draggable="false"/>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/rank" nav-link>
            <img src="../../public/assets/image/crown.svg" draggable="false"/>
          </a>
        </li>
        <li class="dropdown nav-item">
          <a class="nav-link"
            id="navbarDropdownMenuLink" role="button"
            data-bs-toggle="dropdown" aria-expanded="false">
            <span class="nav-profile">
              <img src="../../public/assets/profile/${data.user.photo_id}.png">
            </span>
          </a>
          <ul class="dropdown-menu dropdown-menu-lg-end"
            aria-labelledby="navbarDropdownMenuLink">
            <li><a class="dropdown-item"
              href="/user/${data.user.intra_id}" nav-link>
              Profile</a></li>
            <li><a class="dropdown-item" href="/" nav-link>Logout</a></li>
            <li><a class="dropdown-item" data-lang=ko lang-link>KOREAN</a></li>
            <li><a class="dropdown-item" data-lang=en lang-link>ENGLISH</a></li>
            <li><a class="dropdown-item" data-lang=cn lang-link>CHINESE</a></li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
`;
    }
  }
  setEvent() {
    this.addEvent('click', '[nav-link]', async (e) => {
      const parent = e.target.parentElement;
      e.preventDefault();
      if (e.target.matches('[nav-link]')) {
        e.preventDefault();
        const href = e.target.href;
        await Router.navigateTo(href);
      } else if (parent.matches('[nav-link]')) {
        e.preventDefault();
        const href = parent.href;
        await Router.navigateTo(href);
      }
    });
    this.addEvent('click', '[lang-link]', async (e) => {
      Lang.setLanguage(e.target.dataset.lang);
      const intra_id = Cookie.getCookie(intra_token);
      const change_api = `/api/user/${intra_id}/`;
      const [res] = await this.authReq('PATCH', change_api, {
        'lang_type': e.target.dataset.lang,
      });
      if (res.status !== 200) {
        Router.navigateTo(`/error/${res.status}`);
        throw new Error();
      }
      Cookie.setCookie(pubEnv.TOKEN_LANG, e.target.dataset.lang);
    });
  }
}

export default new Nav(document.querySelector('#nav'));