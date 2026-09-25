module.exports = {
	runtimeCompiler: true,
	
	chainWebpack: config => {
		config
			.plugin('html')
			.tap(args => {
				args[0].title = 'Plataforma Electoral 2026'
				return args
			})
	},
	
}
