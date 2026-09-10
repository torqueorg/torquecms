import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import dbTables from './dbTables.js';
import routes from './routes/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  name: 'auth',
  dbTables,
  routes,
  views: path.join(__dirname, 'views')
};
