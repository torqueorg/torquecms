import debugSetup from 'debug';

const debug = debugSetup('app/src/modules/user/routes/privateGetUsers');

async function privateGetUsers(req, res, next) {
  try {
    debug('get users');

    const db = req.app.get('DB');
    const users = await db.get('user');

    debug('users', users);

    res.render('privateList', {
      layout: 'layoutPrivate',
      list: users
    });
  } catch (err) {
    debug(err);
    res.render('error', { error: err });
  }
}

export default privateGetUsers;
