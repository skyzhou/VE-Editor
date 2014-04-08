module.exports = function(grunt){
	grunt.initConfig({
		pkg:grunt.file.readJSON('package.json'),
		concat:{
            ve: {
                src:['src/editor.js','src/toolbar.js'
                    ,'src/event.js','src/keyboard.js','src/range.js'
                    ,'src/plugins.js','src/mark.js','src/lib/*.js'
                    ,'src/plugins/*.js','src/marks/*.js'],
                template:['src/template/editor.html','src/template/plugins.html'
                    ,'src/template/style.html'],
                dest:'ve.js'
            }
		},
		watch:{
			files:[
                'src/~.js','src/~.tpl'
            ],
			tasks:['concat']
		},
		uglify:{
			options:{
				banner:'/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			ve:{
				src:'ve.js',
				dest:'ve.min.js'
			}
		}
	});
	grunt.loadNpmTasks('grunt-qc-concat');
	grunt.loadNpmTasks('grunt-qc-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('publish',['concat','uglify']);
    grunt.registerTask('default',['concat']);
}