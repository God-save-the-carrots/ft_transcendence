class Cookie {
  constructor() {}
  setCookie(name, value, options = {}) {
    options = {
      path: '/',
      expires: new Date(),
      'max-age': new Date(),
      life: 14 // day
    };

    if (options.expires instanceof Date) {
      options.expires.setTime(options.expires.getTime() + (options.life * 24 * 60 * 60 * 1000));
      options.expires = options.expires.toUTCString();
    }
    if (options['max-age'] instanceof Date) {
      options['max-age'].setTime(options['max-age'].getTime() + (options.life * 24 * 60 * 60 * 1000));
      options['max-age'] = options['max-age'].toUTCString();
    }

    let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

    for (let optionKey in options) {
      updatedCookie += '; ' + optionKey;
      let optionValue = options[optionKey];
      if (optionValue !== true) {
        updatedCookie += '=' + optionValue;
      }
    }

    document.cookie = updatedCookie;
  }

  getCookie(name) {
    let matches = document.cookie.match(new RegExp(
      "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
  }

  deleteCookie(name) {
    setCookie(name, "", {
      'max-age': -1,
      expires: -1
    });
  }
}

export default new Cookie();
