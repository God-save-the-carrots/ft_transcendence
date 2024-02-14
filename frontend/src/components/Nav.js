import Component from '../core/Component.js';
import Router from '../core/Router.js';

export default class Nav extends Component {
  async template() {
    return `
<link rel="stylesheet" type="text/css" href="../../public/assets/css/nav.css" />
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
      <a class="navbar-brand" href="/" data-link>LIBFT</a>
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" href="/game" data-link>
            <img src="../../public/assets/image/game.svg"/>
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/rank/dummy1" data-link>
            <img src="../../public/assets/image/crown.svg"/>
          </a>
        </li>
        <li class="dropdown nav-item">
          <a class="nav-link" href="/user/dummy1"
            id="navbarDropdownMenuLink" role="button"
            data-bs-toggle="dropdown" aria-expanded="false">
            <span class="nav-profile">
              <img src="../../public/assets/profile/1.png">
            </span>
          </a>
          <ul class="dropdown-menu dropdown-menu-lg-end"
            aria-labelledby="navbarDropdownMenuLink">
            <li><a class="dropdown-item" href="/user/dummy1" data-link>
              Profile</a></li>
            <li><a class="dropdown-item" href="/home" data-link>Logout</a></li>
            <li><a class="dropdown-item" href="/test" data-link>Test</a></li>
            </ul>
        </li>
      </ul>
    </div>
  </div>
</nav>
`;
  }
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
  }
}

