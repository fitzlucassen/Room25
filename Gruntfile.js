module.exports = function(grunt) {
    var path = require("path");
    // Je préfère définir mes imports tout en haut
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-connect-socket.io');
    grunt.loadNpmTasks('grunt-express');

    var jsSrc = ['JS/Controller/*.js', 'JS/ngController/*.js', 'JS/app.js', 'JS/base64Manager.js'];
    var jsDist = 'JS/_built.js';

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
                files: [jsSrc],
                tasks: ['scripts:dev']
            },
        },
        express: {
            roomServer: {
                options: {
                    server: path.resolve('JS/server'),
                    keepalive: true,
                    port: 1337,
                    hostname: 'localhost',
                    showStack: true
                }
            }
        }
    });

    grunt.registerTask('default', ['dev', 'watch']);
    grunt.registerTask('dev', ['scripts:dev']);
    grunt.registerTask('dist', ['scripts:dist']);

    // J'aime bien avoir des noms génériques
    grunt.registerTask('scripts:dev', ['jshint', 'uglify:compile', 'cssmin:compile']);
    grunt.registerTask('roomServer', ['express', 'express-keepalive']);
};