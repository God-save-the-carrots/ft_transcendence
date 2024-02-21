import Component from '../../core/Component.js';

export default class GameRound extends Component {
  _title;
  _params;
  _my_css = '../../../public/assets/css/gameInfo.css';
  constructor(target, params = null) {
    super(target);
    this._params = params;
  }
  async template() {
    // return `<div>${JSON.stringify(this._params)}</div>`;
    return `
      <link rel="stylesheet" href="${this._my_css}" type="text/css" />
      <div class='info-card'>
        <div class='info-head'>
          <div class="avatar-group">
            <div class='card'>
              <img class="avatar card-front" alt="Avatar"
                src="/public/assets/profile/1.png" />
              <h class='card-back'>DummyDummy1</h>
            </div>
            <div class='card'>
              <img class="avatar card-front" alt="Avatar"
                src="/public/assets/profile/2.png" />
              <h class='card-back'>
                DummyDummy2
              </h>
            </div>
            <div class='card'>
              <img class="avatar card-front" alt="Avatar"
                src="/public/assets/profile/3.png" />
              <h class='card-back'>Jinam</h>
            </div>
            <div class='card'>
              <img class="avatar card-front" alt="Avatar"
                src="/public/assets/profile/4.png" />
              <h class='card-back'>Jinam1</h>
            </div>
          </div>
        </div>
        <div class='info-body'>


          <div class="card-body body-history">
            <div class="item">


              <div class="item-parent">
                <div class="item-card">
                  <div class="item-card-head">
                    <img class="avatar" alt="Avatar"
                    src="/public/assets/profile/1.png" />
                    <div class="item-time">
                      <div>TIME</div>
                      <p> 01:30</p>
                    </div>
                    <img class="avatar" alt="Avatar"
                    src="/public/assets/profile/2.png" />
                  </div>
                  <div class="item-card-body">
                    <p>10 : 5</p>
                  </div>
                </div>
              </div>


              <div class="item-childrens">

                <div class="item-child">
                  <div class="item-card">
                    <div class="item-card-head">
                      <img class="avatar" alt="Avatar"
                      src="/public/assets/profile/1.png" />
                      <div class="item-time">
                        <div>TIME</div>
                        <p> 01:30</p>
                      </div>
                      <img class="avatar" alt="Avatar"
                      src="/public/assets/profile/3.png" />
                    </div>
                    <div class="item-card-body">
                      <p>10 : 9</p>
                    </div>
                  </div>
                </div>
                  <div class="item-child">
                    <div class="item-card">
                      <div class="item-card-head">
                        <img class="avatar" alt="Avatar"
                        src="/public/assets/profile/2.png" />
                        <div class="item-time">
                          <div>TIME</div>
                          <p> 01:30</p>
                        </div>
                        <img class="avatar" alt="Avatar"
                        src="/public/assets/profile/4.png" />
                      </div>
                      <div class="item-card-body">
                        <p>10 : 5</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>



        </div>
        <div class='info-foot'>
        </div>
      </div>
`;
  }
}
