/* jshint node:true */
'use strict';

module.exports = function(grunt){

    var _ = require('lodash');
    var helpers = require('./modules/helpers');

    // Automatically load all grunt tasks
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        project: grunt.file.readJSON('data/project.json'),
        
        paths: {
            // Top level
            source: 'source',
            build: 'build',
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
            options: {
                data: function(dest, src){
                    return helpers.jade(dest, src);
                }
            },
            dev: {
                options: {
                    pretty: true
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.source %>/',
                    src: '**/*.html.jade',
                    dest: '<%= paths.tmp %>',
                    ext: '.html'
                }]
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.source %>/',
                    src: '**/*.html.jade',
                    dest: '<%= paths.build %>',
                    ext: '.html'
                }]
            }
        },


        // Compass target
        compass: {
            options: {
                sassDir: '<%= paths.source %>/<%= paths.css %>',
                cssDir: '<%= paths.tmp %>/<%= paths.css %>',
                imagesDir: '<%= paths.source %>/<%= paths.img %>',
                javascriptsDir: '<%= paths.source %>/<%= paths.js %>',
                fontsDir: '<%= paths.source %>/<%= paths.font %>',
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
                    cssDir:'<%= paths.build %>/<%= paths.css %>',
                    environment: 'production',
                    outputStyle: 'compressed'
                }
            }
        },


        // JSHint target
        jshint: {
            // Manually load .jshintrc so options can be overridden
            options: _.extend({reporter: require('jshint-stylish')}, grunt.file.readJSON('.jshintrc')),
            dev: {
                // Allow `console` in dev
                options: {devel: true},
                src: [
                    'Gruntfile.js',
                    '<%= paths.source %>/<%= paths.js %>/{,*/}*.js',
                    '!<%= paths.source %>/<%= paths.js %>/vendor/*',
                    'test/{,*/}*_spec.js'
                ]
            },
            build: ['<%= jshint.dev.src %>',
                    '!test/{,*/}*_spec.js']
        },


        // Jasmine target
        jasmine: {
            test: {
                src: '<%= paths.source %>/<%= paths.js %>/{,*/}*.js',
                options: {
                    specs: 'test/{,*/}*_spec.js',
                    vendor: '<%= paths.source %>/<%= paths.js %>/vendor/'
                }
            }
        },


        // Watch target
        watch: {
            jade: {
                files: '<%= paths.source %>/**/*.jade',
                tasks: ['jade:dev']
            },
            grunt: {
                files: 'Gruntfile.js'
            },
            js: {
                files: '<%= paths.source %>/<%= paths.js %>/{,*/}*.js',
                tasks: ['jshint:dev'],
                options: {
                    livereload: true
                }
            },
            test: {
                files: ['<%= paths.source %>/<%= paths.js %>/{,*/}*.js',
                        'test/{,*/}*_spec.js'],
                tasks: ['jshint:dev', 'jasmine']
            },
            compass: {
                files: '<%= paths.source %>/<%= paths.css %>/{,*/}*.{sass,scss}',
                tasks: ['compass:dev']
            },
            livereload:{
                options: {
                    livereload: true
                },
                files: [
                    '<%= paths.tmp %>/**/*.html',
                    '<%= paths.tmp %>/<%= paths.css %>/{,*/}*.css',
                    '<%= paths.source %>/<%= paths.img %>/{,*/}*.{gif,jpeg,jpg,png,svg,webp}'
                ]
            }
        },


        // Server target
        connect: {
            options: {
                port: 4567,
                livereload: 35729, // Default port
                hostname: 'localhost'
            },
            dev: {
                options: {
                    open: true,
                    base: ['<%= paths.tmp %>',
                           '<%= paths.source %>']

                }
            }
        },


        // Clean target
        clean : {
            build: '<%= paths.build %>/*',
            dev: '<%= paths.tmp %>'
        },


        // Concurrent target
        concurrent: {
            dev: [
                'compass:dev',
                'jade:dev'
            ]
        },


        // usemin target
        useminPrepare: {
            options: {
                dest: '<%= paths.build %>',
                flow: {
                    steps: {'js': ['concat']},
                    post: []
                }
            },
            html: '<%= paths.tmp %>/foo.html'
        },

        usemin: {
            options: {
                assetsDirs: ['<%= paths.build %>/']
            },
            html: ['<%= paths.tmp %>/{,*/}*.html'],
            css: ['<%= paths.tmp %>/styles/{,*/}*.css']
        }

    });

    // Init the helpers module
    grunt.config('helpers', helpers(grunt));

    // Task when developing
    grunt.registerTask('dev', function(){
        grunt.task.run([
            'concurrent:dev',
            'connect:dev',
            'watch'
        ]);
    });

    // Task for building
    grunt.registerTask('build', [
        'jade:build',
        'compass:build',
        'useminPrepare',
        'concat',
        'usemin'
    ]);

};