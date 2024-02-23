import { pubEnv } from '../../const.js';
import Component from '../../core/Component.js';
import ErrorPage from './ErrorPage.js';

export default class UserProfile extends Component {
  _title;
  _intra_id;
  _my_css = '../../../public/assets/css/loginedUserProfile.css';
  constructor(target, intra_id) {
    super(target);
    this._intra_id = intra_id;
    this._title = 'UserProfile';
    this.state.photo_id;
  }
  async initState() {
    return {
      photo_id: 0,
    };
  }

  setEvent() {
    this.$target.querySelector('.avatar-form')
        .addEventListener('submit', async (e) => {
          const photo_id = document
              .querySelector('input[name="avatar"]:checked').id;
          e.preventDefault();
          if (this.state.photo_id === photo_id) {
            return;
          }
          const endpoint = pubEnv.API_SERVER;
          const change_api = `${endpoint}/api/user/${this._intra_id}/`;
          const res = await fetch(change_api, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              'photo_id': Number(photo_id)}),
          });
          if (res.status != 200) {
            new ErrorPage({code: res.status, msg: res.statusText});
            return;
          }
          this.state.photo_id = photo_id;
        });
  }

  async template() {
    if (this.state.photo_id > 8) return;
    const endpoint = pubEnv.API_SERVER;
    const profile_api = `${endpoint}/api/game/pong/score/${this._intra_id}/profile`;
    const res = await fetch(profile_api);
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
      <div class="modal fade" id="editmodal" tabindex="-1"
      aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h1 class="modal-title fs-5" id="exampleModalLabel">
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
                  data-bs-dismiss="modal">Save changes</button>
                <button type="button" class="btn btn-secondary"
                  data-bs-dismiss="modal">Close</button>
              </form>
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
