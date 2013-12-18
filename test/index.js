require('./deflate');
require('./gzip');

// run node compatibility tests?
if (typeof window === 'undefined') {
  require('./deflate-node');
  require('./gzip-node');
}
