import debugSetup from 'debug';

async function addPublic(req, res, next, dbTable) {
  try {
    const debug = debugSetup(`app/src/${dbTable.name}/routes/public/add`);
    const db = req.app.get('DB');
    const { id } = req.params;
    let item;
    debug('add', id);

    if (id) {
      item = await db.getOne('id', id);
    }

    debug('item', item);

    res.render(`publicAdd`, {
      layout: 'layout-base',
      item
    });
  } catch (err) {
    debug(err);
    res.render('error', { message: err.message, error: err });
  }
}

export default addPublic;
