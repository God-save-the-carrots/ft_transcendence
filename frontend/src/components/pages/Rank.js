import Component from '../../core/Component.js';

export default class Rank extends Component {
  _title;
  _params;
  constructor() {
    super(document.querySelector('#app'));
    this._title = 'Rank';
  }
  async template() {
    return `
    <link rel="stylesheet" href="../../../public/assets/css/rank.css">
    <div class="block-wrap">
      <div class="title">RANKING</div>
      <div class="content">
        <li class="block mine">
          <span class="rank">1</span>
          <div class="space"></div>
          <span class="profile">
            <img src="../../../public/assets/profile/2.png" alt="profile-image">
          </span>
          <span class="username">cheseo</span>
          <span class="msg">나는 당근~🥕</span>
          <span class="score">100</span>
        </li>
        <ul class="block-list">
          <li class="block">
            <span class="rank">1</span>
            <div class="space"></div>
            <span class="profile">
              <img src="../../../public/assets/profile/2.png" alt="profile-image">
            </span>
            <span class="username">cheseo</span>
            <span class="msg">나는 당근~🥕</span>
            <span class="score">100</span>
          </li>
          <li class="block">
            <span class="rank">2</span>
            <div class="space"></div>
            <span class="profile">
              <img src="../../../public/assets/profile/6.png" alt="profile-image">
            </span>
            <span class="username">minjungk</span>
            <span class="msg">내 밑에는 다 바보</span>
            <span class="score">100</span>
          </li>
          <li class="block">
            <span class="rank">3</span>
            <div class="space"></div>
            <span class="profile">
              <img src="../../../public/assets/profile/8.png" alt="profile-image">
            </span>
            <span class="username">yonshin</span>
            <span class="msg">나는 신</span>
            <span class="score">100</span>
          </li>
          <li class="block">
            <span class="rank">4</span>
            <div class="space"></div>
            <span class="profile">
              <img src="../../../public/assets/profile/4.png" alt="profile-image">
            </span>
            <span class="username">jinam</span>
            <span class="msg">내 위에는 다 바보</span>
            <span class="score">100</span>
          </li>
          <li class="block">
            <span class="rank">5</span>
            <div class="space"></div>
            <span class="profile">
              <img src="../../../public/assets/profile/5.png" alt="profile-image">
            </span>
            <span class="username">junmkang</span>
            <span class="msg">나는 바보</span>
            <span class="score">100</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
      `;
  }
}
