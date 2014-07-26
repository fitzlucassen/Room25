module.exports = function(grunt) {
    var path = require("path");
    // Je préfère définir mes imports tout en haut
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-connect-socket.io');
    grunt.loadNpmTasks('grunt-express');

    var jsSrc = ['./JS/*.js'];
    var jsDist = './JS/_built.js';

    // Configuration de Grunt
    grunt.initConfig({
        concat: {
            options: {
                separator: ';'
            },
            compile: { // On renomme vu qu'on a pas de mode dev/dist. Dist étant une autre tâche : uglify
                src: jsSrc, // Vu qu'on doit l'utiliser deux fois, autant en faire une variable.
                dest: jsDist // Il existe des hacks plus intéressants mais ce n'est pas le sujet du post.
            }
        },
        uglify: {
            options: {
                separator: ';'
            },
            compile: {
                src: jsSrc,
                dest: jsDist
            }
        },
        watch: {
            scripts: {
                files: '**/*.js',
                tasks: ['scripts:dev']
            }
        },
        express: {
            roomServer: {
                options: {
                    server: path.resolve('./JS/server'),
                    keepalive: true,
                    port: 1337,
                    hostname: 'localhost',
                    showStack: true
                }
            }
        }
    })

    grunt.registerTask('default', ['dev', 'watch']);
    grunt.registerTask('dev', ['scripts:dev']);
    grunt.registerTask('dist', ['scripts:dist']);
    grunt.registerTask('roomServer', ['express', 'express-keepalive']);

    // J'aime bien avoir des noms génériques
    grunt.registerTask('scripts:dev', ['concat:compile']);
    grunt.registerTask('scripts:dist', ['uglify:compile']);
}