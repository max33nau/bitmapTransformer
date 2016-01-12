
"use strict";
var fs = require('fs');

function BitMap(bufferInfo) {
  this.header = bufferInfo.toString('ascii').slice(0,2);
  this.sizeInBytes = bufferInfo.readUInt32LE(2);
  this.offsetWherePixelArrayStarts = bufferInfo.readUInt32LE(10);
  this.sizeOfHeader = bufferInfo.readUInt32LE(14);
  this.bitsPerPixel = bufferInfo.readUInt16LE(28);
  this.compressionMethod = bufferInfo.readUInt32LE(30);
  this.imageSize = bufferInfo.readUInt32LE(34);
  this.numberOfColorsInPalette = bufferInfo.readUInt32LE(46);
  this.paletteLength = (bufferInfo.length-this.offsetWherePixelArrayStarts)/3;
  this.paletteOffset = 54;
}

function transformInvertColor(buffer, location, color) {
  if (color === 'red') {
    buffer.writeUInt8(255 - (buffer.readUInt8(location+2)),location+2);
  } else if (color === 'green') {
    buffer.writeUInt8(255 - (buffer.readUInt8(location+1)),location+1);
  } else if (color === 'blue') {
    buffer.writeUInt8(255 - (buffer.readUInt8(location)),location);
  } else {
    return;
  }
}

function createTransformedBitMapFile(typeOfBitMap, createNewBMP) {
  var bmp = fs.createReadStream(typeOfBitMap);
  var transformedBMP;
  bmp.on('data', function(data) {
    var bmpInfo = new BitMap(data);
    if(bmpInfo.header !== 'BM' && bmpInfo.sizeOfHeader === 40) {
      console.log('That is not a valid bmp file');
    } else {
      if (bmpInfo.bitsPerPixel === 24) {
        transformedBMP = fs.createWriteStream(createNewBMP);
        for(var ii = bmpInfo.offsetWherePixelArrayStarts; ii < data.length; ii+= 3) {
          transformInvertColor(data,ii,'blue');
          transformInvertColor(data,ii,'green');
          transformInvertColor(data,ii,'red');
        }
        transformedBMP.write(data);
        transformedBMP.end(function(){ console.log('data has been written for 24bpp');
      });
      } else if (bmpInfo.bitsPerPixel === 8) {
          transformedBMP = fs.createWriteStream(createNewBMP);
          var paletteLength = (bmpInfo.offsetWherePixelArrayStarts - bmpInfo.paletteOffset)/4;
          for(var jj = bmpInfo.paletteOffset; jj < (bmpInfo.paletteOffset+paletteLength); jj+=4) {
            transformInvertColor(data,jj,'blue');
            transformInvertColor(data,jj,'green');
            transformInvertColor(data,jj,'red');
            // Add four to ii this time to account for alpha
          }
          transformedBMP.write(data);
          transformedBMP.end(function(){console.log('data has been written for 8bpp');
        });
      } else {
        console.log('does not have transform power for bits per pixel bmp file');
      }
    }
  });
}

createTransformedBitMapFile('../palette-bitmap.bmp','palette-newbitmap.bmp');
createTransformedBitMapFile('../non-palette-bitmap.bmp', 'non-palette-newbitmap.bmp');
