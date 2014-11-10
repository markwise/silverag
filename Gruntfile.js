module.exports = function (grunt) {
    grunt.initConfig({
    
        pkg: grunt.file.readJSON('package.json'),
        
        names: {
            dist: '<%= pkg.name %>-<%= pkg.version %>',
            edge: '<%= pkg.name %>-edge'
        },
        
        banners: {
            dist: [
                '/*\n',
                ' * Build Date: <%= grunt.template.today("dddd, mmmm dS, yyyy, h:MM:ss TT") %>\n',
                ' *\n',
                ' * Silver Ag v<%= pkg.version %>\n',
                ' * https://github.com/markwise/silverag\n',
                ' *\n',
                ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>, contributers\n',
                ' * Released under the terms of the MIT license\n',
                ' */'
            ].join('')
        },
        
        concat: {
            scripts: {
                options: {
                    banner: '<%= banners.dist %>\n\n',
                    separator: '\n\n\n',
                    process: function (src, path) {
                        
                        if (/header/.test(path)) {
                            src = src.replace(/@version/, grunt.config.data.pkg.version);
                        }
                        
                        if (!/header|footer/.test(path)) {
                            
                            //Remove jshint globals
                            src = src.replace(/^\/\* global.*\*\/\s*/, '');
                            
                            //Remove use strict statements
                            src = src.replace(/(['"])use strict\1;\s*/, '');
                            
                            //Indent each line by 4 spaces
                            src = src.replace(/^(.*)$/mg, '    $1');
                        }
                        
                        return src;                      
                    }
                },
                src: [
                    'src/scripts/header.js',
                    'src/scripts/attrList.js',
                    'src/scripts/generateAgId.js',
                    'src/scripts/keyStore.js',
                    'src/scripts/getLayouts.js',
                    'src/scripts/layout.js',
                    'src/scripts/layouts.js',
                    'src/scripts/layoutObserver.js',
                    'src/scripts/mediaQueries.js',
                    'src/scripts/initialize.js',
                    'src/scripts/footer.js'
                ],
                dest: 'build/<%= pkg.name %>.js'
            },
            styles: {
                options: {
                    banner: '@charset \'utf-8\';\n\n<%= banners.dist %>\n\n'
                },
                src: 'src/styles/silverag.css',
                dest: 'build/<%= pkg.name %>.css'
            }
        },
        
        clean: {
            scripts: ['build/*.js'],
            styles: ['build/*.css'],
            dist: ['dist/'],
            coverage: ['reports/coverage/']
        },
    
        copy: {
            dist: {
                files: [
                    {
                        src: '<%= concat.scripts.dest %>',
                        dest: 'dist/<%= names.dist %>.js'
                    },
                    {
                        src: '<%= concat.styles.dest %>',
                        dest: 'dist/<%= names.dist %>.css'    
                    }
                ]
            },
            edge: {
                files: [
                    {
                        src: '<%= concat.scripts.dest %>',
                        dest: 'dist/<%= names.edge %>.js'
                    },
                    {
                        src: '<%= concat.styles.dest %>',
                        dest: 'dist/<%= names.edge %>.css'    
                    }
                ]
            }
        },
    
        uglify: {
            options: {
                banner: '<%= banners.dist %>\n\n'
            },
            dist: {
                src: 'dist/<%= names.dist %>.js',
                dest: 'dist/<%= names.dist %>.min.js'
            },
            edge: {
                src: 'dist/<%= names.edge %>.js',
                dest: 'dist/<%= names.edge %>.min.js'
            }
        },
        
        cssmin: {
            options: {
                banner: '@charset "utf-8";\n\n<%= banners.dist %>\n'
            },
            dist: {
                src: 'dist/<%= names.dist %>.css',
                dest: 'dist/<%= names.dist %>.min.css'
            },
            edge: {
                src: 'dist/<%= names.edge %>.css',
                dest: 'dist/<%= names.edge %>.min.css'
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
                    'test/globals.js',
                    'src/scripts/attrList.js',
                    'src/scripts/keyStore.js',
                    'src/scripts/getLayouts.js',
                    'src/scripts/generateAgId.js',
                    'src/scripts/layout.js',
                    'test/specs/**/*.js'
                ],
                singleRun: true
            },
            unit: {
                options: {
                    browsers: [
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
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');
    
    
    //Custom tasks
    
    grunt.registerTask('build:scripts', [
        
        //Remove existing build scripts
        'clean:scripts',
        
        //Concatenate scripts and move to build directory
        'concat:scripts'
    ]);
    
    grunt.registerTask('build:styles', [
        
        //Remove existing build styles
        'clean:styles',
        
        //Concatenate styles and move to build directory        
        'concat:styles'
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
    
    grunt.registerTask('dist', [
        
        //Run tests
        'test',
        
        //Make a clean build
        'build',
        
        //Remove existing release files
        'clean:dist',
        
        //Copy, rename and move build files to dist directory
        'copy:dist',
        
        //Minify dist scripts
        'uglify:dist',
        
        //Minify dist styles
        'cssmin:dist'
    ]);
    
    grunt.registerTask('edge', [
        
        //Run tests
        'test',
        
        //Make a clean build
        'build',
        
        //Remove existing release files
        'clean:dist',
        
        //Copy, rename and move build files to dist directory
        'copy:edge',
        
        //Minify dist scripts
        'uglify:edge',
        
        //Minify dist styles
        'cssmin:edge'
    ]);
    
    grunt.registerTask('default', function () {
        grunt.log.write([
            '\nSilver Ag grunt commands:\n\n',
            
            'grunt build:scripts\n',
            '    concatenate scripts and move to build directory\n\n',
            
            'grunt build:styles\n',
            '    concatenate styles and move to build directory\n\n',
            
            'grunt build\n',
            '    build scripts and styles\n\n',
            
            'grunt test\n',
            '    run jshint and jasmine tests\n\n',
            
            'grunt dist\n',
            '    create distribution release\n\n',
            
            'grunt edge\n',
            '    create edge release'
        ].join(''));
    });
};
