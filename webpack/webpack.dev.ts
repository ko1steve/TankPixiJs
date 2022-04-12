import * as Path from 'path';
import * as Merge from 'webpack-merge';
import * as Common from './webpack.common';
import * as CopyWebpackPlugin from 'copy-webpack-plugin';

const appDir = Path.dirname( __dirname );

module.exports = Merge( Common, {
	output: {
		path: Path.join( __dirname, './../dist' )
	},
	devtool: 'inline-source-map',
	mode: 'development',

	devServer: {
		contentBase: Path.join( appDir, '../src' ),

		port: 8018,

		host: '127.0.0.1',

		hot: true
	},
	plugins: [

		new CopyWebpackPlugin( [ {
			from: Path.resolve( appDir, 'assets/' ),
			to: 'assets/',
			force: true
		} ] ),
	]
} );