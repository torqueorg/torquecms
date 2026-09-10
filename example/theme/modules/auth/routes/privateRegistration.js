import debugSetup from 'debug';

const debug = debugSetup('app/src/modules/auth/routes/private-registration');

async function privateRegistration(req, res, next) {
  try {
    debug('registration');
    res.render('privateRegistration', { layout: 'layoutPrivate' });
  } catch (err) {
    res.send(err);
  }
}

export default privateRegistration;
