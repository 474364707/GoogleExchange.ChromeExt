/*
* @Author: William Chan
* @Date:   2017-05-03 15:31:00
* @Last Modified by:   Administrator
* @Last Modified time: 2017-05-04 12:05:57
*/

const exportVar = (enumerate, ...args) => {
  const data = {};
  const type = [].concat(...args);
  type.forEach((action) => {
    data[action] = `${enumerate}_${action}`;
  });
  return data;
};

export const USER = exportVar('USER',
  'GET', 'LOGIN', 'LOGOUT', 'CLEAR',
);
export const CURRENCY = exportVar('CURRENCY',
  'LIST_REQUEST', 'LIST_SUCCESS', 'LIST_FAILURE',
  'RATE_REQUEST', 'RATE_SUCCESS', 'RATE_FAILURE',
);
