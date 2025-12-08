const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, 'dist'),
    clean: true,
    ...(process.env.NODE_ENV !== 'production' && {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    }),
  },
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: ['./src/assets'],
      optimization: true,
      outputHashing: 'none',
      generatePackageJson: true,
      sourceMaps: true,
    }),
  ],
  ignoreWarnings: [
    {
      module: /sequelize-typescript/,
      message:
        /Critical dependency: the request of a dependency is an expression/,
    },
  ],
  // this to prevent webpack from bundling pg
  externals: {
    pg: 'commonjs pg',
    'pg-hstore': 'commonjs pg-hstore',
    'pg-native': 'commonjs pg-native',
  },
};
