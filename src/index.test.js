import jest from 'jest';

describe('Index', () => {
  beforeAll(() => {
    return new Promise(resolve => {
      // console.log('before all');
      resolve();
    });
  });

  it('should initialize the test suite', () => {
    const isInitialized = true;
    expect(isInitialized).toEqual(true);
  });
});
