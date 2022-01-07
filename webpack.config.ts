import * as webpack from 'webpack';
import * as path from 'path';
import 'webpack-dev-server';

const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const ESLintPlugin = require('eslint-webpack-plugin');
import { getScopedName } from './webpack.utils';

const isProduction = process.env.NODE_ENV === 'production';

const styleLoader = isProduction
	? MiniCssExtractPlugin.loader
	: 'style-loader';

const config: webpack.Configuration = {
	mode: isProduction ? 'production' : 'development',
	entry: './src/index.tsx',
	output: {
		filename: '[contenthash].js',
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
					styleLoader,  // to inject the result into the DOM as a style block
					{
						loader: "css-loader",
						options: {
							modules: {
								...(isProduction ? {
									getLocalIdent: (context: Record<string, string>, _: unknown, localName: string) => (
										getScopedName(localName, context.resourcePath)
									),
								} : {
									localIdentName: '[path]_[name]_[local]',
								})
							},
							sourceMap: !isProduction,
						}
					},  // to convert the resulting CSS to Javascript to be bundled (modules:true to rename CSS classes in output to cryptic identifiers, except if wrapped in a :global(...) pseudo class)
					{
						loader: "sass-loader",
						options: {
							sourceMap: !isProduction
						}
					},  // to convert SASS to CSS
				],
			},
			{
				test: /\.css$/i,
				use: [styleLoader, "css-loader", "sass-loader"],
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
		new ESLintPlugin({
			context: './src/',
			extensions: ['ts', 'tsx'],
		}),
		...(isProduction ? [new MiniCssExtractPlugin({
			filename: '[contenthash].css',
			chunkFilename: '[contenthash].css',
		})] : []),
	],
	optimization: {
		minimize: isProduction,
		minimizer: [
			`...`,
			new CssMinimizerPlugin(),
		],
	},
	performance: {
		hints: false,
		maxEntrypointSize: 512_000,
		maxAssetSize: 512_000,
	},
};

export default config;