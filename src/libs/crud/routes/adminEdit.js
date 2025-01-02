import debugSetup from 'debug';

async function adminEdit(req, res, next, dbTable) {
  try {
    const debug = debugSetup(`app/src/${dbTable.name}/routes/admin/edit`);
    const db = req.app.get('DB');
    const { id } = req.params;

    debug('id', id);

    if (!id) {
      return res.render('error', { message: 'No ID provided' });
    }

    const item = await db.getOne(dbTable.name, id);

    debug('item', item);

    res.render(`adminEdit`, {
      layout: 'layoutAdmin',
      item
    });
  } catch (err) {
    debug(err);
    res.render('error', { message: err.message, error: err });
  }
}

export default adminEdit;
