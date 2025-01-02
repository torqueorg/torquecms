import adminAdd from './adminAdd.js';
import adminAddApi from './adminAddApi.js';
import adminGetList from './adminGetList.js';
import adminRemoveApi from './adminRemoveApi.js';
import publicGetList from './publicGetList.js';
import publicAdd from './publicAdd.js';
import moduleConfig from '../moduleConfig.js';

export default [
  {
    method: 'get',
    path: `/admin/${moduleConfig.codeMany}/add`,
    isPrivate: true,
    callback: adminAdd
  },
  {
    method: 'get',
    path: `/admin/${moduleConfig.codeMany}/add/:id`,
    isPrivate: true,
    callback: adminAdd
  },
  {
    method: 'get',
    path: `/admin/${moduleConfig.codeMany}/remove/:id`,
    isPrivate: true,
    callback: adminRemoveApi
  },
  {
    method: 'get',
    path: `/admin/${moduleConfig.codeMany}`,
    isPrivate: true,
    callback: adminGetList
  },
  {
    method: 'post',
    path: `/admin/${moduleConfig.codeMany}/add`,
    isPrivate: true,
    callback: adminAddApi
  },
  {
    method: 'get',
    path: `/${moduleConfig.codeMany}`,
    isPrivate: false,
    callback: publicGetList
  },
  {
    method: 'get',
    path: `/${moduleConfig.codeMany}/add`,
    isPrivate: false,
    callback: publicAdd
  }
];
