chrome.app.runtime.onLaunched.addListener(function(data) {
  if (!data || !data.items) {
    var width = 400;
    var height = 600;
    chrome.app.window.create(
      'main.html', {
        innerBounds: {width: width, height: height, maxWidth: width, maxHeight: height, minWidth: width, minHeight: height},
        resizable: false },
      function (createdWindow) {
      }
    );
    return;
  }

  for (var i = 0; i < data.items.length; ++i)
    expand(data.items[0]);
});
