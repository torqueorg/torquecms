import debugSetup from 'debug';

async function adminRemoveApi(req, res, next, dbTable) {
  try {
    const debug = debugSetup(`app/src/${dbTable.name}/routes/admin/removeApi`);
    const db = req.app.get('DB');
    const { id } = req.params;
    debug('remove', id);

    if (id) {
      await db.removeOne(dbTable.name, id);
    }

    res.redirect(`/admin/${dbTable.name}`);
  } catch (err) {
    debug(err);
    res.render('error', { message: err.message, error: err });
  }
}

export default adminRemoveApi;
