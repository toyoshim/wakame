var updateLoadProgress = function (rate) {
  var load = document.getElementById('load');
  load.value = rate;
  var loadString = document.getElementById('load_string');
  loadString.innerText = (rate * 100)|0;
};

var updateExecProgress = function (rate) {
  var exec = document.getElementById('exec');
  exec.value = rate;
  var execString = document.getElementById('exec_string');
  execString.innerText = (rate * 100)|0;
};

var updateStoreProgress = function (rate) {
  var store = document.getElementById('store');
  store.value = rate;
  var storeString = document.getElementById('store_string');
  storeString.innerText = (rate * 100)|0;
};


