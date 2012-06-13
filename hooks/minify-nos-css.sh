#!/bin/bash

# http://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../static/admin/novius-os/css

#kill compass watch

COMPASS_WATCH=`ps -ef | grep compass | grep watch | awk '{ print $2 }'`
if [ -n "$COMPASS_WATCH" ]
then
  kill -STOP $COMPASS_WATCH
fi

JAVA_CMD='java'
export JAVA_CMD

CSS_COMBINED_FILE="nos.min.css"
CSS_FILES=( laGrid novius-os jquery.novius-os.appdesk jquery.novius-os.listgrid jquery.novius-os.ostabs jquery.novius-os.treegrid jquery.novius-os.preview jquery.novius-os.thumbnailsgrid )

#clear the files
> $CSS_COMBINED_FILE

#run thru the CSS files
for F in ${CSS_FILES[@]}; do
  if [ -e "$F.scss" ]
  then
    touch "$F.scss"
  fi
done
compass compile -s compressed -e production

echo '/**
 * NOVIUS OS - Web OS for digital communication
 *
 * @copyright  2011 Novius
 * @license    GNU Affero General Public License v3 or (at your option) any later version
 *             http://www.gnu.org/licenses/agpl-3.0.html
 * @link http://www.novius-os.org
 */' >> $CSS_COMBINED_FILE
for F in ${CSS_FILES[@]}; do
  if [ $F = "laGrid" ]
  then
    yui-compressor -o "$F.min.css" "$F.css"
    cat "$F.min.css" >> $CSS_COMBINED_FILE
    echo '' >> $CSS_COMBINED_FILE
  else
    cat "$F.css" >> $CSS_COMBINED_FILE
  fi
done

if [ -n "$COMPASS_WATCH" ]
then
  kill -CONT $COMPASS_WATCH
fi
