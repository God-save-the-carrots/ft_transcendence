import Component from '../../core/Component.js';

export default class ErrorPage extends Component {
  _title;
  _params;
  constructor(params = null) {
    super(document.querySelector('#app'));
    this._title = 'Error';
    if (params != null) this._params = params;
    else {
      this._params = {
        code: '404',
        msg: 'Not found',
      };
    }
  }
  async template() {
    return `
<link rel="stylesheet" type="text/css" href="/public/assets/css/error.css">
  <div class="background">
    <img class="map" src="../../public/assets/image/map.svg" alt="map">
    <div class="content">
      <p> ${this._params.code} </p>
      <div class="img-wrap">
        <img src="/public/assets/image/pacman.png" alt="" class="one">
        <img src="/public/assets/image/ghost1.png" alt="" class="one">
        <img src="/public/assets/image/ghost2.png" alt="" class="one">
        <img src="/public/assets/image/ghost3.png" alt="" class="one">
        <img src="/public/assets/image/ghost4.png" alt="" class="one">
      </div>
      <p>
        <span>${this._params.msg}</span>
      </p>
    </div>
  </div>
    `;
  }
  async mounted() {}
}
