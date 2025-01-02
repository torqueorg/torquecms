import debugSetup from 'debug';

async function publicGetSources(req, res, next, dbTable) {
  try {
    const debug = debugSetup(`app/src/${dbTable.name}/routes/public/getList`);
    const db = req.app.get('DB');
    const config = await db.get('config');
    const list = await db.get(dbTable.name);
    debug('list', list);
    debug('config', config);

    const title = config.find(setting => setting.id === 'title');

    res.render(`publicList`, {
      title: (title && title.value) || '',
      list: list.map((item, index) => ({
        ...item,
        num: index + 1
      }))
    });
  } catch (err) {
    res.render('error', { error: err });
  }
}

export default publicGetSources;
