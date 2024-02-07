import Component from '../core/Component.js';
import Router from '../core/Router.js';

export default class Nav extends Component {
  async template() {
    return `
      <a href="/" class="nav__link" data-link>home</a>
      <a href="/user/dummy1" class="nav__link" data-link>user-dummy</a>
      <a href="/game" class="nav__link" data-link>game</a>
      <a href="/rank" class="nav__link" data-link>ranks</a>
      <a href="/test" class="nav__link" data-link>test</a>
      <a href="/login" class="nav__link" data-link>login-test</a>
      <input type="button" value="login" />
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
