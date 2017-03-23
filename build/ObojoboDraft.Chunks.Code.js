/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "build/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(105);


/***/ },

/***/ 104:
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var Code, Common, OboComponent, TextChunk, TextGroupEl;

	__webpack_require__(200);

	Common = window.ObojoboDraft.Common;

	OboComponent = Common.components.OboComponent;

	TextGroupEl = Common.chunk.textChunk.TextGroupEl;

	TextChunk = Common.chunk.TextChunk;

	Code = React.createClass({
	  displayName: "Code",

	  render: function render() {
	    var texts;
	    texts = this.props.model.modelState.textGroup.items.map(function (textItem, index) {
	      return React.createElement(TextGroupEl, { text: textItem.text, groupIndex: index, indent: textItem.data.indent, key: index });
	    });
	    return React.createElement(
	      OboComponent,
	      { model: this.props.model, moduleData: this.props.moduleData },
	      React.createElement(
	        TextChunk,
	        { className: "obojobo-draft--chunks--single-text pad" },
	        React.createElement(
	          "pre",
	          null,
	          React.createElement(
	            "code",
	            null,
	            texts
	          )
	        )
	      )
	    );
	  }
	});

	module.exports = Code;

/***/ },

/***/ 105:
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var ObojoboDraft;

	ObojoboDraft = window.ObojoboDraft;

	OBO.register('ObojoboDraft.Chunks.Code', {
	  type: 'chunk',
	  "default": true,
	  adapter: ObojoboDraft.Common.chunk.textChunk.TextGroupAdapter,
	  componentClass: __webpack_require__(104),
	  selectionHandler: new ObojoboDraft.Common.chunk.textChunk.TextGroupSelectionHandler()
	});

/***/ },

/***/ 200:
/***/ function(module, exports) {

	// removed by extract-text-webpack-plugin

/***/ }

/******/ });