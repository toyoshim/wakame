var expand = function (item) {
  var type = item.type || '';
  var path = item.entry.fullPath;
  var module;

  // Hadle GNU Zipped Tape ARchive.
  if (path.match(/\.tar.gz$/i) || path.match(/\.tgz$/i))
    module = 'tgz';
  // Handle GNU Zip.
  else if (path.match(/\.gz$/i))
    module = 'gunzip';
  // Handle Tape ARchive.
  else if (path.match(/\.tar$/i))
    module = 'tar';
  // Hadle GNU Zipped Tape ARchive.
  else if (type == 'application/x-compressed-tar')
    module = 'tgz';
  // Handle GNU Zip.
  else if (type == 'application/x-gzip')
    module = 'gunzip';
  // Handle Tape ARchive.
  else if (type == "application/x-tar")
    module = 'tar';

  if (!module)
    return;

  var width = 200;
  var height = 56;
  chrome.app.window.create(
    module + '.html', {
      id: module + ' for ' + item.entry.fullPath,
      innerBounds: {width: width, height: height, maxWidth: width, maxHeight: height, minWidth: width, minHeight: height},
      frame: 'none',
      resizable: false
    }, function (createdWindow) {
      createdWindow.contentWindow._sourceFile = item;
    }
  );
};
