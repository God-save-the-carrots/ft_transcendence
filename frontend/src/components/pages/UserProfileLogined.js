import Component from '../../core/Component.js';

export default class UserProfile extends Component {
  _title;
  _intra_id;
  _my_css = '../../../public/assets/css/loginedUserProfile.css';
  constructor(target, intra_id) {
    super(target);
    this._intra_id = intra_id;
    this._title = 'UserProfile';
    this.state.photo_id;
    this.state.msg;
  }
  async initState() {
    return {
      photo_id: 0,
      msg: null,
    };
  }

  setEvent() {
    // avatar
    this.$target.querySelector('.avatar-form')
        .addEventListener('submit', async (e) => {
          const photo_id = document
              .querySelector('input[name="avatar"]:checked').id;
          e.preventDefault();
          if (this.state.photo_id === photo_id) {
            return;
          }
          const change_api = `/api/user/${this._intra_id}/`;
          const [res] = await this.authReq('PATCH', change_api, {
            'photo_id': Number(photo_id),
          });
          if (res.status !== 200) {
            // TODO: load error page;
            return;
          }
          this.state.photo_id = photo_id;
        });
    // msg
    this.$target.querySelector('.msg-form')
        .addEventListener('submit', async (e) => {
          const msg= document
              .querySelector('.msg-input').value;
          e.preventDefault();
          if (this.state.msg === msg) {
            return;
          }
          const change_api = `/api/user/${this._intra_id}/`;
          const [res] = await this.authReq('PATCH', change_api, {
            'message': msg,
          });
          if (res.status !== 200) {
            // TODO: load error page;
            return;
          }
          this.state.msg = msg;
        });
  }

  async template() {
    if (this.state.photo_id > 8 || this.state.msg == 'error') return;
    const profile_api = `/api/game/pong/score/${this._intra_id}/profile/`;
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
  <div>
  </div>
  <div class="profile-body">
    <div class="profile__avatar">
      <img src="${img}" class="float-end rounded-circle mb-3"
        style="width: 180px; margin-right: 10px;"
        alt="Avatar"/>
      <button type="button" data-bs-toggle="modal" data-bs-target="#edit-a">
      </button>
    </div>
    <div class="profile__user">
      <div class="profile__intra"> ${data.user.intra_id}</div>
      <div class="profile__text">
        <button type="button" data-bs-toggle="modal" data-bs-target="#edit-m">
        </button>
        <p> ${data.user.message} </p>
      </div>

      <!-- avatar Modal -->
      <div class="modal fade" id="edit-a" tabindex="-1"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel"
                data-detect='change_my_avatar'>
              change my avatar
              </h1>
              <button type="button" class="btn-close"
                data-bs-dismiss="modal" aria-label="Close">
              </button>
            </div>
            <div class="modal-body">
              <!-- avatar 선택 -->
              <form class="avatar-form">
                <div>
                  <input type="radio"
                  name="avatar" id="1" class="input-hidden" />
                  <label for="1">
                    <img src="/public/assets/profile/1.png"/>
                  </label>
                  <input type="radio"
                  name="avatar" id="2" class="input-hidden" />
                  <label for="2">
                    <img src="/public/assets/profile/2.png"/>
                  </label>
                  <input type="radio"
                  name="avatar" id="3" class="input-hidden" />
                  <label for="3">
                    <img src="/public/assets/profile/3.png"/>
                  </label>
                  <input type="radio"
                  name="avatar" id="4" class="input-hidden" />
                  <label for="4">
                    <img src="/public/assets/profile/4.png"/>
                  </label>
                </div>
                <div>
                  <input type="radio"
                  name="avatar" id="5" class="input-hidden" />
                  <label for="5">
                    <img src="/public/assets/profile/5.png"/>
                  </label>
                  <input type="radio"
                  name="avatar" id="6" class="input-hidden" />
                  <label for="6">
                    <img src="/public/assets/profile/6.png"/>
                  </label>
                  <input type="radio"
                  name="avatar" id="7" class="input-hidden" />
                  <label for="7">
                    <img src="/public/assets/profile/7.png"/>
                  </label>
                  <input type="radio"
                  name="avatar" id="8" class="input-hidden" />
                  <label for="8">
                    <img src="/public/assets/profile/8.png"/>
                  </label>
                </div>
                <!-- submit button -->
                <button type="Submit" class="btn btn-primary"
                  data-bs-dismiss="modal"data-detect='save_changes'>
                    Save changes
                </button>
                <button type="button" class="btn btn-secondary"
                  data-bs-dismiss="modal"data-detect='close'>Close</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <!-- msg Modal -->
      <div class="modal fade" id="edit-m" tabindex="-1"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel"
                data-detect='change_my_message'>
              change my message
              </h1>
              <button type="button" class="btn-close"
                data-bs-dismiss="modal" aria-label="Close">
              </button>
            </div>
            <div class="modal-body">

              <div class="input-form col-md-12 mx-auto">
                <form class="msg-form" novalidate>
                  <div class="row">
                    <div class="col-md-12 mb-3">
                      <input class="msg-input col-md-12 "
                        type="text" maxlength='30' class="form-control"
                        id="name" placeholder="30자 까지 입력 가능" value="" required>
                    </div>
                  </div>
                  <!-- submit button -->
                  <button type="Submit" class="btn btn-primary"
                    data-bs-dismiss="modal" data-detect='save_changes'>
                    Save changes
                  </button>
                  <button type="button" class="btn btn-secondary"
                    data-bs-dismiss="modal" data-detect='close'>Close</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
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
