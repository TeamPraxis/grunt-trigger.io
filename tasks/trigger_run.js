/*
 * grunt-trigger
 * https://github.com/TeamPraxis/grunt-trigger
 *
 * Copyright (c) 2014 Chris Fang
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  grunt.registerMultiTask('trigger_run', 'Executes forge run command', function () {
    var done = this.async();

    var options = this.options({
      buildFolder: './build',
      platform: 'ios',
      device: 'simulator',
      simulatorfamily: 'iphone',
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

    if (!grunt.file.exists(options.buildFolder)) {
      grunt.warn('Build directory ' + options.buildFolder + ' does not exist');
    }

    // Initial validations have passed, execute forge build
    grunt.log.write('Starting application (Press CTRL+C to end)');
    var args = [
      'run', options.platform,
      '--username', process.env.TRIGGER_USER,
      '--password', process.env.TRIGGER_PASSWORD
    ];

    // Add ios run settings
    if (options.platform === 'ios') {
      args.push('--ios.device');
      args.push(options.device);
      args.push('--ios.simulatorfamily');
      args.push(options.simulatorfamily);
    }
    
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
        done();
      }
    });
  });
};