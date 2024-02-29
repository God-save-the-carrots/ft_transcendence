import Cookie from './Cookie.js';
import {pubEnv} from '../const.js';
import {authReq} from '../connect.js';

const access_token = pubEnv.TOKEN_ACCESS;
const refresh_token = pubEnv.TOKEN_REFRESH;
const intra_token = pubEnv.TOKEN_INTRA_ID;

export async function isValidIntra(intra) {
  const apiUrl = `/api/user/${intra}/`;
  const [response] = await authReq('get', apiUrl);
  if (response.status == 200) {
    return true;
  } else {
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
