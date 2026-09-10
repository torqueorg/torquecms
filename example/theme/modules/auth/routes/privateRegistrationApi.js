import debugSetup from 'debug';

const debug = debugSetup(
  'app/src/modules/auth/routes/private-registration-submit'
);

async function privateRegistration(req, res, next) {
  try {
    debug('registration submit');
    res.redirect('/private/auth/registration');
  } catch (err) {
    res.send(err);
  }
}

export default privateRegistration;
