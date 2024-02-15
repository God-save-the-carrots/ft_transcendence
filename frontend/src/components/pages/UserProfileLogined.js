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
    const img = `/public/assets/profile/${data.user.photo_id}.png`;
    return `
<div class="profile">
  <div class="profile-heading"></div>
  <div>
  </div>
  <div class="profile-body">
    <div class="profile__avatar">
      <img src="${img}" class="float-end rounded-circle mb-3"
        style="width: 180px; margin-right: 10px;"
        alt="Avatar"/>
      <button type="button" data-bs-toggle="modal" data-bs-target="#editmodal">
        <i class="bi bi-pencil-fill"></i>
      </button>
    </div>
    <div class="profile__user">
      <div class="profile__intra"> ${data.user.intra_id}</div>
      <div class="profile__text"> HELLO ! ${data.user.message} </div>

      <!-- Modal -->
      <div class="modal fade" id="editmodal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">Edit profile</h1>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ...
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
              <button type="button" class="btn btn-primary">Save changes</button>
            </div>
          </div>
        </div>
      </div>

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
