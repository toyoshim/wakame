_sourceFile.entry.file(function(file) {
  var reader = new FileReader();
  reader.onprogress = function (e) {
    updateLoadProgress(e.loaded / e.total);
  };
  reader.onloadend = function (e) {
    updateLoadProgress(e.loaded / e.total);
    tar(this.result);
  };
  reader.readAsArrayBuffer(file);
}, function (e) {
  console.error(e);
});