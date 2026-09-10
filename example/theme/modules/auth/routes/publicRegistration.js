import debugSetup from 'debug';

const debug = debugSetup('app/src/modules/auth/routes/public-registration');

async function publicRegistration(req, res, next) {
  try {
    debug('registration');
    res.render('publicRegistration');
  } catch (err) {
    res.send(err);
  }
}

export default publicRegistration;
