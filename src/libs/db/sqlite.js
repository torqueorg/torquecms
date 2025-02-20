import debugSetup from 'debug';
import sqlite from 'sqlite3';

const debug = debugSetup('app/src/libs/db/sqlite');

class Sqlite {
  constructor(pathToDb, modules) {
    this.init(pathToDb, modules);
  }

  init(pathToDb, modules) {
    this.pathToDb = pathToDb;
    try {
      const db = this.open();

      db.serialize(() => {
        db.all(
          'SELECT name FROM sqlite_master WHERE type="table"',
          (err, result) => {
            if (err) {
              return debug('Init serialize', err);
            }

            const tables = result;

            modules.forEach(module => {
              if (tables.find(table => table.name === module.name)) {
                return;
              }

              const fields = module.fields.map(function (field) {
                return [field.name, field.type, field.params.join(' ')].join(
                  ' '
                );
              });

              db.run(
                `CREATE TABLE ${module.name} (${fields.join(',')})`,
                (err, result) => {
                  if (err) {
                    return debug('Create error', err);
                  }
                }
              );
            });

            db.close();
          }
        );
      });
    } catch (e) {
      debug('Init Error', e);
    }

    return this;
  }

  open() {
    const dbSetup = sqlite.verbose();
    const db = new dbSetup.Database(this.pathToDb);
    return db;
  }

  get(type, options) {
    const query = [`SELECT * FROM ${type}`];

    if (options) {
      const where = [];

      if (options.where) {
        where.push(`${options.where}`);
      }

      if (options.from) {
        where.push(`${options.from.key} >= ${options.from.value}`);
      }

      if (where.length) {
        query.push(`WHERE ${where.join(' AND ')}`);
      }

      if (options.limit) {
        query.push(`LIMIT ${options.limit}`);
      }
    }

    return new Promise((resolve, reject) => {
      const db = this.open();
      db.serialize(() => {
        db.all(query.join(' '), (err, result) => {
          if (err) {
            debug('get err', err);
            return reject(err);
          }

          db.close();
          resolve(result);
        });
      });
    });
  }

  getOne(type, id) {
    return new Promise((resolve, reject) => {
      const db = this.open();
      db.serialize(() => {
        db.get(`SELECT * FROM ${type} WHERE id="${id}"`, (err, result) => {
          if (err) {
            debug('getOne err', err);
            return reject(err);
          }
          db.close();
          resolve(result);
        });
      });
    });
  }

  addOne(type, item) {
    return new Promise((resolve, reject) => {
      const db = this.open();
      db.serialize(() => {
        const columns = [];
        const values = [];

        Object.keys(item).forEach(key => {
          if (item.hasOwnProperty(key)) {
            columns.push(key);

            const value = item[key];

            values.push(
              typeof value === 'number'
                ? value
                : typeof value === 'boolean' && value
                  ? 1
                  : typeof value === 'boolean' && !value
                    ? 0
                    : value
            );
          }
        });

        const statement = `INSERT INTO ${type} (${columns.join(',')}) VALUES(${columns.fill('?')})`;

        db.run(statement, values, function (err, result) {
          if (err) {
            debug(err);
            return reject(err);
          }
          db.close();
          resolve();
        });
      });
    });
  }

  updateOne(type, id, item) {
    return new Promise((resolve, reject) => {
      const db = this.open();
      db.serialize(() => {
        const columns = [];
        const values = [];

        Object.keys(item).forEach(key => {
          if (item.hasOwnProperty(key)) {
            columns.push(`${key}=?`);

            const value = item[key];

            values.push(
              typeof value === 'number'
                ? value
                : typeof value === 'boolean' && value
                  ? 1
                  : typeof value === 'boolean' && !value
                    ? 0
                    : value
            );
          }
        });

        values.push(id);
        const statement = `UPDATE ${type} SET ${columns.join(',')} WHERE id=?`;

        db.run(statement, values, (err, result) => {
          if (err) {
            debug(err);
            return reject(err);
          }
          db.close();
          resolve();
        });
      });
    });
  }

  removeOne(type, id) {
    return new Promise((resolve, reject) => {
      const db = this.open();
      db.serialize(() => {
        db.all(`DELETE FROM ${type} WHERE id="${id}"`, (err, result) => {
          if (err) {
            debug('removeOne err', err);
            return reject(err);
          }
          db.close();
          resolve(result);
        });
      });
    });
  }

  getCount(type) {
    return new Promise((resolve, reject) => {
      const db = this.open();
      db.serialize(() => {
        db.all(`SELECT COUNT("_id") FROM ${type}`, (err, result) => {
          if (err) {
            debug('getCount err', err);
            return reject(err);
          }
          db.close();
          resolve(result);
        });
      });
    });
  }

  debugModeOn() {
    debugSetup.enable('db:*');
  }

  debugModeOff() {
    debugSetup.disable('db:*');
  }
}

export default Sqlite;
