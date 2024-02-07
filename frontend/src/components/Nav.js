import Component from '../core/Component.js';
import Router from '../core/Router.js';

export default class Nav extends Component {
  async template() {
    return `
      <a href="/" class="logo" ></a>
      <div class="header-right">
        <a class="active" href="/">
          <img src='../../public/assets/nav/LIBFT.png'></img>
        </a>
        <a href="/game">
          <img src='../../public/assets/nav/game.png'></img>
        </a>
        <a href="/rank">
          <img src='../../public/assets/nav/crown.png'></img>
        </a>
        <a href="/user/dummy1">
          <img src='../../public/assets/nav/42logo.png'></img>
        </a>

      </div>
    `;
  }
  setEvent() {
    this.addEvent('click', '[data-link]', async (e) => {
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        const href = e.target.href;
        await Router.navigateTo(href);
      }
    });
  }
}
