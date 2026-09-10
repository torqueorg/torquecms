import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import Torque from '../index.js';
import theme from './theme/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const port = '12345';
const dbPath = path.join(__dirname, 'example.db');

Torque({
  port,
  dbPath,
  theme
});
