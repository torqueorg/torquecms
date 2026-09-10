import debugSetup from 'debug';
import Sequelize from 'sequelize';

const debug = debugSetup('app/src/libs/db/sqlite');
const dbDebug = debugSetup('db:sqlite');

class Sqlite {
  constructor(pathToDb, modules) {
    this.pathToDb = pathToDb;
    this.db = this.open();
    this.ready = this.init(modules);
  }

  async init(modules) {
    try {
      const db = this.open();
      const [tables] = await db.query(
        'SELECT name FROM sqlite_master WHERE type="table"',
        { raw: true }
      );

      if (modules && modules.length) {
        await Promise.all(
          modules.map(
            module =>
              new Promise((resolve, reject) => {
                if (tables.find(table => table.name === module.name)) {
                  resolve();
                  return;
                }

                const fields = module.fields.map(function (field) {
                  return [field.name, field.type, field.params.join(' ')].join(
                    ' '
                  );
                });

                return db.query(
                  `CREATE TABLE ${module.name} (${fields.join(',')})`,
                  { raw: true }
                ).then(resolve).catch(reject);
              })
          )
        );
      }
    } catch (e) {
      debug('Init Error', e);
    }

    return this;
  }

  open() {
    if (this.db) {
      return this.db;
    }

    return new Sequelize({
      dialect: 'sqlite',
      storage: this.pathToDb,
      logging: msg => dbDebug(msg)
    });
  }

  async close() {
    if (this.db) {
      await this.db.close();
      this.db = null;
    }
  }

  get(type, options) {
    const query = [`SELECT * FROM ${type}`];
    const replacements = {};

    if (options) {
      const where = [];

      if (options.where) {
        where.push(`${options.where}`);
      }

      if (options.from) {
        where.push(`${options.from.key} >= :fromValue`);
        replacements.fromValue = options.from.value;
      }

      if (where.length) {
        query.push(`WHERE ${where.join(' AND ')}`);
      }

      if (options.limit) {
        query.push(`LIMIT ${Number(options.limit)}`);
      }
    }

    return new Promise(async (resolve, reject) => {
      try {
        const db = this.open();
        const [results] = await db.query(query.join(' '), {
          replacements,
          raw: true
        });
        resolve(results);
      } catch (err) {
        reject(err);
      }
    });
  }

  getOne(type, id) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = this.open();
        const [result] = await db.query(
          `SELECT * FROM ${type} WHERE id = :id`,
          { replacements: { id }, raw: true }
        );
        resolve(result && result.length ? result[0] : undefined);
      } catch (err) {
        reject(err);
      }
    });
  }

  addOne(type, item) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = this.open();
        const columns = [];
        const placeholders = [];
        const replacements = {};

        Object.keys(item).forEach(key => {
          if (item.hasOwnProperty(key)) {
            columns.push(key);
            placeholders.push(`:${key}`);

            const value = item[key];
            replacements[key] =
              typeof value === 'number'
                ? value
                : typeof value === 'boolean'
                  ? value ? 1 : 0
                  : value;
          }
        });

        const [result] = await db.query(
          `INSERT INTO ${type} (${columns.join(',')}) VALUES (${placeholders.join(',')})`,
          { replacements, raw: true }
        );
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }

  updateOne(type, id, item) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = this.open();
        const sets = [];
        const replacements = { id };

        Object.keys(item).forEach(key => {
          if (item.hasOwnProperty(key)) {
            sets.push(`${key} = :${key}`);
            replacements[key] = item[key];
          }
        });

        const [result] = await db.query(
          `UPDATE ${type} SET ${sets.join(', ')} WHERE id = :id`,
          { replacements, raw: true }
        );
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }

  removeOne(type, id) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = this.open();
        const [result] = await db.query(
          `DELETE FROM ${type} WHERE id = :id`,
          { replacements: { id }, raw: true }
        );
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  }

  getCount(type) {
    return new Promise(async (resolve, reject) => {
      try {
        const db = this.open();
        const [result] = await db.query(`SELECT COUNT("_id") FROM ${type}`, {
          raw: true
        });
        resolve(result);
      } catch (err) {
        reject(err);
      }
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
