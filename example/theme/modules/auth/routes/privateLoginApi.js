import debugSetup from 'debug';
import { v7 as uuid } from 'uuid';
import { forms, auth } from '../../../../../index.js';

const debug = debugSetup('app/src/modules/auth/routes/private-login-api');

async function privateLogin(req, res, next) {
  try {
    const db = req.app.get('DB');
    const { email, password } = (await forms.parseForm(req)).fieldsSingle;

    debug('login values', `${email}`, `${password}`);

    if (!email) {
      throw new Error('No email');
    }

    if (!password) {
      throw new Error('No password');
    }

    const id = uuid();
    const dateNow = new Date().toISOString();
    await db.addOne('auth', {
      id,
      userId: 'userid',
      created: dateNow,
      modified: dateNow,
      expire: dateNow
    });

    auth.createAuth(res, id);
    res.redirect('/private');
  } catch (err) {
    debug('err', err.message);
    res.render('privateLogin', { layout: 'layoutPrivate', error: err.message });
  }
}

export default privateLogin;
