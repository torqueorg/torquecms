import debugSetup from 'debug';

const debug = debugSetup('app/src/modules/user/routes/privateUpdateUserApi');

async function privateUpdateUserApi(req, res, next) {
  try {
    debug('body', req.body);

    res.send({
      added: true
    });
  } catch (err) {
    debug(err);
    res.render('error', { error: err });
  }
}

export default privateUpdateUserApi;
