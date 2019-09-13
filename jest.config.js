module.exports = {
  coveragePathIgnorePatterns: ['/node_modules/', '/src/lib/web-examples/'],
  moduleNameMapper: {
    '\\.html$': '<rootDir>/src/setup/jest-html.mock.js',
    '\\.scss$': '<rootDir>/src/setup/jest-scss.mock.js'
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
