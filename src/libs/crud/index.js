import path from 'path';
// import routes from './routes/index.js';
import adminAddOne from './routes/adminAddOne.js';
import adminEdit from './routes/adminEdit.js';
import adminGetList from './routes/adminGetList.js';
import adminGetOne from './routes/adminGetOne.js';
// import adminUpdateList from './routes/adminUpdateList.js';
import adminUpdateOne from './routes/adminUpdateOne.js';
// import adminRemoveList from './routes/adminRemoveList.js';
import adminRemoveOne from './routes/adminRemoveOne.js';

const __dirname = import.meta.dirname;

const crud = dbTable => {
  const routeAdminAdd = {
    method: 'post',
    path: `/admin/${dbTable.name}/add`,
    isPrivate: true,
    callback: function (req, res, next) {
      adminAddOne(req, res, next, dbTable);
    }
  };
  const routeAdminEdit = {
    method: 'post',
    path: `/admin/${dbTable.name}/add/:id`,
    isPrivate: true,
    callback: function (req, res, next) {
      adminEdit(req, res, next, dbTable);
    }
  };
  const routeAdminGetList = {
    method: 'get',
    path: `/admin/${dbTable.name}`,
    isPrivate: true,
    callback: function (req, res, next) {
      adminGetList(req, res, next, dbTable);
    }
  };
  const routeAdminGetOne = {
    method: 'get',
    path: `/admin/${dbTable.name}/:id`,
    isPrivate: true,
    callback: function (req, res, next) {
      adminGetOne(req, res, next, dbTable);
    }
  };
  // const routeAdminUpdateList = {
  //   method: 'put',
  //   path: `/admin/${dbTable.name}`,
  //   isPrivate: true,
  //   callback: function (req, res, next) {
  //     adminUpdateList(req, res, next, dbTable);
  //   }
  // };
  const routeAdminUpdateOne = {
    method: 'put',
    path: `/admin/${dbTable.name}/:id`,
    isPrivate: true,
    callback: function (req, res, next) {
      adminUpdateOne(req, res, next, dbTable);
    }
  };
  // const routeAdminRemoveList = {
  //   method: 'delete',
  //   path: `/admin/${dbTable.name}`,
  //   isPrivate: true,
  //   callback: function (req, res, next) {
  //     adminRemoveList(req, res, next, dbTable);
  //   }
  // };
  const routeAdminRemoveOne = {
    method: 'delete',
    path: `/admin/${dbTable.name}/:id`,
    isPrivate: true,
    callback: function (req, res, next) {
      adminRemoveOne(req, res, next, dbTable);
    }
  };

  return [
    routeAdminAdd,
    routeAdminEdit,
    routeAdminGetList,
    routeAdminGetOne,
    // routeAdminUpdateList,
    routeAdminUpdateOne,
    // routeAdminRemoveList,
    routeAdminRemoveOne
  ];
};

export default {
  // routes: routes,
  views: path.join(__dirname, 'views'),
  assets: path.join(__dirname, 'assets'),
  crud,
  fields: [
    {
      name: '_id',
      type: 'INTEGER',
      params: ['PRIMARY', 'KEY', 'AUTOINCREMENT']
    },
    {
      name: 'id',
      type: 'TEXT',
      params: ['UNIQUE', 'NOT', 'NULL']
    },
    {
      name: 'created',
      type: 'TEXT',
      params: ['NOT', 'NULL']
    },
    {
      name: 'modified',
      type: 'TEXT',
      params: ['NOT', 'NULL']
    }
  ]
};
