module.exports = function (grunt) {
    var _ = require('lodash');
    
    grunt.initConfig({
    
        pkg: grunt.file.readJSON('package.json'),
        
        id: '<%= pkg.name %>-<%= pkg.version %>',
        
        banners: {
            build: '/* <%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %> */',
            dist: [
                '/*\n',
                ' * Silver Ag v<%= pkg.version %>\n',
                ' * https://github.com/markwise/silverag\n',
                ' *\n',
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>, contributers\n',
                ' * Released under the terms of the MIT license\n',
                ' */\n'
            ].join('')
        },
        
        concat: {
            scripts: {
                options: {
                    separator: '\n\n\n',
                    stripBanners: true,
                    process: function (src) {
                        return src.replace(/\s*(['"])use strict\1;\s*/g, '\n    ');
                    }
                },
                src: [
                    'src/scripts/supports_media_queries.js',
                    'src/scripts/generate_agid.js',
                    'src/scripts/key_store.js',
                    'src/scripts/style_sheet.js',
                    'src/scripts/get_layouts.js',
                    'src/scripts/attr_list.js',
                    'src/scripts/layout.js',
                    'src/scripts/layouts.js',
                    'src/scripts/media_match.js',
                    'src/scripts/media_query.js',
                    'src/scripts/content_loaded.js',
                    'src/scripts/initialize.js',
                    'src/scripts/resize.js'
                ],
                dest: '.tmp/concat.js'
            },
            module: {
                options: {
                    banner: '<%= banners.build %>\n\n',
                    separator: '\n\n\n',
                    stripBanners: true,
                    process: function (src) {
                        return src.replace(/@version/, grunt.config.data.pkg.version);
                    }
                },
                src: [
                    'src/scripts/header.js',
                    '<%= concat.scripts.dest %>',
                    'src/scripts/footer.js'
                ],
                dest: 'build/<%= pkg.name %>.js'
            }
        },
    
        indent: {
            scripts: {
                options: {
                    style: 'space',
                    size: 4,
                    change: 1
                },
                src: ['<%= concat.scripts.dest %>'],
                dest: '.tmp/'
            }
        },
        
        clean: {
            tmp: ['.tmp/'],
            scripts: ['build/*.js'],
            styles: ['build/*.css'],
            dist: ['dist/'],
            coverage: ['reports/coverage/']
        },
    
        uglify: {
            dist: {
                options: {
                    banner: '<%= banners.dist %>\n'
                },
                src: 'build/<%= pkg.name %>.js',
                dest: '.tmp/<%= id %>/<%= id %>.min.js'
            }
        },
    
        zip: {
            dist: {
                cwd: '.tmp/',
                src: ['.tmp/<%= id %>/*'],
                dest: 'dist/<%= id %>.zip'
            }
        },
        
        cssmin: {
            dist: {
                options: {
                    banner: '@charset "utf-8";\n\n<%= banners.dist %>'
                },
                files: [
                    {
                        src: ['build/<%= pkg.name %>.css'],
                        dest: '.tmp/<%= id %>/<%= pkg.name %>-<%= pkg.version %>.min.css'
                    }
                ]
            }
        },
       
        sass: {
            build: {
                options: {
                    //banner: '@charset "utf-8";\n\n<%= banners.build %>\n',
                    banner: '<%= banners.build %>\n',
                    style: 'expanded'
                },
                files: [
                    {
                        src: ['src/styles/<%= pkg.name %>.scss'],
                        dest: 'build/<%= pkg.name %>.css'
                    }
                ]
            }
        },
        
        watch: {
            scripts: {
                files: 'src/scripts/**/*.js',
                tasks: ['build:scripts']
            },
            styles: {
                files: 'src/styles/**/*.scss',
                tasks: ['build:styles']
            }
        },
        
        jshint: {
            options: grunt.file.readJSON('.jshintrc'),
            scripts: ['src/scripts/**/*.js'],
            gruntfile: {
                options: {
                    strict: false,
                    browser: false,
                    node: true
                },
                src: ['Gruntfile.js']
            },
            specs: {
                options: {
                    strict: false,
                    jquery: true,
                    globals: {
                        jasmine: false,
                        jasmineEnv: false,
                        describe: false,
                        xdescribe: false,
                        it: false,
                        xit: false,
                        expect: false,
                        beforeEach: false,
                        afterEach: false,
                        spyOn: false,
                        runs: false,
                        waitsFor: false,
                        setFixtures: false
                    }
                },
                src: ['test/specs/**/*.js']
            }
        },
        
        karma: {
            options: {
                frameworks: ['jasmine'],
                files: [
                    'test/vendor/jquery/dist/jquery.js',
                    'test/vendor/jasmine-jquery/lib/jasmine-jquery.js',
                    'test/vendor/sinon/lib/sinon.js',
                    'test/globals.js',
                    //'src/scripts/supports_media_queries.js',
                    //'src/scripts/get_layouts.js',
                    'src/scripts/attr_list.js',
                    //'src/scripts/layout.js',
                    //'src/scripts/layouts.js',
                    //'src/scripts/media_match.js',
                    //'src/scripts/media_query.js',
                    //'src/scripts/content_loaded.js',
                    //'src/scripts/initialize.js',
                    //'test/specs/**/*.js'
                    'test/specs/attr_list_spec.js'
                ],
                //exclude: [
                    //'src/scripts/header.js',
                    //'src/scripts/footer.js'
                //],
                singleRun: true
            },
            unit: {
                options: {
                    browsers: [
                        'PhantomJS',
                        'Chrome',
                        'Safari',
                        'Firefox'
                    ],
                    preprocessors: {
                        'src/scripts/**/*.js': 'coverage'
                    },
                    reporters: [
                        'progress',
                        'coverage'
                    ],
                    coverageReporter: {
                        dir: 'reports/coverage/'
                    }
                }
            },
            ci: {
                options: {
                    browsers: ['PhantomJS'],
                    reporters: ['dots']
                }
            }
        }
    });
    
    
    //Load tasks
    
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-indent');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-zip');
    
    
    //Custom tasks
    
    grunt.registerTask('travis', [
        'jshint',
        'karma:ci'
    ]);
    
    grunt.registerTask('work', ['watch']);
    
    grunt.registerTask('build:scripts', [
        
        //Make sure tmp directory is empty
        'clean:tmp',
        
        //Concatenate scripts and move to tmp directory
        'concat:scripts',
        
        //Indent concatenated scripts so they are indented within the main module
        'indent',
        
        //Remove existing build scripts
        'clean:scripts',
        
        //Concatenate main module and scripts, and move to build directory
        'concat:module',
        
        //Remove tmp files
        'clean:tmp'
    ]);
    
    grunt.registerTask('build:styles', [
        
        //Remove existing build styles
        'clean:styles',
        
        //Compile sass files and move to build directory
        'sass'
    ]);
    
    grunt.registerTask('build', [
        'build:scripts',
        'build:styles'
    ]);
    
    grunt.registerTask('test', [
    
        //Remove existing code coverage output
        'clean:coverage',
        
        //Run JavaScript linter
        'jshint',
        
        //Run Jasmine tests
        'karma:unit'
    ]);
    
    grunt.registerTask('release', [
        
        //Run tests
        'test',
        
        //Make a clean build
        'build',
        
        //Make sure tmp directory is empty
        'clean:tmp',
        
        //Minify build scripts and move to tmp directory
        'uglify',
        
        //Minify build styles and move to tmp directory
        'cssmin',
        
        //Remove existing release files
        'clean:dist',
        
        //Zip tmp files and move to release directory
        'zip',
        
        //Remove tmp files
        'clean:tmp'
    ]);
    
    grunt.registerTask('default', function () {
        grunt.log.write([
            '\nSilver Ag grunt commands:\n\n',
        
            'grunt work\n',
            '    watch scripts and styles for changes and build\n\n',
            
            'grunt build:scripts\n',
            '    concatenate scripts and move to build directory\n\n',
            
            'grunt build:styles\n',
            '    compile sass files and move to build directory\n\n',
            
            'grunt build\n',
            '    build scripts and styles\n\n',
            
            'grunt test\n',
            '    run automation tests\n\n',
            
            'grunt release\n',
            '    run tests, build and minify scripts and styles, zip distribution\n',
            '    files and move to dist directory\n\n'
        ].join(''));
    });
};
