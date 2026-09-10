import privateGetUsers from './privateGetUsers.js';
import privateUpdateUserApi from './privateUpdateUserApi.js';

export default [
  {
    method: 'get',
    path: '/getUsers',
    isPrivate: false,
    callback: privateGetUsers
  },
  {
    method: 'post',
    path: '/updateUsers',
    isPrivate: false,
    callback: privateUpdateUserApi
  }
];
