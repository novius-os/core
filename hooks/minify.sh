#!/bin/bash
files=`git diff --cached --name-status`

# http://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../

re="static/admin/novius-os/css/"
if [[ $files =~ $re ]]
then
  ./hooks/minify-nos-css.sh
  git add static/admin/novius-os/css/*
fi

re="static/admin/novius-os/js/"
if [[ $files =~ $re ]]
then
  ./hooks/minify-nos-js.sh
  git add static/admin/novius-os/js/*
fi

re="static/admin/vendor/tinymce/themes/nos/editor_template_src.js"
if [[ $files =~ $re ]]
then
  ./hooks/minify-nos-tiny.sh
  git add static/admin/vendor/tinymce/themes/nos/editor_template.js
fi
