/* eslint-disable guard-for-in */
class Cookie {
  constructor() {}
  setCookie(name, value, setting) {
    const default_setting = {
      'path': '/',
      'life': 14, // day
    };
    const options = Object.assign(default_setting, setting);
    if (options.expires instanceof Date) {
      options.expires.setTime(options.expires.getTime() +
        (options.life * 24 * 60 * 60 * 1000));
      options.expires = options.expires.toUTCString();
    }
    if (options['max-age'] instanceof Date) {
      options['max-age'].setTime(options['max-age'].getTime() +
      (options.life * 24 * 60 * 60 * 1000));
      options['max-age'] = options['max-age'].toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) +
      '=' + encodeURIComponent(value);

    for (const optionKey in options) {
      updatedCookie += '; ' + optionKey;
      const optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += '=' + optionValue;
      }
    }
    document.cookie = updatedCookie;
  }

  getCookie(name) {
    const cookies_arr = document.cookie.split(';');
    let res = undefined;
    cookies_arr.forEach((item) => {
      const arr = item.split('=');
      const item_name = arr[0];
      const item_value = arr[1];
      // console.log(item_name, item_value);
      if (name === item_name.trim() && item_value.trim() !== '') {
        console.log(item_name, item_value);
        console.log('found!');
        res = item_value;
      }
    });
    return res;
  }

  deleteCookie(name) {
    this.setCookie(name, '', {
      'expires': new Date('Thu, 01 Jan 1970 00:00:00 UTC'),
      'max-age': new Date('Thu, 01 Jan 1970 00:00:00 UTC'),
    });
  }
}

export default new Cookie();
