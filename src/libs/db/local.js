import debugSetup from 'debug';
import path from 'node:path';
import fs from 'fs/promises';

const __dirname = import.meta.dirname;
const debug = debugSetup('app/src/libs/db/local');

class DB {
  constructor(pathToDb, schemas) {
    debug('path', __dirname, pathToDb, schemas);
    this.init(pathToDb, schemas);
  }

  async init(pathToDb, schemas) {
    try {
      const defaultData = { ...schemas };

      this.dbPath = path.join(__dirname, '..', '..', 'data', 'db.json');
      const dbFile = await fs.readFile(this.dbPath, 'utf8');
      debug('dbFile', dbFile.length);

      if (dbFile) {
        this.db = JSON.parse(dbFile);
      } else {
        this.db = defaultData;
        await this.write();
      }

      debug('DB Init success');
    } catch (e) {
      debug('DB Init Error', e);
    }
  }

  async write() {
    try {
      await fs.writeFile(this.dbPath, JSON.stringify(this.db));
    } catch (e) {
      debug('DB write Error', e);
    }
  }

  get(type) {
    const list = this.db[type];
    return Promise.resolve(list || []);
  }

  getOne(type, id) {
    const list = this.db[type];

    if (!list || !id) {
      return Promise.resolve(undefined);
    }

    return Promise.resolve(list.find(item => item.id === id));
  }

  add(type, item) {
    const list = this.db[type];

    if (!list) {
      this.db[type] = [item];
    } else {
      this.db[type].push(item);
    }

    return this.write();
  }

  update(type, id, item) {
    const list = this.db[type];

    if (!list) {
      this.add(type, item);
    } else {
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          Object.keys(list[i])
            .concat(Object.keys(item))
            .forEach(key => {
              if (item.hasOwnProperty(key)) {
                this.db[type][i][key] = item[key];
              }
            });
        }
      }
    }

    return this.write();
  }

  remove(type, id) {
    const list = this.db[type];

    if (!list) {
      return Promise.resolve();
    }

    this.db[type] = this.db[type].filter(item => item.id !== id);
    return this.write();
  }

  getSize() {
    return this.db.length;
  }
}

export default DB;
