import debugSetup from 'debug';

const debug = debugSetup('app/src/libs/routing');

export default function routing({ app, method, path, middlewares, callback }) {
  if (!middlewares) {
    middlewares = [];
  }

  switch (method) {
    case 'get':
      app.get(path, middlewares, callback);
      break;

    case 'post':
      app.post(path, middlewares, callback);
      break;

    case 'put':
      app.put(path, middlewares, callback);
      break;

    case 'delete':
      app.delete(path, middlewares, callback);
      break;
  }
}
