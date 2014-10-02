/*
 * grunt-trigger
 * https://github.com/TeamPraxis/grunt-trigger
 *
 * Copyright (c) 2014 Chris Fang
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  grunt.registerMultiTask('trigger_reload', 'Exposes forge reload command on base project directory', function (stream) {
    var done = this.async();

    // Defaults
    var options = this.options({
      buildFolder: './build',
      action: 'list',
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

    if (options.action !== 'list' && !stream) {
      grunt.warn('Stream name not defined');
    }

    // Initial validations have passed, execute forge reload
    var args = [ 'reload', options.action ];
    
    // Specify stream name if reload action requires it
    if (options.action !== 'list') {
      args.push(stream);
    }

    args.concat([
      '--username', process.env.TRIGGER_USER,
      '--password', process.env.TRIGGER_PASSWORD
    ]);

    grunt.util.spawn({
      cmd: options.forgePath + 'forge',
      opts: {
        cwd: options.buildFolder
      },
      args: args
    }, function (error, result, code) {
      if (error) {
        grunt.warn('Failed: ' + error, code);
        done();
        return;
      } else {
        console.log(result.stderr);
        done();
      }
    });
  });
};