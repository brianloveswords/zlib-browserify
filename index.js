var Zlib = require('./zlib');
var ConcatTransform = require('concat-transform');
var inherits = require('inherits');

// the least I can do is make error messages for the rest of the node.js/zlib api.
// (thanks, dominictarr)
function error () {
  var m = [].slice.call(arguments).join(' ')
  throw new Error([
    m,
    'we accept pull requests',
    'http://github.com/brianloveswords/zlib-browserify'
    ].join('\n'))
}

function optionsError() {
  error('passing options to zlib-browserify streams is not yet supported');
}

;['createDeflateRaw'
, 'createInflateRaw'
, 'createUnzip'
, 'InflateRaw'
, 'DeflateRaw'
, 'Unzip'
, 'inflateRaw'
, 'deflateRaw'].forEach(function (name) {
  Zlib[name] = function () {
    error('sorry,', name, 'is not implemented yet')
  }
});


// inflate
exports.inflate = function(data, cb) { Zlib.inflate(Buffer(data), cb) };
exports.createInflate = function(opts) { return new Inflate(opts) };
exports.Inflate = Inflate;

function Inflate(opts) {
  if (opts) optionsError();
  if (!(this instanceof Inflate))
    return new Inflate(opts);
  ConcatTransform.call(this);
}
inherits(Inflate, ConcatTransform);

Inflate.prototype._transform = function(chunk, enc, cb) {
  cb(null, Zlib.inflateSync(chunk));
};


// deflate
exports.deflate = function(data, cb) { Zlib.deflate(Buffer(data), cb) };
exports.createDeflate = function(opts) { return new Deflate(opts) };
exports.Deflate = Deflate;

function Deflate(opts) {
  if (opts) optionsError();
  if (!(this instanceof Deflate))
    return new Deflate(opts);
  ConcatTransform.call(this);
}
inherits(Deflate, ConcatTransform);

Deflate.prototype._transform = function(chunk, enc, cb) {
  cb(null, Zlib.deflateSync(chunk));
};


// gunzip
exports.gunzip = function(data, cb) {  Zlib.gunzip(Buffer(data), cb) };
exports.createGunzip = function(opts) { return new Gunzip(opts) };
exports.Gunzip = Gunzip;

function Gunzip(opts) {
  if (opts) optionsError();
  if (!(this instanceof Gunzip))
    return new Gunzip(opts);
  ConcatTransform.call(this);
}
inherits(Gunzip, ConcatTransform);

Gunzip.prototype._transform = function(chunk, enc, cb) {
  cb(null, Zlib.gunzipSync(chunk));
};


// gzip
exports.gzip = function(data, cb) {  Zlib.gzip(Buffer(data), cb) };
exports.createGzip = function(opts) { return new Gzip(opts) };
exports.Gzip = Gzip;

function Gzip(opts) {
  if (opts) optionsError();
  if (!(this instanceof Gzip))
    return new Gzip(opts);
  ConcatTransform.call(this);
}
inherits(Gzip, ConcatTransform);

Gzip.prototype._transform = function(chunk, enc, cb) {
  cb(null, Zlib.gzipSync(chunk));
};
