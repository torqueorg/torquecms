import Sqlite from './sqlite.js';
import { v7 as uuid } from 'uuid';
import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import example from '../../../example/theme/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '..', '..', '..', 'example', 'example.db');

describe('Sqlite', () => {
  let db;
  const created = new Date();
  const userData = {
    id: uuid(),
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    password: '12345',
    created: created,
    modified: created,
    recoveryToken: ''
  };

  beforeAll(async () => {
    db = new Sqlite(dbPath, example.dbTables);

    // Wait a tiny bit to let init() finish table creation
    await new Promise(res =>
      setTimeout(async () => {
        res();
        // await db.addOne('users', { id: 1, name: 'Alice', active: true });
      }, 1000)
    );
  });

  it('should initialize db', async () => {
    const users = await db.get('user');
    expect(users.length).toBeGreaterThanOrEqual(0);
  });

  it('should add and retrieve one user', async () => {
    await db.addOne('user', userData);
    const user = await db.getOne('user', userData.id);
    expect(user.firstName).toBe('Alice');
  });

  it('should update a user', async () => {
    await db.updateOne('user', userData.id, { firstName: 'Bob' });
    const updated = await db.getOne('user', userData.id);
    expect(updated.firstName).toBe('Bob');
  });

  it('should get multiple users with filtering', async () => {
    const result = await db.get('user');
    expect(result.length).toBe(1);
    expect(result[0].firstName).toBe('Bob');
  });

  it('should remove a user', async () => {
    await db.removeOne('user', userData.id);
    const user = await db.getOne('user', userData.id);
    expect(user).toBeUndefined();
  });

  // it('should return correct count of users', async () => {
  //   await db.addOne('users', { id: 6, name: 'Fay', active: true });
  //   await db.addOne('users', { id: 7, name: 'Gus', active: false });
  //
  //   const count = await db.getCount('users');
  //   expect(count[0]['COUNT("_id")']).toBeUndefined(); // since there's no "_id" column
  // });
});
