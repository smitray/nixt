import cfg from '..';

describe('Mogodb Config to match DB name', () => {
  test('DB name should match to nixt-test', () => {
    expect(cfg.mongodb.db).toEqual('nixt-test');
  });

  test('Application port should be 6000', () => {
    expect(cfg.port).toEqual(6000);
  });
});
