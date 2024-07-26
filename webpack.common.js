const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const tailwindcss = require('tailwindcss');
const autoprefixer = require('autoprefixer');

module.exports = {
    entry: {
        popup: path.resolve('src/popup/index.jsx'),
        options: path.resolve('src/options/index.jsx'),
        background: path.resolve('src/background/background.js'),
        contentScript: path.resolve('src/contentScript/index.jsx'),
        newTab: path.resolve('src/tabs/index.jsx'),
    },
    module: {
        rules: [
            {
                use: 'babel-loader',
                test: /\.jsx?$/,
                exclude: /node_modules/,
                options: {
                    presets: ['@babel/preset-react'],
                },
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: 'postcss-loader', // postcss loader needed for tailwindcss
                        options: {
                            postcssOptions: {
                                ident: 'postcss',
                                plugins: [tailwindcss, autoprefixer],
                            },
                        },
                    },
                ],
            },
            {
                type: 'assets/resource',
                test: /\.(png|jpg|jpeg|gif|woff|woff2|tff|eot|svg)$/,
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: false,
        }),
        new CopyPlugin({
            patterns: [{
                from: path.resolve('src/static'),
                to: path.resolve('dist'),
            }],
        }),
        ...getHtmlPlugins([
            'popup',
            'options',
            'newTab',
        ]),
    ],
    resolve: {
        extensions: ['.jsx', '.js'],
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'dist'),
    },
    optimization: {
        splitChunks: {
            chunks(chunk) {
                return chunk.name !== 'contentScript';
            },
        },
    },
};

function getHtmlPlugins(chunks) {
    return chunks.map(chunk => new HtmlPlugin({
        title: 'React Extension',
        filename: `${chunk}.html`,
        chunks: [chunk],
    }));
}
