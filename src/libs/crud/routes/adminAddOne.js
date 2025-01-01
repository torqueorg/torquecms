import debugSetup from 'debug';

async function adminAddOne(req, res, next, dbTable) {
  try {
    const debug = debugSetup(`app/src/${dbTable.name}/routes/admin/addOne`);
    res.render(`adminAdd`, {
      layout: 'layoutAdmin'
    });
  } catch (err) {
    debug(err);
    res.render('error', { message: err.message, error: err });
  }
}

export default adminAddOne;
