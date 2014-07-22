#!/bin/bash

# http://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

php -f ./minify-vendor-js.php
# install require.js via npm for this to work : npm install -g requirejs
r.js -o build.js
