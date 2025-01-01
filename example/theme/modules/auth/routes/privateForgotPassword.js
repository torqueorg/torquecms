import debugSetup from 'debug';

const debug = debugSetup('app/src/modules/auth/routes/private-forgot-password');

async function privateForgotPassword(req, res, next) {
  try {
    debug('login');
    res.render('privateForgotPassword', { layout: 'layoutPrivate' });
  } catch (err) {
    res.send(err);
  }
}

export default privateForgotPassword;
