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
  constructor(parent, $target) {
    this.id = '10000000-1000-4000-8000-100000000000'.replace(/[018]/g, (c) =>
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4)
          .toString(16),
    );
    this.$target = $target;
    this.parent = parent;
    this.events = [];
    this.children = [];
    this.onexception = (e) => {
      if (this.parent) this.parent.onexception(e);
      else this.unmounted();
    };
    this.setup();
  }

  async setup() {
    this.state = observable(await this.initState());
    observe(async () => {
      try {
        this.unmounted();
        await this.render();
        this.setEvent();
        await this.mounted();
      } catch(e) {
        if (e instanceof NoError) {
          // do nothing
        }
        this.onexception(e);
      }
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

  clearEvent() {
    for (const event of this.events) {
      this.$target.removeEventListener(event.eventType, event.callback);
    }
    this.events = [];
  }

  addEvent(eventType, selector, callback) {
    const e = (event) => {
      if (!event.target.closest(selector)) return false;
      callback(event);
    };
    this.events.push({eventType, callback: e});
    this.$target.addEventListener(eventType, e);
  }

  addComponent(component) {
    this.children.push(component);
  }

  popComponent() {
    const component = this.children.pop();
    if (component) component.unmounted();
  }

  unmounted() {
    for (const child of this.children) {
      child.unmounted();
    }
    this.clearEvent();
    this.children = [];
  }
}

Component.prototype.authReq = authReq;

export class NoError extends Error {
}
