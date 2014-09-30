/*
  Downloads and untars Trigger.io Toolkit version 3.3.82
*/

'use strict';

var async = require('async'),
    cp = require('child_process'),
    fs = require('fs'),
    path = require('path'),
    progress = require('progress'),
    request = require('request'),
    requestProgress = require('request-progress');

var toolkitTar = 'TriggerToolkit.tar.gz';
var toolkitUrl = 'https://toolkit-installer.s3.amazonaws.com/3.3.82/' + toolkitTar;

async.waterfall([
  // Download Trigger.io Toolkit
  function (callback) {
    var total = 0;
    var bar = null;

    console.log('Downloading TriggerToolkit');

    requestProgress(request(toolkitUrl))
      .on('progress', function (state) {
        total = state.total;
        if (!bar) {
          bar = new progress('  [:bar] :percent', {total: total, width: 40});
        }
        bar.curr = state.received;
        bar.tick(0);
      })
      .on('error', function (err) {
        console.log('An error has occurred: ', err);
        process.exit(1);
      })
      .pipe(fs.createWriteStream(toolkitTar))
      .on('error', function (err) {
        console.log('An error has occurred: ', err);
        process.exit(1);
      })
      .on('close', function (err) {
        bar.curr = total;
        bar.tick(0);
        callback(err);
      });
  },
  // Extract tar
  function (callback) {
    console.log('Extracting tar contents (via spawned process)');
    cp.execFile('tar', ['xzf', toolkitTar], {}, function (err) {
      callback(err);
    });
  },
  // Remove tar after extraction
  function (callback) {
    fs.unlink(toolkitTar, function (err) {
      callback(err);
    });
  }
], function (err) {
  if (err) {
    console.log('An error has occurred: ', err);
  } else {
    console.log('Installed TriggerToolkit');
  }
});

  