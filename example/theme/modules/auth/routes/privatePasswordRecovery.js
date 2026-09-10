import debugSetup from 'debug';

const debug = debugSetup('app/src/modules/auth/routes/private-password-recovery');

async function privatePasswordRecovery(req, res, next) {
  try {
    debug('login');
    res.render('privatePasswordRecovery', { layout: 'layoutPrivate' });
  } catch (err) {
    res.send(err);
  }
}

export default privatePasswordRecovery;
