var Zlib = require('..');
var stream = require('stream');
var chunky = require('chunky');
var test = require('tape');

var uncompressed = 'this is some text that we have compressed!';
var compressed = Buffer('H4sIAAAAAAAAAyvJyCxWAKLi/NxUhZLUihKFkozEEoXyVIWMxLJUheT83IKi1OLi1BRFAM5fHDwqAAAA', 'base64'); // gzipped using node's zlib

test('gzip', function(t) {
  Zlib.gzip(uncompressed, function(err, deflated) {    
    Zlib.gunzip(deflated, function(err, inflated) {
      t.same(inflated.toString('utf8'), uncompressed);
      t.end();
    });
  });
});

test('gzip stream', function(t) {
  var input = new Zlib.Gzip;
  var output = new Zlib.Gunzip;
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

test('gunzip', function(t) {
  Zlib.gunzip(compressed, function(err, inflated) {
    t.same(inflated.toString('utf8'), uncompressed);
    t.end();
  });
});

test('gunzip stream', function(t) {
  var output = new Zlib.Gunzip;
  var inflated = null;
  output.on('data', function(data) { 
    inflated = inflated ? Buffer.concat([ inflated, data ]) : data;
  });
  output.on('end', function() {
    t.same(inflated.toString('utf8'), uncompressed);
    t.end();
  });
  
  var chunks = chunky(compressed);
  var delay = 0;
  for (var i=0; i<chunks.length; i++) (function(chunk) {
    var last = i === chunks.length - 1;
    delay += 1 + 10 * Math.random();
    setTimeout(function() {
      var action = last ? 'end' : 'write';
      output[action](chunk);
    }, delay);
  })(chunks[i]);
});
