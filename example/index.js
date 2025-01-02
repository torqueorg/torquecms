import path from 'node:path';
import Torque from '../index.js';
import theme from './theme/index.js';

const __dirname = import.meta.dirname;
const port = '12345';
const dbPath = path.join(__dirname, 'example.db');

Torque({
  port,
  dbPath,
  theme
});
