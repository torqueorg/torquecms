import path from 'node:path';
import Torque from '../index.js';
import theme from './theme/index.js';

const port = process.env.PORT || '12345';
const dbPath =
  process.env.DB_PATH || path.join(import.meta.dirname, 'example.db');

Torque({
  port,
  dbPath,
  theme
});
