module.exports = function(grunt) {

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Project configuration.
    grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>*/\n',
                mangle: false
            },
            dist: {
                files: {
                    'lib/decisiontree.min.js': 'lib/decisiontree.js',
                    'lib/decisiontree-full.min.js': 'lib/decisiontree-full.js'
                }
            }
        }
    });

    // Default task(s).
    grunt.registerTask('default', ['uglify']);

};