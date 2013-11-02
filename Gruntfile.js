'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({

    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
      '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
      ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',

    // Task configuration.
    clean: {
      dist: ['dist'],
      reports: ['validation-report.json', 'validation-status.json']
    },
    cssmin: {
      options: {
        banner: '<%= banner %>'
      },
      combine: {
        files: {
          'dist/css/compiled.min.css': ['css/*.css']
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        //Order must be specified or boostrap is put before jquery.
        src: ['js/retina.min.js','js/jquery.min.js','js/bootstrap.min.js','js/custom.js'],
        dest: 'dist/js/compiled.min.js'
      },
    },

    copy: {
      html: {
        expand: true,
        cwd: 'html/',
        src: ["*.htm*"],
        dest: 'dist/'
      },
      imgs: {
        expand: true,
        src: ["images/*.png", "images/*.jpg"],
        dest: 'dist/'
      },
      fonts: {
        expand: true,
        src: ["fonts/*"],
        dest: 'dist/'
      },
      ico: {
        expand: true,
        cwd: 'images/',
        src: ["favicon.ico"],
        dest: 'dist/'
      }
    },

    nodeunit: {
      files: ['test/**/*_test.js']
    },

    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      },
      js: {
        options: {
          jshintrc: 'js/.jshintrc'
        },
        src: ['js/custom.js']
      },
      test: {
        src: ['test/**/*.js']
      },
    },

    validation: {
      options: {
        reset: true
      },
      files: {
        src: ["html/**/*.htm*"]
      }
    },

    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      js: {
        files: 'js/*',
        tasks: ['jshint:js', 'uglify']
      },
      css: {
        files: 'css/*',
        tasks: ['cssmin']
      },
      html: {
        files: 'html/*',
        tasks: ['copy:html']
      },
      imgs: {
        files: 'images/*',
        tasks: ['copy:imgs']
      },
      test: {
        files: '<%= jshint.test.src %>',
        tasks: ['jshint:test', 'nodeunit']
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-html-validation');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default/Workflow task.
  grunt.registerTask('default', ['cssmin', 'jshint', 'uglify', 'copy']);

  // Release task.
  grunt.registerTask('release', ['validation', 'clean', 'cssmin', 'jshint', 'uglify', 'copy']);

};
