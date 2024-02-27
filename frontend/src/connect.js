import Cookie from './core/Cookie.js';
import {pubEnv} from './const.js';

function apiServerEndPoint(uri) {
  return `${pubEnv.API_SERVER}${uri}`;
}

async function request(uri, options) {
  try {
    const res = await fetch(uri, options);
    const json = await res.json();
    return [res, json];
  } catch (e) {
    throw new RequestError(e);
  }
};

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const payload = decodeURIComponent(window.atob(base64).split('').map((c) => {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(payload);
};

/**
 * @return {Promise<string>} 대기큐 등록 성공 여부 (인증 포함)
 */
async function refreshToken() {
  const refresh = Cookie.getCookie(pubEnv.TOKEN_REFRESH);
  const access = Cookie.getCookie(pubEnv.TOKEN_ACCESS);
  if (refresh == null) throw new RequireLoginError();
  try {
    const res = await fetch(apiServerEndPoint('/api/token/verify/'), {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access,
        refresh,
      }),
    });
    if (res.status === 201) Cookie.setToken(await res.json());
    else if (res.status === 200) return;
    else throw new IssueTokenError();
  } catch (e) {
    throw new IssueTokenError(e);
  }
}

export async function authReq(method, uri, body = {}) {
  if (method == null) throw new Error();
  method = method.toUpperCase();
  const endpoint = apiServerEndPoint(uri);
  let access = Cookie.getCookie(pubEnv.TOKEN_ACCESS);
  if (access == null) throw new RequireLoginError();
  const req = {
    method,
    headers: {'Authorization': `Bearer ${access}`},
  };
  if (method !== 'GET') {
    req.body = JSON.stringify(body);
    req.headers['Content-Type'] = 'application/json';
  }
  const expiredAt = parseJwt(access)['exp'];
  if (expiredAt == null) throw new Error();
  if (Date.now() < (expiredAt * 1000) - 10000) {
    const [res, json] = await request(endpoint, req);
    if (res.status != 401) return [res, json];
  }
  await refreshToken();
  access = Cookie.getCookie(pubEnv.TOKEN_ACCESS);
  return await request(endpoint, {
    ...req,
    headers: {...req.headers, 'Authorization': `Bearer ${access}`},
  });
}

export class IssueTokenError extends Error {
  constructor(e) {
    super();
    this.type = 'issueTokenError';
    this.e = e;
  }
}

export class RequireLoginError extends Error {
  constructor(e) {
    super();
    this.type = 'requireLoginError';
    this.e = e;
  }
}

export class RequestError extends Error {
  constructor(e) {
    super();
    this.type = 'requestError';
    this.e = e;
  }
}
