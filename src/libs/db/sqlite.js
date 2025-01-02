import debugSetup from 'debug';
import sqlite from 'sqlite3';

const debug = debugSetup('app/src/libs/db/sqlite');

class Sqlite {
  constructor(pathToDb, modules) {
    this.init(pathToDb, modules);
  }

  init(pathToDb, modules) {
    debug('init');
    this.pathToDb = pathToDb;
    try {
      const db = this.open();

      db.serialize(() => {
        debug('check tables');

        db.all(
          'SELECT name FROM sqlite_master WHERE type="table"',
          (err, result) => {
            if (err) {
              return debug(err);
            }

            const tables = result;
            debug('tables', tables);

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
                    return debug(err);
                  }

                  debug('Created', module.name, result);
                }
              );
            });

            db.close();
          }
        );
      });

      debug('Init success');
    } catch (e) {
      debug('Init Error', e);
    }

    return this;
  }

  open() {
    debug('open', this.pathToDb);
    const dbSetup = sqlite.verbose();
    const db = new dbSetup.Database(this.pathToDb);
    return db;
  }

  get(type) {
    return new Promise((resolve, reject) => {
      const db = this.open();
      db.serialize(() => {
        debug('get', type);

        db.all(`SELECT * FROM ${type}`, (err, result) => {
          if (err) {
            debug('get err', err);
            return reject(err);
          }

          debug('get result', result);
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
        debug('getOne', type, id);

        db.get(`SELECT * FROM ${type} WHERE id="${id}"`, (err, result) => {
          if (err) {
            debug('getOne err', err);
            return reject(err);
          }

          debug('getOne result', result);
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
        debug('add', type);

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

        debug('add', 'statement', statement);
        debug('add', 'values', values);

        db.run(statement, values, function (err, result) {
          if (err) {
            debug(err);
            return reject(err);
          }

          debug(`Row was added to the table: ${result}`);
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
        debug('updateOne', type, id);

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

        debug('update', 'statement', statement, values);

        db.run(statement, values, (err, result) => {
          if (err) {
            debug(err);
            return reject(err);
          }
          debug(`Row was updated to the table: ${result}`);
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
        debug('removeOne', type, id);

        db.all(`DELETE FROM ${type} WHERE id="${id}"`, (err, result) => {
          if (err) {
            debug('removeOne err', err);
            return reject(err);
          }

          debug('removeOne result', result);
          db.close();
          resolve(result);
        });
      });
    });
  }

  getSize() {
    return this.db.length;
  }

  debugModeOn() {
    debugSetup.enable('db:*');
  }

  debugModeOff() {
    debugSetup.disable('db:*');
  }
}

export default Sqlite;
