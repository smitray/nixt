module.exports = {
  preset: 'ts-jest',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@module/(.*)$': '<rootDir>/lib/modules/$1',
    '^@util/(.*)$': '<rootDir>/lib/utils/$1',
    '^@DI': '<rootDir>/lib/mikro-orm.config.ts',
  },
};
