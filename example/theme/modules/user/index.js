import path from 'path';
import dbTables from './dbTables.js';
import routes from './routes/index.js';

const __dirname = import.meta.dirname;

export default {
  name: 'config',
  dbTables,
  routes,
  views: path.join(__dirname, 'views')
};
