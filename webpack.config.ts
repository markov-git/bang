import * as webpack from 'webpack';
import * as path from 'path';
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
import 'webpack-dev-server';

const isProduction = process.env.NODE_ENV === 'production';

const config: webpack.Configuration = {
	mode: isProduction ? 'production' : 'development',
	entry: './src/index.tsx',
	output: {
		filename: '[name].[contenthash].js',
		path: path.resolve(__dirname, 'dist'),
		clean: true,
	},
	devtool: isProduction ? false : 'inline-source-map',
	devServer: {
		static: './dist',
		client: {
			progress: true,
		},
	},
	resolve: {
		extensions: [
			'.tsx',
			'.ts',
			'.js',
			'.sass'
		]
	},
	module: {
		rules: [
			{
				test: /\.?js(x)?$/,
				exclude: /node_modules/,
				use: {
					loader: "babel-loader",
					options: {
						presets: ['@babel/preset-env', '@babel/preset-react']
					}
				}
			},
			{
				test: /\.module\.sass$/i,
				use: [
					{ loader: "style-loader" },  // to inject the result into the DOM as a style block
					{ loader: "css-loader", options: { modules: true } },  // to convert the resulting CSS to Javascript to be bundled (modules:true to rename CSS classes in output to cryptic identifiers, except if wrapped in a :global(...) pseudo class)
					{ loader: "sass-loader" },  // to convert SASS to CSS
				],
			},
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.?ts(x)?$/,
				exclude: /node_modules/,
				use: {
					loader: "ts-loader",
				}
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './src/index.html',
		}),
	],
	optimization: {
		minimizer: [
			`...`,
			new CssMinimizerPlugin(),
		],
	},
};

export default config;