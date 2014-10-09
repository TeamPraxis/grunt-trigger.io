/*
 * grunt-trigger
 * https://github.com/TeamPraxis/grunt-trigger
 *
 * Copyright (c) 2014 Chris Fang
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  grunt.registerMultiTask('trigger_reload', 'Exposes forge reload command on base project directory', function () {
    var done = this.async();

    // Defaults
    var options = this.options({
      buildFolder: './build',
      forgePath: __dirname + '/../TriggerToolkit/'
    });

    if (!process.env.TRIGGER_USER || !process.env.TRIGGER_PASSWORD) {
      grunt.warn('Trigger.io credentials not found');
    }

    // Make sure the paths have a trailing slash
    if (options.buildFolder.substr(-1) !== '/') {
      options.buildFolder += '/';
    }
    if (options.forgePath.length > 0 && options.forgePath.substr(-1) !== '/') {
      options.forgePath += '/';
    }

    if (!grunt.file.exists(options.forgePath)) {
      grunt.warn('Trigger.io Toolkit not found');
    }

    if (!grunt.file.exists(options.buildFolder)) {
      grunt.warn('Build directory ' + options.buildFolder + ' does not exist');
    }

    // Initial validations have passed, build the reload
    grunt.log.write('Building application...');
    grunt.util.spawn({
      cmd: options.forgePath + 'forge',
      opts: {
        cwd: options.buildFolder
      },
      args: [ 'build', 'reload',
        '--username', process.env.TRIGGER_USER,
        '--password', process.env.TRIGGER_PASSWORD
      ]
    }, function (error, result, code) {
      if (error) {
        grunt.warn('Failed: ' + error, code);
        done();
        return;
      } else {
        grunt.log.writeln('DONE!');
        grunt.log.write('Pushing reload...');
        grunt.util.spawn({
          cmd: options.forgePath + 'forge',
          opts: {
            cwd: options.buildFolder
          },
          args: [ 'reload', 'push', 'default',
            '--username', process.env.TRIGGER_USER,
            '--password', process.env.TRIGGER_PASSWORD
          ]
        }, function (error, result, code) {
          if (error) {
            grunt.warn('Failed: ' + error, code);
            done();
            return;
          } else {
            grunt.log.writeln('DONE!');
            done();
          }
        });        
      }
    });
  });
};