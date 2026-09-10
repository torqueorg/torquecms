import loki from 'lokijs';
import debugSetup from 'debug';
import path from 'node:path';
import LokiFSStructuredAdapter from 'lokijs/src/loki-fs-structured-adapter.js';

const __dirname = import.meta.dirname;
const debug = debugSetup('app/src/libs/db/loki');

class DB {
  constructor() {
    debug('path', __dirname);
    this.init();
  }

  init() {
    try {
      const dbPath = path.join(__dirname, '..', '..', 'data', 'data.json');
      this.db = new loki(dbPath, {
        autoload: true,
        autoloadCallback: this.initResult,
        autosave: true,
        autosaveInterval: 500,
        adapter: new LokiFSStructuredAdapter()
      });
      this.post = this.db.addCollection('post');
      this.settings = this.db.addCollection('settings');
      this.file = this.db.addCollection('file');

      debug('DB Init success');
    } catch (e) {
      debug('DB Init Error', e);
    }
  }

  initResult() {
    if (!this.db.getCollection('post')) {
      this.post = this.db.addCollection('post');
    }

    if (!this.db.getCollection('file')) {
      this.file = this.db.addCollection('file');
    }

    if (!this.db.getCollection('settings')) {
      this.settings = this.db.addCollection('settings');
    }

    debug('DB Init completed');
  }

  async write() {
    try {
      return Promise.resolve(this.db.saveDatabase());
    } catch (e) {
      debug('DB write Error', e);
    }
  }

  getList(type) {
    let list = [];

    switch (type) {
      case 'post':
        list = this.post;
        break;

      case 'file':
        list = this.file;
        break;

      case 'settings':
        list = this.settings;
        break;

      default:
        break;
    }

    return list || [];
  }

  get(type) {
    const list = this.getList(type);
    debug('get', list);
    return Promise.resolve(list.find() || []);
  }

  getOne(type, id) {
    const list = this.getList(type);

    if (!list || !id) {
      return Promise.resolve(undefined);
    }

    return Promise.resolve(list.find({ id: id }));
  }

  add(type, item) {
    const list = this.getList(type);
    list.insert(item);
    return this.write();
  }

  update(type, id, item) {
    const list = this.db[type];

    if (!list) {
      this.add(type, item);
    } else {
      let listItem = list.by('id', item.id);

      Object.keys(listItem)
        .concat(Object.keys(item))
        .forEach(key => {
          if (item.hasOwnProperty(key)) {
            this.listItem[key] = item[key];
          }
        });

      list.update(listItem);
    }

    return this.write();
  }

  remove(type, id) {
    const list = this.getList(type);

    if (!list) {
      return Promise.resolve();
    }

    list.chain().find({ id: id }).remove();
    return this.write();
  }

  getSize() {
    return this.db.length;
  }
}

export default DB;
