const relativePaths = () => {
  const basePath = '<rootDir>/src/lib/';
  const paths = require('./tsconfig').compilerOptions.paths;
  const result = {};

  Object.keys(paths).forEach(key =>
    key === '@'
      ? (result['^@$'] = basePath + 'index')
      : (result[key.replace('@', '^@').replace('/*', '(.*)$')] = basePath + paths[key][0].replace('/*', '$1'))
  );

  return result;
};

module.exports = {
  coveragePathIgnorePatterns: ['/node_modules/', '/src/lib/examples/'],
  moduleNameMapper: {
    '\\.html$': '<rootDir>/src/setup/jest-html.mock.js',
    '\\.scss$': '<rootDir>/src/setup/jest-scss.mock.js',
    ...relativePaths()
  },
  testEnvironment: 'node',
  transform: {
    '^.+\\.ts$': 'ts-jest'
  }
};
