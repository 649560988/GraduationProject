const path = require('path');
const config = require('../config');
const define = Object.entries(config).reduce((def, conf) => {
  def[`process.env.${conf[0]}`] = conf[1];
  return def
}, {});

export default {
  entry: 'src/index.js',
  extraBabelPlugins: [['import', { libraryName: 'antd', libraryDirectory: 'es', style: false }]],
  env: {
    development: {
      extraBabelPlugins: ['dva-hmr'],
    },
  },
  externals: {
    '@antv/data-set': 'DataSet',
    rollbar: 'rollbar',
  },
  alias: {
    components: path.resolve(__dirname, 'src/components/'),
  },
  ignoreMomentLocale: true,
  theme: './src/theme.js',
  html: {
    template: './src/index.ejs',
  },
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  define,
  disableDynamicImport: true,
  publicPath: '/',
  hash: true,
};
