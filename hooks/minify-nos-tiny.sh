#!/bin/bash

# http://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../static/admin/vendor/tinymce/themes/nos/

JAVA_CMD='java'
export JAVA_CMD

yui-compressor -o editor_template.js editor_template_src.js
