module.exports = function(grunt) {
    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat:{
          vendor:{
              src:['node_modules/vue/dist/vue.js',
                   'node_modules/blockstack/dist/blockstack.js'
                  ],
              dest:'build/js/vendor.js'
          },
          app:{
              src:['src/js/util.js','src/js/app.js'],
              dest:'build/js/app.js'
          }
      },
      less:{
          site:{
            options:{
                compress:true,
            },
            files:{
                'build/css/app.css':'src/less/app.less',
                'build/css/bootstrap.css':'node_modules/bootstrap3/less/bootstrap.less'
            }
        }
      },
      uglify:{
          js:{
              files:{
                  'build/js/vendor.js':'build/js/vendor.js',
                  'build/js/app.js':'build/js/app.js',
              },
          }
      },
      copy:{
          html:{
                'cwd':'src/html',
                'src':'*.html',
                'dest':'build',
                'expand':true
            },
            data:{
                'cwd':'src/data',
                'src':'**',
                'dest':'build/data',
                'expand':true
            },
            img:{
              'cwd':'src/img',
              'src':'**',
              'dest':'build/img',
              'expand':true
            },
            fontawesome:{
                'cwd':'src/css',
                'src':'**',
                'dest':'build/css',
                'expand':true
              },
              fontawesome:{
                'cwd':'src/sfx',
                'src':'**',
                'dest':'build/sfx',
                'expand':true
              }
      },
      minifyHtml: {
        options: {
            cdata: true,
            removeAttributeQuotes:false,
        },
        dist: {
            files: {
                'build/index.html': 'build/index.html'
            }
        }
      },
      watch: {
            scripts: {
              files: ['src/**'],
              tasks: ['default'],
              options: {spawn: false}
            }
      },
    clean: ['build/**'],
    'gh-pages': {
      options: {
        base: 'build'
      },
      src: ['**']
    },
    connect: {
      server:{
      options:{
        port: 8080,
        base: './build'
      }
    }
    },
   });
  
  
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-json-minify');
    grunt.loadNpmTasks('grunt-gh-pages');
    grunt.loadNpmTasks('grunt-minify-html');
    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Tasks 
    grunt.registerTask('default', ['concat', 'copy', 'less']);

    grunt.registerTask('dev', ['default', 'connect', 'watch']);

    grunt.registerTask('prod', ['clean','default','uglify']);

    grunt.registerTask('publish', ['prod', 'gh-pages']);
  };
  