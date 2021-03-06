/**
 * @Author: Zhai Yiming (root@derzh.com)
 * @Date:   2017-12-13 2:58:06
 * @Last Modified by:   Zhai Yiming (root@derzh.com)
 * @Last Modified time: 2017-12-28 09:59:01
 */
import * as cookie from './cookie';

export const setLocal = (k, v) => (
  window.localStorage
    ? window.localStorage.setItem(k, JSON.stringify(v))
    : (cookie.remove(k), cookie.set(k, JSON.stringify(v)))
);
export const getLocal = (k) => {
  const raw = window.localStorage ? window.localStorage.getItem(k) : cookie.get(k);
  try {
    return JSON.parse(raw);
  } catch (e) {
    return undefined;
  }
};
export const removeLocal = k => (window.localStorage ? window.localStorage.removeItem(k) : cookie.remove(k));
