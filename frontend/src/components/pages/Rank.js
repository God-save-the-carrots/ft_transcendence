import Component from '../../core/Component.js';
import Router from '../../core/Router.js';
import Cookie from '../../core/Cookie.js';
import {pubEnv} from '../../const.js';
import ErrorPage from './ErrorPage.js';

const endpoint = pubEnv.API_SERVER;

export default class Rank extends Component {
  _title;
  _params;
  _my_css = '../../../public/assets/css/rank.css';
  _pagination_css = '../../../public/assets/css/Pagination.css';
  constructor($target, params = null) {
    super($target);
    this._title = 'Rank';
    this._params = params;
  }
  async initState() {
    return {
      current_page: 1,
    };
  }

  async template() {
    const rank_api = `${endpoint}/api/game/pong/rank/`;
    const _current_page = this.state.current_page;
    const access = Cookie.getCookie('access');
    if (access === undefined) {
      // go to login page
    }
    const res = await fetch(rank_api + '?' + `page=${_current_page}&page_size=5`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access}`,
      },
    });
    if (res.status != 200) {
      new ErrorPage({code: res.status, msg: res.statusText});
      return;
    }
    const data = await res.json();
      // .then((response) => response.json());
    // TODO: block mine 로그인 연동하면 바꿔야 함
    let html = '';
    html += `
      <link rel="stylesheet" href="${this._my_css}" type="text/css">
      <link rel="stylesheet" href="${this._pagination_css}" type="text/css">
      <div class="block-wrap">
        ${createMyRanking()}
        ${createRakingContents(_current_page, data.data)}
      </div>
    `;
    html += createPagination(_current_page, data.last_page_index);
    return html;
  }
  async mounted() {}

  setEvent() {
    this.addEvent('click', '[data-link]', async (e) => {
      const parent = e.target.parentElement;
      e.preventDefault();
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        const href = e.target.href;
        await Router.navigateTo(href);
      } else if (parent.matches('[data-link]')) {
        e.preventDefault();
        const href = parent.href;
        await Router.navigateTo(href);
      }
    });
    this.addEvent('click', '.page-item', async (e) => {
      if (isNaN(e.target.dataset.page)) return;
      if (e.target.dataset.page != this.state.current_page) {
        this.state.current_page = e.target.dataset.page;
      }
    });
  }
}

function createMyRanking() {
  const list_HTML = `
    <div class="title" data-detect='ranking'>RANKING</div>
    <li class="block mine">
      <span class="rank">1</span>
      <div class="space"></div>
      <span class="profile">
        <img src="/public/assets/profile/1.png" alt="profile-image">
      </span>
      <span class="username">1</span>
      <span class="msg">하드코딩해서 바꿔야 함</span>
      <span class="score">1111</span>
    </li>
  `;
  return list_HTML;
}

function createRakingContents(page, jsonData) {
  let cnt = 0;
  let list_HTML = `
    <div class="content">
      <ul class="block-list">
  `;
  for (const item of jsonData) {
    cnt += 1;
    const user = item.user; // data.data[0].user
    const intra_id = user.intra_id;
    const msg = user.message;
    const photo = `/public/assets/profile/${user.photo_id}.png`;
    const rating = item.rating;
    const rank = cnt + ((page - 1) * 5);
    list_HTML += `
      <li class="block">
        <a href="/user/${intra_id}" data-link>
          <span class="rank">${rank}</span>
          <div class="space"></div>
          <span class="profile">
            <img src="${photo}" alt="profile-image">
          </span>
          <span class="username">${intra_id}</span>
          <span class="msg">${msg}</span>
          <span class="score">${rating}</span>
        </a>
      </li>
    `;
  }
  list_HTML += `
      </ul>
    </div>
  `;
  return list_HTML;
}

function createPagination(current, last) {
  let list_HTML = `
    <div class="pagination-outer">
      <ul class="pagination pagination-circle">
    `;
  const start = (current % 5 == 0 ?
    parseInt(current / 5) - 1 : parseInt(current / 5)) * 5 + 1;
  const end = start + 5 < last ? start + 5 : last + 1;
  const min = start - 5 > 0 ? start - 5 : 1;
  const max = start + 5 < last ? start + 5 : last + 1;
  if (current != 1) {
    list_HTML += `
      <li class="page-item">
        <a class="page-link" data-page=1><<</a>
      </li>
      `;
  }
  if (start != 1) {
    list_HTML += `
      <li class="page-item">
        <a class="page-link" data-page=${min}><</a>
      </li>
      `;
  }
  for (let i = start; i < end; i++) {
    let class_name = 'page-link';
    if (i == current) {
      class_name += ' current-page';
    }
    list_HTML += `
      <li class="page-item">
        <a class="${class_name}" data-page=${i}>${i}</a>
      </li>
    `;
  }
  if (end != last + 1) {
    list_HTML += `
      <li class="page-item">
        <a class="page-link" data-page=${max}>></a>
      </li>
      `;
  }
  if (current != last) {
    list_HTML += `
      <li class="page-item">
        <a class="page-link" data-page=${last}>>></a>
      </li>
      `;
  }
  list_HTML += `
      </ul>
    </div>
    `;
  return list_HTML;
}
