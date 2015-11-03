var archiver = require('archiver');
var Promise  = require('rsvp').Promise;
var fs       = require('fs');
var debug    = require('debug')('lambda-packager:zip-file');

var ZipFile = function(options) {
  this.sourceDirectory = options.sourceDirectory;
  this.destinationZip = options.destinationZip;
};

ZipFile.prototype.zip = function() {
  var destinationZip = this.destinationZip;
  var sourceDirectory = this.sourceDirectory;

  debug('zipping; from=', sourceDirectory, '; to=', destinationZip);

  return new Promise(function(resolve, reject) {
    var archive = archiver.create('zip', {});
    var output = fs.createWriteStream(destinationZip);

    output.on('close', resolve);
    archive.on('error', reject);

    archive.pipe(output);

    archive.bulk([{
        expand: true,
        cwd: sourceDirectory,
        src: ['**']
    }]);

    archive.finalize();
  });
};

module.exports = ZipFile;
