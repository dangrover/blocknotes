
module.exports = function(grunt) {
 

    grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      concat:{
          app:{
              src:['src/js/util.js','src/js/app.js'],
              dest:'build/js/app.js'
          }
      },
      browserify: {
        dist: {
          files: {
            'build/js/bundle.js': ['src/js/app.js']
          },
          options: {
              alias:{
                  'vue':'vue/dist/vue.common.js'
              }
            
          }
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
                  'build/js/bundle.js':'build/js/bundle.js'
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
            manifest:{
                'src':'src/data/manifest.json',
                'dest':'build/manifest.json'
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
    connect: {
      server:{
        options:{
            port: 8080,
            base: './build',
            middleware:function(connect, options, middlewares) {
                // Allow cross origin requests so that we can serve the manifest.json to blockstack
                var cors = require('cors');
                middlewares.unshift(cors());
                return middlewares;
              }
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
    grunt.loadNpmTasks('grunt-minify-html');
    grunt.loadNpmTasks('grunt-cache-bust');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-browserify');

    // Tasks 
    grunt.registerTask('default', ['browserify', 'copy', 'less']);

    grunt.registerTask('dev', ['default', 'connect', 'watch']);

    grunt.registerTask('prod', ['clean','default','uglify','minifyHtml']);

  };
  