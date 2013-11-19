  // Dan Sevush Nov 6, 2013
  // "homework" assignment from Nanigans.

  // Normally, I would drop the code below in ds.main() inline in the ready handler,
  // but I want to follow all the instructions to the letter.

  // I have used bootstrap for the CSS, I don't consider it a JS library.

  // There are four buttons, one for viewing the original instructions (10MB PNG, sorry)
  // Another button fetches the data and displays it on the left
  // The last two buttons peform the requested tasks.

  // At the highest level, I have implemented two versions of the task logic,
  // one using  jQuery's Deferred (Promise)  and the other using a more traditional
  // (and annoying) static counter with asynch functions.
  // I assume that "parallel" means the file requests follow each other immediately
  // otherwise, we'll have to wait for ECMA7 or 8 maybe?

$(document).ready(function() { // all code can live here for this example
  ds.main();
});

window.ds = window.ds || {};

window.ds.main = function() {
  var url1 = "file1.text",
      url2 = "file2.text",
      menuDiv = 'menu',
      mainDiv = 'main';

  $.ajaxSetup({ cache: false });  // easier to test click debouncing if files load slower
  
  // support functions first
  function enter(there, event) {   // prevent double/triple clicks from refiring
    event.preventDefault();           // prevent cascading click events
    $(there).off(event).fadeTo(1, 0.4); // disable events and fade button
  }
  
  function leave(there, handler) {  // restore event handler and restore faded button
    $(there).on('click', handler).fadeTo(1, 1.0);
  }
  
  function which(id) {  // we 'default' to the main content div
    return (typeof id === 'undefined') ? mainDiv : id;
  }


  function puts(text, block) {  // output a block of data
    block = which(block);
    $('#' + block).append('<pre>' + text + '\n</pre>');
  }

  function clear(block) { // clear the main (default) or menu div
    block = which(block);
    $('#' + block).html('');
  }

  function log(text) {  // if we have a console.log, use it
    if(window.console && console.log) {
      console.log(text);
    }
  }

  function getFileData(url, callback) { // thin sanity check on jQuery's ajax call and simple error message displaying URL
    if(typeof callback === 'function') {
      return $.get(url, callback).fail(function() {
        alert('oops! error getting ' + url);
      });
    }
  }

  function processData(data) {  // process a text file, return an object with a sum for each key found in the file
    if(data) { // we are expecting a text file, delimited by LF (unix style) with key=value pairs
      var splitLine, key, value, countObj = {}, // used later
          lines = data.split('\n');  

      if(lines && lines.length) {
        lines.forEach(function(line) { // we're ignoring IE8 here - could do for(var i=lines.length, i >=0; i--) instead
          splitLine = line.split('=');
          if(splitLine && splitLine.length && splitLine.length === 2) {
            key = splitLine[0];
            value = splitLine[1] -0;  // many ways to insure numeric, I prefer this
            if(key && (value || value === 0)) { //  a 'falsey' zero for value is legit
              countObj[key] = countObj[key] ? countObj[key] + value : value;
            }
          }
        });
      }
      return countObj;
    }
  }

  function mergeObjects(oldObj, newObj) { // using the newObj data, sum or insert key/value pairs in oldObj
    for(var key in newObj) {
      if(newObj.hasOwnProperty(key)) { // should always be true, but just in case...
        value = newObj[key];
        oldObj[key] = oldObj[key] ? oldObj[key] + value : value;
      }
    }
  }

  function displaySorted(obj) {  // build a temp array for sorting the keys then display them in the main div
    var temp = [], textOut = '<strong>Merged data (sorted by keys):</strong>\n';

    for(var key in obj) { // build an array of key values
      if(obj.hasOwnProperty(key)) { // should always be true, but just in case...
        temp.push(key);
      }
    }

    temp.sort();  // sort the array of key values and... 
    temp.forEach(function(key) { // walk 'em
      textOut += '\n' + key + '=' + obj[key];
    });

    puts(textOut);  // display the string
  }

  // bind handlers to the four buttons
  $('#viewInstructions').unbind().click(function here(e) { // display the original instructions, a honkin' 10MB file
    enter(this, e);

    var win = window.open('Nanigans-homework.png', '_blank');
    if(win) {
      win.focus();
    }

    leave(this, here);
  });


  $('#viewFiles').unbind().click(function here(e) { // display the data in the two files
    enter(this, e);  // housekeeping, disable this handler until we reinstate
    clear(menuDiv);     // clear the menu block
    var that = this, defer1, defer2;

    defer1 = $.get(url1); // we're calling jQuery's get function directly
    defer2 = $.get(url2); // and handling errors below. 

    $.when(defer1, defer2)  // both must be completed before this fires
      .done(function(resp1, resp2) {
          puts('<strong>File1</strong>\n' + resp1[0], menuDiv);        
          puts('<strong>File2</strong>\n' + resp2[0], menuDiv);          
          leave(that, here);
      })
      .fail(function(response) {
        alert('oops! \n' + response.responseText);
        leave(that, here);
      });
   });


  // this is where all the "heavy lifting" occurs. I've provided two implementations,
  // but I prefer to use Promise (jQuery also calls it Deferred) to manage asynch events

  // this version uses jQuery's implementation of a Deferred (Promise) object.
  $('#mergeFiles2').unbind().click(function here(e) {
    enter(this, e);  // housekeeping, disable this handler until we reinstate  
    clear();            // clear "screen"

    var mergedObj = {}, defer1, defer2, that = this;

    defer1 = $.get(url1); // we're calling jQuery's get function directly
    defer2 = $.get(url2); // and handling errors below. 

    $.when(defer1, defer2)  // both must be completed before this fires
      .done(function(resp1, resp2) {
          mergeObjects(mergedObj, processData(resp1[0])); // we'll reuse the same primitives
          mergeObjects(mergedObj, processData(resp2[0])); // but we could "mix" it all in at once instead.
          displaySorted(mergedObj);                       // reuse code to display sorted merged data
          leave(that, here);
      })
      .fail(function(response) {
        alert('oops! \n' + response.responseText);
        leave(that, here);
      });
   });

  // this version uses jQuery's ajax and uses a static counter to determine when the files are done
  $('#mergeFiles').unbind().click(function here(e) {
    enter(this, e);  // housekeeping, disable this handler until we reinstate  
    clear();            // clear "screen"

    var mergedObj = {}, mergedCount = 0, that = this; // save scope to restore later

    fetchData(url1);
    fetchData(url2);

    function fetchData(url) {
      return getFileData(url, function(data) {
        mergeObjects(mergedObj, processData(data)); // objects are passed by reference so we're good here
        log(url + ': ' + mergedCount); // useful when debugging
        if(++mergedCount > 1) {   // if we've done this twice, time to show the results
          displaySorted(mergedObj);
          leave(that, here);
        }
      });
    }
   });
};



