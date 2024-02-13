import Component from '../../core/Component.js';

export default class UserHistory extends Component {
  _title;
  _intra_id;
  _myCss = '../../../public/assets/css/UserHistory.css';
  constructor(target, params = null) {
    super(target);
    this._title = 'User History';
    this._intra_id = params;
    this._current_page = 1;
  }
  async initState() {
    return {
      _current_page: 1,
    };
  }
  async template() {
    const _current_page = this.state._current_page;
    const previous = _current_page == 1 ? 1 : _current_page - 1;
    let html = '';
    const history_api = `http://localhost/api/game/pong/score/${this._intra_id}/profile`;
    const data = await fetch(
        `http://localhost/api/game/pong/score/${this._intra_id}`,
    ).then((x) => x.json());
    // card
    // html += createListFromJSON(data.data);
    html += `
      <link rel="stylesheet" href="${this._myCss}" type="text/css" />
      <div class="history-page">
        <div class="card history-card">
          <div class="card-header header-history">
            <div class="avatar-group">
              <a href="/user/dummy1"><img class="avatar" alt="Avatar" src="/public/assets/profile/1.png" /></a>
              <a href="/user/dummy2"><img class="avatar" alt="Avatar" src="/public/assets/profile/2.png" /></a>
              <a href="/user/dummy3"><img class="avatar" alt="Avatar" src="/public/assets/profile/3.png" /></a>
              <a href="/user/dummy4"><img class="avatar" alt="Avatar" src="/public/assets/profile/4.png" /></a>
            </div>
          </div>
          <div class="card-body body-history">
            <div class="item">
              <div class="item-parent">
                <div class="card item-card">
                  <div class="item-card-head">
                    <img class="avatar" alt="Avatar" src="/public/assets/profile/1.png" />
                    <div class="item-time">
                      <div>TIME</div>
                      <p> 01:30</p>
                    </div>
                    <img class="avatar" alt="Avatar" src="/public/assets/profile/2.png" />
                  </div>
                  <div class="item-card-body">
                    <p>10 : 0</p>
                  </div>
                </div>
              </div>
              <div class="item-childrens">
                <div class="item-child">
                  <div class="card item-card">
                    <div class="item-card-head">
                      <img class="avatar" alt="Avatar" src="/public/assets/profile/1.png" />
                      <div class="item-time">
                        <div>TIME</div>
                        <p> 01:30</p>
                      </div>
                      <img class="avatar" alt="Avatar" src="/public/assets/profile/2.png" />
                    </div>
                    <div class="item-card-body">
                      <p>10 : 1</p>
                    </div>
                  </div>
                </div>
                <div class="item-child">
                  <div class="card item-card">
                    <div class="item-card-head">
                      <img class="avatar" alt="Avatar" src="/public/assets/profile/1.png" />
                      <div class="item-time">
                        <div>TIME</div>
                        <p> 01:30</p>
                      </div>
                      <img class="avatar" alt="Avatar" src="/public/assets/profile/2.png" />
                    </div>
                    <div class="item-card-body">
                      <p>10 : 2</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
    // paginataion
    html += `
      <div class="pagination-outer">
        <ul class="pagination pagination-circle">
          <li class="page-item"><a class="page-link" data-page=${previous}>«</a></li>
          <li class="page-item"><a class="page-link" data-page=${_current_page}> ${_current_page} </a></li>
          <li class="page-item"><a class="page-link" data-page=${Number(_current_page) + 1}>${Number(_current_page) + 1}</a></li>
          <li class="page-item"><a class="page-link" data-page=${Number(_current_page) + 2}>${Number(_current_page) + 2}</a></li>
          <li class="page-item"><a class="page-link" data-page=${Number(_current_page) + 3}>»</a></li>
        </ul>
      </div>
    `;
    return html;
  }
  async mounted() {}

  setEvent() {
    this.addEvent('click', '.page-item', async (e) => {
      this.state._current_page = e.target.dataset.page;
    });
  }

}

function createListFromJSON(jsonData) {
  let listHTML = ''; 
  jsonData.forEach(function(item) {

    listHTML += '<div class="card">';
    listHTML += '<div class="card-header">';
    listHTML += '<li>';
    listHTML += 'Match ID: ' + item.match_id + '<br>';
    listHTML += 'Scores: <ul>';
    item.score.forEach(function(scoreItem) {
      listHTML += '<li>' +
        'User:' + scoreItem.user.intra_id +
        ', Value: ' + scoreItem.value + ', Rank: ' + scoreItem.rank + '</li>';
    });
    listHTML += '</ul></li>';
    listHTML += '</div>';
    listHTML += '</div>';
  });
  return listHTML;
}
