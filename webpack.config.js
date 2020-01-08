const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const packageJson = require('./package.json');
const libraryName = packageJson.name
  .toLowerCase()
  .split('-')
  .map(chunk => chunk.charAt(0).toUpperCase() + chunk.slice(1))
  .join('');

const relativePaths = () => {
  const paths = require('./tsconfig').compilerOptions.paths;
  const getFullPath = lastPart => path.join(__dirname, 'src/lib', lastPart);
  const result = {};

  Object.keys(paths).forEach(key =>
    key === '@'
      ? (result['@'] = getFullPath('index'))
      : (result[key.replace('/*', '')] = getFullPath(paths[key][0].replace('/*', '')))
  );

  return result;
};

function getConfig(env) {
  return {
    entry: { [`${packageJson.name}-v${packageJson.version}`]: './src/lib/index.ts' },
    module: {
      rules: [
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                minimize: env.PRODUCTION
              }
            }
          ]
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: path.resolve('src/setup/webpack-style-loader.js'), // creates 'style' html tag from JS strings
              options: { rootElementId: `${packageJson.name}-root` }
            },
            'css-loader', // translates CSS into CommonJS
            'sass-loader' // compiles Sass to CSS
          ]
        },
        { test: /\.ts$/, use: 'ts-loader', exclude: /node_modules/ }
      ]
    },
    output: {
      filename: '[name].js',
      globalObject: 'this',
      library: libraryName,
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist')
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        hash: true,
        minify: false,
        template: './src/index.html'
      }),
      new webpack.DefinePlugin({
        DEVELOPMENT: JSON.stringify(env.DEVELOPMENT === true),
        PRODUCTION: JSON.stringify(env.PRODUCTION === true)
      })
    ],
    resolve: {
      alias: { ...relativePaths() },
      extensions: ['.ts', '.js']
    },
    target: 'web'
  };
}

function fillDev(config) {
  config.devServer = {
    compress: true,
    contentBase: path.resolve(__dirname), // TODO probably not needed
    hot: false,
    openPage: 'dist/index.html',
    overlay: { warnings: true, errors: true },
    port: 8000,
    publicPath: '/dist/'
  };
  config.devtool = 'inline-source-map';
  config.mode = 'development';
}

function fillProd(config, env) {
  config.mode = 'production';
  env.ANALYZER && config.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = env => {
  const config = getConfig(env);

  if (env.DEVELOPMENT === true) {
    fillDev(config);
  } else if (env.PRODUCTION === true) {
    fillProd(config, env);
  } else {
    throw 'Please set the environment!';
  }

  return config;
};
