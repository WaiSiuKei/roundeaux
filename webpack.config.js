const webpack = require('webpack');
const path = require('path');

const nodeEnv = process.env.NODE_ENV || 'development';
const isProd = nodeEnv === 'production';

const sourcePath = path.join(__dirname, './example');
const staticsPath = path.join(__dirname, './static');

const plugins = [
    new webpack.optimize.CommonsChunkPlugin({
        name: 'vendor',
        minChunks: Infinity,
        filename: 'vendor.bundle.js'
    }),
    new webpack.DefinePlugin({
        'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
    }),
    new webpack.NamedModulesPlugin(),
    new webpack.ContextReplacementPlugin(/.*/, path.resolve(__dirname, 'node_modules', 'jsondiffpatch'), {
        '../package.json': './package.json',
        './formatters': './src/formatters/index.js',
        './console': './src/formatters/console.js'
    })
];

if (isProd) {
    plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                screw_ie8: true,
                conditionals: true,
                unused: true,
                comparisons: true,
                sequences: true,
                dead_code: true,
                evaluate: true,
                if_return: true,
                join_vars: true,
            },
            output: {
                comments: false
            },
        })
    );
} else {
    plugins.push(
        new webpack.HotModuleReplacementPlugin()
    );
}

module.exports = {
    devtool: isProd ? 'source-map' : 'eval',
    context: sourcePath,
    entry: {
        js: './index.js',
        vendor: ['react']
    },
    output: {
        path: staticsPath,
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            { test: /\.json$/, loader: "json-loader" },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
        modules: [
            path.resolve(__dirname, 'node_modules'),
            sourcePath
        ],
        alias: {
            logger: path.resolve(__dirname, 'client/')
        }
    },
    plugins,
    devServer: {
        contentBase: './example',
        historyApiFallback: true,
        port: 3000,
        compress: isProd,
        inline: !isProd,
        hot: !isProd,
        stats: {
            assets: true,
            children: false,
            chunks: false,
            hash: false,
            modules: false,
            publicPath: false,
            timings: true,
            version: false,
            warnings: true,
            colors: {
                green: '\u001b[32m',
            }
        },
    }
};
