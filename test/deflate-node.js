var Zlib = require('..');
var ZlibNode = require('zlib');
var stream = require('stream');
var chunky = require('chunky');
var test = require('tape');

var uncompressed = 'this is some text that we have compressed!';
var compressed = Buffer('eJwrycgsVgCi4vzcVIWS1IoShZKMxBKF8lSFjMSyVIXk/NyCotTi4tQURQBMrw91', 'base64'); // deflated using node's zlib

test('deflate - node compatibility', function(t) {
  Zlib.deflate(uncompressed, function(err, deflated) {
    ZlibNode.inflate(deflated, function(err, inflated) {
      t.same(inflated.toString('utf8'), uncompressed);
      t.end();
    });
  });
});

test('deflate stream - node compatibility', function(t) {
  var input = new Zlib.Deflate;
  var output = new ZlibNode.Inflate;
  var inflated = null;
  output.on('data', function(data) {
    inflated = inflated ? Buffer.concat([ inflated, data ]) : data;
  });
  output.on('end', function() {
    t.same(inflated.toString('utf8'), uncompressed);
    t.end();
  });
  
  input.pipe(output);
  
  var chunks = chunky(uncompressed);
  var delay = 0;
  for (var i=0; i<chunks.length; i++) (function(chunk) {
    var last = i === chunks.length - 1;
    delay += 1 + 10 * Math.random();
    setTimeout(function() {
      var action = last ? 'end' : 'write';
      input[action](chunk);
    }, delay);
  })(chunks[i]);
});

test('inflate - node compatibility', function(t) {
  ZlibNode.deflate(uncompressed, function(err, deflated) {
    Zlib.inflate(deflated, function(err, inflated) {
      t.same(inflated.toString('utf8'), uncompressed);
      t.end();
    });
  });
});

test('inflate stream - node compatibility', function(t) {
  var input = new ZlibNode.Deflate;
  var output = new Zlib.Inflate;
  var inflated = null;
  output.on('data', function(data) {
    inflated = inflated ? Buffer.concat([ inflated, data ]) : data;
  });
  output.on('end', function() {
    t.same(inflated.toString('utf8'), uncompressed);
    t.end();
  });
  
  input.pipe(output);
  
  var chunks = chunky(uncompressed);
  var delay = 0;
  for (var i=0; i<chunks.length; i++) (function(chunk) {
    var last = i === chunks.length - 1;
    delay += 1 + 10 * Math.random();
    setTimeout(function() {
      var action = last ? 'end' : 'write';
      input[action](chunk);
    }, delay);
  })(chunks[i]);
});
