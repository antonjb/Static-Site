/* jshint node:true */
'use strict';

module.exports = function(grunt){

	var helpers = require('./modules/helpers');

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),
		project: grunt.file.readJSON('data/project.json'),
		
		paths: {
			// Top level
			app: 'app',
			dist: 'dist',
			tmp: '.tmp',
			// Media Folders
			shared: 'shared',
			js: '<%= paths.shared %>/js',
			css: '<%= paths.shared %>/css',
			img: '<%= paths.shared %>/images',
			font: '<%= paths.shared %>/fonts'
		},


		// Jade target
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


		// Compass target
		compass: {
			options: {
				sassDir: '<%= paths.app %>/<%= paths.css %>',
				cssDir: '<%= paths.tmp %>/<%= paths.css %>',
				imagesDir: '<%= paths.app %>/<%= paths.img %>',
				javascriptsDir: '<%= paths.app %>/<%= paths.js %>',
				fontsDir: '<%= paths.app %>/<%= paths.font %>',
				generatedImagesDir: '<%= paths.tmp %>/<%= paths.img %>',
				relativeAssets: true,
				assetCacheBuster: false
			},
			dev: {
				options: {
					debugInfo: true
				}
			},
			build: {
				options: {
					cssDir:'<%= paths.dist %>/<%= paths.css %>',
					environment: 'production',
					outputStyle: 'compressed'
				}
			}
		},


		// JSHint target
		jshint: {
			// Manually load .jshintrc so options can be overridden
			options: grunt.file.readJSON('.jshintrc'),
			dev: {
				// Allow `console` in dev
				options: {devel: true},
				src: [
					'Gruntfile.js',
					'<%= paths.app %>/<%= paths.js %>'
				]},
			build: '<%= jshint.dev.src %>'
		},


		// usemin target
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
	grunt.loadNpmTasks('grunt-contrib-compass');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-usemin');

	grunt.registerTask('build', [
		'jade',
		'compass:build',
        'useminPrepare',
        'concat',
        'usemin'
    ]);

};