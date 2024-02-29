import Cookie from './Cookie.js';
import {pubEnv} from '../const.js';
import Router from './Router.js';
import {authReq} from '../connect.js';

const access_token = pubEnv.TOKEN_ACCESS;
const refresh_token = pubEnv.TOKEN_REFRESH;
const intra_token = pubEnv.TOKEN_INTRA_ID;

export async function isValidIntra(intra) {
  const apiUrl = `/api/user/${intra}/`;
  try {
    const [response] = await authReq('get', apiUrl);
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
