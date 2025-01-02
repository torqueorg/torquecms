import debugSetup from 'debug';

const debug = debugSetup('app/src/modules/auth/routes/private-login');

async function privateLogin(req, res, next) {
  try {
    debug('login');
    res.render('privateLogin', { layout: 'layoutPrivate' });
  } catch (err) {
    res.send(err);
  }
}

export default privateLogin;
