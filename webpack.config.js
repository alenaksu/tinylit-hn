const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isProduction = process.env.NODE_ENV === 'production';
const publicPath = isProduction ? '' : '';
const outputPath = path.resolve(__dirname, path.join('dist', ''));
const srcPath = path.resolve(__dirname, 'src');

const babelRule = () => ({
    test: /\.js$/,
    exclude: /(node_modules|bower_components)/,
    use: {
        loader: 'babel-loader',
    }
});

const imagesRule = () => ({
    test: /\.(jpe?g|png|gif|svg)$/,
    use: [
        {
            loader: 'file-loader',
            options: {
                publicPath,
                name: '[name].[sha512:hash:8].[ext]',
            },
        },
    ],
});

const esLintRule = () =>
    !isProduction && {
        enforce: 'pre',
        test: /\.js$/,
        include: pkgPath =>
            pkgPath.includes('src/'),
        loader: 'eslint-loader',
    };

const cssLoader = () => ({
    test: /\.css$/,
    use: [
        { loader: "style-loader" },
        { loader: "css-loader" }
    ]
})

const configPlugins = () => {
    let plugins = [
        new CleanWebpackPlugin(['dist']),
        new HtmlWebpackPlugin({
            title: 'Tiny-Lit Hacker News',
            inlineSource: '.css$',
            template: path.join('src', 'index.html')
        }),
        new HtmlWebpackInlineSourcePlugin(),
        new WorkboxPlugin.GenerateSW({
          // these options encourage the ServiceWorkers to get in there fast
          // and not allow any straggling "old" SWs to hang around
          swDest: 'service-worker.js',
          clientsClaim: true,
          skipWaiting: true
        }),
        // extractCSSPlugin,
        isProduction && new UglifyJsPlugin(),
        // !isProduction && new BundleAnalyzerPlugin()
    ].filter(Boolean);

    return plugins;
}

module.exports = {
    entry: './src/index.js',
    module: {
        rules: [
            babelRule(),
            imagesRule(),
            esLintRule(),
            cssLoader()
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: '[name].bundle.js',
        path: outputPath
    },
    plugins: configPlugins()
};
