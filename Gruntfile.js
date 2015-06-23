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
                    sourcemap: true
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
            gruntfile: 'Gruntfile.js',
            dev: {
                // Allow `console` in dev
                options: {devel: true},
                src: [
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
                options: {
                    specs: '<%= browserify.jasmine.dest %>',
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
                files: 'Gruntfile.js',
                tasks: ['jshint:gruntfile']
            },
            js: {
                options: { livereload: true },
                files: ['<%= paths.sJs %>/{,*/}*.js', 'test/{,*/}*_spec.js'],
                tasks: ['jshint:dev', 'browserify:jasmine','jasmine:test', 'useBrowserify:dev', 'browserify:dev']
            },
            compass: {
                files: '<%= paths.sCss %>/{,*/}*.{sass,scss}',
                tasks: ['compass:dev']
            },
            livereload:{
                options: { livereload: true },
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
            all: {
                files:[{
                    expand: true,
                    filter: 'isFile',
                    cwd: '<%= paths.source %>',
                    dest: '<%= paths.build %>',
                    src: ['**/*',
                          '!**/*.{js,scss,sass,jade,gif,jpeg,jpg,png}',
                          '<%= paths.js %>/vendor/jquery*.min.js',
                          '<%= paths.js %>/vendor/modernizr*.min.js',
                          '!.gitkeep']
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


        // Browserify target
        browserify: {
            jasmine: {
                options: {
                    browserifyOptions: {
                        debug: true
                    }
                },
                src: 'test/*_spec.js',
                dest: 'test/browserifyspec.js'
            }
        },


        // useBrowserify target
        useBrowserify: {
            options: {
                root: '<%= paths.source %>'
            },
            dev: {
                options: {
                    dest: '<%= paths.tmp %>',
                    taskOptions: {
                        browserifyOptions: {
                            debug: true
                        }
                    }
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.tmp %>',
                    src: '**/*.html'
                }]
            },
            build: {
                options: {
                    dest: '<%= paths.build %>'
                },
                files: [{
                    expand: true,
                    cwd: '<%= paths.build %>',
                    src: '**/*.html'
                }]
            }
        },


        // uglify target
        uglify: {
            options: {
                preserveComments: 'some'
            },
            build: {
                files: [{
                    expand: true,
                    cwd: '<%= paths.bJs %>',
                    src: ['**/*.js', '!vendor/*.js'],
                    dest: '<%= paths.bJs %>'
                }]
            }
        },


        // Concurrent target
        concurrent: {
            dev: [
                'compass:dev',
                'jade:dev',
            ],
            build: [
                'jade:build',
                'compass:build',
                'imagemin'
            ]
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
    require('./modules/usebrowserify.js')(grunt);

    // Task when developing
    grunt.registerTask('dev', function(){
        grunt.task.run([
            'clean:dev',
            'concurrent:dev',
            'useBrowserify:dev',
            'browserify:dev',
            'connect:dev',
            'watch'
        ]);
    });

    // Task for building
    grunt.registerTask('build', [
        'clean:build',
        'copy',
        'concurrent:build',
        'useBrowserify:build',
        'browserify:build',
        'uglify:build',
        'compress'
    ]);

};