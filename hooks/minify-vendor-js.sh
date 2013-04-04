#!/bin/bash

# http://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../static/admin/bundle

JAVA_CMD='java'
export JAVA_CMD

JS_COMBINED_FILE="vendor.min.js"
PLUGIN_FILES=( log jquery/cookie/jquery.cookie.min jquery/globalize/globalize jquery/globalize/cultures/globalize.cultures.min jquery/mousewheel/jquery.mousewheel.min jquery/jquery-form/jquery.form.min )
UI_FILES=( core widget position mouse draggable droppable resizable sortable dialog button datepicker effect effect-blind effect-slide effect-scale effect-transfer effect-fade )
WIJMO_FILES=( wijmo.wijutil plugin.wijtextselection wijmo.wijinputcore wijmo.wijinputdate wijmo.wijinputmask wijmo.wijinputnumber wijmo.wijlist wijmo.wijpopup wijmo.wijcalendar wijmo.wijtabs wijmo.wijdatasource wijmo.wijsplitter wijmo.wijsuperpanel wijmo.wijdropdown wijmo.wijmenu wijmo.wijcheckbox wijmo.wijradio wijmo.wijexpander wijmo.wijaccordion wijmo.wijdialog wijmo.wijpager wijmo.wijtextbox wijmo.wijgrid wijmo.wijlightbox wijmo.wijtooltip )


#clear the files
> $JS_COMBINED_FILE


#run thru the JS files
for F in ${PLUGIN_FILES[@]}; do
  cat "../vendor/$F.js" >> $JS_COMBINED_FILE
  echo ';' >> $JS_COMBINED_FILE
done


for F in ${UI_FILES[@]}; do
  cat "../vendor/jquery-ui/minified/jquery.ui.$F.min.js" >> $JS_COMBINED_FILE
  echo ';' >> $JS_COMBINED_FILE
done


cat "../vendor/jquery-ui/i18n/jquery-ui-i18n.js"  >> $JS_COMBINED_FILE
echo ';' >> $JS_COMBINED_FILE


for F in ${WIJMO_FILES[@]}; do
  cat "../vendor/wijmo/js/minified/jquery.$F.min.js" >> $JS_COMBINED_FILE
  echo ';' >> $JS_COMBINED_FILE
done

echo "Compressing JS files"

yui-compressor -o "define.min.js" "define.js"
cat "define.min.js" >> $JS_COMBINED_FILE
echo '' >> $JS_COMBINED_FILE
rm "define.min.js"
