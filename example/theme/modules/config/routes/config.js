import debugSetup from 'debug';

const debug = debugSetup('app/src/modules/config/routes/config');

async function config(req, res, next) {
  try {
    debug('get config');

    const db = req.app.get('DB');
    const config = await db.get('config');

    debug('config', config);

    res.render('privateConfig', {
      layout: 'layoutPrivate',
      config: config
    });
  } catch (err) {
    debug(err);
    res.render('error', { error: err });
  }
}

export default config;
