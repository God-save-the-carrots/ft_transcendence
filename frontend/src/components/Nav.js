import Component from '../core/Component.js';
import Router from '../core/Router.js';

export default class Nav extends Component {
  async template() {
    return `
      <link rel="stylesheet" type="text/css" href="../../public/assets/nav/nav.css" />
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarTogglerDemo01"
            aria-controls="navbarTogglerDemo01" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
            <a class="navbar-brand" href="/"></a>
            <ul class="navbar-nav ms-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="/game">
                  <img src="../../public/assets/nav/game.png"/>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/rank">
                  <img src="../../public/assets/nav/crown.png"/>
                </a>
              </li>
              <li class="nav-item dropdown">
                <a class="nav-link dropdown-toggle" href="/user/dummy1" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  <img src="../../public/assets/nav/42logo.png"/>
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <li><a class="dropdown-item" href="/user/dummy1">Profile</a></li>
                  <li><a class="dropdown-item" href="#">Logout</a></li>
                  <li><a class="dropdown-item" href="/test">Test</a></li>
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
