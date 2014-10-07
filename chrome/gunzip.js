var store = function (result) {
  var path = _sourceFile.entry.fullPath;
  var options = {
    type: 'saveFile',
    suggestedName: path.slice(0, -3)
  };
  chrome.fileSystem.chooseEntry(options, function (e) {
    if (!e) {
      window.close();
      return;
    }
    e.createWriter(function(writer) {
      writer.onwrite = function (e) {
        updateStoreProgress(e.loaded / e.total);
      };
      writer.onwriteend = function (e) {
        updateStoreProgress(e.loaded / e.total);
        window.close();
      };
      writer.onerror = function (e) {
        console.error(e);
      };
      writer.write(new Blob([result]));
    }, function (e) {
      console.error(e);
    });
  });
};

var gunzip = function (data) {
  var lib = new Zlib.Gunzip(new Uint8Array(data));
  var result = lib.decompress();
  updateExecProgress(1);
  store(result);
};

_sourceFile.entry.file(function(file) {
  var reader = new FileReader();
  reader.onprogress = function (e) {
    updateLoadProgress(e.loaded / e.total);
  };
  reader.onloadend = function (e) {
    updateLoadProgress(e.loaded / e.total);
    gunzip(this.result);
  };
  reader.readAsArrayBuffer(file);
}, function (e) {
  console.error(e);
});
