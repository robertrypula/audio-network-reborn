module.exports = {
  coveragePathIgnorePatterns: ['/node_modules/', '/src/lib/web-examples/'],
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  }
};
