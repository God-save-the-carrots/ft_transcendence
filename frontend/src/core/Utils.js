import Cookie from './Cookie.js';
import {pubEnv} from '../const.js';
import Router from './Router.js';

const endpoint = pubEnv.API_SERVER;
const access_token = pubEnv.TOKEN_ACCESS;
const refresh_token = pubEnv.TOKEN_REFRESH;
const intra_token = pubEnv.TOKEN_INTRA_ID;

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

export function isCookieExist() {
  const access = Cookie.getCookie(access_token);
  const refresh = Cookie.getCookie(refresh_token);
  const intra_id = Cookie.getCookie(intra_token);
  if (access === undefined || refresh === undefined || intra_id === undefined) {
    return false;
  }
  return true;
}
