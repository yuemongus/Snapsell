const zlib = require('zlib');

function compressFile(filepath, callback) {
    fs.readFile(filepath, (err, buffer) => {
        if (err) {
            return callback(err);
        }
        zlib.gzip(buffer, (err, data) => {
            if (err) {
                return callback(err);
            }

            return callback(null, data);
        });
    });
}
module.exports = compressFile;