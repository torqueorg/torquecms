import path from 'path';
import routes from './routes/index.js';
import auth from './modules/auth/index.js';
import config from './modules/config/index.js';
import user from './modules/user/index.js';

const __dirname = import.meta.dirname;

const mainTheme = {
  name: 'main-theme',
  type: 'theme',
  routes: [...routes, ...auth.routes, ...config.routes, ...user.routes],
  layouts: path.join(__dirname, 'views', 'layouts'),
  partials: path.join(__dirname, 'views', 'partials'),
  views: [path.join(__dirname, 'views'), auth.views, config.views],
  assets: path.join(__dirname, 'assets'),
  dbTables: [...auth.dbTables, ...config.dbTables, ...user.dbTables]
};

export default mainTheme;
