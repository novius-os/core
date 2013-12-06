/*
 *
 * Wijmo Library 3.20133.20
 * http://wijmo.com/
 *
 * Copyright(c) GrapeCity, Inc.  All rights reserved.
 * 
 * Licensed under the Wijmo Commercial License. Also available under the GNU GPL Version 3 license.
 * licensing@wijmo.com
 * http://wijmo.com/widgets/license/
 *
 *
 */
var __extends = this.__extends || function (d, b) {
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../Base/jquery.wijmo.widget.ts" />
/*globals jQuery, window, XMLHttpRequest,SWFUpload,swfobject*/
/*
* Depends:
*     jquery.ui.core.js
*     jquery.ui.widget.js
*/
var wijmo;
(function (wijmo) {
    (function (upload) {
        "use strict";
        var $ = jQuery, widgetName = "wijupload";
        var uploadClass = "wijmo-wijupload", uploadFileRowClass = "wijmo-wijupload-fileRow", isUploadFileRow = "." + uploadFileRowClass, uploadFilesListClass = "wijmo-wijupload-filesList", uploadCommandRowClass = "wijmo-wijupload-commandRow", uploadUploadAllClass = "wijmo-wijupload-uploadAll", uploadCancelAllClass = "wijmo-wijupload-cancelAll", uploadButtonContainer = "wijmo-wijupload-buttonContainer", uploadUploadClass = "wijmo-wijupload-upload", isUploadUpload = "." + uploadUploadClass, uploadCancelClass = "wijmo-wijupload-cancel", isUploadCancel = "." + uploadCancelClass, uploadFileClass = "wijmo-wijupload-file", uploadProgressClass = "wijmo-wijupload-progress", uploadLoadingClass = "wijmo-wijupload-loading", wijuploadXhr, wijuploadFrm, _getFileName = function (fileName) {
            // Trim path on IE.
            if(fileName.indexOf("\\") > -1) {
                fileName = fileName.substring(fileName.lastIndexOf("\\") + 1);
            }
            return fileName;
        }, _getFileNameByInput = function (fileInput) {
            var files = fileInput.files, name = "";
            if(files) {
                $.each(files, function (i, n) {
                    name += _getFileName(n.name) + "; ";
                });
                if(name.length) {
                    name = name.substring(0, name.lastIndexOf(";"));
                }
            } else {
                name = _getFileName(fileInput.value);
            }
            return name;
        }, _getFileSize = function (file) {
            var files = file.files, size = 0;
            if(files && files.length > 0) {
                $.each(files, function (i, n) {
                    if(n.size) {
                        size += n.size;
                    }
                });
            }
            return size;
        };
        wijuploadXhr = function (uploaderId, fileRow, action) {
            var uploader, inputFile = $("input", fileRow), _cancel = function (xhr) {
                if(xhr) {
                    xhr.abort();
                    xhr = null;
                }
            }, _destroy = function (xhr) {
                if(xhr) {
                    xhr = null;
                }
            }, Uploader = function () {
                var self = this, files = inputFile.get(0).files, xhrs = [], idx = 0, uploadedSize = 0, createXHR = function (name, action) {
                    var xhttpr = new XMLHttpRequest();
                    xhttpr.open("POST", action, true);
                    xhttpr.setRequestHeader("Wijmo-RequestType", "XMLHttpRequest");
                    xhttpr.setRequestHeader("Cache-Control", "no-cache");
                    xhttpr.setRequestHeader("Wijmo-FileName", name);
                    xhttpr.setRequestHeader("Content-Type", "application/octet-stream");
                    xhttpr.upload.onprogress = function (e) {
                        if(e.lengthComputable) {
                            var obj;
                            if($.isFunction(self.onProgress)) {
                                obj = {
                                    supportProgress: true,
                                    loaded: uploadedSize + e.loaded,
                                    total: _getFileSize(inputFile[0]),
                                    fileName: _getFileName(self.currentFile.name),
                                    fileNameList: _getFileNameByInput(inputFile[0]).split("; ")
                                };
                                self.onProgress(obj);
                            }
                        }
                    };
                    xhttpr.onreadystatechange = function (e) {
                        if(this.readyState === 4) {
                            var response = this.responseText, obj;
                            uploadedSize += files[idx].size;
                            idx++;
                            if(files.length > idx) {
                                _doAjax(files[idx]);
                            } else if($.isFunction(self.onComplete)) {
                                obj = {
                                    e: e,
                                    response: response,
                                    supportProgress: true
                                };
                                self.onComplete(obj);
                            }
                        }
                    };
                    xhrs.push(xhttpr);
                    return xhttpr;
                }, _doAjax = function (file) {
                    var name = _getFileName(file.name), xhr = createXHR(name, action);
                    self.handleRequest(xhr, file);
                    self.currentFile = file;
                    xhr.send(file);
                };
                self.fileRow = fileRow;
                self.inputFile = inputFile;
                self.upload = function () {
                    _doAjax(files[idx]);
                };
                self.cancel = function () {
                    $.each(xhrs, function (i, xhr) {
                        _cancel(xhr);
                    });
                    if($.isFunction(self.onCancel)) {
                        self.onCancel();
                    }
                };
                self.destroy = function () {
                    $.each(xhrs, function (i, xhr) {
                        _destroy(xhr);
                    });
                };
                self.updateAction = function (act) {
                    action = act;
                };
                self.handleRequest = null;
                self.onCancel = null;
                self.onComplete = null;
                self.onProgress = null;
            };
            uploader = new Uploader();
            return uploader;
        };
        wijuploadFrm = function (uploaderId, fileRow, action) {
            var uploader, inputFile = $("input", fileRow), inputFileId = inputFile.attr("id"), formId = "wijUploadForm_" + uploaderId, form = $("#" + formId), iframeId = "wijUploadIfm_" + inputFileId, isFirstLoad = true, iframe = $("<iframe id=\"" + iframeId + "\" name=\"" + iframeId + "\">"), _upload = //	ifm = $("<iframe src=\"javascript:false;\" id=\"" +
            // id + "\" name=\"" + id + "\">");
            //"javascript".concat(":false;")
            //src="javascript:false;" removes ie6 prompt on https
            function (ifm, iptFile) {
                form.empty();
                form.attr("target", ifm.attr("name"));
                if(iptFile) {
                    iptFile.parent().append(iptFile.clone());
                    form.append(iptFile);
                }
                form.submit();
            }, _cancel = function (ifm) {
                // to cancel request set src to something else
                // we use src="javascript:false;" because it doesn't
                // trigger ie6 prompt on https
                ifm.attr("src", "javascript".concat(":false;"));
            }, _destroy = function (ifm, removeForm) {
                if(removeForm && form) {
                    form.remove();
                    form = null;
                }
                if(ifm) {
                    ifm.remove();
                    ifm = null;
                }
            }, Uploader;
            if(form.length === 0) {
                form = $("<form method=\"post\" enctype=\"multipart/form-data\"></form>");
                form.attr("action", action).attr("id", formId).attr("name", formId).appendTo("body");
            }
            iframe.css("position", "absolute").css("top", "-1000px").css("left", "-1000px");
            iframe.appendTo("body");
            Uploader = function () {
                var self = this;
                self.fileRow = fileRow;
                self.iframe = iframe;
                self.inputFile = inputFile;
                self.upload = function () {
                    var obj;
                    _upload(iframe, inputFile);
                    if($.isFunction(self.onProgress)) {
                        obj = {
                            supportProgress: false,
                            loaded: 1,
                            total: 1
                        };
                        self.onProgress(obj);
                    }
                };
                self.doPost = function () {
                    _upload(iframe);
                };
                self.cancel = function () {
                    _cancel(iframe);
                    if($.isFunction(self.onCancel)) {
                        self.onCancel();
                    }
                };
                self.updateAction = function (act) {
                    action = act;
                    form.attr("action", act);
                };
                self.destroy = function (removeForm) {
                    _destroy(iframe, removeForm);
                };
                self.onCancel = null;
                self.onComplete = null;
                self.onProgress = null;
                iframe.bind("load", function (e) {
                    if(!$.browser.safari) {
                        if(isFirstLoad && !self.autoSubmit) {
                            isFirstLoad = false;
                            return;
                        }
                    }
                    if(iframe.attr("src") === "javascript".concat(":false;")) {
                        return;
                    }
                    var target = e.target, response, doc, obj;
                    try  {
                        doc = target.contentDocument ? target.contentDocument : window.frames[0].document;
                        //if (doc.readyState && doc.readyState !== "complete") {
                        //	return;
                        //}
                        if(doc.XMLDocument) {
                            response = doc.XMLDocument;
                        } else if(doc.body) {
                            response = doc.body.innerHTML;
                        } else {
                            response = doc;
                        }
                        if($.isFunction(self.onComplete)) {
                            obj = {
                                e: e,
                                response: response,
                                supportProgress: false
                            };
                            self.onComplete(obj);
                        }
                    } catch (ex) {
                        response = "";
                    }finally {
                        //iframe.unbind("load");
                                            }
                });
            };
            uploader = new Uploader();
            return uploader;
        };
        /** @widget */
        var wijupload = (function (_super) {
            __extends(wijupload, _super);
            function wijupload() {
                _super.apply(this, arguments);

            }
            wijupload.prototype._swfAppendAddtionalData = function (swfupload) {
                swfupload.queueData = {
                    files: {
                    },
                    filesSelected: // The files in the queue
                    0,
                    filesQueued: // The number of files selected in the last select operation
                    0,
                    filesReplaced: // The number of files added to the queue in the last select operation
                    0,
                    filesCancelled: // The number of files replaced in the last select operation
                    0,
                    filesErrored: // The number of files that were cancelled instead of replaced
                    0,
                    uploadsSuccessful: // The number of files that caused error in the last select operation
                    0,
                    uploadsErrored: // The number of files that were successfully uploaded
                    0,
                    averageSpeed: // The number of files that returned errors during upload
                    0,
                    queueLength: // The average speed of the uploads in KB
                    0,
                    queueSize: // The number of files in the queue
                    0,
                    uploadSize: // The size in bytes of the entire queue
                    0,
                    queueBytesUploaded: // The size in bytes of the upload queue
                    0,
                    uploadQueue: // The size in bytes that have been uploaded for the current upload queue
                    [],
                    errorMsg: // The files currently to be uploaded
                    ''
                };
                //Some files were not added to the queue:
                swfupload.widget = this;
            };
            wijupload.prototype._swfGetHandlers = function () {
                var widget = this, el = widget.element;
                return {
                    onSelect: function (file) {
                        var swfupload = this;
                        var queuedFile = {
                        };
                        if(widget._trigger("change", null, file) === false) {
                            return false;
                        }
                        widget._createFileRow(file);
                        this.queueData.queueSize += file.size;
                        this.queueData.files[file.id] = file;
                    },
                    onSelectError: function (file, errorCode) {
                        if(errorCode == SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT) {
                            alert("File size exceeds the limitation!");
                        } else if(errorCode == SWFUpload.QUEUE_ERROR.QUEUE_LIMIT_EXCEEDED) {
                            alert("Too many files!");
                        }
                    },
                    onDialogOpen: function () {
                        //prepare
                        this.queueData.filesReplaced = 0;
                        this.queueData.filesCancelled = 0;
                    },
                    onDialogClose: function (filesSelected, filesQueued, queueLength) {
                        // start upload
                        var settings = this.settings;
                        // Update the queue information
                        this.queueData.filesErrored = filesSelected - filesQueued;
                        this.queueData.filesSelected = filesSelected;
                        this.queueData.filesQueued = filesQueued - this.queueData.filesCancelled;
                        this.queueData.queueLength = queueLength;
                        widget.isStartUpload = false;
                        // Call the user-defined event handler
                        if(widget.options.autoSubmit) {
                            widget.uploadAll = true;
                            widget._swfUploadFile();
                        }
                        if(settings.onDialogClose) {
                            settings.onDialogClose.call(this, this.queueData);
                        }
                    },
                    onUploadStart: function (file) {
                        this.bytesLoaded = 0;
                        if(this.queueData.uploadQueue.length == 0) {
                            this.queueData.uploadSize = file.size;
                        }
                        if(!widget.isStartUpload && widget.uploadAll) {
                            if(widget._trigger("totalUpload", null, null) === false) {
                                this.cancelUpload();
                                return false;
                            }
                            widget.isStartUpload = true;
                        }
                        if(widget._trigger("upload", null, file) === false) {
                            this.cancelUpload(file.id);
                            return false;
                        }
                    },
                    onUploadProgress: function (file, fileBytesLoaded, fileTotalBytes) {
                        var fileRow = $("#" + file.id, el), loaded, total, percentage = Math.round(fileBytesLoaded / fileTotalBytes * 100), progressSpan = $("." + uploadProgressClass, fileRow), data = {
                            sender: file.name,
                            loaded: fileBytesLoaded,
                            total: fileTotalBytes
                        }, queue = this.queueData;
                        progressSpan.html(percentage + "%");
                        widget._trigger("progress", null, data);
                        loaded = queue.queueBytesUploaded + fileBytesLoaded;
                        total = queue.queueSize;
                        widget._updateSwfProgress(loaded, total);
                        widget._trigger("totalProgress", null, {
                            loaded: loaded,
                            total: total
                        });
                    },
                    onUploadError: function (file, errorCode, errorMsg) {
                        // Load the swfupload settings
                                                var settings = this.settings, fileRow = $("#" + file.id, el), progressSpan = $("." + uploadProgressClass, fileRow);
                        // Set the error string
                        var errorString = 'Error';
                        switch(errorCode) {
                            case SWFUpload.UPLOAD_ERROR.HTTP_ERROR:
                                errorString = 'HTTP Error (' + errorMsg + ')';
                                break;
                            case SWFUpload.UPLOAD_ERROR.MISSING_UPLOAD_URL:
                                errorString = 'Missing Upload URL';
                                break;
                            case SWFUpload.UPLOAD_ERROR.IO_ERROR:
                                errorString = 'IO Error';
                                break;
                            case SWFUpload.UPLOAD_ERROR.SECURITY_ERROR:
                                errorString = 'Security Error';
                                break;
                            case SWFUpload.UPLOAD_ERROR.UPLOAD_LIMIT_EXCEEDED:
                                alert('The upload limit has been reached (' + errorMsg + ').');
                                errorString = 'Exceeds Upload Limit';
                                break;
                            case SWFUpload.UPLOAD_ERROR.UPLOAD_FAILED:
                                errorString = 'Failed';
                                break;
                            case SWFUpload.UPLOAD_ERROR.SPECIFIED_FILE_ID_NOT_FOUND:
                                break;
                            case SWFUpload.UPLOAD_ERROR.FILE_VALIDATION_FAILED:
                                errorString = 'Validation Error';
                                break;
                            case SWFUpload.UPLOAD_ERROR.FILE_CANCELLED:
                                errorString = 'Cancelled';
                                this.queueData.queueSize -= file.size;
                                this.queueData.queueLength -= 1;
                                if(file.status == SWFUpload.FILE_STATUS.IN_PROGRESS || $.inArray(file.id, this.queueData.uploadQueue) >= 0) {
                                    this.queueData.uploadSize -= file.size;
                                }
                                // Trigger the onCancel event
                                if(settings.onCancel) {
                                    settings.onCancel.call(this, file);
                                }
                                delete this.queueData.files[file.id];
                                break;
                            case SWFUpload.UPLOAD_ERROR.UPLOAD_STOPPED:
                                errorString = 'Stopped';
                                break;
                        }
                        progressSpan.text(errorString);
                        var stats = this.getStats();
                        this.queueData.uploadsErrored = stats.upload_errors;
                    },
                    onUploadSuccess: function (file, data, response) {
                        var stats = this.getStats();
                        this.queueData.uploadsSuccessful = stats.successful_uploads;
                        this.queueData.queueBytesUploaded += file.size;
                        this.queueData.response = response;
                        var fileRow = $("#" + file.id, el), self = this;
                        self.queueData.queueLength -= 1;
                        fileRow.fadeOut(1500, function () {
                            fileRow.remove();
                            if(widget.options.showUploadedFiles) {
                                widget._createUploadedFiles(file.name);
                            }
                            if(!self.queueData.queueLength) {
                                widget.commandRow.hide();
                            }
                        });
                        widget._trigger("complete", null, {
                            response: response
                        });
                    },
                    onUploadComplete: function (file, data, response) {
                        var self = this;
                        if(!self.queueData.queueLength && widget.uploadAll) {
                            widget._cleanSwfProgress();
                            widget._trigger("totalComplete", null, self.queueData);
                        }
                        if(widget.uploadAll) {
                            widget._swfUploadFile();
                        }
                    }
                };
            };
            wijupload.prototype._cleanSwfProgress = function () {
            };
            wijupload.prototype._updateSwfProgress = function (loaded, total) {
            };
            wijupload.prototype._initSwfUploadOptions = function (w, h) {
                var self = this, el = self.element, settings, handlers = self._swfGetHandlers(), o = self.options, swfOptions = self.options.swfUploadOptions, id = el.attr("id"), inputId = id + "_SWFUpload";
                $("<input type='file' id='" + inputId + "'>").appendTo(el);
                //uploadify
                settings = $.extend({
                    id: inputId,
                    swf: 'SWFUpload.swf',
                    auto: // Options
                    false,
                    buttonClass: '',
                    buttonCursor: 'hand',
                    buttonImage: null,
                    checkExisting: // (String or null) The path to an image to use for the Flash browse button if not using CSS to style the button
                    false,
                    debug: // The path to a server-side script that checks for existing files on the server
                    false,
                    fileObjName: // Turn on swfUpload debugging mode
                    'Filedata',
                    fileSizeLimit: // The name of the file object to use in your server-side script
                    o.maximumFileSize ? o.maximumFileSize : 0,
                    fileTypeDesc: // The maximum size of an uploadable file in KB (Accepts units B KB MB GB if string, 0 for no limit)
                    'All Files',
                    fileTypeExts: // The description for file types in the browse dialog
                    o.accept ? o.accept : '*.*',
                    height: // Allowed extensions in the browse dialog (server-side validation should also be used)
                    h,
                    itemTemplate: // The height of the browse button
                    false,
                    method: // The template for the file item in the queue
                    'post',
                    multi: // The method to use when sending files to the server-side upload script
                    o.multiple,
                    formData: // Allow multiple file selection in the browse dialog
                    {
                    },
                    preventCaching: // An object with additional data to send to the server-side upload script with every file upload
                    true,
                    progressData: // Adds a random value to the Flash URL to prevent caching of it (conflicts with existing parameters)
                    'percentage',
                    queueID: // ('percentage' or 'speed') Data to show in the queue item during a file upload
                    false,
                    queueSizeLimit: // The ID of the DOM object to use as a file queue (without the #)
                    o.maximumFiles ? o.maximumFiles : 999,
                    removeCompleted: // The maximum number of files that can be in the queue at one time
                    true,
                    removeTimeout: // Remove queue items from the queue when they are done uploading
                    3,
                    requeueErrors: // The delay in seconds before removing a queue item if removeCompleted is set to true
                    false,
                    successTimeout: // Keep errored files in the queue and keep trying to upload them
                    30,
                    uploadLimit: // The number of seconds to wait for Flash to detect the server's response after the file has finished uploading
                    0,
                    width: // The maximum number of files you can upload
                    w,
                    uploader: // The width of the browse button
                    o.action,
                    overrideEvents: // Events
                    []
                }, // (Array) A list of default event handlers to skip
                swfOptions);
                return {
                    assume_success_timeout: settings.successTimeout,
                    button_placeholder_id: settings.id,
                    button_width: settings.width,
                    button_height: settings.height,
                    button_text: null,
                    button_text_style: null,
                    button_text_top_padding: 0,
                    button_text_left_padding: 0,
                    button_action: (o.multiple ? SWFUpload.BUTTON_ACTION.SELECT_FILES : SWFUpload.BUTTON_ACTION.SELECT_FILE),
                    button_disabled: false,
                    button_cursor: (settings.buttonCursor == 'arrow' ? SWFUpload.CURSOR.ARROW : SWFUpload.CURSOR.HAND),
                    button_window_mode: SWFUpload.WINDOW_MODE.TRANSPARENT,
                    debug: settings.debug,
                    requeue_on_error: settings.requeueErrors,
                    file_post_name: settings.fileObjName,
                    file_size_limit: settings.fileSizeLimit,
                    file_types: settings.fileTypeExts,
                    file_types_description: settings.fileTypeDesc,
                    file_queue_limit: settings.queueSizeLimit,
                    file_upload_limit: settings.uploadLimit,
                    flash_url: settings.swf,
                    prevent_swf_caching: settings.preventCaching,
                    post_params: settings.formData,
                    upload_url: settings.uploader,
                    use_query_string: (settings.method == 'get'),
                    file_dialog_complete_handler: // Event Handlers
                    handlers.onDialogClose,
                    file_dialog_start_handler: handlers.onDialogOpen,
                    file_queued_handler: handlers.onSelect,
                    file_queue_error_handler: handlers.onSelectError,
                    swfupload_loaded_handler: settings.onSWFReady,
                    upload_complete_handler: handlers.onUploadComplete,
                    upload_error_handler: handlers.onUploadError,
                    upload_progress_handler: handlers.onUploadProgress,
                    upload_start_handler: handlers.onUploadStart,
                    upload_success_handler: handlers.onUploadSuccess
                };
            };
            wijupload.prototype._createSWFUpload = function () {
                var self = this, el = self.element, btn = self.addBtn, swfOptions, settings = self.options.swfUploadOptions, swfupload, w = btn.width(), h = btn.height();
                var playerVersion = swfobject.getFlashPlayerVersion();
                var flashInstalled = (playerVersion.major >= 9);
                if(flashInstalled) {
                    swfOptions = self._initSwfUploadOptions(w, h);
                    swfupload = new SWFUpload(swfOptions);
                    // Add the SWFUpload object to the elements data object
                    self.swfupload = swfupload;
                    $('#' + swfupload.movieName).css({
                        'position': 'absolute',
                        'z-index': 100,
                        'top': 0,
                        'left': 0,
                        'width': w,
                        'height': h
                    });
                    self._swfAppendAddtionalData(swfupload);
                } else {
                    alert("Please install flash player.");
                    if(settings && settings.onFallback) {
                        settings.onFallback.call();
                    }
                }
            };
            wijupload.prototype._create = function () {
                var self = this, o = self.options, id = new Date().getTime(), useXhr = self.supportXhr();
                // enable touch support:
                if(window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }
                self.filesLen = 0;
                self.totalUploadFiles = 0;
                self.useXhr = useXhr;
                self.id = id;
                self._createContainers();
                self._createUploadButton();
                if((o.enableSWFUploadOnIE && $.browser.msie) || o.enableSWFUpload) {
                    self._createSWFUpload();
                } else {
                    self._createFileInput();
                }
                self._bindEvents();
                //Add for support disabled option at 2011/7/8
                if(o.disabled) {
                    self.disable();
                }
                //end for disabled option
                if(self.element.is(":hidden") && self.element.wijAddVisibilityObserver) {
                    self.element.wijAddVisibilityObserver(function () {
                        self._applyInputPosition();
                        if(self.element.wijRemoveVisibilityObserver) {
                            self.element.wijRemoveVisibilityObserver();
                        }
                    }, "wijupload");
                }
            };
            wijupload.prototype._setOption = function (key, value) {
                var self = this;
                $.Widget.prototype._setOption.apply(this, arguments);
                //Add for support disabled option at 2011/7/8
                if(key === "disabled") {
                    self._handleDisabledOption(value, self.upload);
                } else //end for disabled option
                if(key === "accept") {
                    if(self.input) {
                        self.input.attr("accept", value);
                    }
                }
            };
            wijupload.prototype._handleDisabledOption = function (disabled, ele) {
                var self = this;
                if(disabled) {
                    if(!self.disabledDiv) {
                        self.disabledDiv = self._createDisabledDiv(ele);
                    }
                    self.disabledDiv.appendTo("body");
                } else {
                    if(self.disabledDiv) {
                        self.disabledDiv.remove();
                        self.disabledDiv = null;
                    }
                }
            };
            wijupload.prototype._createDisabledDiv = function (outerEle) {
                var self = this, div, ele = //Change your outerelement here
                outerEle ? outerEle : self.upload, eleOffset = ele.offset(), disabledWidth = ele.outerWidth(), disabledHeight = ele.outerHeight();
                div = $("<div></div>").addClass("ui-disabled").css({
                    "z-index": "99999",
                    position: "absolute",
                    width: disabledWidth,
                    height: disabledHeight,
                    left: eleOffset.left,
                    top: eleOffset.top
                });
                if($.browser.msie) {
                    div.css("background-color", "white");
                    if(parseInt($.browser.version) >= 9) {
                        div.css("opacity", "0.1");
                    }
                }
                return div;
            };
            wijupload.prototype.destroy = /**
            * Removes the wijupload functionality completely.This will return the element back to its pre - init state.
            * @example $(" selector ").wijupload("destroy");
            */
            function () {
                var self = this;
                self.upload.removeClass(uploadClass);
                self.upload.undelegate(self.widgetName).undelegate("." + self.widgetName);
                self.input.remove();
                self.addBtn.remove();
                self.filesList.remove();
                self.commandRow.remove();
                if(self.isCreateByInput === true) {
                    self.element.css({
                        display: ""
                    }).unwrap();
                }
                if(self.uploaders) {
                    $.each(self.uploaders, function (idx, uploader) {
                        if(uploader.destroy) {
                            uploader.destroy(true);
                        }
                        uploader = null;
                    });
                    self.uploaders = null;
                }
                //Add for support disabled option at 2011/7/8
                if(self.disabledDiv) {
                    self.disabledDiv.remove();
                    self.disabledDiv = null;
                }
                //end for disabled option
                            };
            wijupload.prototype.widget = /**
            * Returns the.wijmo - wijupload element.
            * @example $(" selector ").wijupload("widget");
            */
            function () {
                return this.upload;
            };
            wijupload.prototype.supportXhr = /** @ignore */
            function () {
                var useXhr = false;
                if(typeof (new XMLHttpRequest().upload) === "undefined") {
                    useXhr = false;
                } else {
                    useXhr = true;
                }
                return useXhr;
            };
            wijupload.prototype._createContainers = function () {
                var self = this, filesList, commandRow, el = self.element;
                if(el.is(":input") && el.attr("type") === "file") {
                    self.isCreateByInput = true;
                    self.maxDisplay = (el.attr("multiple") || self.options.multiple) ? 0 : 1;
                    self.upload = el.css({
                        display: "none"
                    }).wrap("<div>").parent();
                } else if(self.element.is("div")) {
                    self.maxDisplay = self.options.multiple ? 0 : 1;
                    self.upload = el;
                } else {
                    throw 'The initial markup must be "DIV", "INPUT[type=file]"';
                }
                self.upload.addClass(uploadClass);
                filesList = $("<ul>").addClass(uploadFilesListClass).appendTo(self.upload);
                commandRow = $("<div>").addClass(uploadCommandRowClass).appendTo(self.upload);
                self.filesList = filesList;
                commandRow.hide();
                self.commandRow = commandRow;
                self._createCommandRow(commandRow);
            };
            wijupload.prototype._createCommandRow = function (commandRow) {
                var self = this, o = self.options, uploadAllBtn = $("<a>").attr("href", "#").text("uploadAll").addClass(uploadUploadAllClass).button({
                    icons: {
                        primary: o.wijCSS.iconCircleArrowN
                    },
                    label: self._getLocalization("uploadAll", "Upload All")
                }).button("widget").addClass(o.wijCSS.stateDefault), cancelAllBtn = $("<a>").attr("href", "#").text("cancelAll").addClass(uploadCancelAllClass).button({
                    icons: {
                        primary: o.wijCSS.iconCancel
                    },
                    label: self._getLocalization("cancelAll", "Cancel All")
                }).button("widget").addClass(o.wijCSS.stateDefault);
                commandRow.append(uploadAllBtn).append(cancelAllBtn);
            };
            wijupload.prototype._getLocalization = function (key, defaultVal) {
                var lo = this.options.localization;
                return (lo && lo[key]) || defaultVal;
            };
            wijupload.prototype._createUploadButton = function () {
                var self = this, o = self.options, addBtn = $("<a>").attr("href", "javascript:void(0);").button({
                    label: self._getLocalization("uploadFiles", "Upload files")
                }).button("widget").addClass(o.wijCSS.stateDefault);
                addBtn.mousemove(function (e) {
                    var disabled = addBtn.data("uiButton").options.disabled;
                    if(self.input) {
                        var pageX = e.pageX, pageY = e.pageY;
                        if(!disabled) {
                            self.input.offset({
                                left: pageX + 10 - self.input.width(),
                                top: pageY + 10 - self.input.height()
                            });
                        }
                    }
                });
                self.addBtn = addBtn;
                self.upload.prepend(addBtn);
            };
            wijupload.prototype._applyInputPosition = function () {
                var self = this, addBtn = self.addBtn, addBtnOffset = addBtn.offset(), fileInput = self.cuurentInput;
                fileInput.offset({
                    left: addBtnOffset.left + addBtn.width() - fileInput.width(),
                    top: addBtnOffset.top
                }).height(addBtn.height());
            };
            wijupload.prototype._createFileInput = function () {
                var self = this, addBtn = self.addBtn, addBtnOffset = addBtn.offset(), accept = self.element.attr("accept") || self.options.accept, id = "wijUpload_" + self.id + "_input" + self.filesLen, fileInput = $("<input>").attr("type", "file").prependTo(self.upload), maxFiles = self.options.maximumFiles || self.maxDisplay;
                if(maxFiles !== 1 && self.maxDisplay === 0) {
                    fileInput.attr("multiple", "multiple");
                }
                if(accept) {
                    fileInput.attr("accept", accept);
                }
                self.cuurentInput = fileInput;
                self.filesLen++;
                fileInput.attr("id", id).attr("name", id).css("position", "absolute").offset({
                    left: addBtnOffset.left + addBtn.width() - fileInput.width(),
                    top: addBtnOffset.top
                }).css("z-index", "9999").css("opacity", 0).height(addBtn.height()).css("cursor", "pointer");
                self.input = fileInput;
                fileInput.bind("change", function (e) {
                    var fileRow, uploadBtn;
                    if(self._trigger("change", e, $(this)) === false) {
                        return false;
                    }
                    self._createFileInput();
                    fileRow = self._createFileRow($(this));
                    self._setAddBtnState();
                    if(self.options.autoSubmit) {
                        uploadBtn = $(isUploadUpload, fileRow);
                        if(uploadBtn) {
                            uploadBtn.click();
                        }
                    }
                    fileInput.unbind("change");
                });
                self.uploadAll = false;
            };
            wijupload.prototype._createUploadedFiles = function (name) {
            };
            wijupload.prototype._setAddBtnState = function () {
                var self = this, maxFiles = self.options.maximumFiles || self.maxDisplay, addBtn = self.addBtn, files;
                if(!maxFiles) {
                    return;
                }
                if(!addBtn) {
                    return;
                }
                if(!self.maskDiv) {
                    self.maskDiv = $("<div></div>").css("position", "absolute").css(//.css("background-color", "red")
                    "z-index", "9999").width(addBtn.outerWidth()).height(addBtn.outerHeight()).appendTo(self.upload).offset(addBtn.offset());
                }
                files = $("li", self.filesList);
                if(files.length >= maxFiles) {
                    addBtn.button({
                        disabled: true
                    });
                    self.maskDiv.show();
                    if(self.input) {
                        self.input.css("left", "-1000px");
                    }
                } else {
                    addBtn.button({
                        disabled: false
                    });
                    self.maskDiv.hide();
                }
            };
            wijupload.prototype._createFileRow = function (uploadFile) {
                var self = this, o = self.options, fileRow = $("<li>"), fileName = '', file, progress, fileRows, buttonContainer = $("<span>").addClass(uploadButtonContainer), uploadBtn = $("<a>").attr("href", "#").text("upload").addClass(uploadUploadClass).button({
                    text: false,
                    icons: {
                        primary: o.wijCSS.iconCircleArrowN
                    },
                    label: self._getLocalization("upload", "upload")
                }).button("widget").addClass(o.wijCSS.stateDefault), cancelBtn = $("<a>").attr("href", "#").text("cancel").addClass(uploadCancelClass).button({
                    text: false,
                    icons: {
                        primary: o.wijCSS.iconCancel
                    },
                    label: self._getLocalization("cancel", "cancel")
                }).button("widget").addClass(o.wijCSS.stateDefault);
                fileRow.addClass(uploadFileRowClass).addClass(o.wijCSS.content).addClass(o.wijCSS.cornerAll);
                if((o.enableSWFUploadOnIE && $.browser.msie) || o.enableSWFUpload) {
                    fileName = uploadFile.name;
                    fileRow.attr("id", uploadFile.id).data("file", uploadFile);
                } else {
                    fileRow.append(uploadFile);
                    uploadFile.hide();
                    fileName = _getFileNameByInput(uploadFile[0]);
                }
                file = $("<span>" + fileName + "</span>").addClass(uploadFileClass).addClass(o.wijCSS.stateHighlight).addClass(o.wijCSS.cornerAll);
                fileRow.append(file);
                fileRow.append(buttonContainer);
                progress = $("<span />").addClass(uploadProgressClass);
                buttonContainer.append(progress);
                buttonContainer.append(uploadBtn).append(cancelBtn);
                fileRow.appendTo(self.filesList);
                fileRows = $(isUploadFileRow, self.upload);
                if(fileRows.length) {
                    self.commandRow.show();
                    if((!o.enableSWFUploadOnIE || !$.browser.msie) && !o.enableSWFUpload) {
                        self._createUploader(fileRow);
                    }
                    self._resetProgressAll();
                }
                return fileRow;
            };
            wijupload.prototype._createUploader = function (fileRow) {
                var self = this, inputFile = $("input", fileRow), action = self.options.action, hr = self.options.handleRequest, uploader;
                if(self.useXhr) {
                    uploader = wijuploadXhr(self.id, fileRow, action);
                    uploader.handleRequest = function (xhr, file) {
                        if($.isFunction(hr)) {
                            hr.call(self, xhr, file);
                        }
                    };
                } else {
                    uploader = wijuploadFrm(self.id, fileRow, action);
                }
                uploader.onCancel = function () {
                    var t = this;
                    self._trigger("cancel", null, t.inputFile);
                    //self.totalUploadFiles--;
                    if(self.totalUploadFiles === 0 && self.uploadAll) {
                        self._trigger("totalComplete");
                    }
                };
                if(self._wijUpload()) {
                    uploader.onProgress = function (obj) {
                        var progressSpan = $("." + uploadProgressClass, this.fileRow), data = {
                            sender: obj.fileName,
                            loaded: obj.loaded,
                            total: obj.total,
                            fileNameList: undefined
                        }, id = this.inputFile.attr("id");
                        if(obj.supportProgress) {
                            progressSpan.html(Math.round(1000 * obj.loaded / obj.total) / 10 + "%");
                            if(obj.fileNameList) {
                                data.fileNameList = obj.fileNameList;
                            }
                            self._trigger("progress", null, data);
                            self._progressTotal(id, obj.loaded);
                        } else {
                            progressSpan.addClass(uploadLoadingClass);
                        }
                    };
                    uploader.onComplete = function (obj) {
                        var t = this, id = t.inputFile.attr("id"), uploader = self.uploaders[id], fileSize = //fileName = _getFileName(t.inputFile.val()),
                        _getFileSize(t.inputFile[0]), progressSpan = $("." + uploadProgressClass, t.fileRow);
                        //xhr = obj.e.currentTarget;
                        //					if (xhr.status != 200) {
                        //						throw xhr;
                        //					}
                        self._trigger("complete", obj.e, t.inputFile);
                        progressSpan.removeClass(uploadLoadingClass);
                        progressSpan.html("100%");
                        self._removeFileRow(t.fileRow, uploader, true);
                        self._progressTotal(id, fileSize);
                        self.totalUploadFiles--;
                        if(self.totalUploadFiles === 0 && (self.uploadAll || self.options.autoSubmit)) {
                            self._trigger("totalComplete", obj.e, obj);
                        }
                    };
                }
                if(typeof (self.uploaders) === "undefined") {
                    self.uploaders = {
                    };
                }
                self.uploaders[inputFile.attr("id")] = uploader;
            };
            wijupload.prototype._progressTotal = function (fileName, loadedSize) {
                var self = this, progressAll = self.progressAll, loaded, total;
                if(!self.uploadAll) {
                    return;
                }
                if(progressAll && progressAll.loadedSize) {
                    progressAll.loadedSize[fileName] = loadedSize;
                    loaded = self._getLoadedSize(progressAll.loadedSize);
                    total = progressAll.totalSize;
                }
                self._trigger("totalProgress", null, {
                    loaded: loaded,
                    total: total
                });
            };
            wijupload.prototype._getLoadedSize = function (loadedSize) {
                var loaded = 0;
                $.each(loadedSize, function (key, value) {
                    loaded += value;
                });
                return loaded;
            };
            wijupload.prototype._getTotalSize = function () {
                var self = this, total = 0;
                if(self.uploaders) {
                    $.each(self.uploaders, function (key, uploader) {
                        total += _getFileSize(uploader.inputFile[0]);
                    });
                }
                return total;
            };
            wijupload.prototype._resetProgressAll = function () {
                this.progressAll = {
                    totalSize: 0,
                    loadedSize: {
                    }
                };
            };
            wijupload.prototype._wijUpload = function () {
                //return this.widgetName === "wijupload";
                return true;
            };
            wijupload.prototype._wijcancel = function (fileInput) {
            };
            wijupload.prototype._upload = function (fileRow, isUpload) {
            };
            wijupload.prototype._swfUploadFile = function (fileName) {
                this.swfupload.startUpload(fileName);
            };
            wijupload.prototype._bindEvents = function () {
                var self = this, o = self.options, progressAll = self.progressAll;
                self.upload.delegate(isUploadCancel, "click." + self.widgetName, function (e) {
                    var cancelBtn = $(this), fileRow = cancelBtn.parents(isUploadFileRow), fileInput, uploader;
                    if((o.enableSWFUploadOnIE && $.browser.msie) || o.enableSWFUpload) {
                        var file = fileRow.data("file");
                        //self.swfupload.queueData.queueSize -= file.size;
                        //self.swfupload.queueData.queueLength -= 1;
                        self.swfupload.cancelUpload(file.id);
                        fileRow.fadeOut(1500, function () {
                            fileRow.remove();
                            if(self.swfupload.queueData.queueLength == 0) {
                                self.commandRow.hide();
                            }
                        });
                    } else {
                        fileInput = $("input", fileRow[0]);
                        uploader = self.uploaders[fileInput.attr("id")];
                        self._wijcancel(fileInput);
                        if(self._wijUpload() && uploader) {
                            uploader.cancel();
                        }
                        if(progressAll) {
                            progressAll.totalSize -= _getFileSize(fileInput[0]);
                            if(progressAll.loadedSize[fileInput.val()]) {
                                delete progressAll.loadedSize[fileInput.val()];
                            }
                        }
                        self._removeFileRow(fileRow, uploader, false);
                    }
                });
                self.upload.delegate(isUploadUpload, "click." + self.widgetName, function (e) {
                    var uploadBtn = $(this), fileRow = uploadBtn.parents(isUploadFileRow), fileInput, uploader;
                    if((o.enableSWFUploadOnIE && $.browser.msie) || o.enableSWFUpload) {
                        var file = fileRow.data("file");
                        self.uploadAll = false;
                        if(self._wijUpload()) {
                            self._swfUploadFile(file.id);
                        } else {
                            self._upload(file.id, true);
                        }
                    } else {
                        fileInput = $("input", fileRow[0]);
                        uploader = self.uploaders[fileInput.attr("id")];
                        if(self._trigger("upload", e, fileInput) === false) {
                            return false;
                        }
                        if(self.options.autoSubmit) {
                            //when autoSubmit set to "true", will trigger "totalUpload" immediately.
                            //self.uploadAll = true; //fixed bug 23877
                            uploader.autoSubmit = true;
                            if(self._trigger("totalUpload", e, null) === false) {
                                return false;
                            }
                        }
                        self.totalUploadFiles++;
                        self._upload(fileRow);
                        if(uploader && self._wijUpload()) {
                            uploader.upload();
                        }
                    }
                    e.preventDefault();
                });
                self.upload.delegate("." + uploadUploadAllClass, "click." + self.widgetName, function (e) {
                    if((o.enableSWFUploadOnIE && $.browser.msie) || o.enableSWFUpload) {
                        self.uploadAll = true;
                        if(self._wijUpload()) {
                            self._swfUploadFile();
                        } else {
                            self._upload(true, true);
                        }
                    } else {
                        self.uploadAll = true;
                        if(!self.progressAll) {
                            self._resetProgressAll();
                        }
                        if(self._trigger("totalUpload", e, null) === false) {
                            return false;
                        }
                        self.progressAll.totalSize = self._getTotalSize();
                        self._wijuploadAll($(isUploadUpload, self.filesList[0]));
                        if(self._wijUpload()) {
                            $(isUploadUpload, self.filesList[0]).each(function (idx, uploadBtn) {
                                $(uploadBtn).click();
                                return idx;
                            });
                        }
                    }
                });
                self.upload.delegate("." + uploadCancelAllClass, "click." + self.widgetName, function (e) {
                    if((o.enableSWFUploadOnIE && $.browser.msie) || o.enableSWFUpload) {
                        $.each(self.swfupload.queueData.files, function (key, v) {
                            self.swfupload.cancelUpload(key);
                        });
                        $(isUploadFileRow, self.element).fadeOut(1500, function () {
                            $(this).remove();
                            self.commandRow.hide();
                        });
                    } else {
                        self._resetProgressAll();
                        $(isUploadCancel, self.filesList[0]).each(function (idx, cancelBtn) {
                            $(cancelBtn).click();
                        });
                    }
                });
            };
            wijupload.prototype._wijuploadAll = function (uploadBtns) {
            };
            wijupload.prototype._wijFileRowRemoved = function (fileRow, fileInput, isComplete) {
                this._setAddBtnState();
            };
            wijupload.prototype._removeFileRow = function (fileRow, uploader, isComplete) {
                var self = this, inputFileId, files;
                if(uploader) {
                    inputFileId = uploader.inputFile.attr("id");
                }
                fileRow.fadeOut(1500, function () {
                    fileRow.remove();
                    self._wijFileRowRemoved(fileRow, uploader.inputFile, isComplete);
                    if(self.uploaders[inputFileId]) {
                        delete self.uploaders[inputFileId];
                    }
                    files = $(isUploadFileRow, self.upload);
                    if(files.length) {
                        self.commandRow.show();
                        if(uploader && uploader.destroy) {
                            uploader.destroy();
                        }
                    } else {
                        self.commandRow.hide();
                        self.totalUploadFiles = 0;
                        self._resetProgressAll();
                        if(uploader && uploader.destroy) {
                            uploader.destroy(true);
                        }
                    }
                });
            };
            wijupload.prototype._getFileName = // Used by C1Upload.
            function (fileName) {
                return _getFileName(fileName);
            };
            wijupload.prototype._getFileNameByInput = function (fileInput) {
                return _getFileNameByInput(fileInput);
            };
            wijupload.prototype._getFileSize = function (fileInput) {
                return _getFileSize(fileInput);
            };
            return wijupload;
        })(wijmo.wijmoWidget);
        upload.wijupload = wijupload;        
        var wijupload_options = (function () {
            function wijupload_options() {
                /**
                * @ignore
                */
                this.wijCSS = {
                    iconCircleArrowN: "ui-icon-circle-arrow-n",
                    iconCancel: "ui-icon-cancel"
                };
                /** Specifies the URL path of the server-side handler that handles the post request, validates file size and type, renames files, and saves the file to the server disk.
                * @example
                * For php:
                * $(".selector").wijupload("option", "action", "../upload.php")
                * For asp.net:
                * $(".selector").wijupload("option", "action", "../handlers/uploadHandler.ashx")
                */
                this.action = "";
                /** The value indicates whether to upload the file as soon as it is selected in the "Choose File to Upload" dialog box.
                */
                this.autoSubmit = false;
                /** Fires when user selects a file. This event can be cancelled.
                * "return false;" to cancel the event.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data An object that contains the input file.
                */
                this.change = null;
                /** Fires before the file is uploaded.  This event can be cancelled.
                * "return false;" to cancel the event.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data An object that contains the input file.
                */
                this.upload = null;
                /** Fires when the uploadAll button is clicked. This event can be cancelled.
                * "return false;" to cancel the event.
                * @event
                */
                this.totalUpload = null;
                /** Fires when a file is uploading.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data An object that contains the file info, loadedSize and totalSize.
                */
                this.progress = null;
                /** Fires when the uploadAll button is clicked and file upload is complete.
                * @event
                * @dataKey {number} loadedSize The size of loaded files.
                * @dataKey {number} totalSize The size of total files.
                */
                this.totalProgress = null;
                /** Fires when file upload is complete.
                * @event
                * @param {jQuery.Event} e jQuery Event object
                * @param {object} data An object that contains the file info.
                */
                this.complete = null;
                /** Fires when the uploadAll button is clicked and file upload is complete.
                * @event
                */
                this.totalComplete = null;
                /** Specifies the maximum number of files that can be uploaded.
                */
                this.maximumFiles = 0;
                /** Determines whether multiple selection is supported.
                */
                this.multiple = true;
                /** Specifies the accept attribute of upload. This is an attribute of the file input.
                * @remarks
                * It is a filter that allows the "Choose File to Upload" dialog box to show the file list with the specified type.
                * Possible values:
                * audio/* - All sound files are accepted.
                * video/* - All video files are accepted.
                * image/* - All image files are accepted.
                * MIME_type - A valid MIME type with no parameters.
                * @example
                *		$(".selector").wijupload("accept", "image/*")
                */
                this.accept = "";
                /** upload with SWFupload.swf,
                * this option is used for multiple-select in IE.
                */
                this.enableSWFUploadOnIE = false;
                /** upload with SWFupload.swf in all browsers.
                */
                this.enableSWFUpload = false;
                /** @ignore
                * For web control
                */
                this.swfUploadOptions = {
                };
                /** @ignore
                * For web control
                */
                this.localization = {
                };
                /** @ignore
                * For web control
                */
                this.handleRequest = null;
            }
            return wijupload_options;
        })();        
        var mainClass = "wijmo-wijupload", classPrefix = mainClass + "-";
        wijupload.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijupload_options());
        $.wijmo.registerWidget("wijupload", wijupload.prototype);
    })(wijmo.upload || (wijmo.upload = {}));
    var upload = wijmo.upload;
})(wijmo || (wijmo = {}));
