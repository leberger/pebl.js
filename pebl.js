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

if ('undefined' === typeof ISDEV)
  var ISDEV = false;

/**
 * 
 * @param jQueryElement tplElement
 * @param string url == dataProvider
 * @param function events to bind. When replacing the content,
 *   events are not bound anymore. We need to rebind them man
 * @returns Pebl object
 */
function Pebl(tplElement, url, events) {
  ISDEV && !tplElement && console.log('no tplElement given to instantiate Pebl. Is it right ?');
  ISDEV && !url && console.log('no url given to instantiate Pebl. Is it right ?');
  ISDEV && !events && console.log('no events given to instantiate Pebl. Is it right ?');

  var dataProvider = url;
  var dataElement = [];
  var tplElement = tplElement;
  var events = events;
  var tplOriginalHtml = tplElement.html();
  if ('undefined' === typeof tplOriginalHtml)
    throw 'Make sure that the tplElement exists and is not empty';

  /**
   * @returns Pebl object
   */
  this.replace = function() {
    var oneDataPiece = this.shiftData();
    var html = tplOriginalHtml;
    html = replaceRecurisive(html, oneDataPiece);
    tplElement.html(html);
    bindEvents();
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
      ISDEV && console.warn('no html template element was found for "' + key + '"');
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
        ISDEV && console.warn('Man, why, why so many zombies disguised in Santa Claus?');
      }
    }
    return html || '';
  }

  /**
   * @returns Pebl object
   */
  var bindEvents = function() {
    //@todo : only apply that to the element replaced,
    // so that it is localised
    if ('function' === typeof events) {
      events();
    }
    else {
      ISDEV && console.log('events are not a function.\n\
Please make sure that you initialise Pebl correctly with a function');
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
      url: dataProvider,
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
          console.warn(e.message + '...', 'is data returned in JSON format ?? :\n' + data);
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
   * @param boolean toTop empty of false if element to be added at the end of stack
   * @returns Pebl this
   */
  this.addData = function(data, toTop) {
    if (toTop) {
      dataElement.unshift(data);
    } else {
      dataElement.push(data);
    }
    return this;
  }

  /**
   * add data to the data stack
   * @param json object, data
   * @param boolean toTop empty of false if element to be added at the end of stack
   * @returns Pebl this
   */
  this.addDataInBulk = function(data, toTop) {
    var that = this;
    $(data).each(function() {
      that.addData(this, toTop);
    });
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
   * get the element number i from the data stack, and let it there
   * @param int i
   * @returns json object data
   */
  this.getSpecificData = function(i) {
    if ('undefined' === typeof i) {
      i = 0;
    }
    return jQuery.extend(true, {}, dataElement)[i];
    //    return dataElement.slice();
  }

  /**
   * get the element number i from the data stack
   * @param int i
   * @returns json object data
   */
  this.getCurrent = function(i) {
    return dataElement.slice(0, 1);
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