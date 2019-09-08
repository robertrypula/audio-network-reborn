module.exports = {
  coveragePathIgnorePatterns: ['/node_modules/', '/src/lib/web-examples/'],
  moduleNameMapper: {
    '\\.scss$': '<rootDir>/jest-scss.mock.js'
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
