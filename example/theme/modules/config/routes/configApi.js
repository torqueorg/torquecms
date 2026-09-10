import debugSetup from 'debug';

const debug = debugSetup('app/src/modules/config/routes/config-api');

async function configApi(req, res, next) {
  try {
    debug('body', req.body);
    const db = req.app.get('DB');
    const config = await db.get('config');

    await Promise.all(
      config.map(setting => {
        const param = req.body[setting.id];

        if (param) {
          setting.value = param;
          return db.updateOne('config', setting.id, { ...setting });
        }

        return Promise.resolve();
      })
    );

    res.send({
      added: true
    });
  } catch (err) {
    debug(err);
    res.render('error', { error: err });
  }
}

export default configApi;
