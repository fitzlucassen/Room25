module.exports = function(grunt) {
    var path = require("path");
    // Je préfère définir mes imports tout en haut
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-connect-socket.io');
    grunt.loadNpmTasks('grunt-express');
    grunt.loadNpmTasks('grunt-img');

    var jsDist = 'Js/_built.js';
    var jsSrc = ['Js/**/*.js', '!Js/server.js', '!' + jsDist, '!Js/Module/*.js'];

    var cssDist = 'Css/_built.css';
    var cssSrc = ['Css/**/*.css'];

    // Configuration de Grunt
    grunt.initConfig({
        jshint: {
            all: ['Gruntfile.js', jsSrc]
        },
        uglify: {
            options: {
                separator: ';',
                mangle: false
            },
            compile: {
                src: jsSrc,
                dest: jsDist
            }
        },
        cssmin: {
            compile: {
                src: cssSrc,
                dest: cssDist
            }
        },
        watch: {
            scripts: {
                files: ['Gruntfile.js', jsSrc, cssSrc],
                tasks: ['scripts']
            },
        },
        img: {
            task: {
                src: ['Images/**/*.jpg', 'Images/**/*.jpeg', 'Images/**/*.png','Images/**/*.gif']
            }
        },
        express: {
            roomServer: {
                options: {
                    server: path.resolve('Js/server'),
                    keepalive: true,
                    port: 1337,
                    hostname: '192.168.0.12',
                    showStack: true
                }
            }
        }
    });

    grunt.registerTask('default', ['scripts', 'watch']);
    grunt.registerTask('scripts', ['jshint', 'uglify:compile', 'cssmin:compile', 'img:task']);
    grunt.registerTask('roomServer', ['express', 'express-keepalive']);
};
