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
            media: '<%= paths.shared %>/media',
            // tmp
            tImg: '<%= paths.tmp %>/<%= paths.img %>',
            tFont: '<%= paths.tmp %>/<%= paths.font %>',
            tJs: '<%= paths.tmp %>/<%= paths.js %>',
            tCss: '<%= paths.tmp %>/<%= paths.css %>',
            // source
            sImg: '<%= paths.source %>/<%= paths.img %>',
            sFont: '<%= paths.source %>/<%= paths.font %>',
            sJs: '<%= paths.source %>/<%= paths.js %>',
            sCss: '<%= paths.source %>/<%= paths.css %>',
            // build
            bImg: '<%= paths.build %>/<%= paths.img %>',
            bFont: '<%= paths.build %>/<%= paths.font %>',
            bJs: '<%= paths.build %>/<%= paths.js %>',
            bCss: '<%= paths.build %>/<%= paths.css %>'
        },


        // Symlink target
        symlink: {
            options: {
                overwrite: false
            },
            shared: {
                src: '<%= paths.sImg %>',
                dest: '<%= paths.tImg %>'
            },
            font: {
                src: '<%= paths.sFont %>',
                dest: '<%= paths.tFont %>'
            },
            js: {
                src: '<%= paths.sJs %>',
                dest: '<%= paths.tJs %>'
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
                sassDir: '<%= paths.sCss %>',
                cssDir: '<%= paths.tCss %>',
                imagesDir: '<%= paths.tImg %>',
                javascriptsDir: '<%= paths.tJs %>',
                fontsDir: '<%= paths.tFont %>',
                generatedImagesDir: '<%= paths.tImg %>',
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
                    cssDir: '<%= paths.bCss %>',
                    imagesDir: '<%= paths.bImg %>',
                    javascriptsDir: '<%= paths.bJs %>',
                    fontsDir: '<%= paths.bFont %>',
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
                    '<%= paths.sJs %>/{,*/}*.js',
                    '!<%= paths.sJs %>/vendor/*',
                    'test/{,*/}*_spec.js'
                ]
            },
            build: ['<%= jshint.dev.src %>',
                    '!test/{,*/}*_spec.js']
        },


        // Jasmine target
        jasmine: {
            test: {
                src: ['<%= paths.sJs %>/{,*/}*.js', '!<%= jasmine.test.options.vendor %>'],
                options: {
                    specs: 'test/{,*/}*_spec.js',
                    vendor: '<%= paths.sJs %>/vendor/*.js'
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
                files: '<%= paths.sJs %>/{,*/}*.js',
                tasks: ['jshint:dev'],
                options: {
                    livereload: true
                }
            },
            test: {
                files: ['<%= paths.sJs %>/{,*/}*.js',
                        'test/{,*/}*_spec.js'],
                tasks: ['jasmine']
            },
            compass: {
                files: '<%= paths.sCss %>/{,*/}*.{sass,scss}',
                tasks: ['compass:dev']
            },
            livereload:{
                options: {
                    livereload: true
                },
                files: [
                    '<%= paths.tmp %>/**/*.html',
                    '<%= paths.tCss %>/{,*/}*.css',
                    '<%= paths.sImg %>/{,*/}*.{gif,jpeg,jpg,png,svg,webp}'
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