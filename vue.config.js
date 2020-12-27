const IS_PROD = ['production', 'prod'].includes(process.env.NODE_ENV);
 
module.exports = {
	publicPath: './', // 默认'/'，部署应用包时的基本 URL
	outputDir: process.env.outputDir || 'dist', // 'dist', 生产环境构建文件的目录
	assetsDir: '',  // 相对于outputDir的静态资源(js、css、img、fonts)目录
	lintOnSave: false,
	runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
	productionSourceMap: false,  // 生产环境的 source map
    filenameHashing: false,
	parallel: require('os').cpus().length > 1,
	chainWebpack: config => {//资源打包
		const svgRule = config.module.rule('svg');
		// 清除已有的所有 loader。
		// 如果你不这样做，接下来的 loader 会附加在该规则现有的 loader 之后。
		svgRule.uses.clear();
		
		config.module
		.rule('images')
		.test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
		.use('url-loader')
		.loader('url-loader')
		.tap(options => Object.assign(options, {limit: 614400 }));//小于这个体积的资源全打进js

	},
	css: {
		// 当为true时，css文件名可省略 module 默认为 false
		modules: true,
		// 是否将组件中的 CSS 提取至一个独立的 CSS 文件中,当作为一个库构建时，你也可以将其设置为 false 免得用户自己导入 CSS
		// 默认生产环境下是 true，开发环境下是 false
		extract: false,
		// 是否为 CSS 开启 source map。设置为 true 之后可能会影响构建的性能
		sourceMap: false,
		//向 CSS 相关的 loader 传递选项(支持 css-loader postcss-loader sass-loader less-loader stylus-loader)
		loaderOptions: {
			css: {
				
			},
			less: {}
		}
	},
	pwa: {},
	//下面就是压缩了  最后全部成一个js  不然会出现两个js
	configureWebpack: (config) => {
		//  引入uglifyjs-webpack-plugin
		let UglifyPlugin = require('uglifyjs-webpack-plugin');
		
		if (process.env.NODE_ENV == 'production') {
		// 为生产环境修改配置
		config.mode = 'production'
		// 将每个依赖包打包成单独的js文件
		let optimization = {
			minimizer: [new UglifyPlugin({
				uglifyOptions: {
					warnings: false,
					compress: {
						drop_console: true, 
						drop_debugger: false,
						pure_funcs: ['console.log'] 
					},
					output:{
						// 去掉注释内容
						comments: false,
					}
				}
			})]
		}
		Object.assign(config, {
			optimization
		})
		} else {
		// 为开发环境修改配置
		config.mode = 'development'
		}
	}
};
