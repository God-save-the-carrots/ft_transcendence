import Component from '../../core/Component.js';

export default class UserProfile extends Component {
  _title;
  _intra_id;
  constructor(target, intra_id) {
    super(target);
    this._intra_id = intra_id;
    this._title = 'UserProfile';
  }
  async initState() {
    return {
      data: {},
    };
  }
  async template() {
    const profile_api = `http://localhost/api/game/pong/score/${this._intra_id}/profile`;
    this.state.data = await fetch(profile_api,
    ).then((x) => x.json());
    const data = this.state.data;
    const img = `/public/assets/${data.user.photo_id}.png`;
    return `
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
      <div class="profile__text"> HELLO ! ${data.user.message} </div>
    </div>
    <div class="profile__rank">
      <h1> ${data.rank} </h1>
      <h2> RANK </h2>
    </div>
  </div>
</div>
    `;
  }
}
