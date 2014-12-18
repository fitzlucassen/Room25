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

    var jsDist = 'JS/_built.js';
    var jsSrc = ['JS/**/*.js', '!JS/server.js', '!' + jsDist, '!JS/Base/*.js'];

    var cssSrc = ['CSS/*.css'];
    var cssDist = 'CSS/_built.css';

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
            compile: { // On renomme vu qu'on a pas de mode dev/dist. Dist étant une autre tâche : uglify
                src: jsSrc, // Vu qu'on doit l'utiliser deux fois, autant en faire une variable.
                dest: jsDist // Il existe des hacks plus intéressants mais ce n'est pas le sujet du post.
            }
        },
        cssmin: {
            compile: { // On renomme vu qu'on a pas de mode dev/dist. Dist étant une autre tâche : uglify
                src: cssSrc, // Vu qu'on doit l'utiliser deux fois, autant en faire une variable.
                dest: cssDist // Il existe des hacks plus intéressants mais ce n'est pas le sujet du post.
            }
        },
        watch: {
            scripts: {
                files: ['Gruntfile.js', jsSrc],
                tasks: ['scripts:dev']
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
                    server: path.resolve('JS/server'),
                    keepalive: true,
                    port: 1337,
                    hostname: 'room25.thibaultdulon.com',
                    showStack: true
                }
            }
        }
    });

    grunt.registerTask('default', ['scripts', 'watch']);

    // J'aime bien avoir des noms génériques
    grunt.registerTask('scripts', ['jshint', 'uglify:compile', 'cssmin:compile', 'img:task']);
    grunt.registerTask('roomServer', ['express', 'express-keepalive']);
};
