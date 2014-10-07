var copy = function (tar, fs) {
  this._fs = fs;
  this._entries = tar.getEntries();
  this._index = 0;
};

copy.prototype.run = function () {
  return new Promise(function (resolve, error) {
    this._resolve = resolve;
    this._error = error;
    this._doNext();
  }.bind(this));
};

copy.prototype._doNext = function () {
  if (this._index == this._entries.length) {
    this._resolve('finished.');
    return;
  }
  var entry = this._entries[this._index++];
  if (entry.isFile())
    this._createFile(entry);
  else if (entry.isDirectory())
    this._createDirectory(entry);
};

copy.prototype._createFile = function (entry) {
  console.log('file: ' + entry.name() + ' (' + entry.file().size() + ')');
  this._fs.getFile(entry.name(), {create: true}, function (e) {
    e.createWriter(function(writer) {
      var file = entry.file();
      file.read(file.size()).then(function (r) {
        writer.onwriteend = function (e) {
          nFinishedFiles++;
          updateStoreProgress(nFinishedFiles / nFiles)
          this._doNext();
        }.bind(this);
        writer.onerror = function (e) {
          this._error(e);
        }.bind(this);
        var u8 = r.buffer;
        var view = new DataView(u8.buffer, u8.byteOffset, u8.byteLength);
        writer.write(new Blob([view]));
      }.bind(this), function (e) { this._error(e); }.bind(this));
    }.bind(this), function (e) { this._error(e); }.bind(this));
  }.bind(this), function (e) { this._error(e); }.bind(this));
};

copy.prototype._createDirectory = function (entry) {
  console.log('directory: ' + entry.name());
  this._fs.getDirectory(entry.name(), {create: true}, function (e) {
    var cp = new copy(entry.directory(), e);
    cp.run().then(function (r) {
      this._doNext();
    }.bind(this), function (e) { this._error(e); }.bind(this));
  }.bind(this), function (e) { this._error(e); }.bind(this));
};

var countDir = function (dir) {
  var entries = dir.getEntries();
  var n = 0;
  for (var i = 0; i < entries.length; ++i) {
    var entry = entries[i];
    if (entry.isFile())
      n++;
    else
      n += countDir(entry.directory())
  }
  return n;
};

var nFiles = 0;
var nFinishedFiles = 0;

var store = function (dir) {
  var options = {
    type: 'openDirectory'
  };
  chrome.fileSystem.chooseEntry(options, function (e) {
    if (!e) {
      window.close();
      return;
    }
    nFiles = countDir(dir);
    console.log(nFiles);
    var cp = new copy(dir, e);
    cp.run().then(function (r) {
      console.log(r);
      window.close();
    }, function (e) {
      console.error(e);
      console.error(e.stack);
    });
  });
};

var tar = function (data) {
  var dir = new TarDirectory(data);
  updateExecProgress(1);
  store(dir);
};
