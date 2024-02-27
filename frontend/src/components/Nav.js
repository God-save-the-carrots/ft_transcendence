import {pubEnv} from '../const.js';
import Component from '../core/Component.js';
import Cookie from '../core/Cookie.js';
import Router from '../core/Router.js';
import * as Lang from '../Lang.js';
import ErrorPage from './pages/ErrorPage.js';
import {isCookieExist} from '../core/Utils.js';

const endpoint = pubEnv.API_SERVER;
const access_token = pubEnv.TOKEN_ACCESS;
const refresh_token = pubEnv.TOKEN_REFRESH;
const intra_token = pubEnv.TOKEN_INTRA_ID;

export default class Nav extends Component {
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
      await verifyCookie();
      const intra_id = Cookie.getCookie(intra_token);
      const profile_api =
        `${endpoint}/api/game/pong/score/${intra_id}/profile/`;
      const access = Cookie.getCookie(access_token);
      const res = await fetch(profile_api, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${access}`,
        },
      });
      if (res.status != 200) {
        new ErrorPage({code: res.status, msg: res.statusText});
        return;
      }
      const data = await res.json();
      return `
<link rel="stylesheet" type="text/css" href="../../public/assets/css/nav.css" />
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
      <a class="navbar-brand" href="/user/${data.user.intra_id}"
        data-link>LIBFT</a>
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" href="/game" data-link>
            <img src="../../public/assets/image/game.svg" draggable="false"/>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/rank" data-link>
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
              href="/user/${data.user.intra_id}" data-link>
              Profile</a></li>
            <li><a class="dropdown-item" href="/" data-link>Logout</a></li>
            <li><a class="dropdown-item" data-lang=ko lang-link>KOREAN</a></li>
            <li><a class="dropdown-item" data-lang=en lang-link>ENGLISH</a></li>
            <li><a class="dropdown-item" data-lang=cn lang-link>CHINA</a></li>
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
    this.addEvent('click', '[data-link]', async (e) => {
      const parent = e.target.parentElement;
      e.preventDefault();
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        const href = e.target.href;
        await Router.navigateTo(href);
      } else if (parent.matches('[data-link]')) {
        e.preventDefault();
        const href = parent.href;
        await Router.navigateTo(href);
      }
    });
    this.addEvent('click', '[lang-link]', async (e) => {
      Lang.setLanguage(e.target.dataset.lang);
    });
  }
}

async function verifyCookie() {
  const verify_api = `${endpoint}/api/token/verify/`;
  const access = Cookie.getCookie(access_token);
  const refresh = Cookie.getCookie(refresh_token);
  const href = window.location.href.split(endpoint)[1];
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
  const res_data = await res.json();
  if (res.status === 201) {
    Cookie.deleteCookie(access_token, refresh_token, intra_token);
    Cookie.setToken(res_data);
    Router.navigateTo(href);
    return;
  } else if (res.status === 401) {
    Cookie.deleteCookie(access_token, refresh_token, intra_token);
    Router.navigateTo('/');
  }
}
