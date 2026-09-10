import config from './config.js';
import configApi from './configApi.js';

export default [
  {
    method: 'get',
    path: '/admin/modules/config',
    isPrivate: false,
    callback: config
  },
  {
    method: 'post',
    path: '/admin/modules/config',
    isPrivate: false,
    callback: configApi
  }
];
