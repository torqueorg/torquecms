import { Buffer } from 'node:buffer';

function createAuth(res, id) {
  res.cookie('ts', Buffer.from(id).toString('base64'), {
    signed: true
  });
}

export default createAuth;
