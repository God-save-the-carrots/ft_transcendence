import Component from '../../core/Component.js';

export default class UserHistory extends Component {
  _title;
  _intra_id;
  constructor(target, params = null) {
    super(target);
    this._title = 'User History';
    this._intra_id = params;
  }
  async initState() {
    return {
      data: {},
    };
  }
  async template() {
    let html = '';
    html += `<h1> ${this._title} </h1>`;
    this.state.data = await fetch(
        `http://localhost/api/game/pong/score/${this._intra_id}`,
    ).then((x) => x.json());
    const data = this.state.data;
    html += createListFromJSON(data.data);
    return html;
  }
  async mounted() {}
}

function createListFromJSON(jsonData) {
  let listHTML = '';
  jsonData.forEach(function(item) {
    listHTML += '<li>';
    listHTML += 'Match ID: ' + item.match_id + '<br>';
    listHTML += 'Scores: <ul>';
    item.score.forEach(function(scoreItem) {
      listHTML += '<li>' +
        'User:' + scoreItem.user.intra_id +
        ', Value: ' + scoreItem.value + ', Rank: ' + scoreItem.rank + '</li>';
    });
    listHTML += '</ul></li>';
  });
  return listHTML;
}
