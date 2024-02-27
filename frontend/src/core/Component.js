import {observable, observe} from './observer.js';
import * as Lang from '../Lang.js';
import {authReq} from '../connect.js';

export default class Component {
  /**
   * @type {Element} $target
   */
  $target;
  props;
  state = {};
  constructor($target) {
    this.$target = $target;
    this.setup();
  }

  async setup() {
    this.state = observable(await this.initState());
    observe(async () => {
      this.clearEvent();
      await this.render();
      this.setEvent();
      await this.mounted();
    }, this.state);
  }

  async initState() {
    return {};
  }
  async mounted() {}

  async template() {
    return '';
  }

  async render() {
    this.$target.innerHTML = await this.template();
    Lang.loadLanguage();
  }

  setEvent() {}

  clearEvent() {}

  addEvent(eventType, selector, callback) {
    this.$target.addEventListener(eventType, (event) => {
      if (!event.target.closest(selector)) return false;
      callback(event);
    });
  }

  async unmounted() {}
}

Component.prototype.authReq = authReq;
