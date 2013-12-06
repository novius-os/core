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
var wijmo;
(function (wijmo) {
    /// <reference path="../Base/jquery.wijmo.widget.ts" />
    /// <reference path="../external/declarations/globalize.d.ts" />
    /// <reference path="../wijcalendar/jquery.wijmo.wijcalendar.ts" />
    /// <reference path="../wijpopup/jquery.wijmo.wijpopup.ts" />
    /// <reference path="../wijdialog/jquery.wijmo.wijdialog.ts" />
    /// <reference path="../wijdatepager/jquery.wijmo.wijdatepager.ts" />
    /// <reference path="../wijsuperpanel/jquery.wijmo.wijsuperpanel.ts" />
    /// <reference path="../wijcheckbox/jquery.wijmo.wijcheckbox.ts" />
    /// <reference path="../wijtextbox/jquery.wijmo.wijtextbox.ts" />
    /// <reference path="../wijdropdown/jquery.wijmo.wijdropdown.ts" />
    /// <reference path="../wijinput/jquery.wijmo.wijinputdate.ts" />
    /*globals jQuery,$,window,alert,document,confirm,location,setTimeout, Globalize,
    amplify*/
    /*jslint white: false */
    /*jslint nomen: false*/
    /*jslint browser: true*/
    /*jslint continue: true*/
    /*jslint devel: true*/
    /*jslint forin: true*/
    /*jslint maxlen: 110*/
    /*
    * Depends:
    *	jquery.ui.core.js
    *	jquery.ui.widget.js
    *	globalize.js
    *	jquery.mousewheel.js
    *	jquery.wijmo.wijutil.js
    *	jquery.wijmo.wijinputcore.js
    *	jquery.wijmo.wijinputdate.js
    *   jquery.wijmo.wijinputnumber.js
    *	jquery.wijmo.wijcalendar.js
    *   jquery.wijmo.wijdialog.js
    *   jquery.wijmo.wijcombobox.js
    *	jquery.wijmo.wijdatepager.js
    Following dependencies are needed if you wish to enable built-in client side data-storage:
    *   amplify.core.js
    *	amplify.store.js
    
    
    
    
    */
    /*
    //qq: move to module:
    interface IEvent {
    ///    id - String, unique event id, this field generated automatically;
    id: string;
    ///	calendar - String, calendar id to which the event belongs;
    calendar: string;
    ///	subject - String, event title;
    subject: string;
    ///	location - String, event location;
    location: string;
    ///	start - Date, start date/time;
    start: Date;
    /// end - Date, end date/time;
    end: Date;
    ///	description - String, event description;
    description: string;
    ///	color - String, event color;
    color: string;
    ///	allday - Boolean, indicates all day event
    allday: bool;
    ///	tag - String, this field can be used to store custom information.
    tag: string;
    /// Internal field.
    prevData: any;
    
    ///		parentRecurrenceId - String, id of the event object that
    ///				defines the recurrence criteria for this event object.
    ///				If an event is recurring it represents an occurrence in the series that is
    ///				started and defined by a specific pattern event.
    ///				Use the getPatern method in order to obtain the pattern
    ///				of the current event. A pattern event can be recognized by its
    ///				recurrenceState field set to the "master" value.
    ///				The recurrence information defined by the pattern event
    ///				can be accessed  via the recurrencePattern field of the event.
    ///				If this event is a not member of a recurrence,
    ///				or is itself a root event, this field will be null.
    parentRecurrenceId: string;
    
    ///		recurrenceState - String, indicates the recurrence state of the event.
    ///				(possible values are "notRecurring"(or null), "master", "occurrence",
    ///				"exception", "removed")
    recurrenceState: string;
    
    ///		recurrencePattern - Object, represents the recurrence attributes
    ///				of an event. Only master events can have this field
    ///				(recurrenceState is "master")
    ///				Object syntax:
    ///				parentRecurrenceId - String, id of the event object
    ///					which represents the master event for this
    ///					recurrencePattern object.
    ///				recurrenceType - String, determines the type of recurrence:
    ///					daily - the recurring event reoccurs on a daily basis.
    ///					workdays - the recurring event reoccurs every working day.
    ///					monthly - the recurring event reoccurs on a monthly basis.
    ///					monthlyNth - the recurring event reoccurs every N months.
    ///					weekly - the recurring event reoccurs on a weekly basis.
    ///					yearly - the recurring event reoccurs on an yearly basis.
    ///					yearlyNth - the recurring event reoccurs every N years.
    ///				interval - Number, specifies the interval between occurrences
    ///					of the recurrence.
    ///					The interval field works in conjunction with
    ///					the "recurrenceType" field to determine the cycle of the recurrence.
    ///					The maximum allowable value is 99 for weekly patterns and 999
    ///					for daily patterns.
    ///					The default value is 1.
    ///					For example, if the recurrenceType is set
    ///					to daily, and the "interval" is set to 3,
    ///					the recurrence will occur every third day.
    ///				startTime - Date, indicates the start time for the given
    ///					occurrence of the recurrence pattern.
    ///				endTime - Date, indicates the end time for the given
    ///					occurrence of the recurrence pattern.
    ///				patternStartDate - Date, indicates the start date of the
    ///					recurrence pattern.
    ///				patternEndDate - Date, indicates the end date of the
    ///					recurrence pattern.
    ///					This field is optional but must be coordinated
    ///					with other fields when setting up a recurrence pattern.
    ///					If this field or the "occurrences" field is set,
    ///					the pattern is considered to be finite, and the "noEndDate"
    ///					field is false.
    ///					If neither "patternEndDate" nor "occurrences" is set,
    ///					the pattern is considered infinite and "noEndDate" is true.
    ///					The "interval" field must be set before
    ///					setting "patternEndDate".
    ///				occurrences - Number, the number of occurrences for the
    ///					recurrence pattern.	This field allows the definition of
    ///					a recurrence pattern that is only valid for the specified
    ///					number of subsequent occurrences.
    ///					For example, you can set this property to 10 for a formal
    ///					training  course that will be held on the next ten Thursday
    ///					evenings. The default value is 0. This field must be
    ///					coordinated with other fields when setting up a recurrence pattern.
    ///					If the "patternEndDate" field or the "occurrences" field
    ///					is set, the pattern is considered to be finite and the
    ///					"noEndDate" field is false.
    ///					If neither "patternEndDate" nor "occurrences" is set,
    ///					the pattern is considered infinite and "noEndDate" is true.
    ///				instance - String, determines the week in a month in which
    ///					the event will occur. This field is only valid for recurrences of
    ///					the "monthlyNth" and "yearlyNth" types and allows the definition
    ///					of a recurrence pattern that is only valid for the Nth occurrence,
    ///					such as "the 2nd Sunday in March" pattern.
    ///					The default value is "first".
    ///					Possible values are:
    ///						first - the recurring event will occur on the specified
    ///							day or days of the first week in the month.
    ///						second - The recurring event will occur on the specified
    ///							day or days of the second week in the month.
    ///						third = - The recurring event will occur on the specified
    ///							day or days of the third week in the month.
    ///						fourth - The recurring event will occur on the specified
    ///							day or days of the fourth week in the month.
    ///						last - The recurring event will occur on the specified
    ///							day or days of the last week in the month.
    ///				dayOfWeekMask - String, contains set of values representing the mask
    ///					for week days on which the recurring event occurs.
    ///					Monthly and yearly patterns are only valid for a single day.
    ///					The default value is "none".
    ///					When the "RecurrenceType" field is set to "daily",
    ///					the "DayOfWeekMask" field can only be set to "everyDay";
    ///					setting the field to any other value will result in an exception.
    ///					When the "recurrenceType" field is set to
    ///					"workdays", the "dayOfWeekMask" field
    ///					can only be set to "workDays"; setting the field
    ///					to any other value will result in an exception.
    ///					When the "recurrenceType" field is set to
    ///					"weekly", the "dayOfWeekMask" field
    ///					cannot be set to "none"; doing so will result
    ///					in an exception being thrown.
    ///					When the recurrenceType" field is set to
    ///					"monthly" or "yearly" the "dayOfWeekMask" field is not applicable.
    ///					Possible values are:
    ///						none - no specific value; the actual value is obtained from
    ///							the root event object.
    ///						sunday - specifies Sunday.
    ///						monday - Specifies Monday.
    ///						tuesday - Specifies Tuesday.
    ///						wednesday - Specifies Wednesday.
    ///						thursday - Specifies Thursday.
    ///						friday - Specifies Friday.
    ///						saturday - Specifies Saturday.
    ///						weekendDays - Specifies Saturday and Sunday (or what ever days according
    ///							to the settings of the C1EventsCalendar).
    ///						workDays - Specifies work days (all days except weekend).
    ///						everyDay - Specifies every day of the week.
    ///				dayOfMonth - Number, the number of the day in its respective month on which
    ///					each occurrence will occur. Applicable only when the recurrenceType
    ///					field is set to "monthly" or "yearly".
    ///					The default value is 1.
    ///				monthOfYear - Number, indicates which month of the year is valid
    ///					for the specified recurrence pattern. Can be a number from 1 to 12.
    ///					This field is only valid for recurrence patterns whose recurrenceType"
    ///					field is set to "yearlyNth" or "yearly".
    ///					The default value is 1.
    ///				noEndDate - Boolean, indicates if the recurrence pattern is endless.
    ///					The default value is True. This field must be coordinated with
    ///					other fields when setting up a recurrence pattern. If the patternEndDate field
    ///					or the occurrences field is set, the pattern is considered
    ///					to be finite and the "noEndDate" field is false.
    ///					If neither patternEndDate nor occurrences is set,
    ///					the pattern is considered infinite and "noEndDate" is true.
    ///				exceptions - Array, holds the list of event object ids that
    ///					define the exceptions to that series of events.
    ///					This field is read-only.
    ///				removedOccurrences - Array, holds the list of event object's ids
    ///					removed from that series of events.
    recurrencePattern: any;
    };
    */
    /*
    block comments:
    // util methods:
    // format date/time:
    // public methods
    // _parseDateFromClass
    
    // Event object fields:
    ///     id - String, unique event id, this field generated automatically;
    ///		calendar - String, calendar id to which the event belongs;
    ///		subject - String, event title;
    ///		location - String, event location;
    ///		start - Date, start date/time;
    ///		end - Date, end date/time;
    ///		description - String, event description;
    ///		color - String, event color;
    ///		allday - Boolean, indicates all day event
    ///		tag - String, this field can be used to store custom information.
    
    ///		parentRecurrenceId - String, id of the event object that
    ///				defines the recurrence criteria for this event object.
    ///				If an event is recurring it represents an occurrence in the series that is
    ///				started and defined by a specific pattern event.
    ///				Use the getPatern method in order to obtain the pattern
    ///				of the current event. A pattern event can be recognized by its
    ///				recurrenceState field set to the "master" value.
    ///				The recurrence information defined by the pattern event
    ///				can be accessed  via the recurrencePattern field of the event.
    ///				If this event is a not member of a recurrence,
    ///				or is itself a root event, this field will be null.
    ///		recurrenceState - String, indicates the recurrence state of the event.
    ///				(possible values are "notRecurring"(or null), "master", "occurrence",
    ///				"exception", "removed")
    ///		recurrencePattern - Object, represents the recurrence attributes
    ///				of an event. Only master events can have this field
    ///				(recurrenceState is "master")
    ///				Object syntax:
    ///				parentRecurrenceId - String, id of the event object
    ///					which represents the master event for this
    ///					recurrencePattern object.
    ///				recurrenceType - String, determines the type of recurrence:
    ///					daily - the recurring event reoccurs on a daily basis.
    ///					workdays - the recurring event reoccurs every working day.
    ///					monthly - the recurring event reoccurs on a monthly basis.
    ///					monthlyNth - the recurring event reoccurs every N months.
    ///					weekly - the recurring event reoccurs on a weekly basis.
    ///					yearly - the recurring event reoccurs on an yearly basis.
    ///					yearlyNth - the recurring event reoccurs every N years.
    ///				interval - Number, specifies the interval between occurrences
    ///					of the recurrence.
    ///					The interval field works in conjunction with
    ///					the "recurrenceType" field to determine the cycle of the recurrence.
    ///					The maximum allowable value is 99 for weekly patterns and 999
    ///					for daily patterns.
    ///					The default value is 1.
    ///					For example, if the recurrenceType is set
    ///					to daily, and the "interval" is set to 3,
    ///					the recurrence will occur every third day.
    ///				startTime - Date, indicates the start time for the given
    ///					occurrence of the recurrence pattern.
    ///				endTime - Date, indicates the end time for the given
    ///					occurrence of the recurrence pattern.
    ///				patternStartDate - Date, indicates the start date of the
    ///					recurrence pattern.
    ///				patternEndDate - Date, indicates the end date of the
    ///					recurrence pattern.
    ///					This field is optional but must be coordinated
    ///					with other fields when setting up a recurrence pattern.
    ///					If this field or the "occurrences" field is set,
    ///					the pattern is considered to be finite, and the "noEndDate"
    ///					field is false.
    ///					If neither "patternEndDate" nor "occurrences" is set,
    ///					the pattern is considered infinite and "noEndDate" is true.
    ///					The "interval" field must be set before
    ///					setting "patternEndDate".
    ///				occurrences - Number, the number of occurrences for the
    ///					recurrence pattern.	This field allows the definition of
    ///					a recurrence pattern that is only valid for the specified
    ///					number of subsequent occurrences.
    ///					For example, you can set this property to 10 for a formal
    ///					training  course that will be held on the next ten Thursday
    ///					evenings. The default value is 0. This field must be
    ///					coordinated with other fields when setting up a recurrence pattern.
    ///					If the "patternEndDate" field or the "occurrences" field
    ///					is set, the pattern is considered to be finite and the
    ///					"noEndDate" field is false.
    ///					If neither "patternEndDate" nor "occurrences" is set,
    ///					the pattern is considered infinite and "noEndDate" is true.
    ///				instance - String, determines the week in a month in which
    ///					the event will occur. This field is only valid for recurrences of
    ///					the "monthlyNth" and "yearlyNth" types and allows the definition
    ///					of a recurrence pattern that is only valid for the Nth occurrence,
    ///					such as "the 2nd Sunday in March" pattern.
    ///					The default value is "first".
    ///					Possible values are:
    ///						first - the recurring event will occur on the specified
    ///							day or days of the first week in the month.
    ///						second - The recurring event will occur on the specified
    ///							day or days of the second week in the month.
    ///						third = - The recurring event will occur on the specified
    ///							day or days of the third week in the month.
    ///						fourth - The recurring event will occur on the specified
    ///							day or days of the fourth week in the month.
    ///						last - The recurring event will occur on the specified
    ///							day or days of the last week in the month.
    ///				dayOfWeekMask - String, contains set of values representing the mask
    ///					for week days on which the recurring event occurs.
    ///					Monthly and yearly patterns are only valid for a single day.
    ///					The default value is "none".
    ///					When the "RecurrenceType" field is set to "daily",
    ///					the "DayOfWeekMask" field can only be set to "everyDay";
    ///					setting the field to any other value will result in an exception.
    ///					When the "recurrenceType" field is set to
    ///					"workdays", the "dayOfWeekMask" field
    ///					can only be set to "workDays"; setting the field
    ///					to any other value will result in an exception.
    ///					When the "recurrenceType" field is set to
    ///					"weekly", the "dayOfWeekMask" field
    ///					cannot be set to "none"; doing so will result
    ///					in an exception being thrown.
    ///					When the recurrenceType" field is set to
    ///					"monthly" or "yearly" the "dayOfWeekMask" field is not applicable.
    ///					Possible values are:
    ///						none - no specific value; the actual value is obtained from
    ///							the root event object.
    ///						sunday - specifies Sunday.
    ///						monday - Specifies Monday.
    ///						tuesday - Specifies Tuesday.
    ///						wednesday - Specifies Wednesday.
    ///						thursday - Specifies Thursday.
    ///						friday - Specifies Friday.
    ///						saturday - Specifies Saturday.
    ///						weekendDays - Specifies Saturday and Sunday (or what ever days according
    ///							to the settings of the C1EventsCalendar).
    ///						workDays - Specifies work days (all days except weekend).
    ///						everyDay - Specifies every day of the week.
    ///				dayOfMonth - Number, the number of the day in its respective month on which
    ///					each occurrence will occur. Applicable only when the recurrenceType
    ///					field is set to "monthly" or "yearly".
    ///					The default value is 1.
    ///				monthOfYear - Number, indicates which month of the year is valid
    ///					for the specified recurrence pattern. Can be a number from 1 to 12.
    ///					This field is only valid for recurrence patterns whose recurrenceType"
    ///					field is set to "yearlyNth" or "yearly".
    ///					The default value is 1.
    ///				noEndDate - Boolean, indicates if the recurrence pattern is endless.
    ///					The default value is True. This field must be coordinated with
    ///					other fields when setting up a recurrence pattern. If the patternEndDate field
    ///					or the occurrences field is set, the pattern is considered
    ///					to be finite and the "noEndDate" field is false.
    ///					If neither patternEndDate nor occurrences is set,
    ///					the pattern is considered infinite and "noEndDate" is true.
    ///				exceptions - Array, holds the list of event object ids that
    ///					define the exceptions to that series of events.
    ///					This field is read-only.
    ///				removedOccurrences - Array, holds the list of event object's ids
    ///					removed from that series of events.
    
    
    
    
    
    /// Calendar object fields:
    ///     id - String, unique calendar id, this field generated automatically;
    ///		name - String, calendar name;
    ///		location - String, location field;
    ///		description - String, calendar description;
    ///		color - String, calendar color;
    ///		tag - String, this field can be used to store custom information.
    */
    (function (evcal) {
        "use strict";
        var $ = jQuery, widgetName = "wijevcal";
        /////////////// utils:
        function _toDayDate(dt) {
            return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate());
        }
        function _generateGuid() {
            var result, i, j;
            result = "";
            for(j = 0; j < 32; j += 1) {
                if(j === 8 || j === 12 || j === 16 || j === 20) {
                    result = result + "-";
                }
                i = Math.floor(Math.random() * 16).toString(16).toUpperCase();
                result = result + i;
            }
            return result;
        }
        /////////////// abstract data layer implementation
        // (web sql database / amplify.store)
                var database, databaseName = "C1EventsCalendarDB", databaseVer = "1.1", isAmplifyStoreUsed = false, amplifyTables;
        function ensureTableCreated(tableName, fields, callback) {
            /*				ensureTableCreated("events",
            "(id TEXT PRIMARY KEY, calendar TEXT, subject TEXT, location TEXT, " +
            "start TIMESTAMP, end TIMESTAMP, description TEXT)");*/
            if(isAmplifyStoreUsed) {
                amplifyTables = amplify.store("wijevcal_tables1");
                if(!amplifyTables) {
                    amplifyTables = {
                    };
                }
                //alert("isAmplifyStoreUsed?" + amplifyTables[tableName]);
                if(!amplifyTables[tableName]) {
                    amplifyTables[tableName] = {
                        fields: fields
                    };
                    amplify.store("wijevcal_tables1", amplifyTables);
                    amplify.store("wijevcal_tbl_" + tableName, {
                    });
                }
                if(callback) {
                    callback();
                }
            } else if(database) {
                database.transaction(function (tx) {
                    tx.executeSql("SELECT COUNT(*) FROM " + tableName, [], function () {
                        if(callback) {
                            callback();
                        }
                    }, function (tx, error) {
                        tx.executeSql("CREATE TABLE " + tableName + " " + fields, [], callback, callback);
                    });
                });
            }
        }
        function executeSql(sqlCommand, params, successHandler, errorHandler) {
            /*
            executeSql("SELECT * FROM events", []
            
            executeSql("INSERT OR REPLACE INTO events " +
            "(id, calendar, subject, location, start, end, description) " +
            "VALUES(?,?,?,?,?,?,?);",
            [o.id, o.calendar, o.subject, o.location,
            o.start.getTime(), o.end.getTime(), o.description],
            
            */
                        var data = {
                rowsAffected: 0,
                rows: new Array()
            }, o, i, selectRegexp, insertRegexp, deleteRegexp, match, tblName, tblDesc, tblData, k, paramsDesc, paramName, s, orConditions;
            if(!params) {
                params = [];
            }
            if(!data.rows["item"]) {
                data.rows["item"] = function (i) {
                    return this[i];
                };
            }
            if(isAmplifyStoreUsed) {
                //executeSql("DELETE FROM calendars " + "WHERE name='" + name + "'",
                //executeSql("DELETE FROM events WHERE id='" + id + "'", [],
                try  {
                    selectRegexp = new RegExp("(SELECT) *(.*) *FROM (\\w+)");
                    insertRegexp = new RegExp("(INSERT OR REPLACE|INSERT) *(.*) *INTO *(\\w*) *\\(([\\w|,| ]*)\\)");
                    deleteRegexp = new RegExp("(DELETE) *(.*) *FROM (\\w+) *(\\w*)WHERE (\\w+)='*([^']+)");
                    if(sqlCommand.match(insertRegexp)) {
                        match = insertRegexp.exec(sqlCommand);
                        if(match && match.length > 1) {
                            tblName = match[3];
                            tblDesc = amplifyTables[tblName];
                            tblData = amplify.store("wijevcal_tbl_" + tblName);
                            if(tblData) {
                                paramsDesc = match[4].split(",");
                                o = {
                                };
                                for(i = 0; i < paramsDesc.length; i += 1) {
                                    if(paramsDesc[i]) {
                                        if(i === 0) {
                                            //qq: this will work only when first
                                            //	field is unique, elaborate:
                                            tblData[params[i]] = o;
                                        }
                                        paramName = paramsDesc[i].replace(" ", "");
                                        o[paramName] = params[i];
                                    }
                                }
                            }
                            amplify.store("wijevcal_tbl_" + tblName, tblData);
                        }
                    } else if(sqlCommand.match(selectRegexp)) {
                        match = selectRegexp.exec(sqlCommand);
                        if(match && match.length > 1) {
                            tblName = match[3];
                            tblDesc = amplifyTables[tblName];
                            tblData = amplify.store("wijevcal_tbl_" + tblName);
                            if(tblData) {
                                s = sqlCommand.replace(selectRegexp, "");
                                if(s.toUpperCase().indexOf(" WHERE ") === 0) {
                                    // WHERE found
                                    s = s.substr(7);
                                    orConditions = s.split(" OR ");
                                    for(i = 0; i < orConditions.length; i += 1) {
                                        orConditions[i] = orConditions[i].split("=");
                                        s = orConditions[i][1];
                                        if(s.indexOf("'") === 0) {
                                            s = s.substring(1, s.length - 1);
                                            orConditions[i][1] = s;
                                        } else {
                                            //qq: elaborate other types
                                            orConditions[i][1] = parseFloat(s);
                                        }
                                    }
                                }
                                for(k in tblData) {
                                    if(tblData.hasOwnProperty(k)) {
                                        o = tblData[k];
                                        if(o) {
                                            if(orConditions) {
                                                for(i = 0; i < orConditions.length; i += 1) {
                                                    if(o[orConditions[i][0]] === orConditions[i][1]) {
                                                        data.rows.push(o);
                                                    }
                                                }
                                            } else {
                                                data.rows.push(o);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    } else if(sqlCommand.match(deleteRegexp)) {
                        match = deleteRegexp.exec(sqlCommand);
                        if(match && match.length > 1) {
                            tblName = match[3];
                            tblDesc = amplifyTables[tblName];
                            tblData = amplify.store("wijevcal_tbl_" + tblName);
                            // match[5] key name (e.g. id)
                            // match[6] key value (e.g. ASD-AS@--FSAFS$%-!)
                            if(tblData) {
                                // qq: test for calendars
                                if(tblData[match[6]]) {
                                    delete tblData[match[6]];
                                }
                            }
                            amplify.store("wijevcal_tbl_" + tblName, tblData);
                        }
                    }
                    if(successHandler) {
                        successHandler(data);
                    }
                } catch (ex1) {
                    if(errorHandler) {
                        errorHandler(ex1);
                    }
                }
            } else {
                if(!database) {
                    errorHandler("Local data storage not found.");
                    return;
                }
                database.transaction(function (tx) {
                    tx.executeSql(sqlCommand, params, function (tx, result) {
                        if(successHandler) {
                            successHandler(result);
                        }
                    }, function (tx, error) {
                        if(errorHandler) {
                            errorHandler(error.message);
                        }
                        return;
                    });
                });
            }
        }
        /////////////// <end of data layer
        /** @widget */
        var wijevcal = (function (_super) {
            __extends(wijevcal, _super);
            function wijevcal() {
                _super.apply(this, arguments);

                this._dynIdCounter = 0;
            }
            wijevcal.prototype._setOption = // handle option changes:
            function (key, value) {
                // when the setOption runs in chrome, because the web local storage is asynchronous,
                // when set the event data to the event calender, the init data from local storage
                // is getting the data, if this time set the value, the local storage data will override
                // the set value.
                // defined some deffered object
                                var self = this, newDfd = $.when.apply(this, self._defferObjs), val;
                // when all deffered object has complete, fire the callbacks
                newDfd.always(function () {
                    self._setOptionCallbacks.fire();
                    self._setOptionCallbacks.empty();
                    self._defferObjs = [];
                });
                // if the deffered object is not complete, put the setOption method to the callback
                if(newDfd.state() === "pending") {
                    this._setOptionCallbacks.add(function () {
                        if($.isPlainObject(value)) {
                            val = $.extend(true, {
                            }, value);
                        } else if($.isArray(value)) {
                            val = [].concat(value);
                        } else {
                            val = value;
                        }
                        self._setOptionInternal(key, val);
                    });
                } else// if the deffered object is complete, direct call the set option method.
                 {
                    this._setOptionInternal(key, value);
                }
            };
            wijevcal.prototype._setOptionInternal = function (key, value) {
                var o = this.options, culture;
                switch(key) {
                    case "dataSource":
                        o.dataSource = value;
                        this._needLoadLocalStorage = false;
                        o.eventsData = [];
                        this._bindDataView();
                        break;
                    case "eventsData":
                        o.eventsData = value;
                        o.appointments = value//remove deprecated appointments option?
                        ;
                        this._needLoadLocalStorage = false;
                        this._onEventsDataChanged();
                        this._bindEvents();
                        break;
                    case "appointments":
                        o.eventsData = value;
                        o.appointments = value//remove deprecated appointments option?
                        ;
                        this._needLoadLocalStorage = false;
                        this._onEventsDataChanged();
                        this._bindEvents();
                        break;
                    case "localization":
                        this._setLocalization(value);
                        break;
                    case "culture":
                        o.culture = value;
                        this.element.find(".wijmo-wijdatepager").wijdatepager("option", "culture", o.culture);
                        if(this._editEventDialog) {
                            this._editEventDialog.find(".wijmo-wijinput-date").wijinputdate("option", "culture", o.culture);
                        }
                        this.element.find(".wijmo-wijcalendar").wijcalendar("option", "culture", o.culture);
                        this._redrawActiveView()// fix for 23766
                        ;
                        break;
                    case "disabled":
                        if(o.disabled !== value) {
                            o.disabled = value;
                            this._ensureDisabled();
                        }
                        break;
                    case "enableLogs":
                        o.enableLogs = value;
                        this._initLogPanel();
                        break;
                    case "selectedDate":
                        if(value) {
                            value = _toDayDate(value);
                            if(o.selectedDates[0].getTime() !== value.getTime()) {
                                o.selectedDates[0] = value;
                                this._onSelectedDatesChanged();
                            }
                        }
                        return;
                    case "selectedDates":
                        if(value) {
                            o.selectedDates = value;
                            this._onSelectedDatesChanged();
                        }
                        return;
                    case "statusBarVisible":
                        o.statusBarVisible = value;
                        this._initStatusbar();
                        this.invalidate();
                        return;
                    case "headerBarVisible":
                        o.headerBarVisible = value;
                        this._initHeaderbar();
                        this.invalidate();
                        return;
                    case "navigationBarVisible":
                        o.navigationBarVisible = value;
                        this._initNavigationbar();
                        this.invalidate();
                        return;
                    case "rightPaneVisible":
                        o.rightPaneVisible = value;
                        this._initRightPane();
                        this.invalidate();
                        return;
                    case "timeInterval":
                    case "timeIntervalHeight":
                    case "timeRulerInterval":
                    case "timeRulerFormat":
                        if(o[key] !== value) {
                            o[key] = value;
                            this._redrawActiveView();
                        }
                        break;
                    case "firstDayOfWeek":
                        if(o[key] !== value) {
                            o[key] = value;
                            this._redrawActiveView();
                            //set the calendar's first day of week.
                            culture = this._getCulture();
                            if(culture && culture.calendar) {
                                culture.calendar.firstDay = value;
                                this.element.find(".wijmo-wijcalendar").wijcalendar("refresh");
                            }
                        }
                        break;
                    case "viewType":
                        if(o.viewType !== value) {
                            o.viewType = value;
                            this._onViewTypeChanged();
                        }
                        break;
                    default:
                        break;
                }
                $.wijmo.widget.prototype._setOption.apply(this, arguments);
            };
            wijevcal.prototype._setLocalization = function (value) {
                this._destroyInternal();
                this.options.localization = value;
                this._create();
                this._init();
            };
            wijevcal.prototype._ensureDisabled = function () {
                var o = this.options;
                if(o.disabled) {
                    this.element.addClass(o.wijCSS.stateDisabled);
                    try  {
                        this.element.find(".wijmo-wijcalendar").wijcalendar("option", "disabled", true);
                        this.element.find(".wijmo-wijsuperpanel").wijsuperpanel("option", "disabled", true);
                        this.element.find(".wijmo-wijdatepager").wijdatepager("option", "disabled", true);
                        if($().buttonset) {
                            this.element.find(".ui-buttonset").buttonset("option", "disabled", true);
                        }
                        this.element.find(".wijmo-wijev-today.ui-button").button("option", "disabled", true);
                        //this.element.find(".ui-button.ui-widget").button("option", "disabled", true);
                                            } catch (ex) {
                        this.log(ex, "error");
                        //fix for:
                        //Error: cannot call methods on button prior to initialization; attempted to call method 'option'
                                            }
                    this._unbindEvents();
                } else {
                    this.element.removeClass(o.wijCSS.stateDisabled);
                    try  {
                        this.element.find(".wijmo-wijcalendar").wijcalendar("option", "disabled", false);
                        this.element.find(".wijmo-wijsuperpanel").wijsuperpanel("option", "disabled", false);
                        this.element.find(".wijmo-wijdatepager").wijdatepager("option", "disabled", false);
                        if($().buttonset) {
                            this.element.find(".ui-buttonset").buttonset("option", "disabled", false);
                        }
                        this.element.find(".wijmo-wijev-today.ui-button").button("option", "disabled", false);
                        //this.element.find(".ui-button").button("option", "disabled", false);
                                            } catch (ex) {
                        this.log(ex, "error");
                        //fix for:
                        //Error: cannot call methods on button prior to initialization; attempted to call method 'option'
                                            }
                    this._bindEvents();
                    this._updateTitleText();
                }
            };
            wijevcal.prototype._onViewTypeChanged = function () {
                this._renderActiveView();
                this._updateTitleText();
                this._trigger("viewTypeChanged", null, this.options.viewType);
                this.element.find(".wijmo-wijev-datepager").wijdatepager("option", "viewType", this.options.viewType);
            };
            wijevcal.prototype._onSelectedDatesChanged = function () {
                var o = this.options;
                o.selectedDate = o.selectedDates[0];
                this.element.find(".wijmo-wijev-datepager").wijdatepager("option", "selectedDate", o.selectedDate);
                this._trigger("selectedDatesChanged", null, {
                    selectedDates: o.selectedDates
                });
                this._renderActiveView();
                this._updateTitleText();
            };
            wijevcal.prototype._updateHeaderTitleText = //
            function () {
                var o = this.options, fmt = o.titleFormat, viewStart = o.selectedDates[0], viewEnd = o.selectedDates[o.selectedDates.length - 1];
                if(fmt[o.viewType]) {
                    fmt = fmt[o.viewType];
                } else if(fmt[o.viewType] === false) {
                    this.element.find(".wijmo-wijev-view .wijmo-wijev-header-title").hide();
                    return;
                } else {
                    fmt = fmt.toString();
                }
                if(o.viewType === "list") {
                    viewEnd = this._addDays(viewStart, 14);
                }
                this.element.find(".wijmo-wijev-view .wijmo-wijev-header-title").show().html(this._formatString(fmt, viewStart, viewEnd));
            };
            wijevcal.prototype._updateTitleText = function () {
                var o = this.options, viewStart = o.selectedDates[0], viewEnd = o.selectedDates[o.selectedDates.length - 1], todayDate = new Date(), isTodayShown = false;
                isTodayShown = this._compareDayDates(viewStart, todayDate) === 0 || (viewStart < todayDate && viewEnd > todayDate);
                if($.mobile == null) {
                    this.element.find(".wijmo-wijev-navigationbar .wijmo-wijev-today").button("option", "disabled", isTodayShown);
                }
                this._updateHeaderTitleText();
            };
            wijevcal.prototype.localizeString = /** Get the localized string by key
            * @param {string} key The key of the localized string.
            * @param {string} defaultValue The default value of the localized string.
            * @returns {string} The localized string.
            */
            function (key, defaultValue) {
                var o = this.options;
                if(o.localization && o.localization[key]) {
                    return o.localization[key];
                }
                return defaultValue;
                //("buttonToday", "today")
                            };
            wijevcal.prototype._create = function () {
                var _this = this;
                // enable touch support:
                if(window.wijmoApplyWijTouchUtilEvents) {
                    $ = window.wijmoApplyWijTouchUtilEvents($);
                }
                this._defferObjs = [];
                this._chromeLoadDataDeffer = $.Deferred();
                this._defferObjs.push(this._chromeLoadDataDeffer);
                this._setOptionCallbacks = $.Callbacks("once");
                this._needLoadLocalStorage = true;
                if((this.options.appointments && this.options.appointments.length) || (this.options.eventsData && this.options.eventsData.length)) {
                    this._needLoadLocalStorage = false;
                }
                // Add for parse date options for jUICE. D.H
                if($.isFunction(window["wijmoASPNetParseOptions"])) {
                    window["wijmoASPNetParseOptions"](this.options);
                }
                var navigationbar, toolsBar, o = this.options;
                // fix problem with array options:
                if(!o.colors) {
                    o.colors = [
                        "red", 
                        "darkorchid", 
                        "green", 
                        "blue", 
                        "cornflowerblue", 
                        "yellow", 
                        "bronze"
                    ];
                }
                if(!this.wijevcalnamespacekey) {
                    this.wijevcalnamespacekey = "wijevcal" + new Date().getTime();
                }
                if(!this.element[0].id) {
                    this.element[0].id = "wijevcal_dynid_" + new Date().getTime();
                }
                this._uidPref = this.element[0].id + "evcdynid";
                this.element.addClass("wijmo-wijevcal wijmo-wijev " + //o.wijCSS.widget + " ui-helper-reset " + o.wijCSS.stateDefault);
                o.wijCSS.widget + " " + o.wijCSS.helperReset + " " + o.wijCSS.stateDefault);
                // ui-helper-clearfix ui-corner-all
                //<fieldset data-role="controlgroup" data-type="horizontal" >
                //$("<div class=\"wijmo-wijev-headerbar ui-widget-header ui-corner-top\">" +
                $("<div class=\"wijmo-wijev-headerbar " + o.wijCSS.header + " " + o.wijCSS.cornerTop + "\">" + "<fieldset class=\"wijmo-wijev-tools\">" + "<input id=\"" + this._uidPref + "_daybtn\" name=\"viewselection\"" + " type=\"radio\" class=\"wijmo-wijev-day\" />" + "<label for=\"" + this._uidPref + "_daybtn\">" + this.localizeString("buttonDayView", "Day") + "</label>" + "<input id=\"" + this._uidPref + "_weekbtn\" name=\"viewselection\"" + " type=\"radio\" class=\"wijmo-wijev-week\" />" + "<label for=\"" + this._uidPref + "_weekbtn\">" + this.localizeString("buttonWeekView", "Week") + "</label>" + "<input id=\"" + this._uidPref + "_monthbtn\" name=\"viewselection\"" + " type=\"radio\" class=\"wijmo-wijev-month\" />" + "<label for=\"" + this._uidPref + "_monthbtn\">" + this.localizeString("buttonMonthView", "Month") + "</label>" + "<input id=\"" + this._uidPref + "_listbtn\" name=\"viewselection\"" + " type=\"radio\" class=\"wijmo-wijev-list\" />" + "<label for=\"" + this._uidPref + "_listbtn\">" + this.localizeString("buttonListView", "List") + "</label>" + "</fieldset>" + "</div>").appendTo(this.element);
                $("<div class=\"wijmo-wijev-view-container\">" + "<div class=\"wijmo-wijev-leftpane wijmo-wijev-viewdetails " + o.wijCSS.content + " wijmo-wijev-day-details\">" + "<div class=\"wijmo-wijev-leftpane-inner\">" + "<div class=\"wijmo-wijev-daycalendar\"></div>" + "<div class=\"wijmo-wijev-monthday-container\">" + "<div class=\"wijmo-wijev-monthday-label\">...</div>" + "<div class=\"wijmo-wijev-fulldate-label\">" + this.localizeString("activityLoading", "Loading...") + "</div>" + "<div class=\"wijmo-wijev-year-label\">...</div>" + "</div>" + "<div class=\"wijmo-wijev-agenda-container " + //o.wijCSS.content + " " + o.wijCSS.cornerAll + " ui-helper-clearfix" +
                o.wijCSS.content + " " + o.wijCSS.cornerAll + " " + o.wijCSS.helperClearFix + "\"></div>" + "</div>" + "</div>" + "<div class=\"wijmo-wijev-leftpane wijmo-wijev-viewdetails " + o.wijCSS.content + " wijmo-wijev-list-details\">" + "<div class=\"wijmo-wijev-leftpane-inner\">" + "<div class=\"wijmo-wijev-agenda-container " + //o.wijCSS.content + " " + o.wijCSS.cornerAll + " ui-helper-clearfix\">&nbsp;" +
                o.wijCSS.content + " " + o.wijCSS.cornerAll + " " + o.wijCSS.helperClearFix + "\">&nbsp;" + "</div>" + "</div>" + "</div>" + "<div class=\"wijmo-wijev-rightpane\">" + "&nbsp;</div>" + "</div>").appendTo(this.element);
                $("<div class=\"wijmo-wijev-loading-modal-frame\"></div>" + "<div class=\"wijmo-wijev-loading\">" + "<div class=\"wijmo-wijev-loading-text\">" + this.localizeString("activityLoading", "Loading...") + "</div></div>").appendTo(this.element);
                $("<div class=\"wijmo-wijev-navigationbar " + //" ui-widget-header ui-corner-bottom ui-helper-clearfix\">" +
                o.wijCSS.header + " " + o.wijCSS.cornerBottom + " " + o.wijCSS.helperClearFix + "\">" + "<a class=\"wijmo-wijev-today\">" + this.localizeString("buttonToday", "today") + "</a>" + "<div class=\"wijmo-wijev-datepager\">" + "</div>" + "</div>").appendTo(this.element);
                //
                //$("<div class=\"wijmo-wijev-statusbar ui-widget-header ui-corner-bottom\">" +
                $("<div class=\"wijmo-wijev-statusbar " + o.wijCSS.header + " " + o.wijCSS.cornerBottom + "\">" + "</div>").appendTo(this.element);
                navigationbar = this.element.find(".wijmo-wijev-navigationbar");
                toolsBar = this.element.find(".wijmo-wijev-headerbar .wijmo-wijev-tools");
                navigationbar.find(".wijmo-wijev-today").button({
                    text: this.localizeString("buttonToday", "today")
                }).click($.proxy(this._onTodayClick, this));
                this.element.find(".wijmo-wijev-datepager").wijdatepager({
                    selectedDate: o.selectedDate,
                    localization: o.datePagerLocalization,
                    culture: o.culture,
                    viewType: o.viewType,
                    nextTooltip: this.localizeString("navigatorBarNextTooltip", "right"),
                    prevTooltip: this.localizeString("navigatorBarPrevTooltip", "left"),
                    firstDayOfWeek: o.firstDayOfWeek,
                    selectedDateChanged: $.proxy(function (e, args) {
                        this.goToDate(args.selectedDate);
                    }, this)
                });
                if($.mobile == null) {
                    toolsBar.find(".wijmo-wijev-day").button().button("widget").addClass(o.wijCSS.stateDefault);
                    toolsBar.find(".wijmo-wijev-week").button().button("widget").addClass(o.wijCSS.stateDefault);
                    toolsBar.find(".wijmo-wijev-month").button().button("widget").addClass(o.wijCSS.stateDefault);
                    toolsBar.find(".wijmo-wijev-list").button().button("widget").addClass(o.wijCSS.stateDefault);
                    toolsBar.buttonset();
                } else {
                    toolsBar.attr("data-role", "controlgroup");
                    toolsBar.attr("data-type", "horizontal");
                    //toolsBar.attr("data-mini", "true");
                    toolsBar.parent().trigger("create");
                    toolsBar.controlgroup("refresh");
                }
                // Fix case #41050
                if(this.element.wijAddVisibilityObserver) {
                    this.element.wijAddVisibilityObserver(function () {
                        if(_this.element.wijRemoveVisibilityObserver) {
                            _this.element.wijRemoveVisibilityObserver();
                        }
                        _this._redrawActiveView();
                    }, "wijevcal");
                }
                toolsBar.find(".wijmo-wijev-day").click($.proxy(this._onDayViewClick, this));
                toolsBar.find(".wijmo-wijev-week").click($.proxy(this._onWeekViewClick, this));
                toolsBar.find(".wijmo-wijev-month").click($.proxy(this._onMonthViewClick, this));
                toolsBar.find(".wijmo-wijev-list").click($.proxy(this._onListViewClick, this));
                //
                this.showLoadingLabel();
            };
            wijevcal.prototype.showLoadingLabel = /** @ignore*/
            function (text, isModal) {
                if(text === false) {
                    this.element.find(".wijmo-wijev-loading-text").hide();
                } else {
                    this.element.find(".wijmo-wijev-loading-text").show();
                    if(!text) {
                        text = this.localizeString("activityLoading", "Loading...");
                    }
                }
                if(isModal === undefined || isModal === true) {
                    this.element.find(".wijmo-wijev-loading-modal-frame").show();
                }
                this.element.find(".wijmo-wijev-loading").show();
                this.element.find(".wijmo-wijev-loading-text").html(text);
            };
            wijevcal.prototype.hideLoadingLabel = /** hide the loading label*/
            function () {
                this.element.find(".wijmo-wijev-loading-modal-frame").hide();
                this.element.find(".wijmo-wijev-loading").hide();
            };
            wijevcal.prototype._init = /* initialization code > */
            function () {
                var o = this.options;
                if(o.selectedDates && o.selectedDates.length > 0) {
                    o.selectedDate = o.selectedDates[0] = _toDayDate(o.selectedDates[0]);
                } else if(o.selectedDate) {
                    o.selectedDate = _toDayDate(o.selectedDate);
                    if(!o.selectedDates) {
                        o.selectedDates = [];
                    }
                    o.selectedDates[0] = o.selectedDate;
                } else {
                    o.selectedDate = _toDayDate(new Date());
                    o.selectedDates = [
                        o.selectedDate
                    ];
                }
                if(o.disabled) {
                    this.element.addClass(o.wijCSS.stateDisabled);
                }
                this._initHeaderbar();
                this._initNavigationbar();
                this._initStatusbar();
                this._initRightPane();
                if(o.fullScreen) {
                    this._onFullScreenModeChanged(o.fullScreen);
                }
                this._initLogPanel();
                this._initLocalDataStorage()// _loadData called here
                ;
                this.element.ajaxError(jQuery.proxy(this._onAjaxError, this));
                $(window).bind("resize." + this.wijevcalnamespacekey, $.proxy(this._onWindowResize, this));
                this._renderActiveView()// invalidate called here
                ;
                //this._bindEvents();this._updateTitleText(); called here:
                this._bindDataView();
            };
            wijevcal.prototype._onFullScreenModeChanged = function (isFullscreen) {
                //qq:todo fullscreenmode
                            };
            wijevcal.prototype._isDataViewLoaded = // wijdataview implementation
            function (dv) {
                return dv && (dv.isLoaded() || (dv.count() > 0));
            };
            wijevcal.prototype._isDataview = function (dv) {
                if(dv && typeof (dv) === "object" && !$.isArray(dv)) {
                    return true;
                }
            };
            wijevcal.prototype._getDataViewInst = function () {
                return this.element.data("wijdataview");
            };
            wijevcal.prototype._bindDataView = function () {
                var o = this.options, dataSource = o.dataSource, dataSource, self = this;
                if(!dataSource && this._getDataViewInst()) {
                    dataSource = this._getDataViewInst();
                    dataSource = o.dataSource = dataSource;
                }
                if(dataSource && this._isDataview(dataSource)) {
                    if(this._isDataViewLoaded(dataSource)) {
                        this._dataView = dataSource;
                        this._setOption("eventsData", dataSource.toArray());
                    } else {
                        dataSource.element.bind("dataloaded", function () {
                            self._dataView = dataSource;
                            self._setOption("eventsData", dataSource.toArray());
                        });
                        /*
                        //qq:?
                        .bind("datachange", function (e, args) {
                        if (args && args.length && args[0].changeType !== "reset") {
                        self.dataList = dataSource.dataView.toArray();
                        self._bindData();
                        self.redraw();
                        }
                        });*/
                                            }
                } else {
                    this._dataView = null;
                }
                /*
                qq:?
                if (!self._needloaded) {
                self._bindData();
                }*/
                            };
            wijevcal.prototype._initLocalDataStorage = function () {
                /* local data storage initialization >> */
                try  {
                    isAmplifyStoreUsed = false;
                    if(window["amplify"] && window["amplify"].store) {
                        try  {
                            amplifyTables = amplify.store("wijevcal_tables1");
                            isAmplifyStoreUsed = true;
                            this.log("Using amplify.store for the local data storage");
                        } catch (amplex) {
                            this.log("amplify.store exception:" + amplex);
                            // attempt to load data using web service or custom methods
                            this._loadData();
                            return;
                        }//amplify.store("key", "test-1")
                        
                    } else if(window["openDatabase"]) {
                        try  {
                            database = window["openDatabase"](databaseName, databaseVer, "Wijmo Events Calendar Offline DB", 200000);
                        } catch (ex) {
                            this.log("web sql database error: " + ex);
                            // attempt to load data using web service or custom methods
                            this._loadData();
                            return;
                        }
                        if(!database) {
                            this.log("Failed to open the database on disk." + " This is probably because the version was bad or" + " there is not enough space left in this domain's quota");
                            // attempt to load data using web service or custom methods
                            this._loadData();
                            return;
                        }
                        this.log("Using Web SQL Database for the local data storage.");
                    } else {
                        this.log(this.localizeString("logCouldntOpenLocalStorage", "Couldn't open built-in local data storage." + " Please, add amplify.store references."));
                        // attempt to load data using web service or custom methods
                        this._loadData();
                        return;
                    }
                    // Create tables:
                    ensureTableCreated("calendars", "(id TEXT PRIMARY KEY, name TEXT, location TEXT, description TEXT, " + "color TEXT, tag TEXT)");
                    var tableDeffered = $.Deferred(), self = this;
                    this._defferObjs.push(tableDeffered);
                    ensureTableCreated("events", "(id TEXT PRIMARY KEY, calendar TEXT, subject TEXT, location TEXT, " + "start TIMESTAMP, end TIMESTAMP, description TEXT, color TEXT, " + "allday INTEGER, properties TEXT, tag TEXT)", function () {
                        self._loadData();
                        tableDeffered.resolve();
                    });
                    //();
                    /*
                    TEXT
                    NUMERIC
                    INTEGER
                    REAL
                    NONE
                    */
                                    } catch (err) {
                    this.log("local datastorage initialization error:" + err);
                }/* << end of local data storage initialization */
                
            };
            wijevcal.prototype._initStatusbar = function () {
                var statusbar = this.element.find(".wijmo-wijev-statusbar");
                if(!this.options.statusBarVisible) {
                    statusbar.hide();
                    return;
                } else {
                    statusbar.css("float", "left");
                    statusbar.show();
                }
                if(!this.statusbarEventsAdded) {
                    this.statusbarEventsAdded = true;
                }
            };
            wijevcal.prototype._initHeaderbar = function () {
                var headerbar = this.element.find(".wijmo-wijev-headerbar");
                if(!this.options.headerBarVisible) {
                    headerbar.hide();
                    return;
                } else {
                    headerbar.show();
                }
            };
            wijevcal.prototype._initNavigationbar = function () {
                var navigationbar = this.element.find(".wijmo-wijev-navigationbar");
                if(!this.options.navigationBarVisible) {
                    navigationbar.hide();
                    return;
                } else {
                    navigationbar.show();
                }
            };
            wijevcal.prototype._initRightPane = //
            function () {
                var rightpane = this.element.find(".wijmo-wijev-rightpane");
                if(!this.options.rightPaneVisible) {
                    rightpane.hide();
                    return;
                } else {
                    rightpane.show();
                }
            };
            wijevcal.prototype._initLogPanel = function () {
                if(this.options.enableLogs) {
                    this._createLogPanel();
                    this.log = this._log;
                } else {
                    if(this.logDialog) {
                        this.logDialog.wijdialog("close");
                    }
                    this.log = function () {
                    };
                }
            };
            wijevcal.prototype._handleServerError = /* < end of initialization code*/
            function (answer) {
                if(answer && answer.toString().indexOf("error:") === 0) {
                    this.status(answer.toString(), "error");
                    return true;
                }
                return false;
            };
            wijevcal.prototype._loadData = function () {
                var o = this.options, self = this, i, count, cal, appt, calendarsById, eventsDataById, query, loadCalendarsCallback, loadEventsCallback, errorCallback, calendarDeffered, eventDeffered, needLoadEventsData;
                //successCallback
                this.showLoadingLabel();
                // these codes has an issue in chrome.
                errorCallback = function (e) {
                    // fixed an issue that if the can't support the local storage and not set the dataStorage, webServiceUrl,
                    // when user set the eventsData in the option, the widget will not show the events data.
                    if(e === "Local data storage not found.") {
                        needLoadEventsData = true;
                    }
                    self.hideLoadingLabel();
                };
                o.calendars = [];
                calendarsById = this._calendarsById = {
                };
                loadCalendarsCallback = function (calendars) {
                    o.calendars = [];
                    if(!calendars) {
                        return;
                    }
                    if(typeof calendars === "string") {
                        if(self._handleServerError(calendars)) {
                            errorCallback(calendars);
                            return;
                        }
                        try  {
                            calendars = self._jsonParse(calendars);
                        } catch (ex) {
                            self.status("Unable to parse received calendars data. " + ex, "error");
                            return;
                        }
                    }
                    if(calendars.calendars && calendars.calendars.length) {
                        calendars = calendars.calendars;
                    }
                    for(i = 0; i < calendars.length; i += 1) {
                        cal = self._cloneObj(calendars[i]);
                        cal.prevData = self._cloneObj(cal);
                        o.calendars.push(cal);
                        calendarsById[cal.id] = cal;
                    }
                    self._onCalendarsChanged();
                };
                if(o.dataStorage.loadCalendars) {
                    o.dataStorage.loadCalendars(loadCalendarsCallback, errorCallback);
                } else if(o.webServiceUrl) {
                    $.getJSON(o.webServiceUrl + "?clientId=" + this.element[0].id + "&command=loadCalendars" + "&calendars=" + o.calendars, loadCalendarsCallback);
                } else {
                    executeSql("SELECT * FROM calendars", [], function (data) {
                        for(i = 0 , count = data.rows.length; i < count; i += 1) {
                            cal = self._cloneObj(data.rows.item(i));
                            cal.prevData = self._cloneObj(cal);
                            o.calendars.push(cal);
                            calendarsById[cal.id] = cal;
                        }
                        self._onCalendarsChanged();
                    }, errorCallback);
                }
                if(this._dataView) {
                    o.eventsData = this._dataView.toArray();
                } else {
                    //if init set the event data, when run it browser, the data will be cleared by the below code
                    //o.eventsData = [];
                                    }
                if(!this._eventsDataById) {
                    eventsDataById = this._eventsDataById = {
                    };
                } else {
                    eventsDataById = this._eventsDataById;
                }
                loadEventsCallback = function (events) {
                    if(!events) {
                        return;
                    }
                    if(typeof events === "string") {
                        if(self._handleServerError(events)) {
                            errorCallback(events);
                            return;
                        }
                        try  {
                            events = self._jsonParse(events);
                        } catch (ex) {
                            self.log("Unable to parse received calendars data. " + ex);
                            return;
                        }
                    }
                    if(events.events && events.events.length) {
                        events = events.events;
                    }
                    for(i = 0; i < events.length; i += 1) {
                        appt = self._readEventData(events[i]);
                        self._storeEventWithSort(appt);
                    }
                    self._onEventsDataChanged();
                    self._onInitialized();
                };
                if(o.dataStorage.loadEvents) {
                    o.dataStorage.loadEvents(o.visibleCalendars, loadEventsCallback, errorCallback);
                    self._chromeLoadDataDeffer.resolve();
                } else if(o.webServiceUrl) {
                    $.ajax({
                        url: o.webServiceUrl + "?clientId=" + this.element[0].id + "&command=loadEvents&timestamp=" + new Date().getTime(),
                        dataType: "text",
                        cache: /*dataType: "json",*/
                        false,
                        contentType: "application/json; charset=utf-8",
                        type: "POST",
                        success: //data: "jsonData=" +
                        //	this._jsonStringify({ visibleCalendars: o.visibleCalendars }),
                        loadEventsCallback,
                        error: errorCallback
                    });
                    self._chromeLoadDataDeffer.resolve();
                } else {
                    if(this._dataView) {
                        this._onInitialized();
                        return;
                    }
                    query = "SELECT * FROM events where ";
                    for(i = 0; i < o.visibleCalendars.length; i += 1) {
                        if(i > 0) {
                            query += " OR ";
                        }
                        query += "calendar='" + o.visibleCalendars[i] + "'";
                    }
                    executeSql(query, [], function (data) {
                        if(self._needLoadLocalStorage) {
                            o.eventsData = [];
                            for(i = 0 , count = data.rows.length; i < count; i += 1) {
                                appt = self._readEventData(data.rows.item(i));
                                self._storeEventWithSort(appt);
                            }
                        }
                        self._onEventsDataChanged();
                        self._onInitialized();
                        self._chromeLoadDataDeffer.resolve();
                    }, function () {
                        errorCallback.apply(this, arguments);
                        // if can't get the data from local storage, init the event by the option's data.
                        if(needLoadEventsData) {
                            self._onEventsDataChanged();
                            self._onInitialized();
                        }
                        self._chromeLoadDataDeffer.resolve();
                    });
                }
            };
            wijevcal.prototype._onInitialized = function () {
                this._ensureDisabled();
                this.hideLoadingLabel();
                this._trigger("initialized");
            };
            wijevcal.prototype._readEventData = function (data) {
                var appt = this._cloneObj(data);
                appt.start = new Date(appt["start"]);
                appt.end = new Date(appt["end"]);
                if(typeof appt.allday === "string") {
                    if(appt["allday"] === "false") {
                        appt.allday = false;
                    }
                    if(appt["allday"] === "true") {
                        appt.allday = true;
                    }
                }
                if(appt.start.getTime() >= appt.end.getTime()) {
                    // duration can not be 0.
                    appt.end = this._addMinutes(appt.start, this.options.timeInterval);
                }
                this._deSerializeProperties(appt["properties"], appt);
                appt.prevData = this._cloneObj(appt);
                return appt;
            };
            wijevcal.prototype._prepareEventsForView = function () {
                this._eventsView = this.getOccurrences();
            };
            wijevcal.prototype._cloneObj = function (o1) {
                var o2 = {
                }, k;
                for(k in o1) {
                    if(o1.hasOwnProperty(k)) {
                        o2[k] = o1[k];
                    }
                }
                return o2;
            };
            wijevcal.prototype._onDayViewClick = function () {
                var o = this.options;
                if(o.disabled) {
                    return;
                }
                if(o.viewType !== "day") {
                    o.viewType = "day";
                    this._onViewTypeChanged();
                }
                o.selectedDates = [
                    o.selectedDate
                ];
                this._onSelectedDatesChanged();
            };
            wijevcal.prototype._onWeekViewClick = function () {
                var o = this.options, startDt, dt, i;
                if(o.disabled) {
                    return;
                }
                if(o.viewType !== "week") {
                    o.viewType = "week";
                    this._onViewTypeChanged();
                }
                startDt = o.selectedDate;
                i = o.firstDayOfWeek - startDt.getDay();
                if(Math.abs(i) > 6) {
                    i = startDt.getDay() - o.firstDayOfWeek;
                }
                startDt = this._addDays(startDt, i);
                o.selectedDates = [];
                for(i = 0; i < 7; i += 1) {
                    dt = this._addDays(startDt, i);
                    o.selectedDates.push(dt);
                }
                this._onSelectedDatesChanged();
            };
            wijevcal.prototype._onMonthViewClick = function () {
                var o = this.options;
                if(o.disabled) {
                    return;
                }
                if(o.viewType !== "month") {
                    o.viewType = "month";
                    this._onViewTypeChanged();
                }
            };
            wijevcal.prototype._onListViewClick = function () {
                var o = this.options;
                if(o.disabled) {
                    return;
                }
                if(o.viewType !== "list") {
                    o.viewType = "list";
                    this._onViewTypeChanged();
                }
                o.selectedDates = [
                    o.selectedDate
                ];
                this._onSelectedDatesChanged();
            };
            wijevcal.prototype._ensureEditCalendarDialogCreated = // UI behavior
            /* dialogs */
            function () {
                var o = this.options, dialogContent, buttonsHash = {
                };
                if(!this._editCalendarDialog) {
                    dialogContent = o.editCalendarTemplate;
                    if(!dialogContent) {
                        dialogContent = "<p><label>" + this.localizeString("labelCalendarName", "Calendar name") + "</label>" + "<input type=\"text\" class=\"wijmo-wijev-name\" value=\"\"> " + "<div class=\"wijmo-wijev-color-button\">" + "<div class=\"wijmo-wijev-color ui-wijmo-wijev-event-color-default\">&nbsp;</div>" + "</div>" + "</p>" + "<p><label>" + this.localizeString("labelLocation", "Location") + "</label>" + "<input type=\"text\" class=\"wijmo-wijev-location\" value=\"\"></p>" + "<p><label>" + this.localizeString("labelDescription", "Description") + "</label><textarea class=\"wijmo-wijev-description\" /></p>";
                    }
                    this._editCalendarDialog = $("<div class=\"wijmo-wijev-editcalendar-dialog\">" + dialogContent + "</div>");
                    this.element.append(this._editCalendarDialog);
                    buttonsHash[this.localizeString("buttonSave", "Save")] = $.proxy(function () {
                        try  {
                            var cal = this._validateAndReadCalendarDialogFields(this._editCalendarDialog);
                            if(cal.prevData) {
                                this.updateCalendar(cal);
                            } else {
                                this.addCalendar(cal);
                            }
                            this._editCalendarDialog.wijdialog("close");
                        } catch (ex) {
                            alert(ex);
                        }
                    }, this);
                    this._editCalendarDialog.wijdialog({
                        autoOpen: true,
                        height: 340,
                        width: 440,
                        modal: true,
                        title: this.localizeString("titleEditCalendar", "Edit calendar"),
                        buttons: buttonsHash,
                        captionButtons: {
                            pin: {
                                visible: false
                            },
                            refresh: {
                                visible: false
                            },
                            toggle: {
                                visible: false
                            },
                            minimize: {
                                visible: false
                            },
                            maximize: {
                                visible: false
                            }
                        }
                    });
                    /*,
                    open: $.proxy(function () {
                    }, this)*/
                    this._editCalendarDialog.find(".wijmo-wijev-name, .wijmo-wijev-location, .wijmo-wijev-description").wijtextbox();
                    //
                    this._editCalendarDialog.find(".wijmo-wijev-color-button").button({
                        icons: {
                            primary: o.wijCSS.iconArrowDown
                        }
                    }).click($.proxy(this._onColorButtonClick, {
                        dlg: this._editCalendarDialog,
                        self: this
                    }));
                }
            };
            wijevcal.prototype._ensureEditEventDialogCreated = function () {
                var o = this.options, dialogTemplate, isInputDropdownClosing = false, dateChangedByClicking = false;
                if(!this._editEventDialog) {
                    dialogTemplate = this.options.editEventDialogTemplate;
                    if(!dialogTemplate) {
                        dialogTemplate = "<div class=\"" + "wijmo-wijev-event-dialog " + this.options.wijCSS.content + " " + o.wijCSS.cornerAll + "\">" + "<ul class=\"wijmo-wijev-brief-content\">" + "<li><label>" + this.localizeString("labelName", "name") + "</label>" + "<input type=\"text\" name=\"subject\" class=\"wijmo-wijev-subject\" value=\"\">" + "<div class=\"wijmo-wijev-color-button\">" + "<div class=\"wijmo-wijev-color ui-wijmo-wijev-event-color-default\">&nbsp;</div>" + "</div>" + "</li>" + "<li><label for=\"" + this._uidPref + "_alldaybtn\">" + this.localizeString("labelAllDay", "all-day") + "</label>" + "<input type=\"checkbox\" class=\"wijmo-wijev-allday\" id=\"" + this._uidPref + "_alldaybtn\" />" + "</li>" + "<li><label>" + this.localizeString("labelStarts", "Starts") + "</label>" + "<input type=\"text\" class=\"wijmo-wijev-start\" value=\"\">" + "<input type=\"text\" class=\"wijmo-wijev-start-time\" value=\"\">" + "</li>" + "<li><label>" + this.localizeString("labelEnds", "Ends") + "</label>" + "<input type=\"text\" class=\"wijmo-wijev-end\" value=\"\">" + "<input type=\"text\" class=\"wijmo-wijev-end-time\" value=\"\">" + "</li>" + "</ul>" + "<ul class=\"wijmo-wijev-detailed-content " + o.wijCSS.cornerAll + "\">" + "<li><label>" + this.localizeString("labelLocation", "Location") + "</label>" + "<input type=\"text\" class=\"wijmo-wijev-location\" value=\"\"></li>" + "<li><label>" + this.localizeString("labelRepeat", "Repeat") + "</label>" + "<select class=\"wijmo-wijev-repeat\">" + "<option value=\"none\">" + this.localizeString("repeatNone", "None") + "</option>" + "<option value=\"daily\">" + this.localizeString("repeatDaily", "Every Day") + "</option>" + "<option value=\"workdays\">" + this.localizeString("repeatWorkDays", "Work days") + "</option>" + "<option value=\"weekly\">" + this.localizeString("repeatWeekly", "Every Week") + "</option>" + "<option value=\"monthly\">" + this.localizeString("repeatMonthly", "Every Month") + "</option>" + "<option value=\"yearly\">" + this.localizeString("repeatYearly", "Every Year") + "</option>" + /*"<option value=\"custom\">Custom...</option>" +*/
                        "</select></li>" + "<li><label>" + this.localizeString("labelCalendar", "Calendar") + "</label>" + "<select class=\"wijmo-wijev-calendar\"></select></li>" + "<li class=\"wijmo-wijev-description-item\"><label>" + this.localizeString("labelDescription", "Description") + "</label>" + "<textarea class=\"wijmo-wijev-description\" /></li>" + "</ul>" + "<div class=\"footer\">" + "<a href=\"#\" class=\"wijmo-wijev-delete\">" + this.localizeString("buttonDelete", "Delete") + "</a>" + "<a href=\"#\" class=\"wijmo-wijev-save\">" + this.localizeString("buttonOK", "OK") + "</a>" + "<a href=\"#\" class=\"wijmo-wijev-cancel\">" + this.localizeString("buttonCancel", "Cancel") + "</a>" + "</div>" + "<div class=\"wijmo-wijev-angle\"></div>" + "</div>";
                    }
                    this._editEventDialog = $(dialogTemplate);
                    this.element.append(this._editEventDialog);
                    //color
                    this._editEventDialog.find(".wijmo-wijev-color-button").button({
                        icons: {
                            primary: o.wijCSS.iconArrowDown
                        }
                    }).click($.proxy(this._onColorButtonClick, {
                        dlg: this._editEventDialog,
                        self: this
                    }));
                    /*
                    this._editEventDialog.find(".wijmo-wijev-color-arrow").button({
                    icons: { primary: "ui-icon-triangle-1-s" },
                    text: false
                    }).click($.proxy(this._onColorButtonClick, this)).parent().buttonset();
                    */
                    //delete
                    this._editEventDialog.find(".wijmo-wijev-delete").button().click($.proxy(function () {
                        this.deleteEvent(this._editEventDialog.appt);
                        this._editEventDialog.wijpopup("hide");
                    }, this));
                    //close
                    this._editEventDialog.find(".wijmo-wijev-cancel").button().click($.proxy(function (ev) {
                        this._editEventDialog.wijpopup("hide");
                        ev.preventDefault();
                    }, this));
                    this._editEventDialog.find(".wijmo-wijev-start").width(114).wijinputdate({
                        culture: this.options.culture,
                        titleFormat: this.localizeString("calendarTitleFormat", "MMMM yyyy"),
                        toolTipFormat: this.localizeString("calendarToolTipFormat", "dddd, MMMM dd, yyyy"),
                        nextTooltip: this.localizeString("calendarNextTooltip", "Next"),
                        prevTooltip: this.localizeString("calendarPrevTooltip", "Previous"),
                        showDropDownButton: true,
                        dateFormat: "d",
                        dropDownOpen: function (e, data) {
                            isInputDropdownClosing = false;
                        },
                        dropDownClose: function (e, data) {
                            isInputDropdownClosing = true;
                            $(document).one("mouseup", function () {
                                isInputDropdownClosing = false;
                            });
                        },
                        dateChanged: $.proxy(function (e, args) {
                            if(isInputDropdownClosing) {
                                dateChangedByClicking = true;
                                $(document).one("mouseup", function () {
                                    dateChangedByClicking = false;
                                });
                            }
                            var endDt = this._editEventDialog.find(".wijmo-wijev-end").wijinputdate("option", "date");
                            if(args.date > endDt) {
                                this._editEventDialog.find(".wijmo-wijev-end").wijinputdate("option", "date", args.date);
                            }
                        }, this)
                    });
                    this._editEventDialog.find(".wijmo-wijev-start-time").width(80).wijinputdate({
                        culture: this.options.culture,
                        titleFormat: this.localizeString("calendarTitleFormat", "MMMM yyyy"),
                        toolTipFormat: this.localizeString("calendarToolTipFormat", "dddd, MMMM dd, yyyy"),
                        nextTooltip: this.localizeString("calendarNextTooltip", "Next"),
                        prevTooltip: this.localizeString("calendarPrevTooltip", "Previous"),
                        showDropDownButton: false,
                        dateFormat: "t",
                        dateChanged: $.proxy(function (e, args) {
                            var endDt = this._editEventDialog.find(".wijmo-wijev-end-time").wijinputdate("option", "date"), startDate = this._editEventDialog.find(".wijmo-wijev-start").wijinputdate("option", "date");
                            if(args.date.getDate() !== startDate.getDate()) {
                                args.date.setDate(startDate.getDate());
                                this._editEventDialog.find(".wijmo-wijev-start-time").wijinputdate("option", "date", args.date);
                            }
                            if(args.date > endDt) {
                                this._editEventDialog.find(".wijmo-wijev-end-time").wijinputdate("option", "date", args.date);
                            }
                        }, this)
                    });
                    this._editEventDialog.find(".wijmo-wijev-end").width(114).wijinputdate({
                        culture: this.options.culture,
                        titleFormat: this.localizeString("calendarTitleFormat", "MMMM yyyy"),
                        toolTipFormat: this.localizeString("calendarToolTipFormat", "dddd, MMMM dd, yyyy"),
                        nextTooltip: this.localizeString("calendarNextTooltip", "Next"),
                        prevTooltip: this.localizeString("calendarPrevTooltip", "Previous"),
                        showDropDownButton: true,
                        dateFormat: "d",
                        dropDownOpen: function (e, data) {
                            isInputDropdownClosing = false;
                        },
                        dropDownClose: function (e, data) {
                            isInputDropdownClosing = true;
                            $(document).one("mouseup", function () {
                                isInputDropdownClosing = false;
                            });
                        },
                        dateChanged: $.proxy(function (e, args) {
                            if(isInputDropdownClosing) {
                                dateChangedByClicking = true;
                                $(document).one("mouseup", function () {
                                    dateChangedByClicking = false;
                                });
                            }
                            var startDt = this._editEventDialog.find(".wijmo-wijev-start").wijinputdate("option", "date");
                            if(args.date < startDt) {
                                this._editEventDialog.find(".wijmo-wijev-start").wijinputdate("option", "date", args.date);
                            }
                        }, this)
                    });
                    this._editEventDialog.find(".wijmo-wijev-end-time").width(80).wijinputdate({
                        culture: this.options.culture,
                        titleFormat: this.localizeString("calendarTitleFormat", "MMMM yyyy"),
                        toolTipFormat: this.localizeString("calendarToolTipFormat", "dddd, MMMM dd, yyyy"),
                        nextTooltip: this.localizeString("calendarNextTooltip", "Next"),
                        prevTooltip: this.localizeString("calendarPrevTooltip", "Previous"),
                        showDropDownButton: false,
                        dateFormat: "t"
                    });
                    /*,
                    dateChanged: $.proxy(function (e, args) {
                    var startDt = this._editEventDialog
                    .find(".wijmo-wijev-start-time")
                    .wijinputdate("option", "date"),
                    endDate = this._editEventDialog
                    .find(".wijmo-wijev-end")
                    .wijinputdate("option", "date");
                    if (args.date.getDate() !== endDate.getDate()) {
                    args.date.setDate(endDate.getDate());
                    this._editEventDialog
                    .find(".wijmo-wijev-end-time")
                    .wijinputdate("option", "date", args.date);
                    }
                    if (args.date < startDt) {
                    this._editEventDialog
                    .find(".wijmo-wijev-start-time")
                    .wijinputdate("option", "date", args.date);
                    }
                    }, this)*/
                    this._editEventDialog.find(".wijmo-wijev-allday").wijcheckbox().change($.proxy(this._eventDialogEnsureTimePartState, this));
                    this._editEventDialog.find(".wijmo-wijev-subject,.wijmo-wijev-location,.wijmo-wijev-description").wijtextbox();
                    // save:
                    this._editEventDialog.find(".wijmo-wijev-save").button().click($.proxy(function (e) {
                        try  {
                            var appt = this._validateAndReadApptDialogFields(this._editEventDialog);
                            if(appt.prevData) {
                                this.updateEvent(appt);
                            } else {
                                this.addEvent(appt);
                            }
                            this._editEventDialog.wijpopup("hide");
                        } catch (ex) {
                            alert(ex);
                        }
                    }, this));
                    //////////
                    this._editEventDialog.wijpopup({
                        autoHide: true,
                        hiding: /*qq*/
                        $.proxy(function (e) {
                            if(dateChangedByClicking) {
                                dateChangedByClicking = false;
                                return false;
                            }
                            if(this._colorMenu) {
                                this._colorMenu.wijpopup("hide");
                            }
                            this.element.find(".wijmo-wijev-dayview .ui-selected").removeClass("ui-selected");
                        }, this),
                        shown: $.proxy(function (e) {
                            var self = this;
                            if(!this._dropDownInitialized) {
                                // fix for wijdropdown,
                                // create widget when select element is shown.
                                this._editEventDialog.find(".wijmo-wijev-calendar").wijdropdown().bind("change", function (e) {
                                    var cal = self._calendarsById[this.value];
                                    if(cal && cal.color) {
                                        self._addColorClass(self._editEventDialog.find(".wijmo-wijev-color"), cal.color);
                                    } else {
                                        if(self._editEventDialog.appt && self._editEventDialog.appt.color) {
                                            self._addColorClass(self._editEventDialog.find(".wijmo-wijev-color"), self._editEventDialog.appt.color);
                                        }
                                    }
                                });
                                this._editEventDialog.find(".wijmo-wijev-repeat").wijdropdown().bind("change", function (e) {
                                    var repeat = this.value, appt = self._editEventDialog.appt;
                                    switch(repeat) {
                                        case "none":
                                            appt.recurrenceState = null;
                                            appt.recurrencePattern = null;
                                            break;
                                        case "daily":
                                            appt.recurrenceState = "master";
                                            appt.recurrencePattern = {
                                                parentRecurrenceId: appt.id,
                                                recurrenceType: "daily"
                                            };
                                            break;
                                        case "workdays":
                                            appt.recurrenceState = "master";
                                            appt.recurrencePattern = {
                                                parentRecurrenceId: appt.id,
                                                recurrenceType: "workdays"
                                            };
                                            break;
                                        case "weekly":
                                            appt.recurrenceState = "master";
                                            appt.recurrencePattern = {
                                                parentRecurrenceId: appt.id,
                                                recurrenceType: "weekly"
                                            };
                                            break;
                                        case "monthly":
                                            appt.recurrenceState = "master";
                                            appt.recurrencePattern = {
                                                parentRecurrenceId: appt.id,
                                                recurrenceType: "monthly"
                                            };
                                            break;
                                        case "yearly":
                                            appt.recurrenceState = "master";
                                            appt.recurrencePattern = {
                                                parentRecurrenceId: appt.id,
                                                recurrenceType: "yearly"
                                            };
                                            break;
                                        case "custom":
                                            alert("show custom recurrence pattern.");
                                            break;
                                    }
                                });
                                this._dropDownInitialized = true;
                            } else {
                                // refresh wijdropdown only when select element is shown.
                                this._editEventDialog.find(".wijmo-wijev-calendar").wijdropdown("refresh");
                                this._editEventDialog.find(".wijmo-wijev-repeat").wijdropdown("refresh");
                            }
                            this._onEditEventDialogShown(this._editEventDialog, this._editEventDialog.appt);
                            this._editEventDialog.find(".wijmo-wijev-subject").focus();
                            this._updateEditEventPopupCallout();
                        }, this)
                    });
                }
            };
            wijevcal.prototype._updateEditEventPopupCallout = function () {
                if(this._editEventDialog && this._editEventDialog._arrowTarget) {
                    var dlg = this._editEventDialog, target = $(dlg._arrowTarget), targetOffset = target.offset(), dlgOffset = dlg.offset(), verticalPos;
                    if(targetOffset.left === dlgOffset.left) {
                        // fix for 33872
                        dlg.removeClass("wijmo-wijev-rightangle").removeClass("wijmo-wijev-leftangle");
                    } else if(targetOffset.left < dlgOffset.left) {
                        dlg.removeClass("wijmo-wijev-rightangle").addClass("wijmo-wijev-leftangle");
                    } else {
                        dlg.removeClass("wijmo-wijev-leftangle").addClass("wijmo-wijev-rightangle");
                    }
                    verticalPos = Math.round(targetOffset.top - dlgOffset.top + target.outerHeight(true) / 2);
                    this._editEventDialog.find(".wijmo-wijev-angle").css("top", verticalPos);
                }
            };
            wijevcal.prototype._onColorButtonClick = function () {
                var self = this["self"], dlg = this["dlg"], i, o = self.options, colors = o.colors, s = "";
                if(colors && colors.length > 0) {
                    for(i = 0; i < colors.length; i += 1) {
                        s += "<span class=\"wijmo-wijev-listcolor wijmo-wijev-event-color-" + colors[i] + "\">&nbsp;</span>";
                    }
                }
                if(!self._colorMenu) {
                    self._colorMenu = $("<div class=\"wijmo-wijev-color-menu " + o.wijCSS.content + " " + o.wijCSS.cornerAll + "\"></div>");
                    dlg.append(self._colorMenu);
                    self._colorMenu.wijpopup({
                        autoHide: true/*qq*/ 
                    });
                }
                self._colorMenu.html(s);
                self._colorMenu.find(".wijmo-wijev-listcolor").click($.proxy(function (e) {
                    this._addColorClass(dlg.find(".wijmo-wijev-color"), this._readColorFromClass($(e.target), "default"));
                    self._colorMenu.wijpopup("hide");
                }, self));
                self._colorMenu.wijpopup("show", {
                    of: dlg.find(".wijmo-wijev-color-button"),
                    my: "left top",
                    at: "left bottom"
                });
            };
            wijevcal.prototype._validateAndReadCalendarDialogFields = function (dlg) {
                var cal = dlg.cal || {
                };
                cal.name = dlg.find(".wijmo-wijev-name").val();
                cal.location = dlg.find(".wijmo-wijev-location").val();
                cal.description = dlg.find(".wijmo-wijev-description").val();
                cal.color = this._readColorFromClass(dlg.find(".wijmo-wijev-color"), cal.color || "default");
                if(!cal.name) {
                    throw "Calendar name can not be empty";
                }
                return cal;
            };
            wijevcal.prototype._validateAndReadApptDialogFields = function (dlg) {
                var appt = dlg.appt, startDate, endDate, startTime, endTime, recurrencePattern;
                startDate = _toDayDate(dlg.find(".wijmo-wijev-start").wijinputdate("option", "date"));
                endDate = _toDayDate(dlg.find(".wijmo-wijev-end").wijinputdate("option", "date"));
                startTime = dlg.find(".wijmo-wijev-start-time").wijinputdate("option", "date");
                endTime = dlg.find(".wijmo-wijev-end-time").wijinputdate("option", "date");
                var startTimeNumber = (startTime.getHours() * 60 + startTime.getMinutes()) * 60 + startTime.getSeconds();
                var endTimeNumber = (endTime.getHours() * 60 + endTime.getMinutes()) * 60 + endTime.getSeconds();
                if(startDate.getTime() === endDate.getTime() && startTimeNumber > endTimeNumber) {
                    throw this.localizeString("messageEndOccursBeforeStart", "The end date you entered occurs before the start date.");
                }
                appt.subject = dlg.find(".wijmo-wijev-subject").val();
                appt.location = dlg.find(".wijmo-wijev-location").val();
                appt.start = startDate;
                appt.end = endDate;
                if(dlg.find(".wijmo-wijev-allday").length > 0) {
                    appt.allday = dlg.find(".wijmo-wijev-allday")[0].checked;
                }
                if(!appt.allday) {
                    appt.start = new Date(appt.start.getFullYear(), appt.start.getMonth(), appt.start.getDate(), startTime.getHours(), startTime.getMinutes(), startTime.getSeconds());
                    appt.end = new Date(appt.end.getFullYear(), appt.end.getMonth(), appt.end.getDate(), endTime.getHours(), endTime.getMinutes(), endTime.getSeconds());
                } else {
                    if(appt.start.getTime() >= appt.end.getTime()) {
                        // duration can not be 0.
                        // fix for [22972] Newly created allday events are not
                        // visible for all views except list view until page refresh:
                        appt.end = this._addMinutes(appt.start, this.options.timeInterval);
                    }
                }
                appt.calendar = dlg.find(".wijmo-wijev-calendar").val();
                appt.description = dlg.find(".wijmo-wijev-description").val();
                appt.color = this._readColorFromClass(dlg.find(".wijmo-wijev-color"), appt.color);
                // update recurrence pattern fields:
                recurrencePattern = appt.recurrencePattern;
                if(recurrencePattern && appt.recurrenceState === "master") {
                    // fix for 22970:
                    recurrencePattern.startTime = appt.start;
                    recurrencePattern.endTime = appt.end;
                    recurrencePattern.patternStartDate = appt.start;
                }
                return appt;
            };
            wijevcal.prototype._bindApptToDialog = function (appt) {
                if(!appt) {
                    return;
                }
                var dlg = this._editEventDialog, cal, color;
                dlg.appt = appt;
                dlg.find(".wijmo-wijev-subject").val(appt.subject || "");
                dlg.find(".wijmo-wijev-location").val(appt.location || "");
                try  {
                    dlg.find(".wijmo-wijev-start").wijinputdate("option", "date", appt.start);
                    dlg.find(".wijmo-wijev-start-time").wijinputdate("option", "date", appt.start);
                    dlg.find(".wijmo-wijev-end").wijinputdate("option", "date", appt.end);
                    dlg.find(".wijmo-wijev-end-time").wijinputdate("option", "date", appt.end);
                } catch (ex) {
                    alert("[e0001a] wijinputdate/wijtextselection firefox error\n" + ex);
                }
                if(dlg.find(".wijmo-wijev-allday").length > 0) {
                    dlg.find(".wijmo-wijev-allday")[0].checked = appt.allday;
                }
                dlg.find(".wijmo-wijev-allday").wijcheckbox("refresh");
                this._fillCalendarsSelect(dlg.find(".wijmo-wijev-calendar"), appt.calendar);
                this._loadRepeatValue(appt, dlg.find(".wijmo-wijev-repeat"));
                dlg.find(".wijmo-wijev-description").val(appt.description || "");
                if(!appt.prevData) {
                    dlg.find(".wijmo-wijev-delete").hide();
                } else {
                    dlg.find(".wijmo-wijev-delete").show();
                }
                if(dlg.find(".wijmo-wijev-calendar").length > 0) {
                    cal = this._calendarsById[dlg.find(".wijmo-wijev-calendar")[0].value];
                }
                color = appt.color;
                if(!color && cal && cal.color) {
                    color = cal.color;
                }
                this._addColorClass(dlg.find(".wijmo-wijev-color"), color);
                this._eventDialogEnsureTimePartState();
            };
            wijevcal.prototype._onEditEventDialogShown = function (dlg, appt) {
                // fix for jquery-ui-1.9pre problem
                // (cannot call methods on wijdropdown prior to initialization)
                if(appt.recurrenceState === "exception") {
                    dlg.find(".wijmo-wijev-repeat").wijdropdown("option", "disabled", true);
                } else {
                    dlg.find(".wijmo-wijev-repeat").wijdropdown("option", "disabled", false);
                }
            };
            wijevcal.prototype._eventDialogEnsureTimePartState = function () {
                var dlg = this._editEventDialog;
                if(dlg.find(".wijmo-wijev-allday").length > 0) {
                    if(dlg.find(".wijmo-wijev-allday")[0].checked) {
                        dlg.find(".wijmo-wijev-start-time").wijinputdate("option", "disabled", true);
                        dlg.find(".wijmo-wijev-end-time").wijinputdate("option", "disabled", true);
                    } else {
                        dlg.find(".wijmo-wijev-start-time").wijinputdate("option", "disabled", false);
                        dlg.find(".wijmo-wijev-end-time").wijinputdate("option", "disabled", false);
                    }
                }
            };
            wijevcal.prototype._loadRepeatValue = function (appt, repeatSelect) {
                var repeatVal = "none";
                if(appt.recurrencePattern) {
                    switch(appt.recurrencePattern.recurrenceType) {
                        case "daily":
                            repeatVal = "daily";
                            break;
                        case "workdays":
                            repeatVal = "workdays";
                            break;
                        case "weekly":
                            repeatVal = "weekly";
                            break;
                        case "monthly":
                            repeatVal = "monthly";
                            break;
                        case "yearly":
                            repeatVal = "yearly";
                            break;
                        default:
                            repeatVal = "custom";
                            break;
                    }
                }
                repeatSelect.val(repeatVal);
            };
            wijevcal.prototype._addColorClass = function (el, color) {
                var colorClass, regexp = new RegExp("wijmo-wijev-event-color-(\\w+)\\s*");
                if(el.length > 0) {
                    colorClass = el[0].className;
                    el[0].className = colorClass.replace(regexp, "");
                    el.addClass("wijmo-wijev-event-color-" + (color || "default"));
                }
            };
            wijevcal.prototype._readColorFromClass = function (el, defaultColor) {
                var regexp = new RegExp("wijmo-wijev-event-color-(\\w+)\\s*"), match;
                if(el.length > 0) {
                    match = regexp.exec(el[0].className);
                    if(match && match.length > 1) {
                        return match[1];
                    }
                }
                return defaultColor;
            };
            wijevcal.prototype._fillCalendarsSelect = function ($select, selectedVal) {
                var s = "", o = this.options, i, j, found, calendars = o.calendars.slice(0), visibleCalendars = o.visibleCalendars;
                if(visibleCalendars && visibleCalendars.length > 0) {
                    for(i = 0; i < visibleCalendars.length; i += 1) {
                        found = false;
                        for(j = 0; j < calendars.length; j += 1) {
                            if(calendars[j].name === visibleCalendars[i]) {
                                found = true;
                            }
                        }
                        if(!found) {
                            calendars.push({
                                id: visibleCalendars[i],
                                name: visibleCalendars[i]
                            });
                        }
                    }
                }
                if(calendars.length === 0) {
                    $select.html("");
                    return;
                }
                for(i = 0; i < calendars.length; i += 1) {
                    s += "<option value=\"" + calendars[i].id + "\">" + calendars[i].name + "</option>";
                }
                $select.html(s).val(selectedVal);
            };
            wijevcal.prototype._bindCalendarToDialog = function (cal) {
                if(!cal) {
                    return;
                }
                var dlg = this._editCalendarDialog;
                dlg.cal = cal;
                dlg.find(".wijmo-wijev-name").val(cal.name || "");
                dlg.find(".wijmo-wijev-location").val(cal.location || "");
                dlg.find(".wijmo-wijev-description").val(cal.description || "");
                this._addColorClass(dlg.find(".wijmo-wijev-color"), cal.color);
            };
            wijevcal.prototype._onTodayClick = /*--------*/
            function () {
                if(this.options.disabled) {
                    return;
                }
                this.goToday();
                return false;
            };
            wijevcal.prototype._bindEvents = // <--
            function () {
                if(!this._eventsAttached) {
                    $(this.element).on("click." + this.wijevcalnamespacekey, ".wijmo-wijev-appointment", $.proxy(this._onAppointmentClick, this));
                    /*this.element.find(".wijmo-wijev-appointment")
                    .live("click." + this.wijevcalnamespacekey,
                    $.proxy(this._onAppointmentClick, this));*/
                    $(this.element).on("mousedown." + this.wijevcalnamespacekey, ".wijmo-wijev-dayview .wijmo-wijev-appointment", $.proxy(this._onDayViewAppointmentMouseDown, this));
                    $(this.element).on("mousedown." + this.wijevcalnamespacekey, ".wijmo-wijev-monthview .wijmo-wijev-appointment", $.proxy(this._onMonthViewAppointmentMouseDown, this));
                    $(this.element).on("click." + this.wijevcalnamespacekey, ".wijmo-wijev-dayview .wijmo-wijev-timeinterval", $.proxy(this._onDayViewTimeIntervalClick, this));
                    $(this.element).on("click." + this.wijevcalnamespacekey, ".wijmo-wijev-dayview .wijmo-wijev-allday-cell", $.proxy(this._onDayViewAllDayCellClick, this));
                    $(this.element).on("click." + this.wijevcalnamespacekey, ".wijmo-wijev-monthview .wijmo-wijev-monthcellheader", $.proxy(this._onMonthViewDayLabelClick, this));
                    $(this.element).on("click." + this.wijevcalnamespacekey, ".wijmo-wijev-monthview .wijmo-wijev-monthcell-showmore", $.proxy(this._onMonthViewDayLabelClick, this));
                    $(this.element).on("click." + this.wijevcalnamespacekey, ".wijmo-wijev-weekview .wijmo-wijev-daylabel", $.proxy(this._onMonthViewDayLabelClick, this));
                    $(this.element).on("click." + this.wijevcalnamespacekey, ".wijmo-wijev-monthview .wijmo-wijev-monthcell", $.proxy(this._onMonthViewCellClick, this));
                    //
                    this._eventsAttached = true;
                }
            };
            wijevcal.prototype._unbindEvents = function () {
                if(this._eventsAttached) {
                    $(this.element).off("mousedown." + this.wijevcalnamespacekey);
                    $(this.element).off("click." + this.wijevcalnamespacekey);
                    /*
                    $(this.element).off("click." + this.wijevcalnamespacekey, ".wijmo-wijev-appointment");
                    $(this.element).off("mousedown." + this.wijevcalnamespacekey, ".wijmo-wijev-dayview .wijmo-wijev-daycolumn .wijmo-wijev-appointment");
                    $(this.element).off("click." + this.wijevcalnamespacekey, ".wijmo-wijev-dayview .wijmo-wijev-dayheadercolumn .wijmo-wijev-daylabel");
                    $(this.element).off("click." + this.wijevcalnamespacekey, ".wijmo-wijev-dayview .wijmo-wijev-timeinterval");
                    $(this.element).off("click." + this.wijevcalnamespacekey, ".wijmo-wijev-dayview .wijmo-wijev-allday-cell");
                    $(this.element).off("click." + this.wijevcalnamespacekey, ".wijmo-wijev-monthview .wijmo-wijev-monthcellheader");
                    $(this.element).off("click." + this.wijevcalnamespacekey, ".wijmo-wijev-monthview .wijmo-wijev-monthcell-showmore");
                    $(this.element).off("click." + this.wijevcalnamespacekey, ".wijmo-wijev-weekview .wijmo-wijev-daylabel");
                    $(this.element).off("click." + this.wijevcalnamespacekey, ".wijmo-wijev-monthview .wijmo-wijev-monthcell");
                    */
                    this._eventsAttached = false;
                }
            };
            wijevcal.prototype.destroy = /**
            * Removes the wijevcal functionality completely. This returns the element to its pre-init state.
            */
            function () {
                this._destroyInternal();
                $.wijmo.widget.prototype.destroy.apply(this, arguments);
            };
            wijevcal.prototype._destroyInternal = function () {
                var o = this.options;
                this.element.removeClass("wijmo-wijev wijmo-wijevcal " + o.wijCSS.widget + //" ui-helper-reset");
                " " + o.wijCSS.helperReset);
                $(window).unbind("resize." + this.wijevcalnamespacekey);
                this._unbindEvents();
                this.element.empty();
                this.wijevcalnamespacekey = null;
                this._uidPref = null;
                this._isUpdating = null;
                this._resolveDayApptConflictsTimeout = null;
                this._pendingRedrawActiveView = null;
                this._listViewDetailsInit = null;
                this._dayViewDetailsInit = null;
                this._eventsAttached = null;
                this.statusbarEventsAdded = null;
                this._dataView = null;
                this._eventsView = null;
                this._eventsDataById = null;
                this._calendarsById = null;
                this._dayViewCache = null;
                this._templateDayColumn = null;
                this._templateDayHeader = null;
                this._dayViewScrollToEvent = null;
                this._maxAllDayEventCount = null;
                this._dayColumnsToResolve = null;
                this._dayColumnResolveIdx = null;
                this.logDialog = null;
                this.logPanel = null;
                this._editCalendarDialog = null;
                this._editEventDialog = null;
                this._renderAgendaEventsTimeoutId = null;
                this.__targetAppt = null;
                this._isApptResize = null;
                this.__startApptH = null;
                this.__startApptY = null;
                this.__startClientY = null;
                this._apptDragResizeFlag = null;
                this._apptMovedFlag = null;
                this._movedFromTimeInervalApptElem = null;
                this.__targetApptChanged = null;
                this._defferObjs = null;
                this._setOptionCallbacks = null;
                this._chromeLoadDataDeffer = null;
                $.wijmo.wijevcal.prototype.options.eventsData = [];
            };
            wijevcal.prototype.deleteCalendar = // public methods
            /**
            * Deletes the existing calendar from the current data source.
            * @example $("#wijevcal").wijevcal("deleteCalendar", "My calendar");
            * @param {object} o Calendar id, name or calendar object.
            * @param {function} successCallback Function that will be called when calendar is deleted.
            * @param {function} errorCallback Function that will be called when calendar can not be deleted.(e.g. due to data source or memory problems).
            */
            function (o, successCallback, errorCallback) {
                var i, calendars = this.options.calendars, id = o.id || o, found = false, deleteCalendarCallback, deleteCalendarErrorCallback, k, self = this;
                for(i = 0; i < calendars.length; i += 1) {
                    if(calendars[i].id === id) {
                        found = true;
                        o = calendars[i];
                        if(!this._trigger("beforeDeleteCalendar", null, {
                            data: o
                        })) {
                            return false;
                        }
                        delete this._calendarsById[o.id];
                        calendars.splice(i, 1);
                        break;
                    }
                }
                if(!found) {
                    // try search by name
                    for(i = 0; i < calendars.length; i += 1) {
                        if(calendars[i].name === id) {
                            found = true;
                            o = calendars[i];
                            if(!this._trigger("beforeDeleteCalendar", null, {
                                data: o
                            })) {
                                return false;
                            }
                            delete this._calendarsById[o.id];
                            calendars.splice(i, 1);
                            break;
                        }
                    }
                }
                if(!found) {
                    this.status("Calendar with id/name '" + id + "' not found.");
                    return false;
                }
                this.showLoadingLabel(this.localizeString("activityDeletingCalendar", "Deleting calendar..."));
                deleteCalendarCallback = function (sqlResult) {
                    self.status("Calendar '" + o.name + "' deleted.");
                    self._onCalendarsChanged();
                    self.hideLoadingLabel();
                    if(successCallback) {
                        successCallback(sqlResult);
                    }
                };
                deleteCalendarErrorCallback = function (e) {
                    self.status("Unable to delete calendar '" + o.name + "': " + e);
                    self.hideLoadingLabel();
                    if(errorCallback) {
                        errorCallback(e);
                    }
                };
                if(this.options.dataStorage.deleteCalendar) {
                    this.options.dataStorage.deleteCalendar(o, deleteCalendarCallback, deleteCalendarErrorCallback);
                } else if(this.options.webServiceUrl) {
                    try  {
                        k = this._jsonStringify(o);
                    } catch (ex) {
                        this.status("Unable to prepare calendar data for server. " + ex, "error");
                        deleteCalendarErrorCallback("Unable to prepare calendar data for server. " + ex);
                        return;
                    }
                    $.ajax({
                        url: this.options.webServiceUrl + "?clientId=" + this.element[0].id + "&command=deleteCalendar&timestamp=" + new Date().getTime(),
                        dataType: "text",
                        contentType: "application/json; charset=utf-8",
                        type: "POST",
                        data: "jsonData=" + k,
                        success: deleteCalendarCallback,
                        error: deleteCalendarErrorCallback
                    });
                } else {
                    executeSql("DELETE FROM calendars " + "WHERE id='" + o.id + "'", [], deleteCalendarCallback, deleteCalendarErrorCallback);
                }
            };
            wijevcal.prototype.addCalendar = /**
            * Adds a new calendar.
            * @example
            * $("#wijevcal").wijevcal("addCalendar", {
            *		name: "My calendar",
            *		location: "Home",
            *		description: "Some description",
            *	    color: "lime"
            * });
            * @param {object} o
            * Calendar object.
            * Calendar object fields:
            *     id - String, unique calendar id, this field generated automatically;
            *		name - String, calendar name;
            *		location - String, location field;
            *		description - String, calendar description;
            *		color - String, calendar color;
            *		tag - String, this field can be used to store custom information.
            * @param {function} successCallback Function that will be called when calendar is added.
            * @param {function} errorCallback Function that will be called when calendar can not be added.(e.g. due to data source or memory problems).
            */
            function (o, successCallback, errorCallback) {
                var addCalendarCallback, k, addCalendarErrorCallback, self = this, isExist = false;
                if(!this._trigger("beforeAddCalendar", null, {
                    data: o,
                    prevData: o.prevData || {
                    }
                })) {
                    if(o.prevData) {
                        for(k in o.prevData) {
                            if(o.prevData.hasOwnProperty(k)) {
                                o[k] = o.prevData[k];
                            }
                        }
                    }
                    return false;
                }
                if(!o.id) {
                    if(!this._dynIdCounter) {
                        this._dynIdCounter = 0;
                    }
                    this._dynIdCounter += 1;
                    o.id = "dynid" + this._dynIdCounter + "ts" + new Date().getTime();
                }
                //prevent to add an exist name calenadr
                $.each(self.options.calendars, function (i, cal) {
                    if(o.name === cal.name) {
                        isExist = true;
                        return false;
                    }
                });
                if(isExist) {
                    return;
                }
                this.showLoadingLabel(this.localizeString("activityCreatingCalendar", "Creating calendar..."));
                addCalendarCallback = function (sqlResult) {
                    if(self._handleServerError(sqlResult)) {
                        addCalendarErrorCallback(sqlResult);
                        return;
                    }
                    self._readUpdatedServerDataIfAny(sqlResult, o);
                    if(!self._calendarsById[o.id]) {
                        self.options.calendars.push(o);
                        self._calendarsById[o.id] = o;
                        self.status("Calendar '" + o.name + "' added.");
                    } else {
                        self.status("Calendar '" + o.name + "' added.");
                    }
                    o.prevData = self._cloneObj(o);
                    self._onCalendarsChanged();
                    self.hideLoadingLabel();
                    if(successCallback) {
                        successCallback(sqlResult);
                    }
                };
                addCalendarErrorCallback = function (e) {
                    self.status("Unable to add calendar '" + o.name + "': " + e);
                    self.hideLoadingLabel();
                    if(errorCallback) {
                        errorCallback(e);
                    }
                };
                if(this.options.dataStorage.addCalendar) {
                    this.options.dataStorage.addCalendar(o, addCalendarCallback, addCalendarErrorCallback);
                } else if(this.options.webServiceUrl) {
                    try  {
                        k = this._jsonStringify(o);
                    } catch (ex) {
                        this.status("Unable prepare calendar data for server." + ex, "error");
                        addCalendarErrorCallback("Unable to prepare calendar data for server." + ex);
                        return;
                    }
                    $.ajax({
                        url: this.options.webServiceUrl + "?clientId=" + this.element[0].id + "&command=addCalendar&timestamp=" + new Date().getTime(),
                        dataType: "text",
                        contentType: "application/json; charset=utf-8",
                        type: "POST",
                        data: "jsonData=" + k,
                        success: addCalendarCallback,
                        error: addCalendarErrorCallback
                    });
                } else {
                    executeSql("INSERT OR REPLACE INTO calendars " + "(id, name, location, description, color, tag) " + "VALUES(?,?,?,?,?,?);", [
                        o.id, 
                        o.name, 
                        o.location, 
                        o.description, 
                        o.color, 
                        o.tag
                    ], addCalendarCallback, addCalendarErrorCallback);
                }
            };
            wijevcal.prototype.updateCalendar = /**
            * Updates the existing calendar.
            * @example
            * $("#wijevcal").wijevcal("updateCalendar", {
            *		name: "My calendar",
            *		location: "Home",
            *		description: "Some description",
            *	    color: "lime"
            * });
            * @param {object} o
            * Calendar object.
            * Calendar object fields:
            *   id - String, unique calendar id, this field generated automatically;
            *	name - String, calendar name;
            *	location - String, location field;
            *	description - String, calendar description;
            *	color - String, calendar color;
            *	tag - String, this field can be used to store custom information.
            * @param {function} successCallback Function that will be called when calendar is updated.
            * @param {function} errorCallback Function that will be called when calendar can not be updated.(e.g. due to data source or memory problems).
            */
            function (o, successCallback, errorCallback) {
                var updateCalendarCallback, k, updateCalendarErrorCallback, self = this;
                if(!this._trigger("beforeUpdateCalendar", null, {
                    data: o,
                    prevData: o.prevData || {
                    }
                })) {
                    if(o.prevData) {
                        for(k in o.prevData) {
                            if(o.prevData.hasOwnProperty(k)) {
                                o[k] = o.prevData[k];
                            }
                        }
                    }
                    return false;
                }
                if(!o.id) {
                    if(!this._dynIdCounter) {
                        this._dynIdCounter = 0;
                    }
                    this._dynIdCounter += 1;
                    o.id = "dynid" + this._dynIdCounter + "ts" + new Date().getTime();
                }
                this.showLoadingLabel(this.localizeString("activityUpdatingCalendar", "Updating calendar..."));
                updateCalendarCallback = function (sqlResult) {
                    var isExists = false, visibleCalendars = self.options.visibleCalendars;
                    if(self._handleServerError(sqlResult)) {
                        updateCalendarErrorCallback(sqlResult);
                        return;
                    }
                    self._readUpdatedServerDataIfAny(sqlResult, o);
                    if(!self._calendarsById[o.id]) {
                        //prevent to add an exist name calendar in calendars.
                        $.each(self.options.calendars, function (i, cal) {
                            if(o.name === cal.name) {
                                isExists = true;
                                return false;
                            }
                        });
                        if(!isExists) {
                            self.options.calendars.push(o);
                            self._calendarsById[o.id] = o;
                            self.status("Calendar '" + o.name + "' added.");
                        }
                    } else {
                        //when update the calendar, if this calendar is in visible calendars, we need to update the visibleCalendars array.
                        $.each(visibleCalendars, function (i, visibleCalendar) {
                            if(visibleCalendar === o.prevData.name) {
                                visibleCalendars[i] = o.name;
                                return false;
                            }
                        });
                        self.status("Calendar '" + o.name + "' updated.");
                    }
                    o.prevData = self._cloneObj(o);
                    self._onCalendarsChanged();
                    self.hideLoadingLabel();
                    if(successCallback) {
                        successCallback(sqlResult);
                    }
                };
                updateCalendarErrorCallback = function (e) {
                    self.status("Unable to update calendar '" + o.name + "': " + e);
                    self.hideLoadingLabel();
                    if(errorCallback) {
                        errorCallback(e);
                    }
                };
                if(this.options.dataStorage.updateCalendar) {
                    this.options.dataStorage.updateCalendar(o, updateCalendarCallback, updateCalendarErrorCallback);
                } else if(this.options.webServiceUrl) {
                    try  {
                        k = this._jsonStringify(o);
                    } catch (ex) {
                        this.status("Unable prepare calendar data for server. " + ex, "error");
                        updateCalendarErrorCallback("Unable to prepare calendar data for server. " + ex);
                        return;
                    }
                    $.ajax({
                        url: this.options.webServiceUrl + "?clientId=" + this.element[0].id + "&command=updateCalendar&timestamp=" + new Date().getTime(),
                        dataType: "text",
                        contentType: "application/json; charset=utf-8",
                        type: "POST",
                        data: "jsonData=" + k,
                        success: updateCalendarCallback,
                        error: updateCalendarErrorCallback
                    });
                } else {
                    executeSql("INSERT OR REPLACE INTO calendars " + "(id, name, location, description, color, tag) " + "VALUES(?,?,?,?,?,?);", [
                        o.id, 
                        o.name, 
                        o.location, 
                        o.description, 
                        o.color, 
                        o.tag
                    ], updateCalendarCallback, updateCalendarErrorCallback);
                }
            };
            wijevcal.prototype._initEventData = // for call public method in localstorage
            function (o) {
                return $.extend({
                    allday: false,
                    location: null,
                    subject: null,
                    description: null,
                    color: null,
                    tag: null
                }, o);
            };
            wijevcal.prototype.addEvent = /**
            * Adds a new event.
            * @example
            *	$("#wijevcal").wijevcal("addEvent", {
            *		start: new Date(2011, 4, 2, 0, 32),
            *		end: new Date(2011, 4, 2, 0, 50),
            *		subject: "Subject" });
            * @param {object} o
            *	Event object.
            *   Event object fields:
            *     id - String, unique event id, this field generated automatically;
            *		calendar - String, calendar id to which the event belongs;
            *		subject - String, event title;
            *		location - String, event location;
            *		start - Date, start date/time;
            *		end - Date, end date/time;
            *		description - String, event description;
            *		color - String, event color;
            *		allday - Boolean, indicates all day event
            *		tag - String, this field can be used to store custom information.
            * @param {function} successCallback Function that will be called when event is added.
            * @param {function} errorCallback Function that will be called when event can not be added.(e.g. due to data source or memory problems).
            */
            function (o, successCallback, errorCallback) {
                var addEventCallback, addEventErrorCallback, k, self = this;
                if(!this._trigger("beforeAddEvent", null, {
                    data: o,
                    prevData: o.prevData || {
                    }
                })) {
                    if(o.prevData) {
                        for(k in o.prevData) {
                            if(o.prevData.hasOwnProperty(k)) {
                                o[k] = o.prevData[k];
                            }
                        }
                    }
                    return false;
                }
                if(!o.id) {
                    if(!this._dynIdCounter) {
                        this._dynIdCounter = 0;
                    }
                    this._dynIdCounter += 1;
                    o.id = _generateGuid()// "dynid" + this._dynIdCounter + "ts" + new Date().getTime();
                    ;
                }
                if(!o.calendar) {
                    o.calendar = "Default";
                }
                this.showLoadingLabel(this.localizeString("activityCreatingEvent", "Creating event..."));
                addEventErrorCallback = function (e) {
                    self.hideLoadingLabel();
                    self.status("Unable to add event '" + o.subject + "': " + e, "error");
                    if(o.prevData) {
                        for(k in o.prevData) {
                            if(o.prevData.hasOwnProperty(k)) {
                                o[k] = o.prevData[k];
                            }
                        }
                    }
                    if(errorCallback) {
                        errorCallback(e);
                    }
                };
                addEventCallback = function (result) {
                    if(self._handleServerError(result)) {
                        addEventErrorCallback(result);
                        return;
                    }
                    self._readUpdatedServerDataIfAny(result, o);
                    if(!self._eventsDataById[o.id] || o.recurrenceState === "exception") {
                        self._storeEventWithSort(o);
                        self.status("Event '" + o.subject + "' added.");
                    } else {
                        self.status("Event '" + o.subject + "' added.");
                    }
                    o.prevData = self._cloneObj(o);
                    self._onEventsDataChanged();
                    self.hideLoadingLabel();
                    if(successCallback) {
                        successCallback(result);
                    }
                };
                if(this.options.dataStorage.addEvent) {
                    this.options.dataStorage.addEvent(o, addEventCallback, addEventErrorCallback);
                } else if(this.options.webServiceUrl) {
                    try  {
                        k = this._jsonStringify(o);
                    } catch (ex) {
                        this.status("Unable prepare event data for server. " + ex, "error");
                        addEventErrorCallback("Unable to prepare event data for server. " + ex);
                        return;
                    }
                    $.ajax({
                        url: this.options.webServiceUrl + "?clientId=" + this.element[0].id + "&command=addEvent&timestamp=" + new Date().getTime(),
                        dataType: "text",
                        contentType: "application/json; charset=utf-8",
                        type: "POST",
                        data: "jsonData=" + k,
                        success: addEventCallback,
                        error: addEventErrorCallback
                    });
                } else {
                    // init the options for call widget public method.
                    o = self._initEventData(o);
                    // if not reference the amplify and the browser is not support local storage. just added
                    if(!isAmplifyStoreUsed && !window["openDatabase"]) {
                        addEventCallback.call(this, {
                            rowsAffected: 0,
                            rows: [
                                o
                            ]
                        });
                        return;
                    }
                    executeSql("INSERT OR REPLACE INTO events " + "(id, calendar, subject, location, start, end," + " description, color, allday, properties, tag) " + "VALUES(?,?,?,?,?,?,?,?,?,?,?);", [
                        o.id, 
                        o.calendar, 
                        o.subject, 
                        o.location, 
                        o.start.getTime(), 
                        o.end.getTime(), 
                        o.description, 
                        o.color, 
                        o.allday, 
                        this._serializeProperties(o), 
                        o.tag
                    ], addEventCallback, addEventErrorCallback);
                }
            };
            wijevcal.prototype._storeEventWithSort = function (o) {
                // fix for
                // [19618] [C1EventsCalendar] Request to provide sorting behavior
                // in C1EventsCalendar with all view types:
                                var apps = this.options.eventsData, i, c;
                this._eventsDataById[o.id] = o;
                for(i = 0 , c = apps.length; i < c; i += 1) {
                    if(apps[i].start > o.start) {
                        apps.splice(i, 0, o);
                        return;
                    } else if(apps[i].start.getTime() === o.start.getTime()) {
                        if(apps[i].subject > o.subject) {
                            apps.splice(i, 0, o);
                            return;
                        }
                    }
                }
                apps.push(o);
            };
            wijevcal.prototype._readUpdatedServerDataIfAny = function (result, o) {
                var k = null, j;
                if(typeof result === "string" && result.indexOf("update:") === 0) {
                    result = result.toString().substr("update:".length);
                    try  {
                        k = this._jsonParse(result);
                    } catch (ex) {
                        this.status("Unable to read updated server data. " + ex, "warning");
                    }
                    if(k) {
                        for(j in k) {
                            if(k[j]) {
                                o[j] = k[j];
                                /*
                                if (k.hasOwnProperty(j)) {
                                o[j] = k[j];
                                }*/
                                                            }
                        }
                    }
                }
            };
            wijevcal.prototype.updateEvent = /**
            * Updates the existing event.
            * @example
            *	$("#wijevcal").wijevcal("updateEvent", {
            *		start: new Date(2011, 4, 2, 0, 32),
            *		end: new Date(2011, 4, 2, 0, 50),
            *		subject: "Subject" });
            * @param {object} o
            *	Event object.
            *   Event object fields:
            *     id - String, unique event id, this field generated automatically;
            *		calendar - String, calendar id to which the event belongs;
            *		subject - String, event title;
            *		location - String, event location;
            *		start - Date, start date/time;
            *		end - Date, end date/time;
            *		description - String, event description;
            *		color - String, event color;
            *		allday - Boolean, indicates all day event
            *		tag - String, this field can be used to store custom information.
            * @param {function} successCallback Function that will be called when event is updated.
            * @param {function} errorCallback Function that will be called when event can not be updated.(e.g. due to data source or memory problems).
            */
            function (o, successCallback, errorCallback) {
                var updateEventCallback, updateEventErrorCallback, k, self = this;
                if(!this._trigger("beforeUpdateEvent", null, {
                    data: o,
                    prevData: o.prevData || {
                    }
                })) {
                    if(o.prevData) {
                        for(k in o.prevData) {
                            if(o.prevData.hasOwnProperty(k)) {
                                o[k] = o.prevData[k];
                            }
                        }
                    }
                    this._updateAppointmentVisual(o);
                    return false;
                }
                if(!o.calendar) {
                    o.calendar = "Default";
                }
                this.showLoadingLabel(this.localizeString("activityUpdatingEvent", "Updating event..."));
                updateEventErrorCallback = function (e) {
                    self.hideLoadingLabel();
                    self.status("Unable to update event '" + o.subject + "': " + e, "error");
                    if(o.prevData) {
                        for(k in o.prevData) {
                            if(o.prevData.hasOwnProperty(k)) {
                                o[k] = o.prevData[k];
                            }
                        }
                    }
                    self._updateAppointmentVisual(o);
                    if(errorCallback) {
                        errorCallback(e);
                    }
                };
                if(!o.id) {
                    updateEventErrorCallback("id is empty");
                    return;
                }
                if(o.recurrenceState === "exception" || o.recurrenceState === "occurrence") {
                    if(!this._eventsDataById[o.parentRecurrenceId]) {
                        updateEventErrorCallback("Unable to find master event for event with id:" + o.id);
                        return;
                    }
                    if(o.recurrenceState === "occurrence") {
                        this.log(this._formatString("[updateEvent->addEvent] recurrenceState for event {0} changed to 'exception'.", o.id));
                        o.recurrenceState = "exception";
                        return this.addEvent(o, successCallback, errorCallback);
                    }
                }
                updateEventCallback = function (result) {
                    if(self._handleServerError(result)) {
                        updateEventErrorCallback(result);
                        return;
                    }
                    self._readUpdatedServerDataIfAny(result, o);
                    if(!self._eventsDataById[o.id]) {
                        self._storeEventWithSort(o);
                        self.status("Event '" + o.subject + "' added.");
                    } else {
                        $.extend(self._eventsDataById[o.id], o);
                        self.status("Event '" + o.subject + "' updated.");
                    }
                    o.prevData = self._cloneObj(o);
                    self._onEventsDataChanged();
                    self.hideLoadingLabel();
                    if(successCallback) {
                        successCallback(result);
                    }
                };
                if(this.options.dataStorage.updateEvent) {
                    this.options.dataStorage.updateEvent(o, updateEventCallback, updateEventErrorCallback);
                } else if(this.options.webServiceUrl) {
                    try  {
                        k = this._jsonStringify(o);
                    } catch (ex) {
                        this.status("Unable prepare event data for server. " + ex, "error");
                        updateEventErrorCallback("Unable to prepare event data for server. " + ex);
                        return;
                    }
                    $.ajax({
                        url: this.options.webServiceUrl + "?clientId=" + this.element[0].id + "&command=updateEvent&timestamp=" + new Date().getTime(),
                        dataType: "text",
                        contentType: "application/json; charset=utf-8",
                        type: "POST",
                        data: "jsonData=" + k,
                        success: updateEventCallback,
                        error: updateEventErrorCallback
                    });
                } else {
                    // init the default value for localstorage.
                    o = self._initEventData(o);
                    // if not reference the amplify and the browser is not support local storage. just added
                    if(!isAmplifyStoreUsed && !window["openDatabase"]) {
                        updateEventCallback.call(this, {
                            rowsAffected: 0,
                            rows: [
                                o
                            ]
                        });
                        return;
                    }
                    executeSql("INSERT OR REPLACE INTO events " + "(id, calendar, subject, location, start, end," + " description, color, allday, properties, tag) " + "VALUES(?,?,?,?,?,?,?,?,?,?,?);", [
                        o.id, 
                        o.calendar, 
                        o.subject, 
                        o.location, 
                        o.start.getTime(), 
                        o.end.getTime(), 
                        o.description, 
                        o.color, 
                        o.allday, 
                        this._serializeProperties(o), 
                        o.tag
                    ], updateEventCallback, updateEventErrorCallback);
                }
            };
            wijevcal.prototype._serializeProperties = function (appt) {
                var s = "", props = {
                };
                props.parentRecurrenceId = appt.parentRecurrenceId;
                props.recurrenceState = appt.recurrenceState;
                props.recurrencePattern = appt.recurrencePattern;
                props.color = appt.color;
                props.allday = appt.allday;
                ///		color - String, event color;
                ///		allday - Boolean, indicates all day event
                ///		parentRecurrenceId - String, id of the event object that
                ///				defines the recurrence criteria for this event object.
                ///				If an event is recurring (see isRecurring)
                ///				it represents an occurrence in the series that is
                ///				started and defined by a specific pattern event.
                ///				Use the getPatern method in order to obtain the pattern
                ///				of the current event. A pattern event can be recognized by its
                ///				recurrenceState field set to the "master" value.
                ///				The recurrence information defined by the pattern event
                ///				can be accessed  via the recurrencePattern field of the event.
                ///				If this event is a not member of a recurrence,
                ///				or is itself a root event, this field will be null.
                ///		recurrenceState - String, indicates the recurrence state of the event.
                ///				(possible values are "notRecurring"(or null),
                ///					"master", "occurrence","exception", "removed")
                ///		recurrencePattern - Object, represents the recurrence attributes
                try  {
                    s = this._jsonStringify(props);
                } catch (ex) {
                    this.status("Unable save additional event properties. " + ex, "error");
                }
                return s;
            };
            wijevcal.prototype._deSerializeProperties = function (s, appt) {
                var props = {
                }, pattern;
                if(s) {
                    if(typeof s === "string") {
                        try  {
                            props = this._jsonParse(s);
                        } catch (ex) {
                            this.status("Unable to load additional event properties. " + ex, "error");
                            return;
                        }
                    } else {
                        props = s;
                    }
                    if(props.parentRecurrenceId) {
                        appt.parentRecurrenceId = props.parentRecurrenceId;
                    }
                    if(props.recurrenceState) {
                        appt.recurrenceState = props.recurrenceState;
                    }
                    if(props.recurrencePattern) {
                        appt.recurrencePattern = props.recurrencePattern;
                    }
                    if(props.color) {
                        appt.color = props.color;
                    }
                    if(props.allday) {
                        appt.allday = props.allday;
                    }
                }
                if(appt && appt.recurrencePattern) {
                    // ensure recurrencePattern date properties loaded correctly:
                    pattern = appt.recurrencePattern;
                    pattern.patternStartDate = pattern.patternStartDate ? new Date(pattern.patternStartDate) : pattern.patternStartDate;
                    pattern.startTime = pattern.startTime ? new Date(pattern.startTime) : pattern.startTime;
                    pattern.endTime = pattern.endTime ? new Date(pattern.endTime) : pattern.endTime;
                    // duration can not be 0.
                    if(pattern.startTime.getTime() >= pattern.endTime.getTime()) {
                        pattern.endTime = this._addMinutes(pattern.startTime, this.options.timeInterval);
                    }
                }
            };
            wijevcal.prototype._jsonStringify = function (o) {
                var s;
                if(window["__JSONC1"]) {
                    s = window["__JSONC1"].stringify(o);
                } else if(window["JSON"]) {
                    s = JSON.stringify(o);
                } else {
                    throw "JSON not found.";
                }
                return s;
            };
            wijevcal.prototype._jsonParse = function (s) {
                var o, reISO, reMsAjax;
                if(window["__JSONC1"]) {
                    o = window["__JSONC1"].parse(s);
                } else if(window["JSON"]) {
                    reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;
                    reMsAjax = /^\/Date\((d|-|.*)\)\/$/;
                    o = window["JSON"].parse(s, function (key, value) {
                        if(typeof value === 'string') {
                            var a = reISO.exec(value), b;
                            if(a) {
                                return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
                            }
                            a = reMsAjax.exec(value);
                            if(a) {
                                b = a[1].split(/[-,.]/);
                                return new Date(+b[0]);
                            }
                        }
                        return value;
                    });
                } else {
                    throw "JSON variable not found.";
                }
                return o;
            };
            wijevcal.prototype.getOccurrences = /**
            * Retrieves the array which contains
            * the full list of Event objects in the specified time interval.
            * Note, this method will create instances of the Event
            * object for recurring events.
            * @param {Date} start The Date value which specifies
            * the start date and time of the interval.
            * @param {Date} end The Date value which specifies
            * the end date and time of the interval.
            * @returns {array} events array
            */
            function (start, end) {
                var o = this.options, appts = o.eventsData, appt, occurrenceAppt, exceptionAppt, pattern, i, j, icnt, jcnt, maxOccurrenceCount = 100, patternStart, patternStartTime, patternEndTime, eventsArr = [], exceptionsArr = [], removedArr = [], occurrenceHash = {
                };
                if(!this._eventsDataById) {
                    this._eventsDataById = {
                    };
                }
                for(i = 0 , icnt = appts.length; i < icnt; i += 1) {
                    appt = appts[i];
                    this._eventsDataById[appt.id] = appt;
                    if(appt.recurrenceState === "master") {
                        pattern = appt.recurrencePattern;
                        if(pattern.removedOccurrences) {
                            removedArr = removedArr.concat(pattern.removedOccurrences);
                        }
                        // populate pattern:
                        jcnt = pattern.occurrences || maxOccurrenceCount;
                        patternStart = pattern.patternStartDate || appt.start;
                        patternStartTime = pattern.startTime || appt.start;
                        patternEndTime = pattern.endTime || appt.end;
                        //alert("pattern.recurrenceType=" + pattern.recurrenceType);
                        switch(pattern.recurrenceType) {
                            case "daily":
                                for(j = 0; j < jcnt; j += 1) {
                                    occurrenceAppt = this._cloneObj(appt);
                                    occurrenceAppt.parentRecurrenceId = appt.id;
                                    occurrenceAppt.recurrenceState = "occurrence";
                                    occurrenceAppt.start = this._setTime(this._addDays(patternStart, j), patternStartTime);
                                    occurrenceAppt.end = this._setTime(occurrenceAppt.start, patternEndTime, patternStartTime);
                                    occurrenceAppt.recurrencePattern = null;
                                    if(this._testIsEventInTimeInterval(occurrenceAppt, start, end)) {
                                        occurrenceAppt.id = this._formatString("{0}_OCCR_{1:yyyy_MM_dd}", appt.id, occurrenceAppt.start);
                                        occurrenceHash[occurrenceAppt.id] = occurrenceAppt;
                                    }
                                }
                                break;
                            case "workdays":
                                for(j = 0; j < jcnt; j += 1) {
                                    occurrenceAppt = this._cloneObj(appt);
                                    occurrenceAppt.parentRecurrenceId = appt.id;
                                    occurrenceAppt.recurrenceState = "occurrence";
                                    occurrenceAppt.start = this._setTime(this._addDays(patternStart, j), patternStartTime);
                                    //getDay() : Sunday is 0, Monday is 1, and so on.
                                    if(occurrenceAppt.start.getDay() === 0 || occurrenceAppt.start.getDay() === 6) {
                                        continue;
                                    }
                                    occurrenceAppt.end = this._setTime(occurrenceAppt.start, patternEndTime, patternStartTime);
                                    occurrenceAppt.recurrencePattern = null;
                                    if(this._testIsEventInTimeInterval(occurrenceAppt, start, end)) {
                                        occurrenceAppt.id = this._formatString("{0}_OCCR_{1:yyyy_MM_dd}", appt.id, occurrenceAppt.start);
                                        occurrenceHash[occurrenceAppt.id] = occurrenceAppt;
                                    }
                                }
                                break;
                            case "weekly":
                                for(j = 0; j < jcnt; j += 1) {
                                    occurrenceAppt = this._cloneObj(appt);
                                    occurrenceAppt.parentRecurrenceId = appt.id;
                                    occurrenceAppt.recurrenceState = "occurrence";
                                    occurrenceAppt.start = this._setTime(this._addDays(patternStart, j * 7), patternStartTime);
                                    occurrenceAppt.end = this._setTime(occurrenceAppt.start, patternEndTime, patternStartTime);
                                    occurrenceAppt.recurrencePattern = null;
                                    if(this._testIsEventInTimeInterval(occurrenceAppt, start, end)) {
                                        occurrenceAppt.id = this._formatString("{0}_OCCR_{1:yyyy_MM_dd}", appt.id, occurrenceAppt.start);
                                        occurrenceHash[occurrenceAppt.id] = occurrenceAppt;
                                    }
                                }
                                break;
                            case "monthly":
                                for(j = 0; j < jcnt; j += 1) {
                                    occurrenceAppt = this._cloneObj(appt);
                                    occurrenceAppt.parentRecurrenceId = appt.id;
                                    occurrenceAppt.recurrenceState = "occurrence";
                                    occurrenceAppt.start = this._setTime(new Date(patternStart), patternStartTime);
                                    occurrenceAppt.start.setMonth(occurrenceAppt.start.getMonth() + j);
                                    occurrenceAppt.end = this._setTime(occurrenceAppt.start, patternEndTime, patternStartTime);
                                    occurrenceAppt.recurrencePattern = null;
                                    if(this._testIsEventInTimeInterval(occurrenceAppt, start, end)) {
                                        occurrenceAppt.id = this._formatString("{0}_OCCR_{1:yyyy_MM_dd}", appt.id, occurrenceAppt.start);
                                        occurrenceHash[occurrenceAppt.id] = occurrenceAppt;
                                    }
                                }
                                break;
                            case "yearly":
                                for(j = 0; j < jcnt; j += 1) {
                                    occurrenceAppt = this._cloneObj(appt);
                                    occurrenceAppt.parentRecurrenceId = appt.id;
                                    occurrenceAppt.recurrenceState = "occurrence";
                                    occurrenceAppt.start = this._setTime(new Date(patternStart), patternStartTime);
                                    occurrenceAppt.start.setYear(occurrenceAppt.start.getFullYear() + j);
                                    occurrenceAppt.end = this._setTime(occurrenceAppt.start, patternEndTime, patternStartTime);
                                    occurrenceAppt.recurrencePattern = null;
                                    if(this._testIsEventInTimeInterval(occurrenceAppt, start, end)) {
                                        occurrenceAppt.id = this._formatString("{0}_OCCR_{1:yyyy_MM_dd}", appt.id, occurrenceAppt.start);
                                        occurrenceHash[occurrenceAppt.id] = occurrenceAppt;
                                    }
                                }
                                break;
                            case "monthlyNth":
                                break;
                            case "yearlyNth":
                                break;
                        }
                    } else {
                        if(this._testIsEventInTimeInterval(appt, start, end)) {
                            if(appt.recurrenceState === "exception") {
                                exceptionsArr.push(appt);
                            } else {
                                if(appt.recurrenceState === "removed") {
                                    removedArr.push(appt.id);
                                    this.log("[warning] Seems we found removed event inside events storage, id:" + appt.id);
                                } else {
                                    eventsArr.push(appt);
                                }
                            }
                        }
                    }
                }
                for(i = 0 , icnt = exceptionsArr.length; i < icnt; i += 1) {
                    exceptionAppt = exceptionsArr[i];
                    if(occurrenceHash[exceptionAppt.id]) {
                        delete occurrenceHash[exceptionAppt.id];
                    }
                    eventsArr.push(exceptionAppt);
                    this._eventsDataById[exceptionAppt.id] = exceptionAppt;
                }
                for(i = 0 , icnt = removedArr.length; i < icnt; i += 1) {
                    if(occurrenceHash[removedArr[i]]) {
                        delete occurrenceHash[removedArr[i]];
                    }
                }
                for(i in occurrenceHash) {
                    occurrenceAppt = occurrenceHash[i];
                    eventsArr.push(occurrenceAppt);
                    this._eventsDataById[occurrenceAppt.id] = occurrenceAppt;
                }
                //eventsArr.push(occurrenceAppt);
                //this._eventsDataById[occurrenceAppt.id] = occurrenceAppt;
                return eventsArr;
                ///		parentRecurrenceId - String, id of the event object that
                ///				defines the recurrence criteria for this event object.
                ///				If an event is recurring (see isRecurring)
                ///				it represents an occurrence in the series that is
                ///				started and defined by a specific pattern event.
                ///				Use the getPatern method in order to obtain the pattern
                ///				of the current event. A pattern event can be recognized by its
                ///				recurrenceState field set to the "master" value.
                ///				The recurrence information defined by the pattern event
                ///				can be accessed  via the recurrencePattern field of the
                ///				event.
                ///				If this event is a not member of a recurrence,
                ///				or is itself a root event, this field will be null.
                ///		recurrenceState - String, indicates the recurrence state of
                ///				the event.
                ///				(possible values are "notRecurring"(or null), "master",
                ///				"occurrence", "exception", "removed")
                ///		recurrencePattern - Object, represents the recurrence attributes
                ///				of an event. Only master events can have this field
                ///				(recurrenceState is "master")
                ///				Object syntax:
                ///				parentRecurrenceId - String, id of the event object
                ///					which represents the master event for this
                ///					recurrencePattern object.
                ///				recurrenceType - String, determines the type of recurrence:
                ///					daily - the recurring event reoccurs on a daily basis.
                ///					workdays - the recurring event reoccurs every working
                ///								day.
                ///					weekly - the recurring event reoccurs on
                ///							a weekly basis.
                ///					monthly - the recurring event reoccurs on
                ///							a monthly basis.
                ///					monthlyNth - the recurring event reoccurs
                ///							every N months.
                ///					yearly - the recurring event reoccurs on
                ///							an yearly basis.
                ///					yearlyNth - the recurring event reoccurs every N years.
                ///				interval - Number, specifies the interval between
                ///							occurrences of the recurrence.
                ///					The interval field works in conjunction with
                ///					the "recurrenceType" field to determine the cycle
                ///					of the recurrence.
                ///					The maximum allowable value is 99 for weekly patterns
                ///					and 999 for daily patterns.
                ///					The default value is 1.
                ///					For example, if the recurrenceType is set
                ///					to daily, and the "interval" is set to 3,
                ///					the recurrence will occur every third day.
                ///				startTime - Date, indicates the start time for the given
                ///					occurrence of the recurrence pattern.
                ///				endTime - Date, indicates the end time for the given
                ///					occurrence of the recurrence pattern.
                ///				patternStartDate - Date, indicates the start date of the
                ///					recurrence pattern.
                ///				patternEndDate - Date, indicates the end date of the
                ///					recurrence pattern.
                ///					This field is optional but must be coordinated
                ///					with other fields when setting up a recurrence pattern.
                ///					If this field or the "occurrences" field is set,
                ///					the pattern is considered to be finite, and the "noEndDate"
                ///					field is false.
                ///					If neither "patternEndDate" nor "occurrences" is set,
                ///					the pattern is considered infinite and "noEndDate" is true.
                ///					The "interval" field must be set before
                ///					setting "patternEndDate".
                ///				occurrences - Number, the number of occurrences for the
                ///					recurrence pattern.	This field allows the definition of
                ///					a recurrence pattern that is only valid for the specified
                ///					number of subsequent occurrences.
                ///					For example, you can set this property to 10 for a formal
                ///					training  course that will be held on the next ten Thursday
                ///					evenings. The default value is 0. This field must be
                ///					coordinated with other fields when setting up a recurrence pattern.
                ///					If the "patternEndDate" field or the "occurrences" field
                ///					is set, the pattern is considered to be finite and the
                ///					"noEndDate" field is false.
                ///					If neither "patternEndDate" nor "occurrences" is set,
                ///					the pattern is considered infinite and "noEndDate" is true.
                ///				instance - String, determines the week in a month in which
                ///					the event will occur. This field is only valid for recurrences of
                ///					the "monthlyNth" and "yearlyNth" types and allows the definition
                ///					of a recurrence pattern that is only valid for the Nth occurrence,
                ///					such as "the 2nd Sunday in March" pattern.
                ///					The default value is "first".
                ///					Possible values are:
                ///						first - the recurring event will occur on the specified
                ///							day or days of the first week in the month.
                ///						second - The recurring event will occur on the specified
                ///							day or days of the second week in the month.
                ///						third = - The recurring event will occur on the specified
                ///							day or days of the third week in the month.
                ///						fourth - The recurring event will occur on the specified
                ///							day or days of the fourth week in the month.
                ///						last - The recurring event will occur on the specified
                ///							day or days of the last week in the month.
                ///				dayOfWeekMask - String, contains set of values representing the mask
                ///					for week days on which the recurring event occurs.
                ///					Monthly and yearly patterns are only valid for a single day.
                ///					The default value is "none".
                ///					When the "RecurrenceType" field is set to "daily",
                ///					the "DayOfWeekMask" field can only be set to "everyDay";
                ///					setting the field to any other value will result in an exception.
                ///					When the "recurrenceType" field is set to
                ///					"workdays", the "dayOfWeekMask" field
                ///					can only be set to "workDays"; setting the field
                ///					to any other value will result in an exception.
                ///					When the "recurrenceType" field is set to
                ///					"weekly", the "dayOfWeekMask" field
                ///					cannot be set to "none"; doing so will result
                ///					in an exception being thrown.
                ///					When the recurrenceType" field is set to
                ///					"monthly" or "yearly" the "dayOfWeekMask" field is not applicable.
                ///					Possible values are:
                ///						none - no specific value; the actual value is obtained from
                ///							the root event object.
                ///						sunday - specifies Sunday.
                ///						monday - Specifies Monday.
                ///						tuesday - Specifies Tuesday.
                ///						wednesday - Specifies Wednesday.
                ///						thursday - Specifies Thursday.
                ///						friday - Specifies Friday.
                ///						saturday - Specifies Saturday.
                ///						weekendDays - Specifies Saturday and Sunday
                ///									(or what ever days according
                ///									to the settings of the C1EventsCalendar).
                ///						workDays - Specifies work days (all days except weekend).
                ///						everyDay - Specifies every day of the week.
                ///				dayOfMonth - Number, the number of the day in its respective month on which
                ///					each occurrence will occur. Applicable only when the recurrenceType
                ///					field is set to "monthly" or "yearly".
                ///					The default value is 1.
                ///				monthOfYear - Number, indicates which month of the year is valid
                ///					for the specified recurrence pattern. Can be a number from 1 to 12.
                ///					This field is only valid for recurrence patterns whose recurrenceType"
                ///					field is set to "yearlyNth" or "yearly".
                ///					The default value is 1.
                ///				noEndDate - Boolean, indicates if the recurrence pattern is endless.
                ///					The default value is True. This field must be coordinated with
                ///					other fields when setting up a recurrence pattern.
                ///					If the patternEndDate field or the occurrences field is set,
                ///					the pattern is considered to be finite and the "noEndDate"
                ///					field is false.
                ///					If neither patternEndDate nor occurrences is set,
                ///					the pattern is considered infinite and "noEndDate" is true.
                ///				exceptions - Array, holds the list of event objects that
                ///					define the exceptions to that series of events.
                ///					Event objects are added to the exceptions whenever a field
                ///					in the corresponding event object is altered.
                ///				removedOccurrences - Array, holds the list of event objects
                ///					removed from that series of events.
                            };
            wijevcal.prototype._testIsEventInTimeInterval = function (appt, start, end) {
                if(!start || !end) {
                    return true;
                }
                if(appt.start < end && appt.end > start) {
                    return true;
                }
                return false;
            };
            wijevcal.prototype.deleteEvent = /**
            * Deletes the event.
            * @example
            *	$("#wijevcal").wijevcal("deleteEvent", eventId);
            * @param {number} id
            *	Event object or event id.
            * @param {function} successCallback Function that will be called when event is deleted.
            * @param {function} errorCallback Function that will be called when event can not be deleted.(e.g. due to data source or memory problems).
            */
            function (id, successCallback, errorCallback) {
                if(id.id) {
                    id = id.id;
                }
                var o = this._eventsDataById[id], i, appts, deleteEventCallback, deleteEventErrorCallback, self = this, k, masterAppt;
                if(!this._trigger("beforeDeleteEvent", null, {
                    data: o
                })) {
                    return false;
                }
                this.showLoadingLabel(this.localizeString("activityDeletingEvent", "Deleting event..."));
                deleteEventErrorCallback = function (e) {
                    self.status("Unable to delete event '" + (o ? o.subject : "undefined") + "': " + e);
                    self.hideLoadingLabel();
                    if(errorCallback) {
                        errorCallback(e);
                    }
                };
                if(o.recurrenceState === "exception" || o.recurrenceState === "occurrence") {
                    masterAppt = this._eventsDataById[o.parentRecurrenceId];
                    if(masterAppt) {
                        this.log(this._formatString("[deleteEvent] removing {0} with id {1}. Updating master event with id {2}", o.recurrenceState, o.id, masterAppt.id));
                        if(!masterAppt.recurrencePattern.removedOccurrences) {
                            masterAppt.recurrencePattern.removedOccurrences = [];
                        }
                        masterAppt.recurrencePattern.removedOccurrences.push(o.id);
                        this.updateEvent(masterAppt, successCallback, errorCallback);
                        if(o.recurrenceState === "occurrence") {
                            this.log("No need to delete occurrence from store. Master event should be updated.");
                            return;
                        }
                    } else {
                        if(o.recurrenceState === "exception") {
                            //allow delete exception from events storage.
                                                    } else {
                            deleteEventErrorCallback("Unable to find master event with id " + o.parentRecurrenceId);
                            return false;
                        }
                    }
                }
                if(o.recurrenceState === "master") {
                    //qq: delete all exceptions from events storage, as well?
                                    }
                deleteEventCallback = function (result) {
                    if(self._handleServerError(result)) {
                        deleteEventErrorCallback(result);
                        return;
                    }
                    if(self._eventsDataById[o.id]) {
                        appts = self.options.eventsData;
                        for(i = 0; i < appts.length; i = i + 1) {
                            if(appts[i].id === id) {
                                appts.splice(i, 1);
                            }
                        }
                        delete self._eventsDataById[o.id];
                        self.status("Event '" + o.subject + "' deleted.");
                    } else {
                        self.status("Event '" + o.subject + "' deleted.");
                    }
                    o.prevData = self._cloneObj(o);
                    self._onEventsDataChanged();
                    self.hideLoadingLabel();
                    if(successCallback) {
                        successCallback(result);
                    }
                };
                if(this.options.dataStorage.deleteEvent) {
                    this.options.dataStorage.deleteEvent(o, deleteEventCallback, deleteEventErrorCallback);
                } else if(this.options.webServiceUrl) {
                    try  {
                        k = this._jsonStringify(o);
                    } catch (ex) {
                        this.status("Unable prepare event data for server. " + ex, "error");
                        deleteEventErrorCallback("Unable prepare event data for server. " + ex);
                        return;
                    }
                    $.ajax({
                        url: this.options.webServiceUrl + "?clientId=" + this.element[0].id + "&command=deleteEvent&timestamp=" + new Date().getTime(),
                        dataType: "text",
                        contentType: "application/json; charset=utf-8",
                        type: "POST",
                        data: "jsonData=" + k,
                        success: deleteEventCallback,
                        error: deleteEventErrorCallback
                    });
                } else {
                    // if not reference the amplify and the browser is not support local storage. just added
                    if(!isAmplifyStoreUsed && !window["openDatabase"]) {
                        deleteEventCallback.call(this, {
                            rowsAffected: 0,
                            rows: [
                                o
                            ]
                        });
                        return;
                    }
                    executeSql("DELETE FROM events WHERE id='" + id + "'", [], deleteEventCallback, deleteEventErrorCallback);
                }
            };
            wijevcal.prototype.beginUpdate = /**
            * Use beginUpdate and endUpdate when making a large number of changes
            * to widget options.
            * @example
            *	$("#wijevcal").wijevcal("beginUpdate");
            *	$("#wijevcal").wijevcal("option", "timeInterval", 10);
            *   $("#wijevcal").wijevcal("option", "timeRulerInterval", 20);
            *	$("#wijevcal").wijevcal("endUpdate");
            */
            function () {
                this._isUpdating = true;
                this.showLoadingLabel("Updating...");
            };
            wijevcal.prototype.endUpdate = /**
            * Use beginUpdate and endUpdate when making a large number of changes
            * to widget options.
            * @example
            *	$("#wijevcal").wijevcal("beginUpdate");
            *	$("#wijevcal").wijevcal("option", "timeInterval", 10);
            *   $("#wijevcal").wijevcal("option", "timeRulerInterval", 20);
            *	$("#wijevcal").wijevcal("endUpdate");
            */
            function () {
                this._isUpdating = false;
                if(this._pendingRedrawActiveView) {
                    this._redrawActiveView();
                }
                this.hideLoadingLabel();
            };
            wijevcal.prototype.goToEvent = /**
            * Navigates to the event given by the parameter id.
            * @example
            * $("#wijevcal").wijevcal("goToEvent",
            *   "apptid_dynid1ts1320322142549");
            * @param {object} id Event object or event id.
            */
            function (id) {
                if(id.id) {
                    id = id.id;
                }
                var o = this.options, visual, appt = this.findEventById(id);
                switch(o.viewType) {
                    case "day":
                    case "week":
                    case "list":
                        visual = this.element.find(".wijmo-wijev-dayview .wijmo-wijev-daycolumn ." + this._eventIdToCssClass(id));
                        if(visual.length > 0) {
                            this.element.find(".wijmo-wijev-scrollpanel").wijsuperpanel("scrollChildIntoView", visual);
                        } else {
                            this._dayViewScrollToEvent = appt;
                            this.goToDate(appt.start);
                        }
                        break;
                    case "month":
                        this.goToDate(appt.start);
                        break;
                }
            };
            wijevcal.prototype.isAllDayEvent = /**
            * Tests to see if event duration is more or equals to one day.
            * @example
            * var isAllDay = $("#wijevcal").wijevcal("isAllDayEvent",
            *   "apptid_dynid1ts1320322142549");
            * @param {object} id Event object or event id.
            * @returns {boolean} if event duration is more or equals to one day, return true
            */
            function (id) {
                var appt = id;
                if(!id.id) {
                    appt = this.findEventById(id);
                }
                if(appt.allday) {
                    if((appt.end.getTime() - appt.start.getTime()) / (1000 * 60 * 60 * 24) >= 1) {
                        return true;
                    }
                    return true;
                }
                return false;
            };
            wijevcal.prototype.goToDate = /**
            * Navigates to the date given by parameter dt.
            * @example
            * $("#wijevcal").wijevcal("goToDate", new Date());
            * @param {Date} dt Javascript date.
            */
            function (dt) {
                dt = _toDayDate(dt);
                var o = this.options, weekDay = dt.getDay(), i, daysCor, dUTC, sdUTC, sd0, selectedDates = o.selectedDates;
                if(selectedDates && selectedDates.length > 0) {
                    if(this._isContainsDayDate(selectedDates, dt)) {
                        return;
                    } else {
                        // fixed 35356 by Daniel.He, caused by "Pacific Daylight Time" 1h offset.
                        // convert to UTC time dUTC, sdUTC,
                        sd0 = selectedDates[0];
                        dUTC = Date.UTC(dt.getFullYear(), dt.getMonth(), dt.getDate());
                        sdUTC = Date.UTC(sd0.getFullYear(), sd0.getMonth(), sd0.getDate());
                        daysCor = (dUTC - sdUTC) / 86400000;
                        if(o.viewType === "week") {
                            for(i = 0; i < selectedDates.length; i += 1) {
                                if(selectedDates[i].getDay() === weekDay) {
                                    daysCor = daysCor - i;
                                    break;
                                }
                            }
                        }
                        for(i = 0; i < selectedDates.length; i += 1) {
                            selectedDates[i] = this._addDays(selectedDates[i], daysCor);
                        }
                        this._onSelectedDatesChanged();
                    }
                } else {
                    o.selectedDates = [
                        dt
                    ];
                    this._onSelectedDatesChanged();
                }
            };
            wijevcal.prototype.goToTime = /**
            * Scrolls view to time given by parameter time.
            * @example
            * $("#wijevcal").wijevcal("goToTime", new Date());
            * @param {Date} time Javascript date.
            */
            function (time) {
                var firstTimeInervalCell = this.element.find(".wijmo-wijev-daycolumn .wijmo-wijev-timeinterval:first-child"), lastTimeInervalCell = this.element.find(".wijmo-wijev-daycolumn .wijmo-wijev-timeinterval:last-child"), ys = firstTimeInervalCell.position().top, ye = lastTimeInervalCell.position().top + lastTimeInervalCell.height(), yt, tt, te;
                te = 24 * 60 * 60;
                tt = time.getHours() * 60 * 60 + time.getMinutes() * 60;
                yt = (ye - ys) * tt / te + ys;
                this.element.find(".wijmo-wijev-scrollpanel").wijsuperpanel("vScrollTo", yt);
            };
            wijevcal.prototype.goToday = /**
            * Navigates to today's date.
            * @example
            * $("#wijevcal").wijevcal("goToday");
            */
            function () {
                this.goToDate(new Date());
            };
            wijevcal.prototype.goLeft = /**
            * Navigates to the previous date.
            * @example
            * $("#wijevcal").wijevcal("goLeft");
            */
            function () {
                var offset, o = this.options, view = o.viewType, selectedDates = o.selectedDates;
                if(view === "month") {
                    this.goToDate(this._addMonths(selectedDates[0], -1));
                } else {
                    offset = -7;
                    if(selectedDates.length === 1) {
                        offset = -1;
                    }
                    this.goToDate(this._addDays(selectedDates[0], offset));
                }
            };
            wijevcal.prototype.goRight = /**
            * Navigates to the next date.
            * @example
            * $("#wijevcal").wijevcal("goRight");
            */
            function () {
                var offset, o = this.options, view = o.viewType, selectedDates = o.selectedDates;
                if(view === "month") {
                    this.goToDate(this._addMonths(selectedDates[0], 1));
                } else {
                    offset = 7;
                    if(selectedDates.length === 1) {
                        offset = 1;
                    }
                    this.goToDate(this._addDays(selectedDates[0], offset));
                }
            };
            wijevcal.prototype.refresh = /**
            * Invalidates the entire surface of the control
            * and causes the control to be redrawn.
            */
            function () {
                this.invalidate();
            };
            wijevcal.prototype.invalidate = /**
            * Invalidates the entire surface of the control
            * and causes the control to be redrawn.
            */
            function () {
                var o = this.options;
                switch(o.viewType.toLowerCase()) {
                    case "list":
                    case "day":
                    case "week":
                        this._invalidateDayView();
                        break;
                    case "month":
                        this._invalidateMonthView();
                        break;
                    default:
                        break;
                }
            };
            wijevcal.prototype.showEditCalendarDialog = /**
            * Call this method in order to display built-in "edit calendar" dialog box.
            * @example
            * Display dialog for a new calendar:
            * $("#wijevcal").wijevcal("showEditCalendarDialog", null);
            * @param {object} calendar
            *	Calendar object or calendar name.
            *   Calendar object fields:
            *     id - String, unique calendar id, this field generated automatically;
            *		name - String, calendar name;
            *		location - String, location field;
            *		description - String, calendar description;
            *		color - String, calendar color;
            *		tag - String, this field can be used to store custom information.
            */
            function (calendar) {
                var o = this.options, calendars = o.calendars, i;
                if(!calendar) {
                    calendar = {
                        name: "",
                        description: "",
                        location: "",
                        color: ""
                    };
                } else if(!calendar.name) {
                    for(i = 0; i < calendars.length; i += 1) {
                        if(calendars[i].name === calendar) {
                            calendar = calendars[i];
                            break;
                        }
                    }
                }
                this._ensureEditCalendarDialogCreated();
                this._bindCalendarToDialog(calendar);
                this._editCalendarDialog.wijdialog("open");
            };
            wijevcal.prototype.showEditEventDialog = /**
            * Call this method in order to display built-in "edit event" dialog box.
            * @example
            * Display dialog for a new event:
            * $("#wijevcal").wijevcal("showEditEventDialog", null);
            * @param {object} calendar
            *	Event object.
            * Event object fields:
            *     id - String, unique event id, this field generated automatically;
            *		calendar - String, calendar id to which the event belongs;
            *		subject - String, event title;
            *		location - String, event location;
            *		start - Date, start date/time;
            *		end - Date, end date/time;
            *		description - String, event description;
            *		color - String, event color;
            *		allday - Boolean, indicates all day event
            *		tag - String, this field can be used to store custom information.
            * @param {object} offsetElement
            *	Optional.
            *	DOM element which will be used to calculate dialog position.
            */
            function (appt, offsetElement, e) {
                var o = this.options, masterAppt, parentColumn, startdt, targetCell = offsetElement ? $(offsetElement) : (e ? $(e.target) : null);
                this._ensureEditEventDialogCreated();
                this.element.find(".wijmo-wijev-dayview .ui-selected").removeClass("ui-selected");
                if(targetCell && targetCell.hasClass("wijmo-wijev-daylabel")) {
                    targetCell = targetCell.parent(".wijmo-wijev-allday-cell");
                }
                if(!appt) {
                    appt = {
                        subject: this.localizeString("textNewEvent", "New event")
                    };
                    appt.isNewEvent = true;
                    if(targetCell && targetCell.length > 0) {
                        this._editEventDialog._arrowTarget = targetCell;
                        targetCell.addClass("ui-selected");
                        parentColumn = targetCell.parent(".wijmo-wijev-daycolumn");
                        if(parentColumn.length < 1) {
                            parentColumn = targetCell.parent(".wijmo-wijev-dayheadercolumn");
                        }
                        parentColumn = parentColumn[0];
                        //wijmo-wijev-allday-cell
                        if(targetCell.hasClass("wijmo-wijev-allday-cell")) {
                            appt.allday = true;
                        } else if(targetCell.hasClass("wijmo-wijev-monthcellcontainer")) {
                            parentColumn = targetCell[0];
                            appt.allday = true;
                        } else {
                            appt.allday = false;
                        }
                        if(parentColumn) {
                            startdt = this._parseDateFromClass(parentColumn.className, appt.allday ? null : targetCell[0].className);
                            appt.start = startdt;
                            if(appt.allday) {
                                appt.end = this._addMinutes(appt.start, 60 * 24);
                            } else {
                                appt.end = this._addMinutes(appt.start, o.timeInterval);
                            }
                        }
                    } else {
                        appt.start = new Date(o.selectedDates[0]);
                        appt.end = this._addMinutes(appt.start, o.timeInterval);
                    }
                } else {
                    this._editEventDialog._arrowTarget = targetCell;
                    if(!appt.prevData) {
                        appt.prevData = this._cloneObj(o);
                    }
                    if(appt.recurrenceState === "occurrence") {
                        masterAppt = this._eventsDataById[appt.parentRecurrenceId];
                        if(window.confirm(this._formatString(this.localizeString("promptOpenOccurrenceFormat", "{2}  is recurring event. Do you want to open only this occurrence?"), appt.start, appt.end, appt.subject, appt.location))) {
                            // edit exception: set inside addEvent/updateEvent method
                            //appt.recurrenceState = "exception";
                                                    } else {
                            // edit master event:
                            appt = masterAppt;
                        }
                    }
                    /*
                    if (appt.recurrenceState === "exception") {
                    //alert("Exception found:" + appt.id);
                    }*/
                                    }
                if(this._trigger("beforeEditEventDialogShow", null, {
                    data: appt,
                    targetCell: targetCell
                })) {
                    this._bindApptToDialog(appt);
                    this._editEventDialog.wijpopup("show", {
                        of: targetCell,
                        my: "left center",
                        at: "right center",
                        within: this.element.parent(),
                        offset: (targetCell && e ? Math.round(e.offsetX - targetCell.width()) : 10) + " 0",
                        collision: "fit"
                    });
                }
            };
            wijevcal.prototype._renderActiveView = /** Private methods */
            // render views
            function () {
                var o = this.options, toolsBar = this.element.find(".wijmo-wijev-headerbar .wijmo-wijev-tools");
                this.element.find(".wijmo-wijev-view").hide();
                this.element.find(".wijmo-wijev-viewdetails").hide();
                this.element.find(".wijmo-wijev-" + o.viewType.toLowerCase() + "-details").show();
                switch(o.viewType.toLowerCase()) {
                    case "day":
                    case "week":
                    case "list":
                        this.element.find(".wijmo-wijev-view.wijmo-wijev-dayview").show();
                        this._renderDayView();
                        break;
                    case "month":
                        this.element.find(".wijmo-wijev-view.wijmo-wijev-monthview").show();
                        this._renderMonthView();
                        break;
                    default:
                        break;
                }
                toolsBar.find(".wijmo-wijev-" + o.viewType.toLowerCase())[0]["checked"] = true;
                if($().buttonset) {
                    toolsBar.buttonset("refresh");
                }
            };
            wijevcal.prototype._redrawActiveView = function () {
                if(this._isUpdating) {
                    this._pendingRedrawActiveView = true;
                    return;
                }
                switch(this.options.viewType.toLowerCase()) {
                    case "day":
                    case "week":
                        // I am not sure why there not to redraw the list view.
                                            case "list":
                        this._clearDayViewCache();
                        this._templateDayColumn = null;
                        break;
                }
                this._renderActiveView();
            };
            wijevcal.prototype._getDayColumnDates = /* DAY(S)/WEEK view*/
            function (updateSelectedDates) {
                var o = this.options, columnDates = o.selectedDates, startDt, dt, i;
                if(!columnDates) {
                    columnDates = [
                        new Date()
                    ];
                }
                if(o.viewType === "week") {
                    startDt = o.selectedDate || columnDates[0];
                    i = o.firstDayOfWeek - startDt.getDay();
                    if(Math.abs(i) > 6) {
                        i = startDt.getDay() - o.firstDayOfWeek;
                    }
                    startDt = this._addDays(startDt, i);
                    columnDates = [];
                    for(i = 0; i < 7; i += 1) {
                        dt = this._addDays(startDt, i);
                        columnDates.push(dt);
                    }
                }
                if(updateSelectedDates) {
                    o.selectedDates = columnDates;
                }
                return columnDates;
            };
            wijevcal.prototype._renderDayView = function () {
                var o = this.options, curMinute = 0, lastMinute = 24 * 60, s, cellClass, timeRulerCellClass, columnDates = this._getDayColumnDates(true), i, curDayHeader, curDayColumn, curDayDate, todayDate = new Date(), columnCount, skipNextBorder = false, dayview = this.element.find(".wijmo-wijev-dayview"), headercontainer, scrollcontent, timeruler, curTimeRulerInterval = 0, isOddRow;
                if(dayview.length === 0) {
                    dayview = $("<div class=\"wijmo-wijev-view wijmo-wijev-dayview " + o.wijCSS.content + "\">" + "<h3 class=\"wijmo-wijev-header-title\">title" + "</h3>" + "<div class=\"wijmo-wijev-dayview-inner\">" + "<div class=\"wijmo-wijev-headercontainer\">" + "<div class=\"wijmo-wijev-sizer\">" + "<div class=\"wijmo-wijev-gmtlabel\">" + this.localizeString("labelAllDay", "all-day") + /*GMT" +
                    (new Date().getTimezoneOffset() / 60) +*/
                    "</div>" + "</div>" + "</div>" + "<div class=\"wijmo-wijev-scrollpanel\">" + "<div class=\"wijmo-wijev-scrollcontent\">" + "<div class=\"wijmo-wijev-timeruler\">" + "<div class=\"wijmo-wijev-currenttime-indicator\">" + "<div class=\"wijmo-wijev-currenttime-indicator-arrow " + o.wijCSS.stateError + "\"></div>" + "<div class=\"wijmo-wijev-currenttime-indicator-line " + o.wijCSS.stateError + "\"></div>" + "</div>" + "</div>" + "</div>" + "</div>" + "</div>" + "</div>");
                    dayview.appendTo(this.element.find(".wijmo-wijev-view-container"));
                    this.element.find(".wijmo-wijev-scrollpanel").wijsuperpanel({
                        hScroller: {
                            scrollBarVisibility: "hidden"
                        },
                        animationOptions: {
                            disabled: true
                        }
                    });
                }
                dayview.removeClass("wijmo-wijev-weekview wijmo-wijev-listview");
                dayview.addClass("wijmo-wijev-" + o.viewType.toLowerCase() + "view");
                headercontainer = this.element.find(".wijmo-wijev-headercontainer");
                scrollcontent = this.element.find(".wijmo-wijev-scrollcontent");
                timeruler = scrollcontent.find(".wijmo-wijev-timeruler");
                if(!this._templateDayColumn) {
                    timeruler.find(".wijmo-wijev-timerulerinterval").remove();
                    s = "<div class=\"wijmo-wijev-daycolumn\">";
                    isOddRow = true;
                    while(curMinute < lastMinute) {
                        cellClass = "wijmo-wijev-timeinterval " + o.wijCSS.content + " wijmo-wijev-minute-" + curMinute;
                        if(isOddRow) {
                            cellClass += " wijmo-wijev-oddrow";
                        }
                        isOddRow = !isOddRow;
                        timeRulerCellClass = "wijmo-wijev-timerulerinterval " + o.wijCSS.content + " wijmo-wijev-minute-" + curMinute;
                        s += "<div class=\"" + cellClass + "\" style=\"height: " + o.timeIntervalHeight + "px\"></div>";
                        curMinute += o.timeInterval;
                        curTimeRulerInterval += o.timeInterval;
                        if(curTimeRulerInterval >= o.timeRulerInterval) {
                            cellClass += " wijmo-wijev-timeinterval-hourstart";
                            timeRulerCellClass += " wijmo-wijev-timerulerinterval-hourstart";
                            timeruler.append($("<div class=\"" + timeRulerCellClass + "\" style=\"height:" + (curTimeRulerInterval / o.timeInterval) * o.timeIntervalHeight + "px\">" + this._formatString(o.timeRulerFormat, new Date(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate(), 0, (curMinute - curTimeRulerInterval))) + "</div>"));
                            curTimeRulerInterval = 0;
                        }
                    }
                    s += "</div>";
                    this._templateDayColumn = $(s);
                    this._templateDayHeader = $("<div class=\"wijmo-wijev-dayheadercolumn " + o.wijCSS.content + "\">" + //
                    //left: 82px; right: 34px; top: 8px; height: 26px;
                    "<div class=\"wijmo-wijev-allday-cell " + o.wijCSS.content + "\">" + "<div class=\"wijmo-wijev-daylabel\">3 Monday</div>" + /*"<div class=\"wijmo-wijev-allday-label ui-priority-secondary\">all-day events</div>" +*/
                    "</div>" + "</div>");
                }
                headercontainer.find(".wijmo-wijev-dayheadercolumn").remove();
                scrollcontent.find(".wijmo-wijev-daycolumn").remove();
                for(i = 0 , columnCount = columnDates.length; i < columnCount; i = i + 1) {
                    curDayDate = columnDates[i];
                    curDayHeader = this._getCachedDayHeader(curDayDate);
                    curDayColumn = this._getCachedDayColumn(curDayDate);
                    if(!curDayHeader) {
                        curDayHeader = this._templateDayHeader.clone(true);
                        curDayColumn = this._templateDayColumn.clone(true);
                        curDayHeader.addClass(this._dayDateToCssClass(curDayDate));
                        curDayHeader.find(".wijmo-wijev-daylabel").html(this._formatDayHeaderDate(curDayDate));
                        curDayColumn.addClass(this._dayDateToCssClass(curDayDate));
                        if(skipNextBorder) {
                            skipNextBorder = false;
                        } else {
                            curDayColumn.addClass("wijmo-wijev-leftborder");
                            curDayHeader.addClass("wijmo-wijev-leftborder");
                        }
                        if(this._compareDayDates(curDayDate, todayDate) === 0) {
                            //curDayColumn.addClass("wijmo-wijev-today ui-state-highlight");
                            curDayColumn.addClass("wijmo-wijev-today " + o.wijCSS.stateHighlight);
                            curDayColumn.addClass("wijmo-wijev-leftborder");
                            curDayColumn.addClass("wijmo-wijev-rightborder");
                            curDayHeader.addClass("wijmo-wijev-today").find(".wijmo-wijev-allday-cell").addClass(o.wijCSS.stateHighlight);
                            curDayHeader.addClass("wijmo-wijev-leftborder");
                            curDayHeader.addClass("wijmo-wijev-rightborder");
                            skipNextBorder = true;
                        }
                        if(i === columnCount - 1) {
                            curDayColumn.addClass("wijmo-wijev-rightborder");
                            curDayHeader.addClass("wijmo-wijev-rightborder");
                        }
                    } else {
                        curDayHeader = $(curDayHeader);
                        curDayHeader.find(".wijmo-wijev-daylabel").html(this._formatDayHeaderDate(curDayDate));
                    }
                    headercontainer.append(curDayHeader);
                    scrollcontent.append(curDayColumn);
                }
                this._invalidateDayView();
                this._renderDayViewAppointments();
            };
            wijevcal.prototype._getCachedDayHeader = // view cache>>
            function (dt) {
                var h = null;
                if(this._dayViewCache) {
                    if(this._dayViewCache[dt]) {
                        h = this._dayViewCache[dt].h;
                    }
                }
                return h;
            };
            wijevcal.prototype._getCachedDayColumn = function (dt) {
                var c = null;
                if(this._dayViewCache) {
                    if(this._dayViewCache[dt]) {
                        c = this._dayViewCache[dt].c;
                    }
                }
                return c;
            };
            wijevcal.prototype._storeDayCache = function (dt, h, c) {
                if(!this._dayViewCache) {
                    this._dayViewCache = {
                    };
                }
                this._dayViewCache[dt] = {
                    "h": h,
                    "c": c
                };
            };
            wijevcal.prototype._clearViewsCache = function () {
                this._clearDayViewCache();
                this._clearListViewCache();
            };
            wijevcal.prototype._clearDayViewCache = function () {
                this._dayViewCache = {
                };
            };
            wijevcal.prototype._clearListViewCache = function () {
                var $agendaList = this.element.find(".wijmo-wijev-list-details .wijmo-wijev-agenda-container .wijmo-wijsuperpanel-templateouterwrapper");
                // fixed the issue in IE10.
                if(!$agendaList[0]) {
                    $agendaList = this.element.find(".wijmo-wijev-list-details .wijmo-wijev-agenda-container .wijmo-wijsuperpanel-contentwrapper-touch");
                }
                $agendaList.data("wijevcal_agenda_initialized", false);
                $agendaList.data("wijevcal_agenda_loadedeventscount", 0);
            };
            wijevcal.prototype._invalidateDayView = //<< end of views cache
            function (scrollHeightOnly) {
                var headercontainer = this.element.find(".wijmo-wijev-headercontainer"), scrollcontent = this.element.find(".wijmo-wijev-scrollcontent"), timeruler = scrollcontent.find(".wijmo-wijev-timeruler"), dayHeaderColumns = headercontainer.find(".wijmo-wijev-dayheadercolumn"), dayColumns = scrollcontent.find(".wijmo-wijev-daycolumn"), title = this.element.find(".wijmo-wijev-view .wijmo-wijev-header-title"), headerTitleH, viewWidth, allDayCellH, allDayApptH, allDayLabelH, maxAllDayApptCount, curAllDayApptCount, timeRulerOuterWidth = timeruler.outerWidth(), i, dayscontainerWidth, dayscontainerHeight, columnOuterWidth, scrollpanel;
                this._updateHeaderTitleText()// ensure header title visibility
                ;
                headerTitleH = title.is(":visible") ? title.outerHeight(true) : 0;
                this._invalidateView();
                if(!this._maxAllDayEventCount) {
                    this._maxAllDayEventCount = 0;
                }
                allDayApptH = headercontainer.find(".wijmo-wijev-dayheadercolumn .wijmo-wijev-appointment").outerHeight(true);
                if(!allDayApptH) {
                    allDayApptH = 17;
                }
                allDayLabelH = headercontainer.find(".wijmo-wijev-daylabel").outerHeight(true);
                maxAllDayApptCount = 0;
                for(i = 0; i < dayHeaderColumns.length; i += 1) {
                    curAllDayApptCount = $(dayHeaderColumns[i]).find(".wijmo-wijev-allday-cell .wijmo-wijev-appointment").length;
                    if(curAllDayApptCount > maxAllDayApptCount) {
                        maxAllDayApptCount = curAllDayApptCount;
                    }
                }
                allDayCellH = allDayApptH * maxAllDayApptCount + allDayLabelH + allDayApptH;
                headercontainer.outerHeight(allDayCellH + Math.round(allDayApptH / 2));
                headercontainer.find(".wijmo-wijev-allday-cell").outerHeight(allDayCellH);
                viewWidth = this.element.find(".wijmo-wijev-view").width()// Getting the viewWidth shall not contain the padding of the view container.
                ;
                dayscontainerWidth = viewWidth - timeRulerOuterWidth;
                dayscontainerWidth = dayscontainerWidth - 18//vertical scrollbar width
                ;
                dayscontainerHeight = this.element.find(".wijmo-wijev-view").innerHeight() - headercontainer.outerHeight(true) - headerTitleH;
                columnOuterWidth = Math.floor(dayscontainerWidth / dayColumns.length);
                headercontainer.outerWidth(viewWidth);
                scrollcontent.outerWidth(viewWidth);
                dayHeaderColumns.outerWidth(columnOuterWidth);
                dayColumns.outerWidth(columnOuterWidth);
                this._invalidateCurrentTimeIndicator();
                scrollpanel = this.element.find(".wijmo-wijev-scrollpanel");
                scrollpanel.outerWidth(viewWidth);
                scrollpanel.outerHeight(dayscontainerHeight);
                scrollpanel.wijsuperpanel("refresh");
                switch(this.options.viewType.toLowerCase()) {
                    case "day":
                        this._updateDayViewDetails();
                        break;
                    case "list":
                        this._updateListViewDetails();
                        break;
                }
            };
            wijevcal.prototype._updateDayViewDetails = /* view details */
            function () {
                var o = this.options, selectedDate = o.selectedDate, leftPane = this.element.find(".wijmo-wijev-leftpane"), agendaContainer = leftPane.find(".wijmo-wijev-agenda-container");
                if(!this._dayViewDetailsInit) {
                    this._dayViewDetailsInit = true;
                    this.element.find(".wijmo-wijev-day-details .wijmo-wijev-daycalendar").wijcalendar({
                        culture: o.culture,
                        titleFormat: this.localizeString("calendarTitleFormat", "MMMM yyyy"),
                        toolTipFormat: this.localizeString("calendarToolTipFormat", "dddd, MMMM dd, yyyy"),
                        showTitle: false,
                        showOtherMonthDays: false,
                        showWeekNumbers: false,
                        selectionMode: {
                            day: true,
                            days: false
                        },
                        selectedDatesChanged: $.proxy(function (e, args) {
                            if(args.dates && !o.disabled) {
                                this.goToDate(args.dates[0]);
                            }
                        }, this),
                        nextTooltip: this.localizeString("calendarNextTooltip", "Next"),
                        prevTooltip: this.localizeString("calendarPrevTooltip", "Previous")
                    });
                    this.element.find(".wijmo-wijev-day-details .wijmo-wijev-agenda-container").wijsuperpanel();
                }
                this.element.find(".wijmo-wijev-day-details .wijmo-wijev-daycalendar").wijcalendar("option", "displayDate", selectedDate).wijcalendar("unSelectAll").wijcalendar("selectDate", selectedDate);
                this.element.find(".wijmo-wijev-day-details .wijmo-wijev-daycalendar").wijcalendar("refresh");
                this.element.find(".wijmo-wijev-day-details .wijmo-wijev-monthday-label").html(selectedDate.getDate());
                this.element.find(".wijmo-wijev-day-details .wijmo-wijev-fulldate-label").html(this._formatString(this.localizeString("dayDetailsLabelFulldateFormat", "{0:dddd, MMMM d}"), selectedDate));
                //Tuesday, November 1
                this.element.find(".wijmo-wijev-day-details .wijmo-wijev-year-label").html(this._formatString(this.localizeString("dayDetailsLabelYearFormat", "{0:yyyy}"), selectedDate));
                //selectedDate.getFullYear()
                this._updateAgendaList(this.element.find(".wijmo-wijev-day-details  .wijmo-wijev-agenda-container"), selectedDate, selectedDate, false);
            };
            wijevcal.prototype._listViewAgendaScrolled = function (e, data) {
                var supPanel = this.element.find(".wijmo-wijev-list-details .wijmo-wijev-agenda-container"), vScroller = supPanel.wijsuperpanel("option", "vScroller"), $agendaList, scrollValue = vScroller.scrollValue, scrollMax = vScroller.scrollMax - vScroller.scrollLargeChange * 2, eventType = e.type, isEnd = false, position;
                // in IE10, the superpanel's event is scroll.
                if(eventType === "wijsuperpanelscroll") {
                    position = data.position;
                    $agendaList = supPanel.find(".wijmo-wijsuperpanel-contentwrapper-touch");
                    if(supPanel.height() + position >= $agendaList.height()) {
                        isEnd = true;
                    }
                } else {
                    $agendaList = supPanel.find(".wijmo-wijsuperpanel-templateouterwrapper");
                }
                if(scrollValue >= scrollMax || isEnd) {
                    if($agendaList.data("wijevcal_agenda_loadnextpage")) {
                        $agendaList.data("wijevcal_agenda_loadnextpage", false);
                        $agendaList.find(".wijmo-wijev-agenda-more-events").show().html(this.localizeString("agendaLoadingMoreEvents", "Loading more events..."));
                        if(this._renderAgendaEventsTimeoutId) {
                            clearTimeout(this._renderAgendaEventsTimeoutId);
                            this._renderAgendaEventsTimeoutId = null;
                        }
                        this._renderAgendaEventsTimeoutId = setTimeout($.proxy(function () {
                            this._renderAgendaEventsTimeoutId = null;
                            // fix the issue 42885, this method lack an argument, and when scroll the superpanel to load
                            // more events, it will throw exception.
                            this._renderAgendaEvents($agendaList, null, null, true, supPanel);
                            // fix for 29488:
                            $agendaList.find(".wijmo-wijev-agenda-more-events").remove();
                        }, this), 100);
                    }
                }
            };
            wijevcal.prototype._updateListViewDetails = function () {
                if(!this._listViewDetailsInit) {
                    this._listViewDetailsInit = true;
                    if($.support.isTouchEnabled && $.support.isTouchEnabled()) {
                        this.element.find(".wijmo-wijev-list-details .wijmo-wijev-agenda-container").wijsuperpanel({
                            scroll: $.proxy(this._listViewAgendaScrolled, this)
                        });
                        //scrolling
                                            } else {
                        this.element.find(".wijmo-wijev-list-details .wijmo-wijev-agenda-container").wijsuperpanel({
                            scrolled: $.proxy(this._listViewAgendaScrolled, this)
                        });
                        //scrolling
                                            }
                }
                this._updateAgendaList(this.element.find(".wijmo-wijev-list-details  .wijmo-wijev-agenda-container"), null, null, true);
            };
            wijevcal.prototype._updateAgendaList = function (agendaContainer, startDt, endDt, listViewMode) {
                var leftPane = this.element.find(".wijmo-wijev-leftpane"), $agendaList = agendaContainer;
                ///////////
                // invalidate agenda height when text is changed(fix for 21282):
                agendaContainer.outerHeight(leftPane.innerHeight() - agendaContainer[0].offsetTop);
                if($agendaList.find(".wijmo-wijsuperpanel-templateouterwrapper").length > 0) {
                    $agendaList = $agendaList.find(".wijmo-wijsuperpanel-templateouterwrapper");
                }
                if($.support.isTouchEnabled && $.support.isTouchEnabled()) {
                    $agendaList = $agendaList.find(".wijmo-wijsuperpanel-contentwrapper-touch");
                }
                if(listViewMode && $agendaList.data("wijevcal_agenda_initialized")) {
                    /*fix for 24623 */
                    //$agendaList.parents(".wijmo-wijsuperpanel:first").wijsuperpanel("refresh");
                    // fixed the issue 41787, do not use the parents if the eventscalender is inside of superpanel, it will cause exception.
                    if(agendaContainer.data("wijmo-wijsuperpanel")) {
                        agendaContainer.wijsuperpanel("refresh");
                    }
                    return;
                }
                $agendaList.data("wijevcal_agenda_initialized", true);
                $agendaList.data("wijevcal_agenda_loadedeventscount", 0);
                /////////
                $agendaList.html("");
                this._renderAgendaEvents($agendaList, startDt, endDt, listViewMode, agendaContainer);
            };
            wijevcal.prototype._renderAgendaEvents = function ($agendaList, startDt, endDt, listViewMode, agendaContainer) {
                var appts = this._eventsView, appt, i, apptsCount, daysCount, dayIdx = 0, curDayApptsCount, s = "", s2 = "", viewStart = null, viewEnd = null, o = this.options, curDayStart, curDayEnd, eventsPerPage = 100, self = this, loadedEventsCount = $agendaList.data("wijevcal_agenda_loadedeventscount");
                if(startDt) {
                    viewStart = _toDayDate(startDt);
                    viewEnd = this._addDays(_toDayDate(endDt), 1);
                    daysCount = (viewEnd.getTime() - viewStart.getTime()) / (1000 * 60 * 60 * 24);
                }
                if(appts) {
                    apptsCount = (appts.length < (eventsPerPage + loadedEventsCount) || !listViewMode) ? appts.length : (eventsPerPage + loadedEventsCount);
                    $agendaList.data("wijevcal_agenda_loadedeventscount", apptsCount);
                    if(!viewStart) {
                        s2 = "";
                        for(i = loadedEventsCount; i < apptsCount; i += 1) {
                            appt = appts[i];
                            if(i === loadedEventsCount || curDayStart.getDate() !== appt.start.getDate()) {
                                curDayStart = appt.start;
                                if(i !== 0) {
                                    s += "<ul class=\"wijmo-wijev-agenda-list\">" + s2 + "</ul>";
                                    s += "</div>";
                                }
                                s += "<div class=\"wijmo-wijev-agenda-day-container " + this._dayDateToCssClass(curDayStart) + "\">";
                                if(listViewMode) {
                                    s += this._renderAgendaDayHeader(curDayStart);
                                }
                                s2 = "";
                            }
                            s2 += this._renderAgendaAppointmentVisual(appt);
                            curDayApptsCount += 1;
                            if(i === apptsCount - 1) {
                                s += "<ul class=\"wijmo-wijev-agenda-list\">" + s2 + "</ul>";
                                s += "</div>";
                                if(apptsCount < appts.length) {
                                    s += "<div class=\"wijmo-wijev-agenda-more-events\">";
                                    s += this._formatString(this.localizeString("agendaMoreEventsFormat", "More events ({0})..."), (appts.length - apptsCount));
                                    s += "<div>";
                                    $agendaList.data("wijevcal_agenda_loadnextpage", true);
                                } else {
                                    $agendaList.data("wijevcal_agenda_loadnextpage", false);
                                }
                            }
                        }
                    } else {
                        while(dayIdx < daysCount) {
                            curDayStart = this._addDays(viewStart, dayIdx);
                            curDayStart = new Date(curDayStart.getFullYear(), curDayStart.getMonth(), curDayStart.getDate());
                            curDayEnd = new Date(curDayStart.getFullYear(), curDayStart.getMonth(), curDayStart.getDate(), 23, 59, 59);
                            curDayApptsCount = 0;
                            s2 = "";
                            for(i = loadedEventsCount; i < apptsCount; i += 1) {
                                appt = appts[i];
                                if((appt.start < viewEnd && appt.end > viewStart) && (appt.start < curDayEnd && appt.start >= curDayStart)) {
                                    s2 += this._renderAgendaAppointmentVisual(appt);
                                    curDayApptsCount += 1;
                                }
                            }
                            if(s2 !== "") {
                                s += "<div class=\"wijmo-wijev-agenda-day-container " + this._dayDateToCssClass(curDayStart) + "\">";
                                if(listViewMode) {
                                    s += this._renderAgendaDayHeader(curDayStart);
                                }
                                s += "<ul class=\"wijmo-wijev-agenda-list\">" + s2 + "</ul>";
                                s += "</div>";
                            }
                            dayIdx += 1;
                        }
                    }
                    $(s).appendTo($agendaList);
                }
                $agendaList.on("click", ".wijmo-wijev-agenda-event", $.proxy(this._onAgendaEventClick, this)).on("mouseover", ".wijmo-wijev-agenda-event", function (e) {
                    if(self.options.disabled) {
                        return;
                    }
                    $(this).addClass(o.wijCSS.stateHover);
                }).on("mouseout", ".wijmo-wijev-agenda-event", function (e) {
                    if(self.options.disabled) {
                        return;
                    }
                    $(this).removeClass(o.wijCSS.stateHover).removeClass(o.wijCSS.stateActive);
                }).on("mousedown", ".wijmo-wijev-agenda-event", function () {
                    if(self.options.disabled) {
                        return;
                    }
                    $(this).addClass(o.wijCSS.stateActive);
                }).on("mouseup", ".wijmo-wijev-agenda-event", function () {
                    if(self.options.disabled) {
                        return;
                    }
                    $(this).removeClass(o.wijCSS.stateActive);
                });
                // Fixed the issue 41787.
                if(agendaContainer.data("wijmo-wijsuperpanel")) {
                    agendaContainer.wijsuperpanel("refresh");
                }
                //$agendaList.parents(".wijmo-wijsuperpanel").wijsuperpanel("refresh");
                            };
            wijevcal.prototype._renderAgendaDayHeader = function (curDayStart) {
                //var s = "<div class=\"wijmo-wijev-agenda-header ui-widget-header\">" +
                var s = "<div class=\"wijmo-wijev-agenda-header " + this.options.header + "\">" + "<div class=\"wijmo-wijev-weekday\">" + this._formatString("{0:dddd}", curDayStart) + "</div>" + "<div class=\"wijmo-wijev-date\">" + this._formatString(this.localizeString("agendaHeaderFullDateFormat", "{0:MMMM d, yyyy}"), curDayStart) + "</div>" + "</div>";
                return s;
            };
            wijevcal.prototype._onAgendaEventClick = function (e) {
                if(this.options.disabled) {
                    return;
                }
                var target = $(e.target);
                if(!target.hasClass("wijmo-wijev-agenda-event")) {
                    target = target.parent(".wijmo-wijev-agenda-event");
                }
                if(target.length > 0) {
                    //alert(this._parseEventIdFromClass(target[0].className) + "," + target[0].className);
                    this.goToEvent(this._parseEventIdFromClass(target[0].className));
                    //this.goToDate(this._parseDateFromClass(target[0].className));
                                    }
            };
            wijevcal.prototype._renderAgendaAppointmentVisual = function (ev) {
                var s = "<li class=\"wijmo-wijev-agenda-event " + this._dayDateToCssClass(ev.start) + " " + this._eventIdToCssClass(ev.id) + //" " + this.options.wijCSS.stateDefault + " ui-helper-clearfix\">" +
                " " + this.options.wijCSS.stateDefault + " " + this.options.wijCSS.helperClearFix + "\">" + "<div class=\"wijmo-wijev-agenda-event-color " + "wijmo-wijev-event-color-" + (ev.color || "default") + "\">" + "<div></div>" + "</div>" + "<div class=\"wijmo-wijev-agenda-event-title\">" + ev.subject + "</div>" + "<div class=\"wijmo-wijev-agenda-event-time\">" + (this.isAllDayEvent(ev) ? this.localizeString("labelAllDay", "all-day") : this._formatString(this.localizeString("agendaTimeFormat", "{0:hh:mm tt} to {1:hh:mm tt}"), ev.start, ev.end)) + "</div>" + "</li>";
                return s;
            };
            wijevcal.prototype._invalidateCurrentTimeIndicator = //wijmo-wijev-day-details
            function () {
                var timeInicator = this.element.find(".wijmo-wijev-timeruler .wijmo-wijev-currenttime-indicator"), curTime = new Date(), o = this.options;
                curTime = curTime.getMinutes() + curTime.getHours() * 60;
                timeInicator.css("top", (curTime / o.timeInterval) * o.timeIntervalHeight);
            };
            wijevcal.prototype._onEventsDataChanged = // <- end of day view
            function () {
                this._clearViewsCache();
                this._prepareEventsForView();
                this._renderActiveView();
                this._trigger("eventsDataChanged", null, {
                    eventsData: this.options.eventsData
                });
            };
            wijevcal.prototype._onCalendarsChanged = function () {
                this._trigger("calendarsChanged", null, {
                    calendars: this.options.calendars
                });
            };
            wijevcal.prototype._renderDayViewAppointments = function () {
                var appts = this._eventsView, appt, i, j, apptsCount, daysCount, headercontainer = this.element.find(".wijmo-wijev-headercontainer"), scrollcontent = this.element.find(".wijmo-wijev-scrollcontent"), dayHeaderColumns = headercontainer.find(".wijmo-wijev-dayheadercolumn"), dayColumns = scrollcontent.find(".wijmo-wijev-daycolumn"), curDayStart, curDayEnd, o = this.options, columnDates = this._getDayColumnDates(), viewStart = columnDates[0], viewEnd, allDayCellChanged, apptVisual, visualStartDt, visualEndDt, visualStartMin, visualEndMin, visualStartPx, visualEndPx, conflictColumns = [];
                viewEnd = columnDates[columnDates.length - 1];
                viewEnd = new Date(viewEnd.getFullYear(), viewEnd.getMonth(), viewEnd.getDate(), 23, 59, 59);
                if(appts) {
                    for(j = 0 , daysCount = columnDates.length; j < daysCount; j += 1) {
                        if(!dayColumns[j]._cached) {
                            curDayStart = columnDates[j];
                            curDayStart = new Date(curDayStart.getFullYear(), curDayStart.getMonth(), curDayStart.getDate());
                            curDayEnd = new Date(curDayStart.getFullYear(), curDayStart.getMonth(), curDayStart.getDate(), 23, 59, 59);
                            for(i = 0 , apptsCount = appts.length; i < apptsCount; i += 1) {
                                appt = appts[i];
                                if((appt.start < viewEnd && appt.end > viewStart) && (appt.start < curDayEnd && appt.end > curDayStart)) {
                                    if(this.isAllDayEvent(appt)) {
                                        allDayCellChanged = true;
                                        apptVisual = $(this._getAllDayEventMarkup(appt));
                                        $(dayHeaderColumns[j]).find(".wijmo-wijev-allday-cell").append(apptVisual);
                                    } else {
                                        visualStartDt = appt.start;
                                        visualEndDt = appt.end;
                                        if(visualStartDt < curDayStart) {
                                            visualStartDt = curDayStart;
                                        }
                                        if(visualEndDt > curDayEnd) {
                                            visualEndDt = curDayEnd;
                                        }
                                        visualStartMin = (((visualStartDt - curDayStart) / 1000) / 60);
                                        visualEndMin = (((visualEndDt - curDayStart) / 1000) / 60);
                                        visualStartPx = Math.round(visualStartMin * o.timeIntervalHeight / o.timeInterval);
                                        visualEndPx = Math.round(visualEndMin * o.timeIntervalHeight / o.timeInterval);
                                        apptVisual = $(this._getEventMarkup(appt));
                                        apptVisual.css("top", visualStartPx);
                                        apptVisual.outerHeight(visualEndPx - visualStartPx);
                                        $(dayColumns[j]).append(apptVisual);
                                    }
                                }
                            }//<for (i = 0
                            
                            //
                            this._storeDayCache(columnDates[j], dayHeaderColumns[j], dayColumns[j]);
                            dayColumns[j]._cached = true;
                            conflictColumns.push(dayColumns[j]);
                        } else//<if(!dayColumns[j]._cached
                         {
                            // fix for 30112 case 1:
                            conflictColumns.push(dayColumns[j]);
                        }
                    }//<for (j = 0
                    
                }
                this._dayColumnsToResolve = conflictColumns;
                this._dayColumnResolveIdx = 0;
                if(!this._resolveDayApptConflictsTimeout) {
                    clearTimeout(this._resolveDayApptConflictsTimeout);
                    this._resolveDayApptConflictsTimeout = null;
                }
                this._resolveDayApptConflictsTimeout = setTimeout($.proxy(this._resolveDayViewAppointmentConflictsCb1, this), 1);
                // adjust scroll height according new all day cells height:
                if(allDayCellChanged) {
                    this._invalidateDayView(true);
                }
                if(this._dayViewScrollToEvent) {
                    apptVisual = this.element.find(".wijmo-wijev-dayview .wijmo-wijev-daycolumn ." + this._eventIdToCssClass(this._dayViewScrollToEvent.id));
                    if(apptVisual.length > 0) {
                        this.element.find(".wijmo-wijev-scrollpanel").wijsuperpanel("scrollChildIntoView", apptVisual);
                    }
                    //this._dayViewScrollToEvent = null;
                                    }
            };
            wijevcal.prototype._getAllDayEventMarkup = function (appt) {
                return "<div class=\"wijmo-wijev-appointment " + this._eventIdToCssClass(appt.id) + "\">" + "<div class=\"" + " wijmo-wijev-colordot wijmo-wijev-event-color-" + (appt.color || "default") + "\"></div>" + "<div class=\"wijmo-wijev-event-title\">" + appt.subject + "</div>" + "</div>";
            };
            wijevcal.prototype._getEventMarkup = function (appt) {
                return "<div class=\"wijmo-wijev-appointment wijmo-wijev-event-color-" + (appt.color || "default") + " " + this._eventIdToCssClass(appt.id) + "\">" + "<div class=\"wijmo-wijev-content\"><div class=\"wijmo-wijev-title\">" + this._formatString(this.options.eventTitleFormat, appt.start, appt.end, appt.subject, appt.location, "", appt.description/*"<strong>ICONS</strong>"*/ ) + "</div></div>" + "<div class=\"wijmo-wijev-resizer\">" + //"<div class=\"ui-icon ui-icon-grip-solid-horizontal\">" +
                "<div class=\"" + this.options.wijCSS.icon + " " + this.options.wijCSS.iconHGripSolid + "\">" + "&nbsp;</div></div>" + "</div>";
            };
            wijevcal.prototype._resolveDayViewAppointmentConflictsCb1 = function () {
                this._resolveDayApptConflictsTimeout = null;
                if(!this._dayColumnsToResolve || this._dayColumnResolveIdx >= this._dayColumnsToResolve.length) {
                    return;
                }
                this._resolveDayViewAppointmentConflicts(this._dayColumnsToResolve[this._dayColumnResolveIdx]);
                this._dayColumnResolveIdx = this._dayColumnResolveIdx + 1;
                setTimeout($.proxy(this._resolveDayViewAppointmentConflictsCb1, this), 1);
            };
            wijevcal.prototype._resolveDayViewAppointmentConflicts = function (col) {
                var eventsData = $(col).find(".wijmo-wijev-appointment"), eventDataArray, intersections = [], arr1, i, j, appt1, appt2, count1, count2, v, startIndex = 0;
                eventDataArray = $(eventsData).toArray().sort(this._sortOffsetTop);
                for(i = 0 , count1 = eventsData.length; i < count1; i += 1) {
                    if(i < startIndex) {
                        continue;
                    }
                    appt1 = eventDataArray[i];
                    for(j = i; j < count1; j += 1) {
                        if(j !== i) {
                            appt2 = eventDataArray[j];
                            if((appt1.offsetTop) < (appt2.offsetTop + appt2.offsetHeight) && (appt1.offsetTop + appt1.offsetHeight) > appt2.offsetTop) {
                                if(!intersections[i]) {
                                    intersections[i] = [
                                        appt1
                                    ];
                                }
                                intersections[i].push(appt2);
                                if((appt2.offsetTop + appt2.offsetHeight) > (appt1.offsetTop + appt1.offsetHeight)) {
                                    appt1 = appt2;
                                }
                            } else {
                                break;
                            }
                        }
                    }
                    startIndex = j;
                }
                for(i = 0 , count1 = intersections.length; i < count1; i += 1) {
                    arr1 = intersections[i];
                    if(arr1) {
                        count2 = arr1.length;
                        arr1.sort(this._sortOffsetTop);
                        for(j = 0; j < count2; j += 1) {
                            appt1 = arr1[j];
                            appt1.style.width = Math.floor(100 / count2) + "%";
                            v = Math.floor(100 * j / count2);
                            appt1.style.marginLeft = v + "%";
                            appt1.style.zIndex = v;
                        }
                    }
                }
            };
            wijevcal.prototype._sortOffsetTop = function (a, b) {
                if(a.offsetTop < b.offsetTop) {
                    return -1;
                } else if(a.offsetTop > b.offsetTop) {
                    return 1;
                }
                return 0;
            };
            wijevcal.prototype._onDayViewTimeIntervalClick = // day view time interval
            function (e) {
                if(this.options.disabled) {
                    return;
                }
                if(this.options.readOnly) {
                    return;
                }
                this.showEditEventDialog(null, e.target, e);
            };
            wijevcal.prototype._onDayViewAllDayCellClick = function (e) {
                if(this.options.disabled) {
                    return;
                }
                if(this.options.readOnly) {
                    return;
                }
                var targetAppt = $(e.target);
                if(targetAppt.hasClass("wijmo-wijev-appointment") || targetAppt.parents(".wijmo-wijev-appointment").length > 0) {
                    return;
                }
                if((targetAppt.hasClass("wijmo-wijev-daylabel") || targetAppt.parents(".wijmo-wijev-daylabel").length > 0)) {
                    return;
                }
                //
                this.showEditEventDialog(null, e.target, e);
            };
            wijevcal.prototype._onMonthViewDayLabelClick = function (e) {
                if(this.options.disabled) {
                    return;
                }
                var monthcellcontainer = $(e.target).parents(".wijmo-wijev-monthcellcontainer"), o = this.options, cellDate;
                if(monthcellcontainer.length < 1) {
                    monthcellcontainer = $(e.target).parents(".wijmo-wijev-dayheadercolumn");
                }
                //
                if(monthcellcontainer[0]) {
                    cellDate = this._parseDateFromClass(monthcellcontainer[0].className);
                    if(o.viewType !== "day") {
                        o.viewType = "day";
                        this._onViewTypeChanged();
                    }
                    o.selectedDates = [
                        new Date(cellDate)
                    ];
                    this._onSelectedDatesChanged();
                }
            };
            wijevcal.prototype._onMonthViewCellClick = function (e) {
                if(this.options.disabled) {
                    return;
                }
                var monthcellcontainer = $(e.target).parent(".wijmo-wijev-monthcellcontainer");
                if(this.options.readOnly) {
                    return;
                }
                if(monthcellcontainer.length < 1) {
                    return;
                }
                this.showEditEventDialog(null, monthcellcontainer, e);
            };
            wijevcal.prototype._onAppointmentClick = function (e) {
                var target = $(e.target), appt;
                if(this.options.disabled) {
                    return;
                }
                if(this.options.readOnly) {
                    return;
                }
                if(this._apptDragResizeFlag) {
                    return;
                }
                if(!target.hasClass("wijmo-wijev-appointment")) {
                    target = target.parents(".wijmo-wijev-appointment");
                }
                if(target.length > 0) {
                    appt = this.findEventById(target[0].className);
                    this.showEditEventDialog(appt, target, e);
                }
            };
            wijevcal.prototype.findEventById = /** Find event object by id
            * @returns {object} events data.
            */
            function (id) {
                var i;
                if(id) {
                    i = id.indexOf("apptid_");
                    if(i !== -1) {
                        id = this._parseEventIdFromClass(id);
                    }
                    if(this._eventsDataById) {
                        return this._eventsDataById[id];
                    }
                }
                return null;
            };
            wijevcal.prototype._onMonthViewAppointmentMouseDown = // month view appointment drag/drop
            function (e) {
                if(this.options.disabled) {
                    return;
                }
                if(this.options.readOnly) {
                    return;
                }
                var target = $(e.target), appt = target.hasClass("wijmo-wijev-appointment") ? target : target.parents(".wijmo-wijev-appointment");
                e.preventDefault();
                this.__targetAppt = appt;
                $(document).bind("mouseup.tmp_wijevcal", $.proxy(this._onMonthViewAppointmentMouseUp, this));
                this.element.find(".wijmo-wijev-monthview .wijmo-wijev-monthcellcontainer").bind("mouseover.tmp_wijevcal", $.proxy(this._onMonthViewCellMouseOver, this));
            };
            wijevcal.prototype._onDayViewAppointmentMouseDown = // day view appointment drag/drop/resize/inline edit
            function (e) {
                if(this.options.disabled) {
                    return;
                }
                if(this.options.readOnly) {
                    return;
                }
                var target = $(e.target), appt = target.hasClass("wijmo-wijev-appointment") ? target : target.parents(".wijmo-wijev-appointment"), isResize = target.hasClass("wijmo-wijev-resizer") || target.parents(".wijmo-wijev-resizer").length > 0;
                if(this.options.disabled) {
                    //fix for 20811
                    return;
                }
                this._isApptResize = isResize;
                e.preventDefault();
                if(this._isApptResize) {
                    this.__startApptH = appt[0].offsetHeight;
                    this.__startApptY = appt[0].offsetTop;
                } else {
                    this.__startApptY = appt[0].offsetTop;
                }
                this.__startClientY = e.clientY;
                this.__targetAppt = appt;
                $(document).bind("mousemove.tmp_wijevcal", $.proxy(this._onDayViewAppointmentMouseMove, this));
                $(document).bind("mouseup.tmp_wijevcal", $.proxy(this._onDayViewAppointmentMouseUp, this));
                $(this.element).find(".wijmo-wijev-dayview .wijmo-wijev-daycolumn").bind("mouseover.tmp_wijevcal", $.proxy(this._onDayViewColumnMouseOver, this));
                $(this.element).find(".wijmo-wijev-dayview .wijmo-wijev-allday-cell").bind("mouseover.tmp_wijevcal", $.proxy(this._onDayViewAllDayMouseOver, this));
            };
            wijevcal.prototype._onDayViewAppointmentMouseMove = function (e) {
                if(this.options.disabled) {
                    return;
                }
                e.preventDefault();
                var ychange = e.clientY - this.__startClientY, top, o = this.options, newHeight, offsetTop;
                if(!e.ctrlKey) {
                    ychange = Math.round(ychange / o.timeIntervalHeight) * o.timeIntervalHeight;
                }
                if(ychange !== 0 && !this._apptDragResizeFlag) {
                    this._apptDragResizeFlag = true;
                    this.__targetAppt.addClass("wijmo-wijev-dragging");
                    this.__targetAppt.css("width", "100%").css("margin-left", "0").css("z-index", "1000");
                }
                if(this._apptDragResizeFlag) {
                    if(this._isApptResize) {
                        newHeight = this.__startApptH + ychange;
                        if(newHeight < 0) {
                            newHeight = Math.abs(newHeight);
                            top = this.__startApptY - newHeight;
                            if(top >= 0) {
                                this.__targetAppt.css("height", newHeight);
                                this.__targetAppt.css("top", top);
                            }
                        } else {
                            this.__targetAppt.css("height", newHeight);
                        }
                    } else {
                        top = this.__startApptY + ychange;
                        if(top < 0) {
                            top = 0;
                        }
                        this.__targetAppt.css("top", top);
                        offsetTop = this.__targetAppt.offset().top;
                        //fix for 25070 (part 1):
                        this.element.find(".wijmo-wijev-scrollpanel").wijsuperpanel("scrollChildIntoView", this.__targetAppt);
                        this.__startApptY = this.__startApptY - (this.__targetAppt.offset().top - offsetTop);
                    }
                    this._onApptVisualDargOrResize(this.__targetAppt, this.findEventById(this.__targetAppt[0].className));
                }
            };
            wijevcal.prototype._onDayViewAppointmentMouseUp = function (e) {
                if(this.options.disabled) {
                    return;
                }
                if(this.__targetAppt) {
                    this.__targetAppt.removeClass("wijmo-wijev-dragging");
                }
                $(document).unbind(".tmp_wijevcal");
                $(this.element).find(".wijmo-wijev-dayview .wijmo-wijev-daycolumn").unbind(".tmp_wijevcal");
                $(this.element).find(".wijmo-wijev-dayview .wijmo-wijev-allday-cell").unbind(".tmp_wijevcal");
                if(this._apptDragResizeFlag || this._apptMovedFlag) {
                    var o = this.findEventById(this.__targetAppt[0].className);
                    this._onApptVisualDargOrResize(this.__targetAppt, o);
                    this._apptMovedFlag = false;
                    this._movedFromTimeInervalApptElem = null;
                    this.updateEvent(o);
                    window.setTimeout($.proxy(function () {
                        if(this.__targetAppt && !this.__targetAppt.hasClass("wijmo-wijev-dragging")) {
                            this._apptDragResizeFlag = false;
                            // fix for 30112 case 2
                            this._resolveDayViewAppointmentConflicts(this.__targetAppt.parents(".wijmo-wijev-daycolumn"));
                        }
                    }, this), 1);
                }
            };
            wijevcal.prototype._updateAppointmentVisual = function (appt) {
                var visual = this.element.find(".wijmo-wijev-dayview ." + this._eventIdToCssClass(appt.id)), o = this.options, visualStartMin, visualEndMin, visualStartPx, visualEndPx, curDayStart, columnDateClass, sourceCol, targetCol;
                if(visual.length === 1) {
                    this._addColorClass(visual, appt.color);
                    visual.find(".wijmo-wijev-title").html(this._formatString(o.eventTitleFormat, appt.start, appt.end, appt.subject, appt.location, "", appt.description/*"<strong>ICONS</strong>"*/ ));
                    curDayStart = _toDayDate(appt.start);
                    visualStartMin = (((appt.start - curDayStart) / 1000) / 60);
                    visualEndMin = (((appt.end - curDayStart) / 1000) / 60);
                    visualStartPx = Math.round(visualStartMin * o.timeIntervalHeight / o.timeInterval);
                    visualEndPx = Math.round(visualEndMin * o.timeIntervalHeight / o.timeInterval);
                    visual.css("top", visualStartPx);
                    visual.css("height", (visualEndPx - visualStartPx));
                    columnDateClass = this._dayDateToCssClass(curDayStart);
                    if(visual.parents(".wijmo-wijev-daycolumn." + columnDateClass).length !== 1) {
                        sourceCol = visual[0].parentNode;
                        targetCol = this.element.find(".wijmo-wijev-daycolumn." + columnDateClass);
                        sourceCol.removeChild(visual[0]);
                        //this._resolveDayViewAppointmentConflicts(sourceCol); //qq:not works.
                        visual.appendTo(targetCol);
                        //this._resolveDayViewAppointmentConflicts(targetCol); //qq:not works.
                                            }
                    //daycolumn date_2011_7_7
                    /*
                    
                    Math.round(visualStartPx * o.timeInterval / o.timeIntervalHeight)
                    = visualStartMin;
                    
                    visualStartMin * 60 * 1000 + curDayStart = visualStartDt
                    
                    
                    visualStartMin = (((visualStartDt - curDayStart)/1000) / 60);
                    visualEndMin = (((visualEndDt - curDayStart) / 1000) / 60);
                    visualStartPx = Math.round(visualStartMin *
                    o.timeIntervalHeight / o.timeInterval);
                    visualEndPx = Math.round(visualEndMin *
                    o.timeIntervalHeight / o.timeInterval);
                    
                    */
                                    }
            };
            wijevcal.prototype._onApptVisualDargOrResize = function (visual, appt) {
                if(this.options.disabled) {
                    return;
                }
                var o = this.options, visualStartPx = visual[0].offsetTop, visualEndPx = visualStartPx + visual[0].offsetHeight, visualStartMin, visualEndMin, visualStartDt, visualEndDt, realEndDt, durationMs, curDayStart, parentCol;
                if(visual.parents(".wijmo-wijev-dayheadercolumn").length > 0) {
                    parentCol = visual.parents(".wijmo-wijev-dayheadercolumn")[0];
                } else {
                    parentCol = visual.parents(".wijmo-wijev-daycolumn")[0];
                }
                curDayStart = this._parseDateFromClass(parentCol.className, null);
                visualStartMin = Math.round(visualStartPx * o.timeInterval / o.timeIntervalHeight);
                visualEndMin = Math.round(visualEndPx * o.timeInterval / o.timeIntervalHeight);
                visualStartDt = new Date(visualStartMin * 60 * 1000 + curDayStart.getTime());
                visualEndDt = new Date(visualEndMin * 60 * 1000 + curDayStart.getTime());
                if(appt) {
                    if(!this._isApptResize) {
                        // fix for 25120
                        // do not change duration for drag action
                        durationMs = appt.end.getTime() - appt.start.getTime();
                        realEndDt = new Date(visualStartDt.getTime() + durationMs);
                    } else {
                        realEndDt = visualEndDt;
                    }
                    appt.allday = visual.parents(".wijmo-wijev-dayheadercolumn").length > 0;
                    appt.start = visualStartDt;
                    appt.end = realEndDt//visualEndDt;
                    ;
                    visual.find(".wijmo-wijev-title").html(this._formatString(o.eventTitleFormat, appt.start, appt.end, appt.subject, appt.location, "", appt.description/*"<strong>ICONS</strong>"*/ ));
                    if(!this._isApptResize && realEndDt.getTime() !== visualEndDt.getTime()) {
                        // fix for 25120
                        // Update visual height
                        visual.css("height", (Math.round((((appt.end - _toDayDate(appt.start)) / 1000) / 60) * o.timeIntervalHeight / o.timeInterval) - Math.round((((appt.start - _toDayDate(appt.start)) / 1000) / 60) * o.timeIntervalHeight / o.timeInterval)));
                    }
                }
            };
            wijevcal.prototype._onDayViewColumnMouseOver = function (e) {
                if(this.options.disabled) {
                    return;
                }
                var targetCol = $(e.target).parents(".wijmo-wijev-daycolumn"), sourceCol = this.__targetAppt.parents(".wijmo-wijev-daycolumn");
                if(targetCol.length < 1) {
                    return;
                }
                if(sourceCol.length < 1) {
                    sourceCol = this.__targetAppt.parents(".wijmo-wijev-dayheadercolumn");
                    if(sourceCol.length < 1) {
                        return;
                    } else {
                        // move from all day event cell to time interval.
                        if(this._movedFromTimeInervalApptElem) {
                            // fix for 25070 case 2.
                            this.__targetAppt.replaceWith(this._movedFromTimeInervalApptElem);
                            this.__targetAppt = $(this._movedFromTimeInervalApptElem);
                            this._movedFromTimeInervalApptElem = null;
                        } else {
                            this.__targetAppt.html(this._getEventMarkup(this.findEventById(this.__targetAppt[0].className)));
                        }
                    }
                }
                if(targetCol[0].className !== sourceCol[0].className) {
                    this.__targetAppt[0].parentNode.removeChild(this.__targetAppt[0]);
                    this._resolveDayViewAppointmentConflicts(sourceCol);
                    this.__targetAppt.appendTo(targetCol);
                    this._apptMovedFlag = true;
                }
            };
            wijevcal.prototype._onMonthViewCellMouseOver = function (e) {
                if(this.options.disabled) {
                    return;
                }
                var target = $(e.target), targetCell = target.hasClass("wijmo-wijev-monthcellcontainer") ? target : target.parents(".wijmo-wijev-monthcellcontainer"), sourceCell = this.__targetAppt.parents(".wijmo-wijev-monthcellcontainer");
                if(targetCell.length < 1 || sourceCell.length < 1) {
                    return;
                }
                if(targetCell[0].className !== sourceCell[0].className) {
                    this.__targetAppt[0].parentNode.removeChild(this.__targetAppt[0]);
                    this.__targetAppt.appendTo(targetCell.find(".wijmo-wijev-monthcell"));
                    this.__targetApptChanged = true;
                }
            };
            wijevcal.prototype._onMonthViewAppointmentMouseUp = function () {
                if(this.options.disabled) {
                    return;
                }
                var appt, parentCell = this.__targetAppt.parents(".wijmo-wijev-monthcellcontainer")[0], curDayStart = this._parseDateFromClass(parentCell.className, null), daysDiff;
                $(document).unbind(".tmp_wijevcal");
                this.element.find(".wijmo-wijev-monthview .wijmo-wijev-monthcellcontainer").unbind(".tmp_wijevcal");
                if(this.__targetApptChanged) {
                    this.__targetApptChanged = false;
                    appt = this.findEventById(this.__targetAppt[0].className);
                    daysDiff = (curDayStart.getTime() - _toDayDate(appt.start).getTime()) / (1000 * 60 * 60 * 24);
                    appt.start = this._addDays(appt.start, daysDiff);
                    appt.end = this._addDays(appt.end, daysDiff);
                    this.updateEvent(appt);
                }
            };
            wijevcal.prototype._onDayViewAllDayMouseOver = function (e) {
                if(this.options.disabled) {
                    return;
                }
                var targetCol = $(e.target).parents(".wijmo-wijev-dayheadercolumn"), sourceCol = this.__targetAppt.parents(".wijmo-wijev-daycolumn"), newVisual;
                if(targetCol.length < 1) {
                    return;
                }
                if(sourceCol.length > 0) {
                    // update appointment element
                    // move from time interval to all day cell
                    newVisual = $(this._getAllDayEventMarkup(this.findEventById(this.__targetAppt[0].className)));
                    // fix for 25070 case 2:
                    this._movedFromTimeInervalApptElem = this.__targetAppt[0].cloneNode(true);
                    this.__targetAppt.replaceWith(newVisual);
                    this.__targetAppt = newVisual;
                } else {
                    // move from all day cell to another all day cell
                    sourceCol = this.__targetAppt.parents(".wijmo-wijev-dayheadercolumn");
                }
                if(sourceCol.length < 1) {
                    return;
                }
                if(targetCol[0].className !== sourceCol[0].className) {
                    this.__targetAppt[0].parentNode.removeChild(this.__targetAppt[0]);
                    this._resolveDayViewAppointmentConflicts(sourceCol);
                    this.__targetAppt.appendTo($(targetCol).find(".wijmo-wijev-allday-cell"));
                    this._apptMovedFlag = true;
                }
            };
            wijevcal.prototype._renderMonthView = // <-
            /* MONTH view */
            function () {
                var o = this.options, selectedDate = o.selectedDate, firstDayOfWeek = o.firstDayOfWeek, isToday = false, isOtherMonth = false, curDate, startDate, endDate, todayDate = new Date(), curColumnInd, curRowInd, skipNextBorder = false, containerClass, sCols = [
                    "", 
                    "", 
                    "", 
                    "", 
                    "", 
                    "", 
                    ""
                ], s, i, monthview = this.element.find(".wijmo-wijev-view.wijmo-wijev-monthview"), monthviewinner, dayHeaderFormat = o.dayHeaderFormat, firstRowDayHeaderFormat = o.firstRowDayHeaderFormat;
                if(!selectedDate) {
                    selectedDate = new Date();
                }
                startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
                while(startDate.getDay() !== parseInt(firstDayOfWeek)) {
                    startDate = this._addDays(startDate, -1);
                }
                endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), this._daysInMonth(selectedDate.getMonth(), selectedDate.getFullYear()));
                curDate = startDate;
                curColumnInd = 0;
                curRowInd = 0;
                while(curDate < endDate || curColumnInd < 7) {
                    if(curDate > endDate) {
                        endDate = curDate;
                    }
                    s = "";
                    containerClass = "wijmo-wijev-monthcellcontainer " + o.wijCSS.content + " " + this._dayDateToCssClass(curDate);
                    isOtherMonth = curDate.getMonth() !== selectedDate.getMonth();
                    if(isOtherMonth) {
                        // ui-priority-secondary
                        containerClass += " wijmo-wijev-othermonth";
                    }
                    if(skipNextBorder) {
                        skipNextBorder = false;
                    } else {
                        containerClass += " wijmo-wijev-leftborder";
                        if(curColumnInd === 6) {
                            containerClass += " wijmo-wijev-rightborder";
                        }
                    }
                    isToday = this._compareDayDates(curDate, todayDate) === 0;
                    if(isToday) {
                        // ui-state-highlight
                        containerClass += " wijmo-wijev-today";
                        containerClass += " wijmo-wijev-rightborder";
                        skipNextBorder = true;
                    }
                    s += "<div class=\"" + containerClass + "\">";
                    s += "<div class=\"wijmo-wijev-monthcellheader";
                    if(isOtherMonth) {
                        //s += " ui-priority-secondary";
                        s += " " + o.wijCSS.prioritySecondary;
                    }
                    if(isToday) {
                        //s += " ui-state-highlight";
                        s += " " + o.wijCSS.stateHighlight;
                    }
                    s += "\">";
                    if(isToday) {
                        s += "<span class=\"wijmo-wijev-todaylabel\">" + this.localizeString("labelToday", "Today") + "</span>";
                    }
                    if(curRowInd === 0) {
                        s += this._formatString(firstRowDayHeaderFormat, curDate);
                    } else {
                        s += this._formatString(dayHeaderFormat, curDate);
                    }
                    s += "</div>";
                    s += "<div class=\"wijmo-wijev-monthcell";
                    if(isOtherMonth) {
                        //s += " ui-priority-secondary";
                        s += " " + o.wijCSS.prioritySecondary;
                    }
                    if(isToday) {
                        //s += " ui-state-highlight";
                        s += " " + o.wijCSS.stateHighlight;
                    }
                    s += "\"></div>";
                    s += "</div>";
                    sCols[curColumnInd] = sCols[curColumnInd] + s;
                    curColumnInd += 1;
                    curDate = this._addDays(curDate, 1);
                    if(curColumnInd > 6) {
                        if(curDate > endDate) {
                            break;
                        }
                        curColumnInd = 0;
                        curRowInd += 1;
                    }
                }
                if(monthview.length === 0) {
                    monthview = $("<div class=\"wijmo-wijev-view wijmo-wijev-monthview " + o.wijCSS.content + "\">" + "<h3 class=\"wijmo-wijev-header-title\">title" + "</h3>" + "<div class=\"wijmo-wijev-monthview-inner\">" + "</div>" + "</div>");
                    monthview.appendTo(this.element.find(".wijmo-wijev-view-container"));
                }
                monthviewinner = monthview.find(".wijmo-wijev-monthview-inner");
                monthviewinner.find(".wijmo-wijev-monthcolumn").remove();
                curDate = startDate;
                for(i = 0; i < 7; i += 1) {
                    monthviewinner.append("<div class=\"wijmo-wijev-monthcolumn\">" + sCols[i] + "</div>");
                    curDate = this._addDays(curDate, 1);
                }
                this._invalidateMonthView();
                this._renderMonthViewAppointments();
            };
            wijevcal.prototype._invalidateMonthView = function () {
                var monthview = this.element.find(".wijmo-wijev-monthview"), monthviewinner = monthview.find(".wijmo-wijev-monthview-inner"), monthColumns = monthview.find(".wijmo-wijev-monthcolumn"), monthcellcontainers = monthview.find(".wijmo-wijev-monthcellcontainer"), title = this.element.find(".wijmo-wijev-monthview .wijmo-wijev-header-title"), viewWidth, viewHeight, columnOuterWidth, monthcellcontainerH, monthHeaderH, monthCellH, weekdaynameH, diff;
                this._invalidateView();
                if(monthColumns.length < 1) {
                    return;
                }
                viewWidth = monthview.innerWidth();
                viewHeight = monthview.innerHeight() - title.outerHeight(true);
                monthviewinner.outerWidth(viewWidth);
                monthviewinner.outerHeight(viewHeight);
                viewWidth = viewWidth - (monthviewinner.outerWidth(true) - monthviewinner.innerWidth());
                viewHeight = viewHeight - (monthviewinner.outerHeight(true) - monthviewinner.innerHeight());
                //viewHeight = monthviewinner.();
                columnOuterWidth = Math.floor(viewWidth / monthColumns.length);
                monthColumns.outerWidth(columnOuterWidth);
                diff = viewWidth - columnOuterWidth * monthColumns.length;
                if(diff > 0) {
                    $(monthColumns[monthColumns.length - 1]).outerWidth(columnOuterWidth + diff);
                }
                weekdaynameH = $(monthColumns[0]).find(".wijmo-wijev-weekdayname").outerHeight(true);
                if(!weekdaynameH) {
                    //(20120830) fix for 27354(regression issue?):
                    weekdaynameH = 0;
                }
                monthcellcontainerH = Math.floor((viewHeight - weekdaynameH) / $(monthColumns[0]).find(".wijmo-wijev-monthcellcontainer").length);
                monthcellcontainers.height(monthcellcontainerH);
                //outerHeight(monthcellcontainerH);
                monthHeaderH = $(monthcellcontainers[0]).find(".wijmo-wijev-monthcellheader").outerHeight(true);
                monthCellH = monthcellcontainerH - monthHeaderH;
                monthcellcontainers.find(".wijmo-wijev-monthcell").outerHeight(monthCellH);
            };
            wijevcal.prototype._renderMonthViewAppointments = function () {
                var appts = this._eventsView, appt, i, j, apptsCount, daysCount, monthcellcontainers = this.element.find(".wijmo-wijev-monthcellcontainer"), monthcellcontainer, curDayStart, curDayEnd, apptVisual;
                if(appts) {
                    for(j = 0 , daysCount = monthcellcontainers.length; j < daysCount; j += 1) {
                        monthcellcontainer = monthcellcontainers[j];
                        curDayStart = this._parseDateFromClass(monthcellcontainer.className);
                        curDayEnd = new Date(curDayStart.getFullYear(), curDayStart.getMonth(), curDayStart.getDate(), 23, 59, 59);
                        for(i = 0 , apptsCount = appts.length; i < apptsCount; i += 1) {
                            appt = appts[i];
                            if((appt.start < curDayEnd && appt.end > curDayStart)) {
                                apptVisual = $("<div class=\"wijmo-wijev-appointment " + this._eventIdToCssClass(appt.id) + "\">" + "<div class=\"" + " wijmo-wijev-colordot wijmo-wijev-event-color-" + (appt.color || "default") + "\"></div>" + "<div class=\"wijmo-wijev-event-title\">" + appt.subject + "</div>" + "</div>");
                                $(monthcellcontainer).find(".wijmo-wijev-monthcell").append(apptVisual);
                            }
                        }//<for (i = 0
                        
                    }//<for (j = 0
                    
                }
                // display "show more..." if needed:
                monthcellcontainers.find(".wijmo-wijev-monthcell").each($.proxy(function (i, el) {
                    var monthcell = $(el), apps = monthcell.find(".wijmo-wijev-appointment"), monthcellH = monthcell.outerHeight(), appH = apps.outerHeight(), appsH = apps.length * appH, hiddenCount = 0;
                    if(appsH > monthcellH) {
                        apps.each(function (j, a) {
                            if((j * appH + appH) > monthcellH) {
                                a["style"].display = "none";
                                hiddenCount += 1;
                            }
                        });
                        if(hiddenCount > 0) {
                            if(monthcell.find(".wijmo-wijev-monthcell-showmore").length < 1) {
                                monthcell.append($("<div class=\"wijmo-wijev-monthcell-showmore\">" + this._formatString(this.localizeString("monthCellMoreEventsFormat", "{0}  more..."), hiddenCount) + "</div>"));
                            }
                        }
                    }
                }, this));
            };
            wijevcal.prototype.log = /**  Sends a log message to built-in log console.
            * Note: n order to use this method, you must set the enableLogs option to true.
            * @param {string} msg Log message.
            * @param {string} className
            * Optional. CSS class name that will be applied to the destination message.
            * Few predefined classes are available:
            *	"error", "warning", "information", "status"
            */
            function (msg, className) {
            };
            wijevcal.prototype._log = function (msg, className) {
                var dt;
                if(this.logPanel) {
                    dt = new Date();
                    this.logPanel.prepend($('<span class="' + (className ? className : "wijmo-wijev-information") + '">' + '[' + dt.getHours() + ':' + dt.getMinutes() + ':' + dt.getSeconds() + '] ' + msg + '</span><br/>'));
                }
            };
            wijevcal.prototype._createLogPanel = function () {
                if(!this.logPanel) {
                    this.logDialog = $('<div title="Log">' + '<div class="wijmo-wijev-log"></div></div>');
                    this.logDialog.appendTo(this.element);
                    var btnsHash = {
                    };
                    btnsHash[this.localizeString("buttonClearAll", "Clear All")] = function () {
                        $(this).find(".wijmo-wijev-log").html("");
                    };
                    btnsHash[this.localizeString("buttonClose", "Close")] = function () {
                        $(this).wijdialog("close");
                    };
                    this.logPanel = this.logDialog.wijdialog({
                        captionButtons: {
                        },
                        buttons: /*pin: { visible: false },
                        refresh: { visible: false },
                        toggle: { visible: false },
                        minimize: { visible: false }*/
                        btnsHash,
                        width: 600,
                        height: 420,
                        position: [
                            "right", 
                            "top"
                        ]
                    }).find(".wijmo-wijev-log");
                }
                this.logDialog.wijdialog("open");
            };
            wijevcal.prototype.status = /**
            * Changes status label text.
            * @param {string} txt The new status text.
            */
            function (txt, className) {
                this.element.find(".wijmo-wijev-statusbar").html("<span class='" + (className ? className : "wijmo-wijev-status") + "'>" + txt + "</span>");
                this.log(txt, className ? className : "wijmo-wijev-status");
                if(!this.statusbarEventsAdded) {
                    this.statusbarEventsAdded = true;
                    this._initStatusbar();
                }
            };
            wijevcal.prototype._invalidateView = //<--
            /* common view code */
            function () {
                var rightPane = this.element.find(".wijmo-wijev-rightpane"), leftPane = this.element.find(".wijmo-wijev-leftpane"), header = this.element.find(".wijmo-wijev-headerbar"), navigationbar = this.element.find(".wijmo-wijev-navigationbar"), footer = this.element.find(".wijmo-wijev-statusbar"), viewContainer = this.element.find(".wijmo-wijev-view-container"), view = this.element.find(".wijmo-wijev-view"), elemInnerW, elemInnerH, headerH, navigationbarH, footerH, viewHeight, viewWidth, leftPaneW, rightPaneW, i;
                elemInnerW = this.element.innerWidth() - (viewContainer.outerWidth(true) - viewContainer.innerWidth());
                elemInnerH = this.element.innerHeight() - (viewContainer.outerHeight(true) - viewContainer.innerHeight());
                headerH = header.is(":visible") ? header.outerHeight(true) : 0;
                navigationbarH = navigationbar.is(":visible") ? navigationbar.outerHeight(true) : 0;
                footerH = footer.is(":visible") ? footer.outerHeight(true) : 0;
                viewContainer.outerWidth(elemInnerW);
                viewContainer.outerHeight(elemInnerH - headerH - navigationbarH - footerH);
                leftPaneW = 0;
                for(i = 0; i < leftPane.length; i += 1) {
                    if($(leftPane[i]).is(":visible")) {
                        leftPaneW += $(leftPane[i]).outerWidth();
                    }
                }
                rightPaneW = rightPane.is(":visible") ? rightPane.outerWidth() : 0;
                viewHeight = elemInnerH - headerH - navigationbarH - footerH;
                // -1 is fix for [29300] [JPN issue]
                //	[Sample][EventCalendar]List view of EventCalendar gets control desorted
                viewWidth = elemInnerW - rightPaneW - leftPaneW - 1;
                //alert("leftPaneW=" + leftPaneW + ",viewWidth=" + viewWidth);
                view.outerHeight(viewHeight);
                view.outerWidth(viewWidth);
                header.outerWidth(viewWidth + leftPaneW);
                navigationbar.outerWidth(this.element.innerWidth());
                footer.outerWidth(viewWidth + leftPaneW + rightPaneW);
                leftPane.outerHeight(elemInnerH - headerH - navigationbarH - footerH);
                /*
                //agendaContainer invalidated later(fix for 21282) when date label text is changed.
                agendaContainer.outerHeight(leftPane.innerHeight() -
                agendaContainer[0].offsetTop);
                */
                rightPane.outerHeight(elemInnerH + 100);
                this.element.find(".wijmo-wijev-datepager").wijdatepager("refresh");
            };
            wijevcal.prototype._daysInMonth = //<-
            // util methods:
            // note, month is zero-based(0-11)
            function (month, year) {
                var dd = new Date(year, month + 1, 0);
                return dd.getDate();
            };
            wijevcal.prototype._addMinutes = function (dt, num) {
                return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate(), dt.getHours(), dt.getMinutes() + num);
            };
            wijevcal.prototype._addDays = function (dt, num) {
                return new Date(dt.getFullYear(), dt.getMonth(), dt.getDate() + num, dt.getHours(), dt.getMinutes(), dt.getSeconds(), dt.getMilliseconds());
            };
            wijevcal.prototype._setTime = function (dt, timePart, daysTestPart) {
                var daysDuration;
                dt = new Date(dt);
                dt.setHours(timePart.getHours());
                dt.setMinutes(timePart.getMinutes());
                dt.setSeconds(timePart.getSeconds());
                dt.setMilliseconds(timePart.getMilliseconds());
                if(daysTestPart) {
                    daysDuration = Math.floor((timePart.getTime() - daysTestPart.getTime()) / (1000 * 60 * 60 * 24));
                    if(daysDuration > 0) {
                        dt = this._addDays(dt, daysDuration);
                    }
                }
                return dt;
            };
            wijevcal.prototype._addMonths = function (dt, num) {
                return new Date(dt.getFullYear(), dt.getMonth() + num, dt.getDate());
            };
            wijevcal.prototype._compareDayDates = function (dt1, dt2) {
                dt1 = new Date(dt1.getFullYear(), dt1.getMonth(), dt1.getDate());
                dt2 = new Date(dt2.getFullYear(), dt2.getMonth(), dt2.getDate());
                if(dt1 < dt2) {
                    return -1;
                } else if(dt1 > dt2) {
                    return 1;
                }
                return 0;
            };
            wijevcal.prototype._dayDateToCssClass = function (dt) {
                return "wijmo-wijev-date_" + dt.getFullYear() + "_" + dt.getMonth() + "_" + dt.getDate();
            };
            wijevcal.prototype._parseDateFromClass = function (dateClass, minuteClass, defaultVal) {
                var dt, min, datearr, minregexp = new RegExp("wijmo-wijev-minute-(\\d+)\\s"), dateregexp = new RegExp("wijmo-wijev-date_(\\d+_\\d+_\\d+)\\s");
                if(dateClass) {
                    datearr = dateregexp.exec(dateClass + " ")[1].split("_");
                    dt = new Date(parseInt(datearr[0], 10), parseInt(datearr[1], 10), parseInt(datearr[2], 10));
                    if(minuteClass) {
                        min = minregexp.exec(minuteClass + " ");
                        if(min) {
                            min = parseInt(min[1], 10);
                            dt.setMinutes(min);
                        }
                    }
                    return dt;
                } else {
                    return defaultVal || null;
                }
            };
            wijevcal.prototype._eventIdToCssClass = function (id) {
                return "apptid_" + id;
            };
            wijevcal.prototype._parseEventIdFromClass = function (cssClass) {
                var id = "", regexp, match;
                regexp = new RegExp("apptid_(\\S+)");
                match = regexp.exec(cssClass);
                if(match && match.length > 1) {
                    id = match[1];
                }
                return id;
            };
            wijevcal.prototype._isContainsDayDate = function (arr, dt) {
                var i;
                if(arr) {
                    for(i = 0; i < arr.length; i += 1) {
                        if(this._compareDayDates(arr[i], dt) === 0) {
                            return true;
                        }
                    }
                } else {
                    return false;
                }
            };
            wijevcal.prototype._formatString = //format:
            function (fmt, arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
                var r, args = arguments, i, funcArgs, self = this;
                if(args.length <= 1) {
                    return Globalize.format(args);
                }
                if(typeof fmt === "string") {
                    if(fmt === "_formatWeekTitle") {
                        fmt = this._formatWeekTitle;
                    } else if(fmt === "_formatMonthTitle") {
                        fmt = this._formatMonthTitle;
                    } else if(typeof window[fmt] === "function") {
                        fmt = window[fmt];
                    }
                }
                if(typeof fmt === "function") {
                    funcArgs = [];
                    for(i = 1; i < args.length; i += 1) {
                        funcArgs[i - 1] = args[i];
                    }
                    return fmt.apply(this, funcArgs);
                }
                r = new RegExp("\\{(\\d+)(?:,([-+]?\\d+))?(?:\\:" + "([^(^}]+)(?:\\(((?:\\\\\\)|[^)])+)\\)){0,1}){0,1}\\}", "g");
                return fmt.replace(r, function (m, num, len, f, params) {
                    m = args[Number(num) + 1];
                    if(f) {
                        return Globalize.format(m, f, self._getCulture());
                    } else {
                        return m;
                    }
                });
            };
            wijevcal.prototype._formatMonthTitle = function (dt) {
                return this._formatString(this.localizeString("monthViewHeaderFormat", "{0:MMMM yyyy}"), dt);
            };
            wijevcal.prototype._formatWeekTitle = function (start, end) {
                if(start.getMonth() !== end.getMonth()) {
                    return this._formatString(this.localizeString("weekViewHeaderFormat2Months", "{0:MMMM} - {1:MMMM yyyy}"), start, end);
                } else {
                    return this._formatString(this.localizeString("weekViewHeaderFormat", "{0:MMMM yyyy}"), start);
                }
            };
            wijevcal.prototype._formatDayHeaderDate = // format date/time:
            function (dt) {
                var o = this.options, viewType = o.viewType.toLowerCase(), dayViewHeaderFormat = this.options.dayViewHeaderFormat;
                if(dayViewHeaderFormat[viewType]) {
                    dayViewHeaderFormat = dayViewHeaderFormat[viewType];
                } else if(!dayViewHeaderFormat[viewType]) {
                    return "";
                }
                //return Globalize.format(date, format, this._getCulture());
                return this._formatString(dayViewHeaderFormat, dt);
            };
            wijevcal.prototype._getCulture = // culture:
            function (name) {
                return Globalize.findClosestCulture(name || this.options.culture);
            };
            wijevcal.prototype._isRTL = function () {
                return !!this._getCulture().isRTL;
            };
            wijevcal.prototype._onAjaxError = //<--
            function (event, jqXHR, ajaxSettings, thrownError) {
                if(jqXHR) {
                    this.status("Ajax error " + jqXHR.status + " (" + jqXHR.statusText + ")", "error");
                    this.log("Error, requested url: " + ajaxSettings.url, "error");
                    if(jqXHR.responseText) {
                        this.log("Error, response text: " + jqXHR.responseText, "error");
                    }
                } else {
                    this.status("Ajax error detected.", "error");
                    this.log("Error, requested url: " + ajaxSettings.url, "error");
                }
            };
            wijevcal.prototype._onWindowResize = function () {
                this.invalidate();
            };
            return wijevcal;
        })(wijmo.wijmoWidget);
        evcal.wijevcal = wijevcal;        
        var wijevcal_options = (function () {
            function wijevcal_options() {
                /** wijMobileCSS
                * @ignore
                */
                this.wijMobileCSS = {
                    header: "ui-header ui-bar-a",
                    content: "ui-body ui-body-c",
                    stateDefault: "ui-btn-up-c"
                };
                /** Selector option for auto self initialization.
                *	This option is internal.
                * @ignore
                */
                this.initSelector = ":jqmData(role='wijevcal')";
                /**	Determines the culture to be used, for example, "de-DE" is German.
                *	Date and time formatting depends on the culture option.
                */
                this.culture = "";
                /**	Use the localization option in order to localize
                *	text which not depends on culture option.
                * @default {
                *	messageEndOccursBeforeStart: "The end date you entered occurs before the start date.",
                *   activityLoading: "Loading...",
                *	activityDeletingCalendar: "Deleting calendar...",
                *   activityCreatingCalendar: "Creating calendar...",
                *	activityUpdatingCalendar: "Updating calendar...",
                *	activityCreatingEvent: "Creating event...",
                *	activityUpdatingEvent: "Updating event...",
                *	activityDeletingEvent: "Deleting event...",
                *	activityUpdating: "Updating...",
                *	agendaLoadingMoreEvents: "Loading more events...",
                *	agendaMoreEventsFormat: "More events ({0})...", // (0) - Number, invisible events count
                *	agendaTimeFormat: "{0:hh:mm tt} to {1:hh:mm tt}", // {0} Date, event start time, {1} - Date, event end time
                *	buttonToday: "today",
                *	buttonDayView: "Day",
                *	buttonWeekView: "Week",
                *	buttonMonthView: "Month",
                *	buttonListView: "List",
                *	buttonDelete: "Delete",
                *	buttonOK: "OK",
                *	buttonCancel: "Cancel",
                *	calendarNextTooltip: "Next",
                *	calendarPrevTooltip: "Previous",
                *	navigatorBarNextTooltip: "right",
                *	navigatorBarPrevTooltip: "left",
                *	labelAllDay: "all-day",
                *	labelToday: "Today",
                *	labelName: "name",
                *	labelStarts: "starts",
                *	labelEnds: "ends",
                *	labelLocation: "location",
                *	labelRepeat: "repeat",
                *	labelCalendar: "calendar",
                *	labelDescription: "description",
                *	monthCellMoreEventsFormat: "{0}  more...", // (0) - Number, invisible events count
                *	promptOpenOccurrenceFormat: "{2}  is recurring event. Do you want to open only this occurrence?", // {0} = Start, {1} = End, {2} = Subject, {3} = Location
                *	textNewEvent: "New event",
                *	repeatNone: "None",
                *	repeatDaily: "Every Day",
                *	repeatWorkDays: "Work days",
                *	repeatWeekly: "Every Week",
                *	repeatMonthly: "Every Month",
                *	repeatYearly: "Every Year",
                *   labelCalendarName: "Calendar name",
                *   labelColor: "Color",
                *   buttonSave: "Save",
                *   titleEditCalendar: "Edit calendar",
                *	calendarToolTipFormat: "dddd, MMMM dd, yyyy",
                *   calendarTitleFormat: "MMMM yyyy",
                *	dayDetailsLabelFulldateFormat: "{0:dddd, MMMM d}",
                *	dayDetailsLabelYearFormat: "{0:yyyy}"
                *	weekViewHeaderFormat2Months: "{0:MMMM} - {1:MMMM yyyy}",
                *	weekViewHeaderFormat: "{0:MMMM yyyy}",
                *	monthViewHeaderFormat: "{0:MMMM yyyy}",
                *	agendaHeaderFullDateFormat": "{0:MMMM d, yyyy}",
                *	logCouldntOpenLocalStorage: "Couldn't open built-in local data storage. Please, add amplify.store references."
                *	buttonClearAll: "Clear All",
                *	buttonClose: "Close"
                * }
                * @type {object}
                * @example $("#eventscalendar").wijevcal(
                *					{
                *						localization: {
                *							buttonToday: "Go today",
                *							buttonListView: "Agenda"
                *						}
                *					});
                */
                this.localization = null;
                /**	Use the datePagerLocalization option in order to localize
                *	bottom date pager.
                * @ignore
                */
                this.datePagerLocalization = null;
                /** Set this option to true if you want to prevent users to edit events data.
                * @example
                * $("#report").wijevcal({
                *		readOnly: true
                *	});
                */
                this.readOnly = false;
                /** Determines the URL of the web service which will be used to store information about events.
                * @example
                * $("#report").wijevcal({
                *		webServiceUrl: "http://mysite/c1evcalservice.ashx"
                *	});
                */
                this.webServiceUrl = "";
                //c1evcalservice.ashx
                /** The colors option specifies the name of the colors that will be shown in the color name drop-down list.
                *					"blue", "cornflowerblue", "yellow", "bronze"]
                * @type {Array}
                * @example $("#eventscalendar").wijevcal(
                *						{ colors: ["cornflowerblue", "yellow"]);
                */
                this.colors = null;
                /** Data storage methods. Use this option in order to implement custom
                * data storage layer.
                * @type {object}
                * @example $("#eventscalendar").wijevcal(
                *						{ dataStorage: {
                *		addEvent: function(obj, successCallback, errorCallback) {
                *		},
                *		updateEvent: function(obj, successCallback, errorCallback) {
                *		},
                *		deleteEvent: function(obj, successCallback, errorCallback) {
                *		},
                *		loadEvents: function(visibleCalendars,
                *								successCallback, errorCallback) {
                *		},
                *		addCalendar: function(obj, successCallback, errorCallback) {
                *		},
                *		updateCalendar: function(obj, successCallback, errorCallback) {
                *		},
                *		deleteCalendar: function(obj, successCallback, errorCallback) {
                *		},
                *		loadCalendars: function(successCallback, errorCallback) {
                *		}
                *	});
                */
                this.dataStorage = {
                    addEvent: null,
                    updateEvent: null,
                    deleteEvent: null,
                    loadEvents: null,
                    addCalendar: null,
                    updateCalendar: null,
                    deleteCalendar: null,
                    loadCalendars: null
                };
                /** A dataview object to bind to events data
                * @type {object}
                * @example
                * var dv = $.wijmo.wijdataview({....});
                * $("#eventscalendar").wijevcal({
                *   dataSource: dv
                * })
                */
                this.dataSource = null;
                /** The event objects array.
                * @example $("#eventscalendar").wijevcal(
                *						{ eventsData: [{id: "appt1",
                *							start: new Date(2011, 4, 6, 17, 30),
                *							end: new Date(2011, 4, 6, 17, 35) }] });
                */
                this.eventsData = [];
                /** The event objects array. This option is read-only.
                * This option is deprecated:
                *	please, use eventsData option, instead.
                * @example $("#eventscalendar").wijevcal(
                *						{ eventsData: [{id: "appt1",
                *							start: new Date(2011, 4, 6, 17, 30),
                *							end: new Date(2011, 4, 6, 17, 35) }] });
                */
                this.appointments = [];
                /** Available calendar objects array.
                *	This option is read-only.
                *	Use addCalendar/updateCalendar/deleteCalendar methods in order
                *	to add/edit or delete a calendar.
                * @example
                *		var calendars = $("#eventscalendar")
                *						.wijevcal("option", "calendars");
                */
                this.calendars = [];
                /** Specifies whether the events calendar is disabled.
                * @example $("#eventscalendar").wijevcal("option",
                *													"disabled", true);
                */
                this.disabled = false;
                /** The calendar dialog box template.
                * @example $("#eventscalendar").wijevcal(
                *						{ editCalendarTemplate: "html content");
                */
                this.editCalendarTemplate = "";
                /** Enables a built-in log console.
                * @example
                *	$("#eventscalendar").wijevcal({ enableLogs: true });
                */
                this.enableLogs = false;
                /** Format of the title text for the event.
                * Format arguments:
                * {0} = Start, {1} = End, {2} = Subject, {3} = Location, {4} = Icons,
                * {5} = Description.
                * @example
                *	$("#eventscalendar").wijevcal({
                *			eventTitleFormat: "{0:h:mmtt}-{1:h:mmtt} {4} {2}" });
                */
                this.eventTitleFormat = "{2}";
                /** The title text format that will be shown under the header bar.
                * {0} = start date. {1} = end date.
                * @type {object}
                * @example
                * Specify common title format:
                *	$("#eventscalendar").wijevcal(
                *		{
                *			titleFormat: "First date: {0:d} Last date: {1:d}"
                *		}
                *	);
                * Specify separate format for the each view:
                *	$("#eventscalendar").wijevcal(
                *		{
                *			titleFormat:  {
                *	 function customFormatFunc will be called
                *			//in order to format string:
                *				day: customFormatFunc,
                *				week: "Week {0:d} : {1:d}",
                *				month: "{0:yyyy, MMMM}",
                *				list: "Events until {1:d}"
                *			}
                *		}
                *);
                */
                this.titleFormat = {
                    day: false,
                    week: "_formatWeekTitle",
                    month: "_formatMonthTitle",
                    list: false
                };
                /** The first day of the week (from 0 to 6).
                * Sunday is 0, Monday is 1, and so on.
                * @example $("#eventscalendar").wijevcal(
                *	{ firstDayOfWeek: 1 });
                */
                this.firstDayOfWeek = 0;
                /** Indicates whether the header bar will be visible.
                * @example
                *	$("#element").wijevcal({ headerBarVisible: false });
                */
                this.headerBarVisible = true;
                /** Indicates whether the bottom navigation bar will be visible.
                * @example $("#element").wijevcal({ navigationBarVisible: false });
                */
                this.navigationBarVisible = true;
                /** Indicates whether the right pane will be visible.
                *	By default the right pane are empty.
                *	You can use this pane in order to provide additional custom UI.
                * @example
                *	$("#element").wijevcal({ rightPaneVisible: false });
                */
                this.rightPaneVisible = false;
                /** The selected date.
                * @type {Date}
                * @example $("#eventscalendar").wijevcal(
                *		{ selectedDate: new Date(2015, 11, 21) });
                */
                this.selectedDate = null;
                /** The selected dates.
                * @type {Date}
                * @example $("#eventscalendar").wijevcal(
                *	{ selectedDates: [new Date(2012, 11, 21), new Date(2015, 11, 21)] });
                */
                this.selectedDates = null;
                /** Indicates whether the status bar will be visible.
                * @example $("#element").c1reportviewer({ statusBarVisible: false });
                */
                this.statusBarVisible = false;
                /** The time interval in minutes for the Day view.
                * @example $("#eventscalendar").wijevcal(
                *		{ timeInterval: 10 });
                */
                this.timeInterval = 30;
                /** The Day view time interval row height in pixels.
                * @example $("#eventscalendar").wijevcal(
                *		{ timeIntervalHeight: 30 });
                */
                this.timeIntervalHeight = 15;
                /** Time ruler interval for the Day view (in minutes).
                * @example $("#eventscalendar").wijevcal(
                *		{ timeRulerInterval: 60 });
                */
                this.timeRulerInterval = 60;
                /** Time ruler format for the Day view.
                * @remarks
                * Format argument:
                *  {0} = Current ruler time.
                * @example $("#eventscalendar").wijevcal(
                *										{ timeRulerFormat: "{0:t}" });
                */
                this.timeRulerFormat = "{0:h tt}";
                /** Format of the text for the day cell header(month view).
                * Format argument:
                *  {0} = Day date.
                * @example
                *	$("#eventscalendar").wijevcal(
                *			{ dayHeaderFormat: "{0}" });
                */
                this.dayHeaderFormat = "{0:d }";
                /** Format of the text for the first cell header in the first row of the month view.
                * Format argument:
                *  {0} = Day date.
                * @example
                *	$("#eventscalendar").wijevcal(
                *		{ firstRowDayHeaderFormat: "{0}" });
                */
                this.firstRowDayHeaderFormat = "{0:ddd d}";
                /** Format of the text for the day header in the day view. Format argument: {0} = Day date.
                * @remarks
                * Format argument:
                *  {0} = Day date.
                *		day: "all-day events",
                *		week: "{0:d dddd}",
                *		list: "{0:d dddd}"
                * }
                * @example
                *	$("#eventscalendar").wijevcal(
                *			{ dayViewHeaderFormat: "{0: d}" });
                */
                this.dayViewHeaderFormat = {
                    day: "all-day events",
                    week: "{0:d dddd}",
                    list: "{0:d dddd}"
                };
                /** The active view type. Possible values are: day, week, month, list.
                * @example $("#eventscalendar").wijevcal(
                *			{ viewType: "month" });
                */
                this.viewType = "day";
                /** Array of the calendar names which need to be shown.
                * @type {Array}
                * @example
                *		$("#eventscalendar").wijevcal("option",
                *		"visibleCalendars", ["My Calendar"]);
                */
                this.visibleCalendars = new Array("Default");
                /** Occurs when calendars option has been changed.
                * @event
                * @dataKey {object} calendars the new calendars option value.
                */
                this.calendarsChanged = null;
                /** Occurs when events calendar is constructed and events
                * data is loaded from an external or local data source.
                * @event
                
                */
                this.initialized = null;
                /** Occurs when selectedDates option has been changed.
                * Event type: wijevcalselecteddateschanged
                * @event
                * @dataKey {object} selectedDates the new selectedDates value.
                
                */
                this.selectedDatesChanged = null;
                /** Occurs when viewType option has been changed.
                * @event
                * @param {string} viewType The new viewType value.
                */
                this.viewTypeChanged = null;
                /** Occurs before the built-in event dialog is shown.
                * Return false or call event.preventDefault() in order to cancel event and
                *	prevent the built-in dialog to be shown.
                * @event
                * @dataKey {object} data This is the event data.
                * @dataKey {DOMElement} targetCell This is target offset DOM element which can be used for popup callout.
                */
                this.beforeEditEventDialogShow = null;
                /** Occurs before the add event action.
                * Return false or call event.preventDefault() in order to cancel event and
                *	prevent the add action.
                * @event
                * @dataKey {object} data This is the new event data that should be added to a data source.
                
                */
                this.beforeAddEvent = null;
                /** Occurs before the update event action.
                * Return false or call event.preventDefault() in order to cancel event and
                *	prevent the update action.
                * @event
                * @dataKey {object} data This is the new event data that should be added to a data source.
                * @dataKey {object} prevData This is previous event data.
                
                */
                this.beforeUpdateEvent = null;
                /** Occurs before the delete action.
                * Return false or call event.preventDefault() in order to cancel event and
                *	prevent the delete action.
                * @event
                * @dataKey {object} data This is the event object that should be deleted.
                
                */
                this.beforeDeleteEvent = null;
                /** Occurs before the add calendar action.
                * Return false or call event.preventDefault() in order to cancel event and
                * prevent the add action.
                * @event
                * @dataKey {object} data This is  the new calendar data that should be added to a data source.
                
                */
                this.beforeAddCalendar = null;
                /** Occurs before the update calendar action.
                * Return false or call event.preventDefault() in order to cancel event and
                * prevent the update action.
                * @event
                * @dataKey {object} data This is the new event data that should be added to a data source.
                * @dataKey {object} prevData This is previous event data.
                */
                this.beforeUpdateCalendar = null;
                /** Occurs before the delete calendar action.
                * Return false or call event.preventDefault() in order to cancel event and
                *	prevent the delete action.
                * @event
                * @dataKey {object} data This is the calendar data that should be deleted from a data source.
                
                */
                this.beforeDeleteCalendar = null;
                /** Occurs when the eventsData option is changed.
                * @event
                * @dataKey {object} eventsData This is array of the event objects.
                
                */
                this.eventsDataChanged = null;
            }
            return wijevcal_options;
        })();        
        wijevcal.prototype.options = $.extend(true, {
        }, wijmo.wijmoWidget.prototype.options, new wijevcal_options());
        $.wijmo.registerWidget(widgetName, wijevcal.prototype);
    })(wijmo.evcal || (wijmo.evcal = {}));
    var evcal = wijmo.evcal;
})(wijmo || (wijmo = {}));
