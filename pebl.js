/***
 * 
 * * pebl.js
 * 
 * 
 * simple js templating
 * 
 * @author Cedric, hello@linux-commands-examples.com
 * @date 24 Jan 2013, modified 29 Sept 2014
 * 
 * @requires jQuery
 * 
 * 
 * https://github.com/leberger/pebl.js
 * 
 * Lisence :   GNU GENERAL PUBLIC LICENSE Version 3, 29 June 2007
 * 
 * 
 ***/

if ('undefined' === typeof IS_DEVELOPEMENT_MODE)
  var IS_DEVELOPEMENT_MODE = false;

/**
 * 
 * @param jQueryElement tplElement
 * @param string url == dataProvider
 * @param function events to bind. When replacing the content,
 *   events are not bound anymore. We need to rebind them man
 * @returns Pebl object
 */
function Pebl(tplElement, url, events) {
  this.dataProvider = url;
  var dataElement = [];
  this.tplElement = tplElement;
  this.events = events;
  this.tplOriginalHtml = tplElement.html();
  if ('undefined' === typeof this.tplOriginalHtml)
    throw 'Make sure that the tplElement exists and is not empty';

  /**
   * @returns Pebl object
   */
  this.replace = function() {
    var oneDataPiece = this.shiftData();
    var html = this.tplOriginalHtml;
    html = replaceRecurisive(html, oneDataPiece);
    this.tplElement.html(html);
    this.bindEvents();
    return this;
  }

  var replaceArray = function(key, html, oneData) {
    var htmlResult = '';
    var htmlOfSubPart;
    var regx = new RegExp('{' + key + '/}' + '([\\s\\S]*)' + '{/' + key + '}', 'm');
    htmlOfSubPart = html.match(regx);
    if (htmlOfSubPart && null !== typeof htmlOfSubPart[1]) {
      htmlOfSubPart = htmlOfSubPart[1];
      for (var oneDataKey in oneData) {
        if (oneData.hasOwnProperty(oneDataKey)) {
          htmlResult += replaceRecurisive(htmlOfSubPart, oneData[oneDataKey]);
        }
        else {
          console.warn('hu ho ! This shoud not happen');
        }
      }
      var regx = new RegExp('{' + key + '/}' + '[\\s\\S]*' + '{/' + key + '}');
      html = html.replace(regx, htmlResult);
    }
    else {
      //we do not modify html
      IS_DEVELOPEMENT_MODE && console.warn('no html template element was found for"' + key + '"');
    }
    return html;
  }

  var replaceRecurisive = function(html, oneDataPiece) {
    for (var key in oneDataPiece) {
      if (oneDataPiece.hasOwnProperty(key)) {
        try {
          var oneData = oneDataPiece[key];

          if (oneData instanceof Array) {
            html = replaceArray(key, html, oneData)
          }
          else {
            var regx = new RegExp('{' + key + '}', 'g');
            html = html.replace(regx, (null !== oneData && false !== oneData) ? oneData : ' ');
          }
        } catch (e) {
          console.warn(e.message);
        }
      }
      else {
        IS_DEVELOPEMENT_MODE && console.warn('Man, why, why so many zombies disguised in Santa Claus?');
      }
    }
    return html || '';
  }

  /**
   * @returns Pebl object
   */
  this.bindEvents = function() {
    //@todo : only apply that to the element replaced,
    // so that it is localised
    if ('function' === typeof this.events) {
      this.events();
    }

    return this;
  }

  /**
   * ajax call - used to load new data,
   *  and to post something (see arg)
   * @param arg param for get call
   * @param callback function when successful
   * @returns Pebl object
   */
  this.loadData = function(arg, _callback) {
    var that = this;
    $.ajax({
      url: that.dataProvider,
      type: "GET",
      data: arg,
      success: function(data) {
        try {
          that.addData(JSON.parse(data));
          if (typeof _callback !== 'undefined' && typeof _callback !== 'function' && null !== _callback) {
            throw '_callback is not a function it is a `' + (typeof _callback) + '` !'
          }
          if (typeof _callback === 'function') {
            _callback();
          }
        }
        catch (e) {
          console.warn(e.message);
          console.warn('is data returned in JSON format ?? :\n' + data);
        }
      }
    }).fail(function() {
      console.warn('failed to download more data');
    });
    return this;
  }

  /**
   * add data to the data stack
   * @param json object, data
   * @returns this
   */
  this.addData = function(data) {
    dataElement.push(data);
    return this;
  }

  /**
   * 
   * @returns json {Pebl@pro;dataElement@call;shift}
   */
  this.shiftData = function() {
    return dataElement.shift();
  }

  /**
   * get the element number i from the data stack
   * @param int i
   * @returns json object data
   */
  this.getAllData = function(i) {
    return jQuery.extend(true, {}, dataElement)[0];
    //    return dataElement.slice();
  }

  /**
   * console.log data
   * @returns Pebl object
   */
  this.logData = function() {
    console.log(dataElement);
    return this;
  }
  return this;
}