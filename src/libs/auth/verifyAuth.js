import { Buffer } from 'node:buffer';

function verifyAuth() {
  return async function (req, res, next) {
    const { ts } = req.signedCookies;
    const db = req.app.get('DB');

    if (!ts) {
      res.redirect('/admin/auth/login');
      return;
    }

    const parsedTs = Buffer.from(ts, 'base64').toString();

    if (!parsedTs) {
      res.redirect('/admin/auth/login');
      return;
    }

    const user = await db.getOne('auth', parsedTs);

    if (!user) {
      res.redirect('/admin/auth/login');
      return;
    }

    req.user = user;
    next();
  };
}

export default verifyAuth;
