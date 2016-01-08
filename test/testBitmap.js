"use strict";

var assert = require('assert');
var fs = require('fs');

describe('tests to see if bitmapTransformer is functioning', function(){
  it('should open file', function() {
      fs.open('../non-palette-bitmap.bmp','r', function(error,fd){
        assert(!error);
      });
  });

  it('should read a file', function(){
      var buffer = fs.readFileSync('../non-palette-bitmap.bmp');
      assert(buffer);
    });


});
