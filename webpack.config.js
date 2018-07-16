const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

function isProduction() {
    return process.env.NODE_ENV === 'production';
}

const babelRule = options => ({
    test: /\.js$/,

    use: {
        loader: 'babel-loader',
        options: merge({
            plugins: [["transform-class-properties", { "spec": true }]],
        }, options)
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
    !isProduction() && {
        enforce: 'pre',
        test: /\.js$/,
        include: pkgPath =>
            pkgPath.includes('src/'),
        loader: 'eslint-loader',
    };

const publicPath = isProduction() ? 'static/' : '';
const outputPath = path.resolve(__dirname, path.join('public', 'static'));
const srcPath = path.resolve(__dirname, 'src');

const configPlugins = () => {
    let plugins = [
        new HtmlWebpackPlugin({
            title: '',
            // Load a custom template (lodash by default see the FAQ for details)
            csrfToken: isProduction() ? '<?php echo json_encode($csrfToken); ?>' : '{}',
            template: 'src/index.html',
            filename: isProduction() ? '../../app/templates/index.phtml' : 'index.html'
        }),
        htmlModuleScriptPlugin,
        extractCSSPlugin,
    ];

    if (isProduction()) {
        plugins.push(new UglifyJsPlugin());
    } else {
        plugins.push(new BundleAnalyzerPlugin());
    }

    return plugins;
}

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ]
};