#!/bin/bash

# http://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../static/admin/novius-os/js

JAVA_CMD='java'
export JAVA_CMD

JS_COMBINED_FILE="../../bundle/nos.min.js"
JS_FILES=( jquery.novius-os.validate jquery.novius-os.wysiwyg jquery.novius-os jquery.novius-os.loadspinner jquery.novius-os.ostabs jquery.novius-os.preview jquery.novius-os.listgrid jquery.novius-os.treegrid jquery.novius-os.thumbnailsgrid jquery.novius-os.appdesk jquery.novius-os.datacatchers )

#clear the files
> $JS_COMBINED_FILE

> /tmp/nos-license
printf "/**\n * NOVIUS OS - Web OS for digital communication\n *\n * @copyright  2011 Novius\n * @license    GNU Affero General Public License v3 or (at your option) any later version\n *             http://www.gnu.org/licenses/agpl-3.0.html\n * @link http://www.novius-os.org\n */\n" > /tmp/nos-license

cat /tmp/nos-license >> $JS_COMBINED_FILE
#run thru the JS files
for F in ${JS_FILES[@]}; do
  yui-compressor -o "$F.min.js" "$F.js"
  cat "$F.min.js" >> $JS_COMBINED_FILE
  echo '' >> $JS_COMBINED_FILE
  rm "$F.min.js"
done

shopt -s globstar
SUB_DIR=( inspector media page views renderer )
for D in ${SUB_DIR[@]}; do
    cd $DIR/../static/admin/novius-os/js/$D
    for file in *.js
    do
      if [[ ! -f "$file" ]]
      then
          continue
      fi
      > "minified/$file"
      yui-compressor -o "minified/$file.temp" "$file"
      cat /tmp/nos-license "minified/$file.temp" >> "minified/$file"
      rm "minified/$file.temp"
    done
done