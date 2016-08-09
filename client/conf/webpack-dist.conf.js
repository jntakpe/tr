const webpack = require('webpack');
const conf = require('./gulp.conf');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const SplitByPathPlugin = require('webpack-split-by-path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const autoprefixer = require('autoprefixer');

module.exports = {
    module: {
        loaders: [
            {
                test: /.json$/,
                loaders: [
                    'json'
                ]
            },
            {
                test: /\.(css|scss)$/,
                loaders: ExtractTextPlugin.extract('style', 'css?minimize!sass', 'postcss')
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                loaders: [
                    'ts'
                ]
            },
            {
                test: /.html$/,
                loaders: [
                    'html'
                ]
            }
        ]
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new HtmlWebpackPlugin({
            template: conf.path.src('index.html'),
            inject: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': '"production"'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {unused: true, dead_code: true} // eslint-disable-line camelcase
        }),
        new SplitByPathPlugin([{
            name: 'vendor',
            path: path.join(__dirname, '../node_modules')
        }]),
        new ExtractTextPlugin('/index-[contenthash].css')
    ],
    postcss: () => [autoprefixer],
    output: {
        path: path.join(process.cwd(), conf.paths.dist),
        filename: '[name]-[hash].js'
    },
    resolve: {
        extensions: [
            '',
            '.webpack.js',
            '.web.js',
            '.js',
            '.ts'
        ]
    },
    entry: {
        app: `./${conf.path.src('index')}`
    },
    ts: {
        configFileName: 'conf/ts.conf.json'
    },
    tslint: {
        configuration: require('../tslint.json')
    }
};
