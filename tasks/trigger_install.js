/*
 * grunt-trigger
 * https://github.com/TeamPraxis/grunt-trigger
 *
 * Copyright (c) 2014 Chris Fang
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  grunt.registerTask('trigger_install', 'Installs Trigger Toolkit', function () {
    grunt.task.run(['clean:trigger_toolkit', 'wget:trigger', 'targz:trigger', 'clean:trigger_tmp']);
  });
};