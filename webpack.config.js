// External dependencies.
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const WebpackNotifierPlugin = require( 'webpack-notifier' );
const { Compilation, sources } = require( 'webpack' );

/**
 * Declaration Bundler Plugin.
 *
 * Bundles all TypeScript declaration files.
 */
class DeclarationBundlerPlugin {
	constructor( options ) {
		this.options = options || {};
		this.out = this.options.out || './dist/declarations.d.ts';
		this.excludedReferences = this.options.excludedReferences || undefined;
	}

	apply( compiler ) {
		compiler.hooks.thisCompilation.tap( 'DeclarationBundlerPlugin', ( compilation ) => {
			compilation.hooks.processAssets.tapPromise(
				{
					name: 'DeclarationBundlerPlugin',
					stage: Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
				},
				async ( assets ) => {
					const declarationFiles = {};
					for ( const filename in assets ) {
						if ( filename.endsWith( '.d.ts' ) ) {
							if ( ! filename.includes( 'index.d.ts' ) ) {
								declarationFiles[ filename ] = assets[ filename ];
							}
							delete assets[ filename ];
						}
					}
					const combinedDeclaration = this.generateCombinedDeclaration( declarationFiles );
					compilation.emitAsset( this.out, new sources.RawSource( combinedDeclaration ) );
				}
			);
		} );
	}

	generateCombinedDeclaration( declarationFiles ) {
		let declarations = '';
		for ( const fileName in declarationFiles ) {
			const declarationFile = declarationFiles[ fileName ];
			const data = declarationFile.source();
			const lines = data.split( '\n' );
			for ( let i = 0; i < lines.length; i++ ) {
				const line = lines[ i ];
				if (
					line !== '' &&
					line.indexOf('export =' ) === -1 &&
					! ( /import ([a-z0-9A-Z_-]+) = require\(/ ).test( line ) &&
					( ! this.excludedReferences || line.indexOf('<reference' ) === -1 || ! this.excludedReferences.some( ( reference ) => line.indexOf( reference ) !== -1 ) )
				) {
					if ( line.indexOf('declare ' ) !== -1 ) {
						lines[ i ] = line.replace('declare ', '' );
					}
					lines[ i ] = lines[ i ];
				} else {
					lines.splice( i, 1 );
					i--;
				}
			}
			declarations += lines.join( '\n' ) + '\n\n';
		}
		return declarations;
	}
}

/**
 * Webpack Configuration.
 */

module.exports = ( env ) => {
	// Build configuration.
	const buildConfig = {
		entry: {
			modal: './src/modal/index.ts',
			slider: './src/slider/index.ts',
			form: './src/form/index.ts',
		},
		module: {
			rules: [
				{
					test: /\.tsx?$/,
					use: 'ts-loader',
					exclude: /node_modules/,
				},
				{
					test: /\.(sa|sc|c)ss$/,
					use: [
						MiniCssExtractPlugin.loader,
						{
							loader: 'css-loader',
							options: {
								url: false,
								sourceMap: false,
							},
						},
						{
							loader: 'postcss-loader',
						},
						{
							loader: 'sass-loader',
							options: {
								sassOptions: {
									outputStyle: 'compressed',
								},
							},
						},
					],
				},
			],
		},
		resolve: {
			extensions: [ '.scss', '.ts' ],
		},
		output: {
			path: __dirname,
			filename: `dist/[name]/index.js`,
			publicPath: '/',
		},
		plugins: [
			new MiniCssExtractPlugin( {
				filename: `dist/[name]/style.css`,
			} ),
			new DeclarationBundlerPlugin( {
				out: 'dist/declarations.d.ts',
			} ),
		],
		performance: {
			hints: false,
		},
		devtool: 'source-map',
	};

	// Development environment.
	if ( 'development' in env ) {
		buildConfig.plugins.push( new WebpackNotifierPlugin( {
			title: 'Build',
			alwaysNotify: true,
		} ) );
	}

	// Return config.
	return [ buildConfig ];
};
