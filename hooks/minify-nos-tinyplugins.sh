#!/bin/bash

# http://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../static/admin/vendor/tinymce/plugins/

JAVA_CMD='java'
export JAVA_CMD

PLUGINS=( nosalign nosbrclearall nosenhancer nosimage noslink nospaste nosstyleselect nostoolbartoggle nosvisualhtml )

for R in ${PLUGINS[@]}; do
    yui-compressor -o $R/editor_plugin.js $R/editor_plugin_src.js
done


