import Component from '../../core/Component.js';

export default class Rank extends Component {
  _title;
  _params;
  constructor(params = null) {
    super(document.querySelector('#app'));
    this._title = 'Rank';
    this._params = params;
  }

  async template() {
    const rank_api = `http://localhost/api/game/pong/rank/`;
    const data = await fetch(rank_api,
    ).then((x) => x.json());
    const img = `/public/assets/profile/${data.data[0].user.photo_id}.png`;
    const intra_id = `${data.data[0].user.intra_id}`;
    const msg = `${data.data[0].message}`;
    const rating = `${data.data[0].rating}`;

    const img1 = `/public/assets/profile/${data.data[1].user.photo_id}.png`;
    const intra_id1 = `${data.data[1].user.intra_id}`;
    const msg1 = `${data.data[1].message}`;
    const rating1 = `${data.data[1].rating}`;

    const img2 = `/public/assets/profile/${data.data[2].user.photo_id}.png`;
    const intra_id2 = `${data.data[2].user.intra_id}`;
    const msg2 = `${data.data[2].message}`;
    const rating2 = `${data.data[2].rating}`;

    const img3 = `/public/assets/profile/${data.data[3].user.photo_id}.png`;
    const intra_id3 = `${data.data[3].user.intra_id}`;
    const msg3 = `${data.data[3].message}`;
    const rating3 = `${data.data[3].rating}`;

    const img4 = `/public/assets/profile/${data.data[4].user.photo_id}.png`;
    const intra_id4 = `${data.data[4].user.intra_id}`;
    const msg4 = `${data.data[4].message}`;
    const rating4 = `${data.data[4].rating}`;
    return `
    <link rel="stylesheet" href="../../../public/assets/css/rank.css">
    <div class="block-wrap">
      <div class="title">RANKING</div>
      <div class="content">
        <li class="block mine">
          <span class="rank">1</span>
          <div class="space"></div>
          <span class="profile">
            <img src="${img}" alt="profile-image">
          </span>
          <span class="username">${intra_id}</span>
          <span class="msg">${msg}</span>
          <span class="score">${rating}</span>
        </li>
        <ul class="block-list">
          <li class="block">
            <span class="rank">1</span>
            <div class="space"></div>
            <span class="profile">
              <img src="${img}" alt="profile-image">
            </span>
            <span class="username">${intra_id}</span>
            <span class="msg">${msg}</span>
            <span class="score">${rating}</span>
          </li>
          <li class="block">
            <span class="rank">2</span>
            <div class="space"></div>
            <span class="profile">
              <img src="${img1}" alt="profile-image">
            </span>
            <span class="username">${intra_id1}</span>
            <span class="msg">${msg1}</span>
            <span class="score">${rating1}</span>
          </li>
          <li class="block">
            <span class="rank">3</span>
            <div class="space"></div>
            <span class="profile">
              <img src="${img2}" alt="profile-image">
            </span>
            <span class="username">${intra_id2}</span>
            <span class="msg">${msg2}</span>
            <span class="score">${rating2}</span>
          </li>
          <li class="block">
            <span class="rank">4</span>
            <div class="space"></div>
            <span class="profile">
              <img src="${img3}" alt="profile-image">
            </span>
            <span class="username">${intra_id3}</span>
            <span class="msg">${msg3}</span>
            <span class="score">${rating3}</span>
          </li>
          <li class="block">
            <span class="rank">5</span>
            <div class="space"></div>
            <span class="profile">
              <img src="${img4}" alt="profile-image">
            </span>
            <span class="username">${intra_id4}</span>
            <span class="msg">${msg4}</span>
            <span class="score">${rating4}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
      `;
  }
  async mounted() {}
}
