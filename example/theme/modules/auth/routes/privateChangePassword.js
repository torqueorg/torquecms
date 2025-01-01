import debugSetup from 'debug';

const debug = debugSetup('app/src/modules/auth/routes/private-change-password');

async function privateChangePassword(req, res, next) {
  try {
    debug('login');
    res.render('privateChangePassword', { layout: 'layoutPrivate' });
  } catch (err) {
    res.send(err);
  }
}

export default privateChangePassword;
