"use strict";
/* global global: false */
/* global XMLHttpRequest: false */

var templateLoader = require('./template-loader.js');
var console = require("console");
var ko = require("knockout");
var $ = require("jquery");
require("./ko-bindings.js");
var performanceAwareCaller = require("./timed-call.js").timedCall;

var addUndoStackExtensionMaker = require("./undomanager/undomain.js");
var colorPlugin = require("./ext/color.js");
var inlinerPlugin = require("./ext/inliner.js");

var localStorageLoader = require("./ext/localstorage.js");

if (typeof ko == 'undefined') throw "Cannot find knockout.js library!";
if (typeof $ == 'undefined') throw "Cannot find jquery library!";

function _canonicalize(url) {
  var div = global.document.createElement('div');
  div.innerHTML = "<a></a>";
  div.firstChild.href = url; // Ensures that the href is properly escaped
  div.innerHTML = div.innerHTML; // Run the current innerHTML back through the parser
  return div.firstChild.href;
}

var applyBindingOptions = function(options, ko) {
  // push "convertedUrl" method to the wysiwygSrc binding
  ko.bindingHandlers.wysiwygSrc.convertedUrl = function(src, method, width, height) {
    var imgProcessorBackend = options.imgProcessorBackend ? options.imgProcessorBackend : './upload';
    var backEndMatch = imgProcessorBackend.match(/^(https?:\/\/[^\/]*\/).*$/);
    var srcMatch = src.match(/^(https?:\/\/[^\/]*\/).*$/);
    if (backEndMatch === null || (srcMatch !== null && backEndMatch[1] == srcMatch[1])) {
      return imgProcessorBackend + "?src=" + encodeURIComponent(src) + "&method=" + encodeURIComponent(method) + "&params=" + encodeURIComponent(width + "," + height);
    } else {
      console.log("Cannot apply backend image resizing to non-local resources ", src, method, width, height, backEndMatch, srcMatch);
      return src + "?method=" + method + "&width=" + width + (height !== null ? "&height=" + height : '');
    }
  };

  ko.bindingHandlers.wysiwygSrc.placeholderUrl = function(width, height, text) {
    return options.imgProcessorBackend + "?method=" + 'placeholder' + "&params=" + width + encodeURIComponent(",") + height;
  };

  // pushes custom tinymce configurations from options to the binding
  if (options && options.tinymceConfig)
    ko.bindingHandlers.wysiwyg.standardOptions = options.tinymceConfig;
  if (options && options.tinymceConfigFull)
    ko.bindingHandlers.wysiwyg.fullOptions = options.tinymceConfigFull;
};

var start = function(options, templateFile, templateMetadata, jsorjson, customExtensions) {

  templateLoader.fixPageEvents();

  var fileUploadMessagesExtension = function(vm) {
    var fileuploadConfig = {
      messages: {
        unknownError: vm.t('Unknown error'),
        uploadedBytes: vm.t('Uploaded bytes exceed file size'),
        maxNumberOfFiles: vm.t('Maximum number of files exceeded'),
        acceptFileTypes: vm.t('File type not allowed'),
        maxFileSize: vm.t('File is too large'),
        minFileSize: vm.t('File is too small'),
        post_max_size: vm.t('The uploaded file exceeds the post_max_size directive in php.ini'),
        max_file_size: vm.t('File is too big'),
        min_file_size: vm.t('File is too small'),
        accept_file_types: vm.t('Filetype not allowed'),
        max_number_of_files: vm.t('Maximum number of files exceeded'),
        max_width: vm.t('Image exceeds maximum width'),
        min_width: vm.t('Image requires a minimum width'),
        max_height: vm.t('Image exceeds maximum height'),
        min_height: vm.t('Image requires a minimum height'),
        abort: vm.t('File upload aborted'),
        image_resize: vm.t('Failed to resize image'),
        generic: vm.t('Unexpected upload error')
      }
    };
    // fileUpload options.
    if (options && options.fileuploadConfig)
      fileuploadConfig = $.extend(true, fileuploadConfig, options.fileuploadConfig);

    ko.bindingHandlers['fileupload'].extendOptions = fileuploadConfig;

  };

  var simpleTranslationPlugin = function(vm) {
    if (options && options.strings) {
      vm.t = function(key, objParam) {
        var res = options.strings[key];
        if (typeof res == 'undefined') {
          console.warn("Missing translation string for",key,": using default string");
          res = key;
        }
        return vm.tt(res, objParam);
      };
    }
  };

  // simpleTranslationPlugin must be before the undoStack to translate undo/redo labels
  var extensions = [simpleTranslationPlugin, addUndoStackExtensionMaker(performanceAwareCaller), colorPlugin, inlinerPlugin];
  if (typeof customExtensions !== 'undefined')
    for (var k = 0; k < customExtensions.length; k++) extensions.push(customExtensions[k]);
  extensions.push(fileUploadMessagesExtension);

  var galleryUrl = options.fileuploadConfig ? options.fileuploadConfig.url : '/upload/';
  applyBindingOptions(options, ko);

  // TODO what about appending to another element?
  $("<!-- ko template: 'main' --><!-- /ko -->").appendTo(global.document.body);

  // templateFile may override the template path in templateMetadata
  if (typeof templateFile == 'undefined')
  {
    if(typeof templateMetadata != 'undefined') {
      templateFile = JSON.parse(templateMetadata).template;
    }
  }
  else {
    templateFile = 'templates/' + templateFile + '/template-' + templateFile + '.html';
  }
  // TODO canonicalize templateFile to absolute or relative depending on "relativeUrlsException" plugin

  templateLoader.load(performanceAwareCaller, templateFile, templateMetadata, jsorjson, extensions, galleryUrl);

};

function getFileFromServer(url, doneCallback) {
    var xhr;

    xhr = new XMLHttpRequest();
    xhr.onreadystatechange = handleStateChange;
    xhr.open("GET", url, true);
    xhr.send();

    function handleStateChange() {
        if (xhr.readyState === 4) {
            doneCallback(xhr.status == 200 ? xhr.responseText : null);
        }
    }
}

var FireAllCyclinders = function(options, templateFile, templateMetadata, jsorjson, customExtensions, autosave)
{
  var hash = global.location.hash ? global.location.href.split("#")[1] : "deafult";
  var ext = ".content";
  if(autosave){
    ext = ".backup";
  }
  console.log("HASH: " + hash);
  getFileFromServer("../../backend-php/saved-templates/" + hash + ext, function(content) {
    if(content === null) console.log("No Content Found");
    else console.log("Content Loaded");
      getFileFromServer("../../backend-php/saved-templates/" + hash + ".meta", function(meta) {
          if(meta === null) console.log("No Metadata Found");
          else console.log("Meta Loaded");
          start(options, templateFile, meta, content, customExtensions);
          $("#editorMetaData").val(meta);
        });
    });
};

module.exports = {
  isCompatible: templateLoader.isCompatible,
  start: start,
  FireAllCyclinders: FireAllCyclinders,
};
