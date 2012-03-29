#!/bin/bash

# http://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../static/admin/novius-os/js

JAVA_CMD='java'
export JAVA_CMD

JS_COMBINED_FILE="novius-os.min.js"
JS_FILES=( jquery.novius-os jquery.novius-os.loadspinner jquery.novius-os.ostabs jquery.novius-os.preview jquery.novius-os.listgrid jquery.novius-os.treegrid jquery.novius-os.thumbnailsgrid jquery.novius-os.appdesk )

#clear the files
> $JS_COMBINED_FILE

echo '/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */' >> $JS_COMBINED_FILE
#run thru the JS files
for F in ${JS_FILES[@]}; do
  yui-compressor -o "$F.min.js" "$F.js"
  cat "$F.min.js" >> $JS_COMBINED_FILE
  echo '' >> $JS_COMBINED_FILE
  rm "$F.min.js"
done
