var gunzip = function (data) {
  var lib = new Zlib.Gunzip(new Uint8Array(data));
  var result = lib.decompress();
  updateLoadProgress(1);
  tar(result.buffer);
};

_sourceFile.entry.file(function(file) {
  var reader = new FileReader();
  reader.onprogress = function (e) {
    updateLoadProgress(e.loaded / e.total / 2);
  };
  reader.onloadend = function (e) {
    updateLoadProgress(e.loaded / e.total / 2);
    gunzip(this.result);
  };
  reader.readAsArrayBuffer(file);
}, function (e) {
  console.error(e);
});