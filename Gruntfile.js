'use strict';

module.exports = function(grunt){

	var helpers = require('./modules/helpers');

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		project: grunt.file.readJSON('data/project.json'),
		
		paths: {
			app: 'app',
			dist: 'dist',
			tmp: '.tmp'
		},

		jade: {
			app: {
				options: {
					pretty: true,
					data: function(dest, src){
						return helpers.jade(dest, src);
					}
				},
				files: [{
					expand: true,
					cwd: '<%= paths.app %>/',
					src: '**/*.html.jade',
					dest: '<%= paths.tmp %>',
					ext: '.html'
				}]
			}
		},

		useminPrepare: {
            options: {
                dest: '<%= paths.dist %>',
                flow: {
                	steps: {'js': ['concat']},
                	post: []
                }
            },
            html: '<%= paths.tmp %>/foo.html'
        },

        usemin: {
            options: {
                assetsDirs: ['<%= paths.dist %>/']
            },
            html: ['<%= paths.tmp %>/{,*/}*.html'],
            css: ['<%= paths.tmp %>/styles/{,*/}*.css']
        }

	});

	grunt.config('helpers', helpers(grunt));

	grunt.loadNpmTasks('grunt-contrib-jade');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-usemin');

	grunt.registerTask('build', [
		'jade',
        'useminPrepare',
        'concat',
        'usemin'
    ]);

};