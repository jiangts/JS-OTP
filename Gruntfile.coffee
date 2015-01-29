module.exports = (grunt) ->

  grunt.initConfig
    coffee:
      app:
        expand: true
        cwd: 'coffee'
        src: ['*.coffee']
        dest: 'js'
        ext: '.js'

    concat:
      app:
        src: ['js/totp.js', 'js/sha.js']
        dest: 'dist/TotpManager.js'

    uglify:
      app:
        options:
          banner: """/*
           * File combining 
           * (1) sha.js by Brian Turek 2008-2013 under BSD license
           * (2) and a modified js OTP implementation found on JSFiddle
          */\n
          """
        files:
          'dist/TotpManager.min.js': ['dist/TotpManager.js']

    watch:
      app:
        files: 'src/*.coffee'
        tasks: ['default']

  # These plugins provide necessary tasks.
  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadNpmTasks 'grunt-contrib-watch'
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-contrib-uglify'

  # Default task.
  grunt.registerTask 'default', ['coffee', 'concat', 'uglify']

