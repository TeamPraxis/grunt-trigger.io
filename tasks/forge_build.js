/*
 * grunt-trigger
 * https://github.com/TeamPraxis/grunt-trigger
 *
 * Copyright (c) 2014 Chris Fang
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  grunt.registerTask('forge_build', 'Executes forge build command', function () {
    var done = this.async();
    if (!process.env.TRIGGER_USER || !process.env.TRIGGER_PASSWORD) {
      grunt.fail.warn('Trigger.io credentials not found');
    }
    grunt.util.spawn({
      cmd: 'node_modules/grunt-trigger/TriggerToolkit/forge',
      args: ['build', this.args[0], '--username', process.env.TRIGGER_USER, '--password', process.env.TRIGGER_PASSWORD]
    }, function (error, result, code) {
      if (error) {
        grunt.fail.warn('forge build failed: ' + error, code);
        done();
        return;
      } else {
        done();
      }
    });
  });
};