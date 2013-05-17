#!/bin/bash

# http://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../static/admin/bundle

JAVA_CMD='java'
export JAVA_CMD

JS_COMBINED_FILE="vendor.min.js"
PLUGIN_FILES=( log jquery/cookie/jquery.cookie.min jquery/globalize/globalize jquery/globalize/cultures/globalize.cultures.min jquery/mousewheel/jquery.mousewheel.min jquery/jquery-form/jquery.form.min )
UI_FILES=( core widget position mouse draggable droppable resizable sortable dialog button datepicker effect effect-blind effect-slide effect-scale effect-transfer effect-fade )
WIJMO_FILES=( Base/jquery.wijmo.widget data/wijmo.data data/wijmo.data.wijdatasource wijutil/jquery.wijmo.wijutil wijutil/jquery.plugin.wijtextselection wijinput/jquery.wijmo.wijinputcore wijinput/jquery.wijmo.wijinputdate wijinput/jquery.wijmo.wijinputmask wijinput/jquery.wijmo.wijinputnumber wijlist/jquery.wijmo.wijlist wijpopup/jquery.wijmo.wijpopup wijcalendar/jquery.wijmo.wijcalendar wijtabs/jquery.wijmo.wijtabs wijdatasource/jquery.wijmo.wijdatasource wijsplitter/jquery.wijmo.wijsplitter wijsuperpanel/jquery.wijmo.wijsuperpanel wijmenu/jquery.wijmo.wijmenu wijexpander/jquery.wijmo.wijexpander wijaccordion/jquery.wijmo.wijaccordion wijdialog/jquery.wijmo.wijdialog wijpager/jquery.wijmo.wijpager wijgrid/jquery.wijmo.wijgrid wijlightbox/jquery.wijmo.wijlightbox wijtooltip/jquery.wijmo.wijtooltip )


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
  cat "../vendor/wijmo/js/$F.min.js" >> $JS_COMBINED_FILE
  echo ';' >> $JS_COMBINED_FILE
done

echo "Compressing JS files"

yui-compressor -o "define.min.js" "define.js"
cat "define.min.js" >> $JS_COMBINED_FILE
echo '' >> $JS_COMBINED_FILE
rm "define.min.js"
