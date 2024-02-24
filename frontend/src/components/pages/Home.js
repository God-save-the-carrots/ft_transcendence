import Component from '../../core/Component.js';

export default class Home extends Component {
  _title;
  _params;
  constructor(params = null) {
    super(document.querySelector('#app'));
    this._title = 'Home';
    this._params = params;
  }
  async template() {
    return `
<link rel="stylesheet" type="text/css" href="../../public/assets/css/home.css">
<div class="background">
    <img class="map" src="../../public/assets/image/map.svg" alt="map">
    <div class="content">
      <div class="img-wrap">
        <img src="../../public/assets/image/monster.svg" alt="" class="one">
        <img src="../../public/assets/image/star.svg" alt="" class="two">
        <img src="../../public/assets/image/monster.svg" alt="" class="three">
      </div>
      <p data-detect='welcometolibft'>
        <span>Welcome</span>
        <span>to</span>
        <span class="title">LIBFT!</span>
      </p>
      <div class="btn-wrap">
        <button class="login-btn">42 login</button>
      </div>
    </div>
  </div>
    `;
  }
  async mounted() {}
}
