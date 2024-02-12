import Component from '../core/Component.js';
import Router from '../core/Router.js';

export default class Nav extends Component {
  async template() {
    return `
<link rel="stylesheet" type="text/css" href="../../public/assets/css/nav.css" />
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <div class="container-fluid">
    <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
      <a class="navbar-brand" href="/" data-link></a>
      <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link" href="/game" data-link>
            <img src="../../public/assets/nav/game.png"/>
            game
          </a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/rank" data-link>
            <img src="../../public/assets/nav/crown.png"/>
            rank
          </a>
        </li>
        <li class="dropdown nav-item">
          <a class="nav-link " href="/user/dummy1" 
            id="navbarDropdownMenuLink" role="button"
            data-bs-toggle="dropdown" aria-expanded="false">
            <img class="nav-profile" src="../../public/assets/nav/42logo.png"/>
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
      if (e.target.matches('[data-link]')) {
        e.preventDefault();
        const href = e.target.href;
        await Router.navigateTo(href);
      }
    });
  }
}

