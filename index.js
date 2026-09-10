import * as dotenv from 'dotenv';
dotenv.config();

import debugSetup from 'debug';
import { v7 as _uuid } from 'uuid';
import { Jimp } from 'jimp';
import _webp from 'webp-converter';
import _forms from './src/libs/forms/index.js';
import _auth from './src/libs/auth/index.js';

if (process.env.NODE_ENV === 'development') {
  debugSetup.enable('app/*');
}

import start from './src/index.js';

export const uuid = _uuid;
export const jimp = Jimp;
export const webp = _webp;
export const forms = _forms;
export const auth = _auth;
export const debug = debugSetup('app/external');
export default start;
