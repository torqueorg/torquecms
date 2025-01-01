/* Private */
import privateChangePassword from './privateChangePassword.js';
import privateForgotPassword from './privateForgotPassword.js';
import privateLogin from './privateLogin.js';
import privateLoginApi from './privateLoginApi.js';
import privateLogout from './privateLogout.js';
import privateRegistration from './privateRegistration.js';
import privateRegistrationApi from './privateRegistrationApi.js';
import privatePasswordRecovery from './privatePasswordRecovery.js';

/* Public */
import publicRegistration from './publicRegistration.js';

export default [
  {
    method: 'get',
    path: '/admin/auth/login',
    isPrivate: false,
    callback: privateLogin
  },
  {
    method: 'post',
    path: '/admin/auth/login',
    isPrivate: false,
    callback: privateLoginApi
  },
  {
    method: 'get',
    path: '/admin/auth/logout',
    isPrivate: true,
    callback: privateLogout
  },
  {
    method: 'get',
    path: '/admin/auth/registration',
    isPrivate: false,
    callback: privateRegistration
  },
  {
    method: 'post',
    path: '/admin/auth/registration',
    isPrivate: false,
    callback: privateRegistrationApi
  },
  {
    method: 'get',
    path: '/admin/auth/forgot-password',
    isPrivate: false,
    callback: privateForgotPassword
  },
  {
    method: 'get',
    path: '/admin/auth/change-password',
    isPrivate: true,
    callback: privateChangePassword
  },
  {
    method: 'get',
    path: '/admin/auth/password-recovery',
    isPrivate: false,
    callback: privatePasswordRecovery
  },
  {
    method: 'get',
    path: '/auth/registration',
    isPrivate: false,
    callback: publicRegistration
  }
];
