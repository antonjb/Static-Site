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
            font: '<%= paths.shared %>/fonts',
            media: '<%= paths.shared %>/media'
        },


        // Symlink target
        symlink: {
            options: {
                overwrite: false
            },
            shared: {
                src: '<%= paths.source %>/<%= paths.img %>',
                dest: '<%= paths.tmp %>/<%= paths.img %>'
            },
            font: {
                src: '<%= paths.source %>/<%= paths.font %>',
                dest: '<%= paths.tmp %>/<%= paths.font %>'
            },
            js: {
                src: '<%= paths.source %>/<%= paths.js %>',
                dest: '<%= paths.tmp %>/<%= paths.js %>'
            }
        },


        // Jade target
        jade: {
            options: {
                pretty: true,
                data: function(dest, src){
                    return helpers.jade(dest, src);
                }
            },
            dev: {
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
                imagesDir: '<%= paths.tmp %>/<%= paths.img %>',
                javascriptsDir: '<%= paths.tmp %>/<%= paths.js %>',
                fontsDir: '<%= paths.tmp %>/<%= paths.font %>',
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
                    imagesDir: '<%= paths.build %>/<%= paths.img %>',
                    javascriptsDir: '<%= paths.build %>/<%= paths.js %>',
                    fontsDir: '<%= paths.build %>/<%= paths.font %>',
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
                hostname: '0.0.0.0'
            },
            dev: {
                options: {
                    open: true,
                    base: ['<%= paths.tmp %>',
                           'node_modules/',
                           '<%= paths.source %>']

                }
            }
        },


        // Clean target
        clean: {
            build: ['<%= paths.build %>/*', './build.zip'],
            dev: '<%= paths.tmp %>'
        },


        // Copy target
        copy: {
            media: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.source %>',
                    dest: '<%= paths.build %>',
                    src: [
                        '<%= paths.img %>/{,*/}*.{gif,jpeg,jpg,png,svg,webp}',
                        '<%= paths.font %>/{,*/}*.*',
                        '<%= paths.media %>/{,*/}*.*'
                    ]
                }]
            },
            vendor: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.source %>',
                    dest: '<%= paths.build %>',
                    src: '<%= paths.js %>/vendor/*.*'
                }]
            }
        },


        // imagemin target
        imagemin: {
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.source %>',
                    dest: '<%= paths.build %>',
                    src: '<%= paths.img %>/{,*/}*.{gif,jpeg,jpg,png}'
                }]
            }
        },


        // uglify target
        uglify: {
            options: {
                preserveComments: 'some'
            }
        },


        // Concurrent target
        concurrent: {
            dev: [
                'compass:dev',
                'jade:dev'
            ],
            build: [
                'jade:build',
                'compass:build',
                'imagemin'
            ]
        },


        // usemin target
        useminPrepare: {
            options: {
                dest: '<%= paths.build %>',
                root: '<%= paths.source %>',
                flow: {
                    steps: {'js': ['uglifyjs']},
                    post: {}
                }
            },
            html: '<%= paths.build %>/**/*.html'
        },

        usemin: {
            options: {
                assetsDirs: ['<%= paths.build %>']
            },
            html: ['<%= paths.build %>/{,*/}*.html']
        },


        // compress target
        compress: {
            build: {
                options: {
                    archive: 'build.zip',
                    mode: 'zip'
                },
                files: [{src: './build/**'}]
            }
        }

    });

    // Init the helpers module
    grunt.config('helpers', helpers(grunt));

    // Task when developing
    grunt.registerTask('dev', function(){
        grunt.task.run([
            'clean:dev',
            'symlink',
            'concurrent:dev',
            'connect:dev',
            'watch'
        ]);
    });

    // Task for building
    grunt.registerTask('build', [
        'symlink',
        'clean:build',
        'copy',
        'concurrent:build',
        'useminPrepare',
        'uglify',
        'usemin',
        'compress'
    ]);

};