import jest from 'jest';

export default async () => {
  jest.mock('sqlite3', () => {
    const all = jest.fn();
    const get = jest.fn();
    const run = jest.fn();
    const close = jest.fn();
    const serialize = jest.fn(cb => cb());

    const mockDb = {
      all,
      get,
      run,
      close,
      serialize
    };

    const Database = jest.fn(() => mockDb);

    return {
      verbose: () => ({ Database })
    };
  });
};
