/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Helper functions for generating GogoCode for blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.GogoCode');

goog.require('Blockly.Generator');


Blockly.GogoCode = new Blockly.Generator('GogoCode');

/**
 * List of illegal variable names.
 * This is not intended to be a security feature.  Blockly is 100% client-side,
 * so bypassing this list is trivial.  This is intended to prevent users from
 * accidentally clobbering a built-in object or function.
 * @private
 */
Blockly.GogoCode.addReservedWords(
    'Blockly,' +  // In case JS is evaled in the current window.
    // https://developer.mozilla.org/en/GogoCode/Reference/Reserved_Words
    'break,case,catch,continue,debugger,default,delete,do,else,finally,for,function,if,in,instanceof,new,return,switch,this,throw,try,typeof,var,void,while,with,' +
    'class,enum,export,extends,import,super,implements,interface,let,package,private,protected,public,static,yield,' +
    'const,null,true,false,' +
    // https://developer.mozilla.org/en/GogoCode/Reference/Global_Objects
    'Array,ArrayBuffer,Boolean,Date,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Error,eval,EvalError,Float32Array,Float64Array,Function,Infinity,Int16Array,Int32Array,Int8Array,isFinite,isNaN,Iterator,JSON,Math,NaN,Number,Object,parseFloat,parseInt,RangeError,ReferenceError,RegExp,StopIteration,String,SyntaxError,TypeError,Uint16Array,Uint32Array,Uint8Array,Uint8ClampedArray,undefined,uneval,URIError,' +
    // https://developer.mozilla.org/en/DOM/window
    'applicationCache,closed,Components,content,_content,controllers,crypto,defaultStatus,dialogArguments,directories,document,frameElement,frames,fullScreen,globalStorage,history,innerHeight,innerWidth,length,location,locationbar,localStorage,menubar,messageManager,mozAnimationStartTime,mozInnerScreenX,mozInnerScreenY,mozPaintCount,name,navigator,opener,outerHeight,outerWidth,pageXOffset,pageYOffset,parent,performance,personalbar,pkcs11,returnValue,screen,screenX,screenY,scrollbars,scrollMaxX,scrollMaxY,scrollX,scrollY,self,sessionStorage,sidebar,status,statusbar,toolbar,top,URL,window,' +
    'addEventListener,alert,atob,back,blur,btoa,captureEvents,clearImmediate,clearInterval,clearTimeout,close,confirm,disableExternalCapture,dispatchEvent,dump,enableExternalCapture,escape,find,focus,forward,GeckoActiveXObject,getAttention,getAttentionWithCycleCount,getComputedStyle,getSelection,home,matchMedia,maximize,minimize,moveBy,moveTo,mozRequestAnimationFrame,open,openDialog,postMessage,print,prompt,QueryInterface,releaseEvents,removeEventListener,resizeBy,resizeTo,restore,routeEvent,scroll,scrollBy,scrollByLines,scrollByPages,scrollTo,setCursor,setImmediate,setInterval,setResizable,setTimeout,showModalDialog,sizeToContent,stop,unescape,updateCommands,XPCNativeWrapper,XPCSafeJSObjectWrapper,' +
    'onabort,onbeforeunload,onblur,onchange,onclick,onclose,oncontextmenu,ondevicemotion,ondeviceorientation,ondragdrop,onerror,onfocus,onhashchange,onkeydown,onkeypress,onkeyup,onload,onmousedown,onmousemove,onmouseout,onmouseover,onmouseup,onmozbeforepaint,onpaint,onpopstate,onreset,onresize,onscroll,onselect,onsubmit,onunload,onpageshow,onpagehide,' +
    'Image,Option,Worker,' +
    // https://developer.mozilla.org/en/Gecko_DOM_Reference
    'Event,Range,File,FileReader,Blob,BlobBuilder,' +
    'Attr,CDATASection,CharacterData,Comment,console,DocumentFragment,DocumentType,DomConfiguration,DOMError,DOMErrorHandler,DOMException,DOMImplementation,DOMImplementationList,DOMImplementationRegistry,DOMImplementationSource,DOMLocator,DOMObject,DOMString,DOMStringList,DOMTimeStamp,DOMUserData,Entity,EntityReference,MediaQueryList,MediaQueryListListener,NameList,NamedNodeMap,Node,NodeFilter,NodeIterator,NodeList,Notation,Plugin,PluginArray,ProcessingInstruction,SharedWorker,Text,TimeRanges,Treewalker,TypeInfo,UserDataHandler,Worker,WorkerGlobalScope,' +
    'HTMLDocument,HTMLElement,HTMLAnchorElement,HTMLAppletElement,HTMLAudioElement,HTMLAreaElement,HTMLBaseElement,HTMLBaseFontElement,HTMLBodyElement,HTMLBRElement,HTMLButtonElement,HTMLCanvasElement,HTMLDirectoryElement,HTMLDivElement,HTMLDListElement,HTMLEmbedElement,HTMLFieldSetElement,HTMLFontElement,HTMLFormElement,HTMLFrameElement,HTMLFrameSetElement,HTMLHeadElement,HTMLHeadingElement,HTMLHtmlElement,HTMLHRElement,HTMLIFrameElement,HTMLImageElement,HTMLInputElement,HTMLKeygenElement,HTMLLabelElement,HTMLLIElement,HTMLLinkElement,HTMLMapElement,HTMLMenuElement,HTMLMetaElement,HTMLModElement,HTMLObjectElement,HTMLOListElement,HTMLOptGroupElement,HTMLOptionElement,HTMLOutputElement,HTMLParagraphElement,HTMLParamElement,HTMLPreElement,HTMLQuoteElement,HTMLScriptElement,HTMLSelectElement,HTMLSourceElement,HTMLSpanElement,HTMLStyleElement,HTMLTableElement,HTMLTableCaptionElement,HTMLTableCellElement,HTMLTableDataCellElement,HTMLTableHeaderCellElement,HTMLTableColElement,HTMLTableRowElement,HTMLTableSectionElement,HTMLTextAreaElement,HTMLTimeElement,HTMLTitleElement,HTMLTrackElement,HTMLUListElement,HTMLUnknownElement,HTMLVideoElement,' +
    'HTMLCanvasElement,CanvasRenderingContext2D,CanvasGradient,CanvasPattern,TextMetrics,ImageData,CanvasPixelArray,HTMLAudioElement,HTMLVideoElement,NotifyAudioAvailableEvent,HTMLCollection,HTMLAllCollection,HTMLFormControlsCollection,HTMLOptionsCollection,HTMLPropertiesCollection,DOMTokenList,DOMSettableTokenList,DOMStringMap,RadioNodeList,' +
    'SVGDocument,SVGElement,SVGAElement,SVGAltGlyphElement,SVGAltGlyphDefElement,SVGAltGlyphItemElement,SVGAnimationElement,SVGAnimateElement,SVGAnimateColorElement,SVGAnimateMotionElement,SVGAnimateTransformElement,SVGSetElement,SVGCircleElement,SVGClipPathElement,SVGColorProfileElement,SVGCursorElement,SVGDefsElement,SVGDescElement,SVGEllipseElement,SVGFilterElement,SVGFilterPrimitiveStandardAttributes,SVGFEBlendElement,SVGFEColorMatrixElement,SVGFEComponentTransferElement,SVGFECompositeElement,SVGFEConvolveMatrixElement,SVGFEDiffuseLightingElement,SVGFEDisplacementMapElement,SVGFEDistantLightElement,SVGFEFloodElement,SVGFEGaussianBlurElement,SVGFEImageElement,SVGFEMergeElement,SVGFEMergeNodeElement,SVGFEMorphologyElement,SVGFEOffsetElement,SVGFEPointLightElement,SVGFESpecularLightingElement,SVGFESpotLightElement,SVGFETileElement,SVGFETurbulenceElement,SVGComponentTransferFunctionElement,SVGFEFuncRElement,SVGFEFuncGElement,SVGFEFuncBElement,SVGFEFuncAElement,SVGFontElement,SVGFontFaceElement,SVGFontFaceFormatElement,SVGFontFaceNameElement,SVGFontFaceSrcElement,SVGFontFaceUriElement,SVGForeignObjectElement,SVGGElement,SVGGlyphElement,SVGGlyphRefElement,SVGGradientElement,SVGLinearGradientElement,SVGRadialGradientElement,SVGHKernElement,SVGImageElement,SVGLineElement,SVGMarkerElement,SVGMaskElement,SVGMetadataElement,SVGMissingGlyphElement,SVGMPathElement,SVGPathElement,SVGPatternElement,SVGPolylineElement,SVGPolygonElement,SVGRectElement,SVGScriptElement,SVGStopElement,SVGStyleElement,SVGSVGElement,SVGSwitchElement,SVGSymbolElement,SVGTextElement,SVGTextPathElement,SVGTitleElement,SVGTRefElement,SVGTSpanElement,SVGUseElement,SVGViewElement,SVGVKernElement,' +
    'SVGAngle,SVGColor,SVGICCColor,SVGElementInstance,SVGElementInstanceList,SVGLength,SVGLengthList,SVGMatrix,SVGNumber,SVGNumberList,SVGPaint,SVGPoint,SVGPointList,SVGPreserveAspectRatio,SVGRect,SVGStringList,SVGTransform,SVGTransformList,' +
    'SVGAnimatedAngle,SVGAnimatedBoolean,SVGAnimatedEnumeration,SVGAnimatedInteger,SVGAnimatedLength,SVGAnimatedLengthList,SVGAnimatedNumber,SVGAnimatedNumberList,SVGAnimatedPreserveAspectRatio,SVGAnimatedRect,SVGAnimatedString,SVGAnimatedTransformList,' +
    'SVGPathSegList,SVGPathSeg,SVGPathSegArcAbs,SVGPathSegArcRel,SVGPathSegClosePath,SVGPathSegCurvetoCubicAbs,SVGPathSegCurvetoCubicRel,SVGPathSegCurvetoCubicSmoothAbs,SVGPathSegCurvetoCubicSmoothRel,SVGPathSegCurvetoQuadraticAbs,SVGPathSegCurvetoQuadraticRel,SVGPathSegCurvetoQuadraticSmoothAbs,SVGPathSegCurvetoQuadraticSmoothRel,SVGPathSegLinetoAbs,SVGPathSegLinetoHorizontalAbs,SVGPathSegLinetoHorizontalRel,SVGPathSegLinetoRel,SVGPathSegLinetoVerticalAbs,SVGPathSegLinetoVerticalRel,SVGPathSegMovetoAbs,SVGPathSegMovetoRel,ElementTimeControl,TimeEvent,SVGAnimatedPathData,' +
    'SVGAnimatedPoints,SVGColorProfileRule,SVGCSSRule,SVGExternalResourcesRequired,SVGFitToViewBox,SVGLangSpace,SVGLocatable,SVGRenderingIntent,SVGStylable,SVGTests,SVGTextContentElement,SVGTextPositioningElement,SVGTransformable,SVGUnitTypes,SVGURIReference,SVGViewSpec,SVGZoomAndPan');

/**
 * Order of operation ENUMs.
 * https://developer.mozilla.org/en/GogoCode/Reference/Operators/Operator_Precedence
 */
Blockly.GogoCode.ORDER_ATOMIC = 0;         // 0 "" ...
Blockly.GogoCode.ORDER_MEMBER = 1;         // . []
Blockly.GogoCode.ORDER_NEW = 1;            // new
Blockly.GogoCode.ORDER_FUNCTION_CALL = 2;  // ()
Blockly.GogoCode.ORDER_INCREMENT = 3;      // ++
Blockly.GogoCode.ORDER_DECREMENT = 3;      // --
Blockly.GogoCode.ORDER_LOGICAL_NOT = 4;    // !
Blockly.GogoCode.ORDER_BITWISE_NOT = 4;    // ~
Blockly.GogoCode.ORDER_UNARY_PLUS = 4;     // +
Blockly.GogoCode.ORDER_UNARY_NEGATION = 4; // -
Blockly.GogoCode.ORDER_TYPEOF = 4;         // typeof
Blockly.GogoCode.ORDER_VOID = 4;           // void
Blockly.GogoCode.ORDER_DELETE = 4;         // delete
Blockly.GogoCode.ORDER_MULTIPLICATION = 5; // *
Blockly.GogoCode.ORDER_DIVISION = 5;       // /
Blockly.GogoCode.ORDER_MODULUS = 5;        // %
Blockly.GogoCode.ORDER_ADDITION = 6;       // +
Blockly.GogoCode.ORDER_SUBTRACTION = 6;    // -
Blockly.GogoCode.ORDER_BITWISE_SHIFT = 7;  // << >> >>>
Blockly.GogoCode.ORDER_RELATIONAL = 8;     // < <= > >=
Blockly.GogoCode.ORDER_IN = 8;             // in
Blockly.GogoCode.ORDER_INSTANCEOF = 8;     // instanceof
Blockly.GogoCode.ORDER_EQUALITY = 9;       // == != === !==
Blockly.GogoCode.ORDER_BITWISE_AND = 10;   // &
Blockly.GogoCode.ORDER_BITWISE_XOR = 11;   // ^
Blockly.GogoCode.ORDER_BITWISE_OR = 12;    // |
Blockly.GogoCode.ORDER_LOGICAL_AND = 13;   // &&
Blockly.GogoCode.ORDER_LOGICAL_OR = 14;    // ||
Blockly.GogoCode.ORDER_CONDITIONAL = 15;   // ?:
Blockly.GogoCode.ORDER_ASSIGNMENT = 16;    // = += -= *= /= %= <<= >>= ...
Blockly.GogoCode.ORDER_COMMA = 17;         // ,
Blockly.GogoCode.ORDER_NONE = 99;          // (...)

/**
 * Arbitrary code to inject into locations that risk causing infinite loops.
 * Any instances of '%1' will be replaced by the block ID that failed.
 * E.g. '  checkTimeout(%1);\n'
 * @type ?string
 */
Blockly.GogoCode.INFINITE_LOOP_TRAP = null;

/**
 * Initialise the database of variable names.
 */
Blockly.GogoCode.init = function() {
  // Create a dictionary of definitions to be printed before the code.
  Blockly.GogoCode.definitions_ = Object.create(null);
  // Create a dictionary mapping desired function names in definitions_
  // to actual function names (to avoid collisions with user functions).
  Blockly.GogoCode.functionNames_ = Object.create(null);

  if (Blockly.Variables) {
    if (!Blockly.GogoCode.variableDB_) {
      Blockly.GogoCode.variableDB_ =
          new Blockly.Names(Blockly.GogoCode.RESERVED_WORDS_);
    } else {
      Blockly.GogoCode.variableDB_.reset();
    }

    var defvars = [];
    var variables = Blockly.Variables.allVariables();
    for (var x = 0; x < variables.length; x++) {
      defvars[x] = 'make "' +
          Blockly.GogoCode.variableDB_.getName(variables[x],
          Blockly.Variables.NAME_TYPE) + ' 0';
    }
    Blockly.GogoCode.definitions_['variables'] = defvars.join('\n');
  }
};

/**
 * Prepend the generated code with the variable definitions.
 * @param {string} code Generated code.
 * @return {string} Completed code.
 */
Blockly.GogoCode.finish = function(code) {
  // Convert the definitions dictionary into a list.
  var definitions = [];
  for (var name in Blockly.GogoCode.definitions_) {
    definitions.push(Blockly.GogoCode.definitions_[name]);
  }
  return definitions.join('\n\n') + '\n\n\n' + code;
};

/**
 * Naked values are top-level blocks with outputs that aren't plugged into
 * anything.  A trailing semicolon is needed to make this legal.
 * @param {string} line Line of generated code.
 * @return {string} Legal line of code.
 */
Blockly.GogoCode.scrubNakedValue = function(line) {
  return line + ';\n';
};

/**
 * Encode a string as a properly escaped GogoCode string, complete with
 * quotes.
 * @param {string} string Text to encode.
 * @return {string} GogoCode string.
 * @private
 */
Blockly.GogoCode.quote_ = function(string) {
  // TODO: This is a quick hack.  Replace with goog.string.quote
  string = string.replace(/\\/g, '\\\\')
                 .replace(/\n/g, '\\\n')
                 .replace(/'/g, '\\\'');
  return '\'' + string + '\'';
};

/**
 * Common tasks for generating GogoCode from blocks.
 * Handles comments for the specified block and any connected value blocks.
 * Calls any statements following this block.
 * @param {!Blockly.Block} block The current block.
 * @param {string} code The GogoCode code created for this block.
 * @return {string} GogoCode code with comments and subsequent blocks added.
 * @private
 */
Blockly.GogoCode.scrub_ = function(block, code) {
  if (code === null) {
    // Block has handled code generation itself.
    return '';
  }
  var commentCode = '';
  // Only collect comments for blocks that aren't inline.
  if (!block.outputConnection || !block.outputConnection.targetConnection) {
    // Collect comment for this block.
    var comment = block.getCommentText();
    if (comment) {
      commentCode += this.prefixLines(comment, '// ') + '\n';
    }
    // Collect comments for all value arguments.
    // Don't collect comments for nested statements.
    for (var x = 0; x < block.inputList.length; x++) {
      if (block.inputList[x].type == Blockly.INPUT_VALUE) {
        var childBlock = block.inputList[x].connection.targetBlock();
        if (childBlock) {
          var comment = this.allNestedComments(childBlock);
          if (comment) {
            commentCode += this.prefixLines(comment, '// ');
          }
        }
      }
    }
  }
  var nextBlock = block.nextConnection && block.nextConnection.targetBlock();
  var nextCode = this.blockToCode(nextBlock);
  return commentCode + code + nextCode;
};



Blockly.GogoCode['clock_date'] = function(block) {
  var dropdown_date = block.getFieldValue('date');
  // TODO: Assemble JavaScript into code variable.
  var code = '<span class="c330">date['+dropdown_date+']</span>\n';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.GogoCode.ORDER_NONE];
};

Blockly.GogoCode['display_text'] = function(block) {
  var text_input = block.getFieldValue('text');
  var code = '<span class="c330">display \''+text_input+'\'</span>\n';
  return code;
};

Blockly.GogoCode['display_number'] = function(block) {
  //var text_input = block.getFieldValue('text');
  var value_value = Blockly.GogoCode.valueToCode(block, 'value', Blockly.GogoCode.ORDER_ATOMIC);
  var code = '<span class="c330">display \''+value_value+'\'</span>\n';
  return code;
};

Blockly.GogoCode['display_movecursor'] = function(block) {
  var text_num = block.getFieldValue('num');
  text_num = isNaN(text_num) ? 0 : text_num % 32 ;
  var code = '<span class="c330">movecursor \''+text_num+'\'</span>\n';
  return code;
};

Blockly.GogoCode['display_clearscreen'] = function(block) {
  var code = '<span class="c330">clearscreen</span>\n';
  return code;
};

Blockly.GogoCode['recorder_play'] = function(block) {
  var code = '<span class="c90">play</span>\n';
  return code;
};

Blockly.GogoCode['recorder_next'] = function(block) {
  var code = '<span class="c90">next</span>\n';
  return code;
};

Blockly.GogoCode['recorder_prev'] = function(block) {
  var code = '<span class="c90">prev</span>\n';
  return code;
};

Blockly.GogoCode['recorder_select'] = function(block) {
  var num_track = block.getFieldValue('track');
  var code = '<span class="c90">selecttrack '+num_track+'</span>\n';
  return code;
};

Blockly.GogoCode['recorder_eraseall'] = function(block) {
  var code = '<span class="c90">eraseall</span>\n';
  return code;
};

Blockly.GogoCode['i2c_write'] = function(block) {
  var value_value = Blockly.GogoCode.valueToCode(block, 'value', Blockly.GogoCode.ORDER_ATOMIC);
  var text_reg_addr = block.getFieldValue('reg_addr');
  var text_i2c_addr = block.getFieldValue('i2c_addr');
  var code = '<span class="c210">i2cwrite [write: \''+value_value+'\', reg_address: '+text_reg_addr+', i2c_address: '+text_i2c_addr+']</span>\n';
  return code;
};

Blockly.GogoCode['i2c_read'] = function(block) {
  var text_reg_addr = block.getFieldValue('reg_addr');
  var text_i2c_addr = block.getFieldValue('i2c_addr');
  var code = '<span class="c210">i2cread [reg_address: '+text_reg_addr+', i2c_address: '+text_i2c_addr+']</span>\n';
  return [code, Blockly.GogoCode.ORDER_NONE];
};


Blockly.GogoCode.action_beep = function() {
  var code = '<span class="c290">beep</span>\n';
  return code;
};

Blockly.GogoCode.action_led = function() {
  var dropdown_onoff = this.getFieldValue('onoff');
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c290">led'+dropdown_onoff+'</span>\n';
  return code;
};

/***
Blockly.GogoCode.action_wait = function() {
  var text_name = this.getFieldValue('NAME');
  // TODO: Assemble GogoCode into code variable.
  text_name *= 10;
  var code = '<span class="c290">wait ' + (isNaN(text_name) ? 0 : text_name) + '</span> \n';
  return code;
};
/***/

Blockly.GogoCode['action_wait'] = function(block) {
  var value_name = Blockly.GogoCode.valueToCode(block, 'NAME', Blockly.GogoCode.ORDER_ATOMIC);
  //value_name = value_name.replace('<span class="c10">', '').replace('</span>', '').toInt()
  //value_name *= 10;
  //var code = '<span class="c290">wait ' + (isNaN(value_name) ? 0 : value_name) + '</span> \n';
  var code = '<span class="c290">wait ' + value_name + '</span> \n';
  return code;
};

Blockly.GogoCode.action_gettimer = function() {
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c120">timer</span>';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.GogoCode.ORDER_NONE];
};

Blockly.GogoCode.action_reset_timer = function() {
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c120">resett</span>\n'
  return code;
};

Blockly.GogoCode.action_motor = function() {
  var dropdown_a = this.getFieldValue('a');
  var dropdown_b = this.getFieldValue('b');
  var dropdown_c = this.getFieldValue('c');
  var dropdown_d = this.getFieldValue('d');
  //var value_name = Blockly.GogoCode.valueToCode(this, 'NAME', Blockly.GogoCode.ORDER_ATOMIC);
  // TODO: Assemble GogoCode into code variable.

  var code = '<span class="c316">'+dropdown_a+dropdown_b+dropdown_c+dropdown_d+',</span> \n';//+value_name.slice(1, value_name.length-1)+'\n';
  return code;
};

Blockly.GogoCode.motor_action_turn = function() {
  var dropdown_turn = this.getFieldValue('turn');
  //var value_right = Blockly.GogoCode.valueToCode(this, 'right', Blockly.GogoCode.ORDER_ATOMIC);
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c316">'+dropdown_turn+'</span> \n';//+value_right.slice(1, value_right.length-1);
  // TODO: Change ORDER_NONE to the correct strength.
  //return [code, Blockly.GogoCode.ORDER_NONE];
  return code;
};

Blockly.GogoCode.motor_action_onfor = function(block) {
  //var value_right = Blockly.GogoCode.valueToCode(this, 'right', Blockly.GogoCode.ORDER_ATOMIC);
  var text_second = Blockly.GogoCode.valueToCode(block, 'value', Blockly.GogoCode.ORDER_ATOMIC);
  //text_second = text_second.replace('<span class="c10">', '').replace('</span>', '').toInt();
  // TODO: Assemble GogoCode into code variable.
  //text_second *= 10;
  //text_second = isNaN(text_second) ? 0 : text_second;
  var code = '<span class="c316">onfor ' + text_second + '</span> \n';//+value_right.slice(1, value_right.length-1);
  // TODO: Change ORDER_NONE to the correct strength.
  //return [code, Blockly.GogoCode.ORDER_NONE];
  return code;
};

Blockly.GogoCode.motor_action_thisway = function() {
  //var value_right = Blockly.GogoCode.valueToCode(this, 'right', Blockly.GogoCode.ORDER_ATOMIC);
  var dropdown_thisway = this.getFieldValue('thisway');
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c316">'+dropdown_thisway+ '</span> \n';//+value_right.slice(1, value_right.length-1);
  // TODO: Change ORDER_NONE to the correct strength.
  //return [code, Blockly.GogoCode.ORDER_NONE];
  return code;
};

Blockly.GogoCode.motor_action_rd = function() {
  //var value_right = Blockly.GogoCode.valueToCode(this, 'right', Blockly.GogoCode.ORDER_ATOMIC);
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c316">rd</span> \n';//+value_right.slice(1, value_right.length-1);
  // TODO: Change ORDER_NONE to the correct strength.
  //return [code, Blockly.GogoCode.ORDER_NONE];
  return code;
};

Blockly.GogoCode.motor_action_power = function() {
  var dropdown_power = this.getFieldValue('power');
  //var value_right = Blockly.GogoCode.valueToCode(this, 'right', Blockly.GogoCode.ORDER_ATOMIC);
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c316">setpower ' + dropdown_power + '</span> \n';//+value_right.slice(1, value_right.length-1);
  // TODO: Change ORDER_NONE to the correct strength.
  //return [code, Blockly.GogoCode.ORDER_NONE];
  return code;
};

/***

Blockly.GogoCode.motor_action_turn = function() {
  var dropdown_turn = this.getFieldValue('turn');
  // TODO: Assemble GogoCode into code variable.
  var code = dropdown_turn+' ';
  return code;
};
/***/

/**  CONTROL  **/



Blockly.GogoCode.control_if = function() {
  var value_condition = Blockly.GogoCode.valueToCode(this, 'condition', Blockly.GogoCode.ORDER_ATOMIC);
  var statements_statement = Blockly.GogoCode.statementToCode(this, 'statement');
  
  //var code = 'if '+value_condition.slice(1, value_condition.length-1)+' [\n'+statements_statement+']\n';
  var code = '<span class="c120">if '+ value_condition +' \n[\n'+statements_statement+'\n]</span>\n';
  return code;
};

Blockly.GogoCode.control_ifelse = function() {
  var value_condition = Blockly.GogoCode.valueToCode(this, 'condition', Blockly.GogoCode.ORDER_ATOMIC);
  var statements_if = Blockly.GogoCode.statementToCode(this, 'if');
  var statements_else = Blockly.GogoCode.statementToCode(this, 'else');
  // TODO: Assemble GogoCode into code variable.
  //var code = 'ifelse '+value_condition.slice(1, value_condition.length-1)+' [\n'+statements_if+'] [\n'+statements_else+']\n';
  var code = '<span class="c120">ifelse '+value_condition+' \n[\n'+statements_if+'\n] [\n'+statements_else+'\n]</span>\n';
  return code;
};

Blockly.GogoCode.control_waituntil = function() {
  var value_name = Blockly.GogoCode.valueToCode(this, 'NAME', Blockly.GogoCode.ORDER_ATOMIC);
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c120">waituntil [ '+value_name.slice(1, value_name.length-1)+' ]</span>\n';
  return code;
};

Blockly.GogoCode.control_repeat = function() {
  var value_times = Blockly.GogoCode.valueToCode(this, 'times', Blockly.GogoCode.ORDER_ATOMIC);
  var statements_do = Blockly.GogoCode.statementToCode(this, 'do');
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c120">repeat '+value_times.slice(1, value_times.length-1)+' \n[\n'+statements_do+'\n]</span>\n';
  var code = '<span class="c120">repeat '+value_times+' \n[\n'+statements_do+'\n]</span>\n';
  return code;
};

Blockly.GogoCode.control_forever = function() {
  var statements_do = Blockly.GogoCode.statementToCode(this, 'do');
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c120">forever \n[\n'+statements_do+'\n]</span>\n';
  return code;
};

Blockly.GogoCode.input_switch = function() {
  var dropdown_switch = this.getFieldValue('switch');
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c290">switch'+dropdown_switch+'</span>';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.GogoCode.ORDER_NONE];
};

Blockly.GogoCode.input_sensor = function() {
  var dropdown_sensor = this.getFieldValue('sensor');
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c290">sensor'+dropdown_sensor+'</span>';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.GogoCode.ORDER_NONE];
};

Blockly.GogoCode.input__output__storage_setdp = function() {
  var value_dp = Blockly.GogoCode.valueToCode(this, 'DP', Blockly.GogoCode.ORDER_ATOMIC);
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c220">setdp '+value_dp.slice(1, value_dp.length-1)+'</span>\n';
  return code;
};

Blockly.GogoCode.input__output__storage_record = function() {
  var value_value = Blockly.GogoCode.valueToCode(this, 'value', Blockly.GogoCode.ORDER_ATOMIC);
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c220">record '+value_value.slice(1, value_value.length-1)+'</span>\n';
  return code;
};

Blockly.GogoCode.input__output__storage_recall = function() {
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c220">recall</span> ';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.GogoCode.ORDER_NONE];
};

Blockly.GogoCode.input__output__storage_send_serial = function() {
  var value_send = Blockly.GogoCode.valueToCode(this, 'send', Blockly.GogoCode.ORDER_ATOMIC);
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c250">send '+value_send.slice(1, value_send.length-1)+'</span> \n';
  return code;
};

Blockly.GogoCode.input__output__storage_new_serial = function() {
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c250">newserial?</span>';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.GogoCode.ORDER_NONE];
};

Blockly.GogoCode.input__output__storage_get_serial = function() {
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c250">serial</span> ';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.GogoCode.ORDER_NONE];
};

Blockly.GogoCode.input__output__storage_new_ir = function() {
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c250">newir?</span>'
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.GogoCode.ORDER_NONE];
};

Blockly.GogoCode.input__output__storage_get_ir = function() {
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c250">ir</span> '
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.GogoCode.ORDER_NONE];
};

/***

Blockly.GogoCode.math_true = function() {
  // TODO: Assemble GogoCode into code variable.
  var code = 'true'
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.GogoCode.ORDER_NONE];
};

/***/



Blockly.GogoCode.math_number = function() {
  var text_number = this.getFieldValue('number');
  var code = '<span class="c10">'+(isNaN(text_number) ? 0 : text_number)+'</span>';
  return [code, Blockly.GogoCode.ORDER_NONE];
};

Blockly.GogoCode.math_random = function() {
  // TODO: Assemble GogoCode into code variable.
  var code = Math.floor(Math.random() * 32768 * 2) - 32768;
  code = '<span class="c10">random</span>';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.GogoCode.ORDER_NONE];
};

Blockly.GogoCode.math_equal = function() {
  var value_left = Blockly.GogoCode.valueToCode(this, 'left', Blockly.GogoCode.ORDER_ATOMIC);
  var value_right = Blockly.GogoCode.valueToCode(this, 'right', Blockly.GogoCode.ORDER_ATOMIC);
  var dropdown_cond = this.getFieldValue('cond');
  // TODO: Assemble GogoCode into code variable.
  //var code = '( '+value_left.slice(1, value_left.length-1)+' '+dropdown_cond+' '+value_right.slice(1, value_right.length-1) +' )';
  var code = '<span class="c10">'+value_left+' '+dropdown_cond+' '+value_right+'</span> ';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.GogoCode.ORDER_NONE];
};

Blockly.GogoCode.math_operator = function() {
  var value_1stnum = Blockly.GogoCode.valueToCode(this, '1stNum', Blockly.GogoCode.ORDER_ATOMIC);
  var value_2ndnum = Blockly.GogoCode.valueToCode(this, '2ndNum', Blockly.GogoCode.ORDER_ATOMIC);
  var dropdown_op = this.getFieldValue('op');
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c10">( '+value_1stnum.slice(1, value_1stnum.length-1)+' '+dropdown_op+' '+value_2ndnum.slice(1, value_2ndnum.length-1) +' )</span>';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.GogoCode.ORDER_NONE];
};

Blockly.GogoCode.math_andor = function() {
  var value_left = Blockly.GogoCode.valueToCode(this, 'left', Blockly.GogoCode.ORDER_ATOMIC);
  var value_right = Blockly.GogoCode.valueToCode(this, 'right', Blockly.GogoCode.ORDER_ATOMIC);
  var dropdown_andor = this.getFieldValue('andor');
  // TODO: Assemble GogoCode into code variable.
  //var code = value_left.slice(1, value_left.length-1)+' '+dropdown_andor+' '+value_right.slice(1, value_right.length-1) +' ';
  var code = '<span class="c10">'+value_left+' '+dropdown_andor+' '+value_right +'</span> ';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.GogoCode.ORDER_NONE];
};

Blockly.GogoCode.math_not = function() {
  var value_bool = Blockly.GogoCode.valueToCode(this, 'bool', Blockly.GogoCode.ORDER_ATOMIC);
  // TODO: Assemble GogoCode into code variable.
  var code = '<span class="c10">not '+value_bool+'</span>';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.GogoCode.ORDER_NONE];
};



/****    VARIABLE    ****/ 

Blockly.GogoCode.variables_get = function() {
  // Variable getter.
  var code = '<span class="c330">[:]:'+Blockly.GogoCode.variableDB_.getName(this.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE)+'[;]</span>';
  return [code, Blockly.GogoCode.ORDER_ATOMIC];
};

Blockly.GogoCode.variables_set = function() {
  // Variable setter.
  var argument0 = Blockly.GogoCode.valueToCode(this, 'VALUE',
      Blockly.GogoCode.ORDER_ASSIGNMENT) || '0';
  //if (argument0 != '0') argument0 = argument0.slice(1, argument0.length-1);
  var varName = Blockly.GogoCode.variableDB_.getName(
      this.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);
  return '<span class="c330">make "' + varName + ' ' + argument0 + '</span>\n';
};


/****    PROCEDURE    ****/

Blockly.GogoCode['procedures_callreturn'] = function(block) {
  // Call a procedure with a return value.
  var funcName = Blockly.GogoCode.variableDB_.getName(
      block.getFieldValue('NAME'), Blockly.Procedures.NAME_TYPE);
  var args = [];
  for (var x = 0; x < block.arguments_.length; x++) {
    args[x] = Blockly.GogoCode.valueToCode(block, 'ARG' + x,
        Blockly.GogoCode.ORDER_COMMA) || 'null';
  }
  var code = funcName + '(' + args.join(', ') + ')';
  return [code, Blockly.GogoCode.ORDER_FUNCTION_CALL];
};

Blockly.GogoCode.procedure_procedure = function() {
  var statements_statement = Blockly.GogoCode.statementToCode(this, 'statement');
  var text_pname = this.getFieldValue('pname');
  // TODO: Assemble GogoCode into code variable.
  //var code = '[SS]to '+text_pname+'\n[SS]'+statements_statement+'end[SS]';
  var code = '[p]<span class="c210">to '+text_pname+'</span>\n[SS]'+statements_statement+'<span class="c210">end</span>[/p]';
  return code;
};

/****

Paste your new language here

****/

