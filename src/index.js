import debugSetup from 'debug';
import express from 'express';
import http from 'http';
import https from 'https';
import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';
import onHeaders from 'on-headers';
import net from 'net';
import killPort from 'kill-port';

import routing from './libs/routing/index.js';
import normalizePort from './libs/normalizePort/index.js';
import dbs from './libs/db/index.js';
import auth from './libs/auth/index.js';
import crud from './libs/crud/index.js';

import themeDefault from './theme/index.js';

const __dirname = import.meta.dirname;
const debug = debugSetup('app/src/index');

function isPortInUse(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();

    server.once('error', function(err) {
      if (err.code === 'EADDRINUSE') {
        return resolve(true);
      }

      reject(err);
    });

    server.once('listening', function() {
      server.close();
      resolve(false);
    });

    server.listen(port);
  });
}

function start(optionsStart = {}) {
  const optionsDefault = {
    port: '4444',
    dbPath: path.join(__dirname, 'data.db'),
    theme: themeDefault,
    modules: [],
    options: {}
  };
  const options = {};

  Object.keys(optionsDefault).forEach(key => {
    if (key === 'theme') {
      options.theme = {
        views: []
      };

      Object.keys(optionsDefault.theme).forEach(themeKey => {
        if (optionsStart.theme && optionsStart.theme[themeKey]) {
          options.theme[themeKey] = optionsStart.theme[themeKey];
        } else {
          options.theme[themeKey] = optionsDefault.theme[themeKey];
        }
      });
    } else {
      options[key] = optionsStart[key] || optionsDefault[key];
    }
  });

  const app = express();
  const server =
    options.options && options.options.SSL
      ? https.createServer(
        {
          key: options.options.SSL.key,
          cert: options.options.SSL.cert
        },
        app
      )
      : http.createServer(app);
  const router = express.Router();
  const views = [];
  const assets = [];
  const dbSchemas = [];

  if (crud.views) {
    views.push(crud.views);
  }

  if (crud.assets) {
    assets.push(crud.assets);
  }

  // Theme
  if (options.theme.views) {
    options.theme.views.forEach(view => views.push(view));
  }

  if (options.theme.assets) {
    assets.push(options.theme.assets);
  }

  if (options.theme.dbTables) {
    dbSchemas.push(
      ...options.theme.dbTables.map(dbTable => ({
        name: dbTable.name,
        fields: [...crud.fields, ...dbTable.fields]
      }))
    );
  }

  if (options.theme.routes && options.theme.routes.length) {
    options.theme.routes.forEach(function (route) {
      const middlewares = [];

      if (route.isPrivate) {
        middlewares.push(auth.verifyAuth());
      }

      routing({
        app: router,
        method: route.method,
        path: route.path,
        middlewares,
        callback: route.callback
      });
    });
  }

  dbSchemas.forEach(dbTable => {
    const routes = crud.crud(dbTable);

    routes.forEach(route => {
      const middlewares = [];

      if (route.isPrivate) {
        middlewares.push(auth.verifyAuth());
      }

      routing({
        app: router,
        method: route.method,
        path: route.path,
        middlewares,
        callback: route.callback
      });
    });
  });

  if (options.options && options.options.staticPaths) {
    options.options.staticPaths.forEach(function (staticPath) {
      app.use(staticPath.path, express.static(staticPath.folder));
    });
  }

  const port = normalizePort(options.port || '4444');
  const db = new dbs['sqlite'](options.dbPath, dbSchemas);

  app.set('port', port);
  app.set('DB', db);

  app.engine(
    'hbs',
    engine({
      extname: 'hbs',
      defaultLayout: 'layoutBase',
      defaultView: 'index',
      layoutsDir: options.theme.layouts,
      partialsDir: [options.theme.partials]
    })
  );
  app.set('views', views);
  app.set('view engine', 'hbs');

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser('secret-token'));
  app.use(async function (req, res, next) {
    const ip =
      req.ip ||
      req._remoteAddress ||
      (req.connection && req.connection.remoteAddress) ||
      undefined;
    const startAt = process.hrtime();

    onHeaders(res, function onHeaders() {
      const diff = process.hrtime(startAt);
      const time = diff[0] * 1e3 + diff[1] * 1e-6;

      // debug(
      //   'middleware',
      //   ip,
      //   req.method,
      //   req.baseUrl,
      //   req.originalUrl || req.url,
      //   res.statusCode,
      //   time.toFixed(3) + 'ms'
      // );
    });

    req.__dirname = __dirname;
    req.__options = { ...options.options };
    res.locals.modules = dbSchemas;

    next();
  });
  app.use('/files', express.static(path.join(__dirname, '..', 'files')));

  if (assets && assets.length) {
    assets.forEach(function (asset) {
      app.use('/', express.static(asset));
    });
  }

  app.use(router);
  app.use(function (req, res, next) {
    next(createError(404));
  });

  app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
  });

  isPortInUse(port).then(function(isInUse) {
    if (isInUse) {
      killPort(port);
    }

    server.listen(port);
  }).catch(function(err) {
    console.error(err);
  });

  server.on('error', function (error) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  });
  server.on('listening', function () {
    const addr = server.address();
    const bind =
      typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
    debug('Listening on ' + bind);
  });
}

export default start;
