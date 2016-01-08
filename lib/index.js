"use strict";
var fs = require('fs');

function BitMap(bufferInfo) {
  this.header = buffer.toString('ascii').slice(0,2);
  this.sizeInBytes = bufferInfo.readUInt32LE(2);
  this.offsetWherePixelArrayStarts = bufferInfo.readUInt32LE(10);
  this.sizeOfHeader = bufferInfo.readUInt32LE(14);
  this.bitsPerPixel = bufferInfo.readUInt16LE(28);
  this.imageSize = bufferInfo.readUInt32LE(34);
  this.numberOfColorPalettes = bufferInfo.readUInt32LE(46);
  this.paletteOffset = 54;
  this.paletteLength = (bufferInfo.length-54)/3;
}


var buffer = fs.readFileSync('non-palette-bitmap.bmp');
console.log('1',buffer)

var bufferObject = new BitMap(buffer);

var palette = [];
var offset = bufferObject.paletteOffset;
for(var ii = 0; ii < bufferObject.paletteLength; ii++) {
  palette[ii] = {
    blue: buffer.readUInt8(offset),
    green: buffer.readUInt8(offset + 1),
    red: buffer.readUInt8(offset + 2)
  }
  offset += 3;
  //console.log(ii,palette[ii]);
}

for (var jj = 0; jj < palette.length; jj++) {
  palette[jj].blue = Math.floor(palette[jj].blue * 0.5);
  palette[jj].green = Math.floor(palette[jj].green * 0.5);
  palette[jj].red = Math.floor(palette[jj].red * 0.5);
}

var offset = bufferObject.paletteOffset;
for(var ii = 0; ii < bufferObject.paletteLength; ii++) {
  buffer.writeUInt8(palette[ii].blue,offset);
  buffer.writeUInt8(palette[ii].green,offset + 1);
  buffer.writeUInt8(palette[ii].red, offset + 2);
  offset += 3;
}

console.log('2',buffer);

fs.writeFileSync('newbitmap.bmp', buffer)
