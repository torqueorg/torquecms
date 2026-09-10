import fs from 'node:fs';
import path from 'node:path';
import Sqlite from './sqlite.js';
import { v7 as uuid } from 'uuid';
import crud from '../crud/index.js';
import example from '../../../example/theme/index.js';

const dbPath = path.join(import.meta.dirname, `test-${Date.now()}.db`);

describe('Sqlite', () => {
  let db;
  const created = new Date();
  const userData = {
    id: uuid(),
    firstName: 'Alice',
    lastName: 'Johnson',
    email: 'alice.johnson@example.com',
    password: '12345',
    created: created.toString(),
    modified: created.toString(),
    recoveryToken: ''
  };

  beforeAll(async () => {
    const dbSchemas = example.dbTables.map(dbTable => ({
      name: dbTable.name,
      fields: [...crud.fields, ...dbTable.fields]
    }));

    db = new Sqlite(dbPath, dbSchemas);
    await db.ready;
  });

  afterAll(async () => {
    if (db) {
      await db.close();
    }
    if (fs.existsSync(dbPath)) {
      try {
        fs.unlinkSync(dbPath);
      } catch {
        // ignore
      }
    }
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
