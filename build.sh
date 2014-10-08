#!/bin/sh

checkout () {
  if [ -d $1 ]; then
    (cd $1 && git checkout master && git pull)
  else
    git clone $2
  fi
  if [ $? -ne 0 ]; then
    return 1
  fi
  (cd $1 && git checkout $3)
  return $?
}

build () {
  mkdir chrome/third_party 2> /dev/null
  mkdir third_party 2> /dev/null
  cd third_party
  checkout zlib.js https://github.com/imaya/zlib.js.git b99bd33d485d63e93310b911a1f8dbf9ceb265d5
  if [ $? -ne 0 ]; then
    return 1
  fi
  cd ..
  cp third_party/zlib.js/bin/gunzip.min.js chrome/third_party/gunzip.min.js
  if [ $? -ne 0 ]; then
    return 1
  fi
  cat \
    bower_components/jslt/src/File.js \
    bower_components/jslt/src/ArrayBufferFile.js \
    bower_components/jslt/src/Directory.js \
    bower_components/jslt/src/TarDirectory.js \
      | ./bower_components/uglify-js/bin/uglifyjs -nc > chrome/third_party/tar.min.js
  if [ $? -ne 0 ]; then
    return 1
  fi
  ./node_modules/vulcanize/bin/vulcanize --strip --csp --inline -o chrome/main.html src/main.html
  return $?
}

bower install && npm install vulcanize@0.4.2 && build && zip -r wakame.zip chrome echo "succeeded"

