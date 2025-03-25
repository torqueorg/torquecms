import debugSetup from 'debug';
import sqlite from 'sqlite3';
import Sequelize from 'sequelize';

const debug = debugSetup('app/src/libs/db/sqlite');

class Sqlite {
  constructor(pathToDb, modules) {
    this.pathToDb = pathToDb;
    this.init(modules);
  }

  async init(modules) {
    try {
      const db = this.open();
      const [tables] = await db.query(
        'SELECT name FROM sqlite_master WHERE type="table"',
        { raw: true }
      );

      console.log('tables', tables);

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
              );
            })
        )
      );

      await db.close();
    } catch (e) {
      debug('Init Error', e);
    }

    return this;
  }

  open() {
    return new Sequelize({
      dialect: 'sqlite',
      storage: this.pathToDb
    });
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

    return new Promise(async (resolve, reject) => {
      try {
        const db = this.open();
        const [results] = await db.query(query.join(' '), { raw: true });
        await db.close();
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
          `SELECT * FROM ${type} WHERE id="${id}"`,
          { raw: true }
        );
        await db.close();
        resolve(result);
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

        const [result] = await db.query(
          `INSERT INTO ${type} (${columns.join(',')}) VALUES("${values.join('","')}")`,
          { raw: true }
        );
        await db.close();
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
        const columns = [];

        Object.keys(item).forEach(key => {
          if (item.hasOwnProperty(key)) {
            columns.push(`${key}="${item[key]}"`);
          }
        });

        const [result] = await db.query(
          `UPDATE ${type} SET ${columns.join(',')} WHERE id="${id}"`,
          { raw: true }
        );
        await db.close();
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
          `DELETE FROM ${type} WHERE id="${id}"`,
          { raw: true }
        );
        await db.close();
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
        await db.close();
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
