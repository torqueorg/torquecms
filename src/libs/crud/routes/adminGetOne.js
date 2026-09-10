import debugSetup from 'debug';

async function adminGetOne(req, res, next, dbTable) {
  try {
    const debug = debugSetup(`app/src/${dbTable.name}/routes/admin/getOne`);
    debug('type', dbTable.name);

    const { id } = req.params;

    debug('id', id);

    if (!id) {
      return res.render('error', { message: 'No ID provided' });
    }

    const db = req.app.get('DB');
    const item = await db.getOne(dbTable.name, id);

    debug('item', item);

    res.render(`adminGetOne`, {
      layout: 'layoutAdmin',
      item
    });
  } catch (err) {
    debug(err);
    res.render('error', { message: err.message, error: err });
  }
}

export default adminGetOne;
