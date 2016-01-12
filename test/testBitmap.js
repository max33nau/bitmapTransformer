"use strict";

var assert = require('assert');
var fs = require('fs');

describe('a group of test that should test file input and creating streams', function(){
  it('should not receive a error when creating the readStream', function(){
    var bpm = fs.createReadStream('non-palette-bitmap.bmp');
    if(bpm) {
      console.log('read stream created');
    } else {
    assert.ifError('error');
    }
  });

  it('should be a bpm file when the data is received', function(){
    var bpm = fs.createReadStream('non-palette-bitmap.bmp');
    bpm.on('data', function(data){
      var typeOfFile = data.toString('ascii').slice(0,2);
      assert.deepEqual(typeOfFile, 'BM');
    });
  });

  // This was a hard assignment to figure out to run tests for. Not sure what else to do
});
