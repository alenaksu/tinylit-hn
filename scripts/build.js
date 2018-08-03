const Bundler = require('parcel-bundler');
const argv = require('minimist')(process.argv.slice(2));

process.env.NODE_ENV = argv.p ? 'production' : 'development';

process.on('unhandledRejection', (reason, p) => {
    console.log('Unhandled Rejection at: Promise', p, 'reason:', reason);
});

// manually set up the bundler
const bundler = new Bundler(argv._[0], {
    sourceMaps: !argv.p,
    cache: !argv.p
});

bundler.addAssetType('html', require.resolve('./HTMLAsset'));

argv.w ? bundler.serve(1234, false) : bundler.bundle();
