import debugSetup from 'debug';

async function adminRemoveOne(req, res, next, dbTable) {
  try {
    const debug = debugSetup(`app/src/${dbTable.name}/routes/admin/removeOne`);

    debug('type', dbTable.name);

    const { id } = req.params;

    debug('id', id);

    if (!id) {
      return res.render('error', { message: 'No ID provided' });
    }

    const db = req.app.get('DB');
    const item = await db.removeOne(dbTable.name, id);

    debug('item', item);

    res.redirect(`/admin/${dbTable.name}`);
  } catch (err) {
    debug(err);
    res.render('error', { message: err.message, error: err });
  }
}

export default adminRemoveOne;
