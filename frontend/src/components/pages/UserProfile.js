import Component from '../../core/Component.js';

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
    const profile_api =
      `/api/game/pong/score/${this._intra_id}/profile/`;
    const [res, data] = await this.authReq('get', profile_api);
    if (res.status !== 200) {
      // TODO: load error page;
      return;
    }
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
