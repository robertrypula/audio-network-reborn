module.exports = {
  coveragePathIgnorePatterns: ['/node_modules/', '/src/lib/web-examples/'],
  moduleNameMapper: {
    '\\.html$': '<rootDir>/jest-html.mock.js',
    '\\.scss$': '<rootDir>/jest-scss.mock.js'
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
