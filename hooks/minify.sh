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
  git add static/admin/bundle/nos.min.js

  SUB_DIR=( inspector media page views renderer )
  for D in ${SUB_DIR[@]}; do
    git add static/admin/novius-os/js/$D/minified/*
  done
fi

re="static/admin/vendor/tinymce/themes/nos/editor_template_src.js"
if [[ $files =~ $re ]]
then
  ./hooks/minify-nos-tiny.sh
  git add static/admin/vendor/tinymce/themes/nos/editor_template.js
fi

re="static/admin/vendor/tinymce/plugins/nos"
if [[ $files =~ $re ]]
then
  ./hooks/minify-nos-tinyplugins.sh
  git add static/admin/vendor/tinymce/plugins/nosalign/*
  git add static/admin/vendor/tinymce/plugins/nosbrclearall/*
  git add static/admin/vendor/tinymce/plugins/nosenhancer/*
  git add static/admin/vendor/tinymce/plugins/nosimage/*
  git add static/admin/vendor/tinymce/plugins/noslink/*
  git add static/admin/vendor/tinymce/plugins/nospaste/*
  git add static/admin/vendor/tinymce/plugins/nosstyleselect/*
  git add static/admin/vendor/tinymce/plugins/nostoolbartoggle/*
  git add static/admin/vendor/tinymce/plugins/nosvisualhtml/*
fi

re1="static/admin/vendor/jquery/*"
re2="static/admin/vendor/jquery-ui/*"
re3="static/admin/vendor/wijmo/*"
re4="static/admin/vendor/log.js"
if [[ $files =~ $re1 ]]
then
  ./hooks/minify-vendor-js.sh
  git add static/admin/bundle/vendor.min.js
elif [[ $files =~ $re2 ]]
then
  ./hooks/minify-vendor-js.sh
  git add static/admin/bundle/vendor.min.js
elif [[ $files =~ $re3 ]]
then
  ./hooks/minify-vendor-js.sh
  git add static/admin/bundle/vendor.min.js
elif [[ $files =~ $re4 ]]
then
  ./hooks/minify-vendor-js.sh
  git add static/admin/bundle/vendor.min.js
fi
