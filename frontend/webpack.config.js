var path = require("path")
var webpack = require('webpack')
var BundleTracker = require('webpack-bundle-tracker')

// yo dawg i heard you like configs so we put a config in yo config so you can
// config when you config.
var ENV_BANK = process.env.BANK;
var DEFS = {};
if (!ENV_BANK || ENV_BANK === "") {
  DEFS.dev = false;
}
else {
  DEFS = JSON.parse(ENV_BANK);
  if (DEFS.dev == undefined) DEFS.dev = false;
}

var config = {
context: path.resolve(__dirname, './src/'),

entry: {
    index:  ['./js/index.js']
},
output: {
    path: path.resolve(__dirname, './frontend/static/'),
    filename: '[name].js', // use entry field name.
    // for hot reload.
    publicPath: DEFS.dev ? 'http://localhost:3000/assets/bundles/' : '/static/',
    library: ['$'], // for inlined JS in HTML.
},


plugins: [
    // no genereta empty output, if errors occur
    new webpack.NoEmitOnErrorsPlugin(),
    // integration with django
    new BundleTracker({filename: "./webpack-stats.json"}),
],

module: {
    rules: [
        {
            test: [/\.js?$/, /\.jsx?$/],
            exclude: /node_modules/,
            loader: 'babel-loader',
            options: {
                presets: ['es2015', 'react', 'stage-0']
            },
            //ignore, couze we have above query and babelrc used by mocha
            // babelrc: false,

        },
        {
            test: /\.(css|sass)$/,
            use: [
                "style-loader",
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1
                    }
                },
                "postcss-loader",
                "sass-loader"
            ]
        }
    ]
},

resolve: {
    modules: ['node_modules', path.join(__dirname, "frontend/src")],
},

}

var plugins = [];
var loaders = [];

// diff between dev & prod.
if (DEFS.dev) {
    loaders.push(
        { // hope that order not does not affect
            test: [/\.js?$/, /\.jsx?$/],
            exclude: /node_modules/,
            loader: 'react-hot'
        }
    );

    config.devtool = 'source-map';
}

else {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: { warnings: false },
            // prevent renaming(mangling) this vars
            mangle: { except: ['$super', '$', 'exports', 'require'] },
            sourceMap: false // on circleCI it's throw error from UglifyJsPlugin
        })
    );
}

config.plugins = config.plugins.concat(plugins);
// prepending, because order is affects
module.exports = config;
