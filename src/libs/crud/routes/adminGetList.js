import debugSetup from 'debug';

async function adminGetList(req, res, next, dbTable) {
  try {
    const debug = debugSetup(`app/src/${dbTable.name}/routes/admin/getList`);
    debug('get', req.app.get('views'));

    const db = req.app.get('DB');
    const list = await db.get(dbTable.name);

    debug('list', list.length);

    res.render(`adminGetList`, {
      layout: 'layoutAdmin',
      list: list.map((item, index) => ({
        ...item,
        num: index + 1
      }))
    });
  } catch (err) {
    debug(err);
    res.render('error', { message: err.message, error: err });
  }
}

export default adminGetList;
