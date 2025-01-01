/* Private */
import privateHome from './privateHome.js';
import privateApi from './privateApi.js';
import privateModules from './privateModules.js';

/* Public */
import publicHome from './publicHome.js';

export default [
  {
    method: 'get',
    path: '/admin/api',
    isPrivate: true,
    callback: privateApi
  },
  {
    method: 'get',
    path: '/admin/modules',
    isPrivate: true,
    callback: privateModules
  },
  {
    method: 'get',
    path: '/admin',
    isPrivate: true,
    callback: privateHome
  },
  {
    method: 'get',
    path: '/',
    isPrivate: false,
    callback: publicHome
  }
];
