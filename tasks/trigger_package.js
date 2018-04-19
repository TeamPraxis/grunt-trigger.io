/*
 * grunt-trigger
 * https://github.com/sagely/grunt-trigger
 *
 * Copyright (c) 2014 Chris Fang
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function (grunt) {
  grunt.registerMultiTask('trigger_package', 'Executes forge package command', function () {
    var done = this.async();

    // Defaults
    var options = this.options({
      buildFolder: './build',
      platform: 'ios',
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

    // Initial validations have passed, execute forge package
    grunt.log.write('Building application...');
    var args = [
      'package', options.platform,
      '--username', process.env.TRIGGER_USER,
      '--password', process.env.TRIGGER_PASSWORD
    ];

    if (options.profile) {
      args.push('--ios.profile.provisioning_profile');
      args.push(options.profile);
    }

    if (options.certificate) {
      args.push('--ios.profile.developer_certificate_path');
      args.push(options.certificate);
    }

    if (options.password) {
      args.push('--ios.profile.developer_certificate_password');
      args.push(options.password);
    }

    if (options.keystore) {
      args.push('--android.profile.keystore');
      args.push(options.keystore);
    }

    if (options.storepass) {
      args.push('--android.profile.storepass');
      args.push(options.storepass);
    }

    if (options.keypass) {
      args.push('--android.profile.keypass');
      args.push(options.keypass);
    }

    if (options.keyalias) {
      args.push('--android.profile.keyalias');
      args.push(options.keyalias);
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
        grunt.log.writeln('DONE!');
        done();
      }
    });
  });
};