import debugSetup from 'debug';

const debug = debugSetup('app/src/modules/auth/routes/private-logout');

async function privateLogout(req, res, next) {
  try {
    debug('login');
    res.render('privateLogout', { layout: 'layoutPrivate' });
  } catch (err) {
    res.send(err);
  }
}

export default privateLogout;
