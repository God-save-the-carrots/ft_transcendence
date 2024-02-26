import Cookie from './Cookie.js';
import {pubEnv} from '../const.js';
import Router from './Router.js';

const endpoint = pubEnv.API_SERVER;

export async function isValidIntra(intra) {
  const apiUrl = `${endpoint}/api/user/${intra}/`;
  const access = Cookie.getCookie('access');
  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${access}`,
      },
    });
    if (response.ok) {
      return true;
    } else if (response.status === 401) {
      Router.navigateTo('/');
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
}
