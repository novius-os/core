#!/bin/bash

# http://stackoverflow.com/questions/59895/can-a-bash-script-tell-what-directory-its-stored-in
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR/../static/admin/bundle

JAVA_CMD='java'
export JAVA_CMD

JS_COMBINED_FILE="vendor.min.js"
PLUGIN_FILES=( log jquery/bgiframe/jquery.bgiframe-2.1.3-pre jquery/cookie/jquery.cookie jquery/globalize/globalize.min jquery/mousewheel/jquery.mousewheel.min jquery/jquery-form/jquery.form.min )
UI_FILES=( ui.core ui.widget ui.position ui.mouse ui.draggable ui.droppable ui.resizable ui.sortable ui.dialog ui.button ui.datepicker effects.core effects.blind effects.slide effects.scale effects.transfer effects.fade )
WIJMO_FILES=( wijmo.wijutil plugin.wijtextselection wijmo.wijinputcore wijmo.wijinputdate wijmo.wijinputmask wijmo.wijinputnumber wijmo.wijlist wijmo.wijpopup wijmo.wijcalendar wijmo.wijtabs wijmo.wijdatasource wijmo.wijsplitter wijmo.wijsuperpanel wijmo.wijdropdown wijmo.wijmenu wijmo.wijcheckbox wijmo.wijradio wijmo.wijexpander wijmo.wijaccordion wijmo.wijdialog wijmo.wijpager wijmo.wijtextbox wijmo.wijgrid wijmo.wijlightbox wijmo.wijtooltip )


#clear the files
> $JS_COMBINED_FILE

#run thru the JS files
for F in ${PLUGIN_FILES[@]}; do
  cat "../vendor/$F.js" >> $JS_COMBINED_FILE
  echo ';' >> $JS_COMBINED_FILE
done

for F in ${UI_FILES[@]}; do
  cat "../vendor/jquery-ui/minified/jquery.$F.min.js" >> $JS_COMBINED_FILE
  echo ';' >> $JS_COMBINED_FILE
done

for F in ${WIJMO_FILES[@]}; do
  cat "../vendor/wijmo/js/minified/jquery.$F.min.js" >> $JS_COMBINED_FILE
  echo ';' >> $JS_COMBINED_FILE
done

yui-compressor -o "define.min.js" "define.js"
cat "define.min.js" >> $JS_COMBINED_FILE
echo '' >> $JS_COMBINED_FILE
rm "define.min.js"
