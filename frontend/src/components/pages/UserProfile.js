import {pubEnv} from '../../const.js';
import Component from '../../core/Component.js';
import Cookie from '../../core/Cookie.js';
import ErrorPage from './ErrorPage.js';
import Router from '../../core/Router.js';

const endpoint = pubEnv.API_SERVER;
const access_token = pubEnv.TOKEN_ACCESS;
const refresh_token = pubEnv.TOKEN_REFRESH;
const intra_token = pubEnv.TOKEN_INTRA_ID;

export default class UserProfile extends Component {
  _title;
  _intra_id;
  _my_css = '../../../public/assets/css/userProfile.css';
  constructor(target, intra_id) {
    super(target);
    this._intra_id = intra_id;
    this._title = 'UserProfile';
  }
  async template() {
    await verifyCookie(this._intra_id);
    const profile_api =
      `${endpoint}/api/game/pong/score/${this._intra_id}/profile`;
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
    const img = `/public/assets/profile/${data.user.photo_id}.png`;
    return `
<link rel="stylesheet" href="${this._my_css}" type="text/css" />
<div class="profile">
  <div class="profile-heading"></div>
  <div class="profile-body">
    <div class="profile__avatar">
      <img src="${img}" class="float-end rounded-circle mb-3"
        style="width: 180px; margin-right: 10px;"
        alt="Avatar" />
    </div>
    <div class="profile__user">
      <div class="profile__intra">${data.user.intra_id}</div>
      <div class="profile__text"> ${data.user.message} </div>
    </div>
    <div class="profile__rank">
      <h1> ${data.rank} </h1>
      <h2 data-detect='rank'> RANK </h2>
    </div>
  </div>
</div>
    `;
  }
}

async function verifyCookie(intra_id) {
  const verify_api = `${endpoint}/api/token/verify/`;
  const access = Cookie.getCookie(access_token);
  const refresh = Cookie.getCookie(refresh_token);
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
    Router.navigateTo(`/rank/${intra_id}`);
    return;
  } else if (res.status === 401) {
    Cookie.deleteCookie(access_token, refresh_token, intra_token);
    Router.navigateTo('/');
  }
}
