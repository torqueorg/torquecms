import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import routes from './routes/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const theme = {
  name: 'mainTheme',
  type: 'theme',
  routes: [...routes],
  layouts: path.join(__dirname, 'views', 'layouts'),
  partials: path.join(__dirname, 'views', 'partials'),
  views: [path.join(__dirname, 'views')],
  assets: path.join(__dirname, 'assets'),
  dbTables: []
};

export default theme;
