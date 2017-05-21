// IMAGE COMPARATOR
#target photoshop
app.bringToFront();
var doc = app.activeDocument;

var scriptName = 'IMAGE COMPARATOR  by RONC';
var scriptVersion = 'V0.994-20May2017';
var scriptAuthor = ''; //'Ron Chambers';
var scriptAbstract = 'Images from two layers are written as PNG24 files. A web page is also provided to compare the images within a browser.';

/*
    Copyright <2017> <Ron Chambers>               MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Includes an external .js file
// @include 'REC-global_lib.js' 

var imageWidth = doc.width;
var imageHeight = doc.height;
var imageWidth = Math.round(doc.width.value);
var imageHeight = Math.round(doc.height.value);

//
// Dialog
//
// layer names

var layerNum = doc.layers.length;
var uiError = layerNum - 2;
if (uiError < 0)
{
  alert("Number of layers must exceed 2.", layerNum);

}
var layerNames = [];
for (var i = 0; i < layerNum; i++)
{
  layerNames[i] = doc.layers[layerNum - i - 1].name;
}
//prompt("Layers Names:", layerNames);
var uiSeparatorLine = '________________________________________________________________________________________________';

var uiFoldername = Folder.temp;
var uiSelection = 0;
var uiSelectionL = layerNames[0];
var uiSelectionR = layerNames[1];
var uiFilenameHtml = "/ImageComparator.html";
var uiFilenamePNG = "/ImageComparator.png";
var uiCommentsL = "LEFT Image comments: ";
var uiCommentsR = "RIGHT Image comments: ";
var uiCommentsC = "COMMON Image comments:";
var uiDone = 0;

var dlg = new Window('dialog', scriptName + '  ' + scriptVersion, undefined, undefined);
dlg.alignment = "center";

dlg.openPnl = dlg.add('panel', undefined, scriptAuthor);
var bga = dlg.openPnl.add("group");
bga.orientation = "column";
bga.alignment = "center";
txt1 = bga.add("statictext", undefined, scriptAbstract);
txt1a = bga.add("statictext", undefined, uiSeparatorLine);

var bgb = dlg.openPnl.add("group");
bgb.orientation = "row";
bgb.alignment = "center";
txt2 = bgb.add("statictext", undefined, "Foldername:");
var ett1 = bgb.add("edittext", undefined, uiFoldername);
ett1.characters = 20;
ett1.helpTip = "Location of web page: " + uiFoldername;
uiFoldername = ett1.text;

txt2a = bgb.add("statictext", undefined, "Filename:");
var ett2 = bgb.add("edittext", undefined, uiFilenameHtml);
ett2.characters = 20;
ett2.helpTip = "Filename of web page: " + uiFilenameHtml;
uiFilenameHtml = ett2.text;

var dc = dlg.openPnl.add("group");
dc.orientation = "column";
dc.alignment = "center";
txt3 = dc.add("statictext", undefined, uiSeparatorLine);

var dd = dlg.openPnl.add("group");
dd.orientation = "row";
dd.alignment = "center";

var dL = dd.add("group");
dL.orientation = "column";
dL.alignment = 'left'; //"center";
title1 = dL.add('statictext', undefined, 'Layer to display on left: ');
title1.alignment = "left";
ddL = dL.add('dropdownlist', undefined, layerNames);
ddL.alignment = "left";
ddL.helpTip = "Layer to display on left";
ddL.selection = 0;
uiSelectionL = ddL.selection.text;
var dLett = dL.add("edittext", [0, 0, 240, 70], uiCommentsL,
{
  multiline: true
});
dLett.helpTip = "Left comments.";
uiCommentsL = dLett.text;

var dR = dd.add("group");
dR.orientation = "column";
dR.alignment = "center";
title2 = dR.add('statictext', undefined, 'Layer to display on right: ');
title2.alignment = "left";
ddR = dR.add('dropdownlist', undefined, layerNames);
ddR.alignment = "left";
ddR.helpTip = "Layer to display on right";
ddR.selection = 0;
uiSelectionR = ddR.selection.text;
var dRett = dR.add("edittext", [0, 0, 240, 70], uiCommentsR,
{
  multiline: true
});
dRett.helpTip = "Right comments.";
uiCommentsR = dRett.text;

var dda = dlg.openPnl.add("group");
dda.orientation = "column";
dda.alignment = "center";
var dCett = dda.add("edittext", [0, 0, 490, 70], uiCommentsC,
{
  multiline: true
});
dCett.helpTip = "Common comments.";
uiCommentsC = dCett.text;
txt4 = dda.add("statictext", undefined, "***(To change lines within the comments fields, use CTRL+J keys.   Do not use Enter or CTRL+Enter keys.)***");
txt5 = dda.add("statictext", undefined, uiSeparatorLine);
if (uiSelectionL == uiSelectionR) uiError = uiError + 10000;

var bg = dlg.openPnl.add("group");
bg.orientation = "row";
bg.alignment = "center";
bg1 = bg.add("button", undefined, "OK");
bg1.helpTip = 'OK - start execution';
bg1.onClick = dobuild;
bg2 = bg.add("button", undefined, "Cancel");
bg2.helpTip = 'Cancel - abort execution';
bg2.onClick = doabort;
bg3 = bg.add("button", undefined, "Help");
bg3.helpTip = 'Help - have question?';
bg3.onClick = dohelp;

var bgb = dlg.openPnl.add("group");
bgb.orientation = "column";
bgb.alignment = "center";
txt2 = bgb.add('statictext', undefined, '***(ESC key cancels during execution of script.)***');

dlg.show();

function dobuild()
{
  // alert("Congratulations - it all worked!");
  dlg.close();
  //alert("here1", uiSelection + " " + ddL.selection);
  uiSelectionL = ddL.selection.text;
  uiSelectionR = ddR.selection.text;
  uiFoldername = ett1.text;
  uiFilenameHtml = ett2.text;
  uiCommentsL = dLett.text + "\nLayer: " + uiSelectionL;
  uiCommentsR = dRett.text + "\nLayer: " + uiSelectionR;
  uiCommentsC = dCett.text;
  //alert("comment", uiCommentsL) ;
  //alert("comment", uiCommentsR) ;
  //alert("comment", uiCommentsC) ;
  //alert("here2", uiSelection + " " + ddL.selection);
}

function doabort()
{
  // alert("De-Congratulations - it didn't work!");
  uiDone = 1;
  dlg.close();
  return;
}

function dohelp()
{
  //alert("Congratulations - need help");
  openURL("ImageComparator-help.html");
  uiDone = 1;
  dlg.close();
  return;
}

function openURL(url)
{
  var fname = "shortcut.url";
  var shortcut = new File(uiFoldername + '/' + fname);
  shortcut.open('w');
  shortcut.writeln('[InternetShortcut]');
  shortcut.writeln('URL=' + url);
  shortcut.writeln();
  shortcut.close();
  shortcut.execute();
  shortcut.remove();
};

cTID = function (s)
{
  return app.charIDToTypeID(s);
};
sTID = function (s)
{
  return app.stringIDToTypeID(s);
};

// @include 'REC-loadSymbols.js' 
// @include 'REC-layers_lib.js' 

hideLayerPalette = true;
hideHistoryPalette = true;
if (hideLayerPalette == true) hideLayers();


// Select
function step01(enabled, withDialog)
{
  if (enabled != undefined && !enabled)
    return;
  var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
  var desc1 = new ActionDescriptor();
  var ref1 = new ActionReference();
  ref1.putName(PSClass.Layer, uiSelection);
  desc1.putReference(PSKey.Target, ref1);
  desc1.putBoolean(PSKey.MakeVisible, false);
  var list1 = new ActionList();
  list1.putInteger(25);
  desc1.putList(PSKey.LayerID, list1);
  executeAction(PSEvent.Select, desc1, dialogMode);
};

// Duplicate
function step02(enabled, withDialog)
{
  if (enabled != undefined && !enabled)
    return;
  var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
  var desc1 = new ActionDescriptor();
  var ref1 = new ActionReference();
  ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
  desc1.putReference(PSKey.Target, ref1);
  desc1.putInteger(PSClass.Version, 5);
  var list1 = new ActionList();
  list1.putInteger(381);
  desc1.putList(PSKey.ID, list1);
  executeAction(PSEvent.Duplicate, desc1, dialogMode);
};

// Move
function step03(enabled, withDialog)
{
  if (enabled != undefined && !enabled)
    return;
  var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
  var desc1 = new ActionDescriptor();
  var ref1 = new ActionReference();
  ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
  desc1.putReference(PSKey.Target, ref1);
  var ref2 = new ActionReference();
  ref2.putIndex(PSClass.Layer, layerNum + 1);
  desc1.putReference(PSKey.To, ref2);
  desc1.putBoolean(PSKey.Adjustment, false);
  desc1.putInteger(PSClass.Version, 5);
  var list1 = new ActionList();
  list1.putInteger(381);
  desc1.putList(PSKey.LayerID, list1);
  executeAction(PSEvent.Move, desc1, dialogMode);
};

// Save
function step04(enabled, withDialog)
{
  if (enabled != undefined && !enabled)
    return;
  var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
  var desc1 = new ActionDescriptor();
  var desc2 = new ActionDescriptor();
  desc2.putEnumerated(PSKey.PNGInterlaceType, PSKey.PNGInterlaceType, PSEnum.PNGInterlaceNone);
  desc2.putEnumerated(PSKey.PNGFilter, PSKey.PNGFilter, PSEnum.PNGFilterAdaptive);
  desc2.putInteger(PSKey.Compression, 0);
  desc1.putObject(PSKey.As, PSClass.PNGFormat, desc2);
  desc1.putPath(PSKey.In, new File(uiFoldername + uiFilenamePNG));
  desc1.putInteger(PSKey.DocumentID, 476);
  desc1.putBoolean(PSKey.Copy, true);
  executeAction(PSEvent.Save, desc1, dialogMode);
};

// Delete
function step05(enabled, withDialog)
{
  if (enabled != undefined && !enabled)
    return;
  var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
  var desc1 = new ActionDescriptor();
  var ref1 = new ActionReference();
  ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
  desc1.putReference(PSKey.Target, ref1);
  var list1 = new ActionList();
  list1.putInteger(384);
  desc1.putList(PSKey.LayerID, list1);
  executeAction(PSEvent.Delete, desc1, dialogMode);
};

/*
// Save
function step03(enabled, withDialog)
{
  if (enabled != undefined && !enabled)
    return;
  //pngOpts.PNG8 = false; 
  //pngOpts.transparency = true; 
  //pngOpts.interlaced = false; 
  //pngOpts.quality = 100;
  var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
  var desc1 = new ActionDescriptor();
  var desc2 = new ActionDescriptor();
  desc2.putEnumerated(PSKey.PNGInterlaceType, PSKey.PNGInterlaceType, PSEnum.PNGInterlaceNone);
  desc2.putEnumerated(PSKey.PNGFilter, PSKey.PNGFilter, PSEnum.PNGFilterAdaptive);
  desc2.putInteger(PSKey.Compression, 100);
  desc1.putObject(PSKey.As, PSClass.PNGFormat, desc2);
  desc1.putPath(PSKey.In, new File(Folder.temp + "/SelectLayerView.png"));
  desc1.putInteger(PSKey.DocumentID, 476);
  desc1.putBoolean(PSKey.Copy, true);
  executeAction(PSEvent.Save, desc1, dialogMode);
};
*/

function SelectLayerPNG()
{
  for (sel = 0; sel < 2; sel = sel + 1)
  {
    if (sel == 0)
    {
      uiSelection = uiSelectionL;
      uiFilenamePNG = "/ImageComparatorLeft.png";
    }
    if (sel == 1)
    {
      uiSelection = uiSelectionR;
      uiFilenamePNG = "/ImageComparatorRight.png";
    }
    //alert("here3", uiSelection + "\n " + ddL.selection + "\n  " +  uiFilenamePNG);
    step01(); // Select
    step02(); // Duplicate
    step03(); // Move
    step04(); // Save
    step05(); // Delete
  }
}

function BuildWriteHTML()
{
  //  alert("commentL", uiCommentsL);
  var HTMLcode = "";
  HTMLcode = HTMLcode +
    "<html>\n" +
    "<head>\n" +
    "<style>\n" +
    "body\n" +
    "{\n" +
    "color:white;\n" +
    "font-family: Arial, san-serif;\n " +
    "}\n" +
    " table\n" +
    "{\n" +
    "display: table;\n" +
    "border-spacing: 0px;\n" +
    "border-color: #404040;\n" +
    "}\n" +
    "</style>\n" +

    /*before-after/before-after.css*/
    '\n' +
    "<style>\n" +
    ".ba-slider {\n" +
    "   position: relative;\n" +
    "   overflow: hidden;}\n" +
    ".ba-slider img {\n" +
    "    width: 100%;\n" +
    "    display:block;\n" +
    "    max-width:none;}\n" +
    ".ba-slider .resize {\n" +
    "    position: absolute;\n" +
    "    top:0;\n" +
    "    left: 0;\n" +
    "    height: 100%;\n" +
    "    width: 100%;\n" +
    "    overflow: hidden;}\n" +
    ".ba-slider .handle { /* Thin line separator */ \n" +
    " position:absolute; \n" +
    " left:50%;\n" +
    " top:0;\n" +
    " bottom:0;\n" +
    " width:2px;\n" +
    " margin-left:0px;\n" +
    " background: rgba(0, 0, 0, 0.66);\n" +
    " opacity: 0.25\n" +
    " cursor: ew-resize;}\n" +
    ".ba-slider .handle:after { \n" +
    "    position: absolute;\n" +
    "    top: 50%;\n" +
    "    width: 64px;\n" +
    "    height: 64px;\n" +
    "    margin: -32px 0px 0px -31px;\n" +
    "    content:  url(arrow64.png); \n" +
    "    opacity: 0.25\n" +
    "    line-height:64px;\n" +
    //"    background: #ffffff;\n" +
   // "    border:1px solid #ffffff;\n" +
  //  "    border-radius: 50%;\n" +
   // "    transition:all 0.3s ease;\n" +
   // "    box-shadow:\n" +
  //  "      0px 2px 6px rgba(0, 0, 0, 0.0033), \n" +
  //  "      inset 0px 2px 0px rgba(255, 255, 255, 0.5),\n" +
  //  "      inset 0px 60px 50px -30px #000000; }\n" +
    ".ba-slider .handle.ba-draggable:after  {\n" +
    "    width: 48px;\n" +
    "    height: 48px;\n" +
    "    margin: -24px 0px 0px -24px;\n" +
    "    content:  url(arrow48.png); \n" +
    "    line-height:48px;\n" +
    "</style>\n" +

    '<script type="text/javascript" src="http://code.jquery.com/jquery-2.1.3.min.js"></script>\n' +

    /*before-after/before-after.js*/
    ' \n' +
    "<script>\n" +
    "(function($) {\n" +
    "function drags(dragElement, resizeElement, container) {\n" +
    // Initialize the dragging event on mousedown.\n" +
    "dragElement.on('mousedown.ba-events touchstart.ba-events', function(e) {\n" +
    "dragElement.addClass('ba-draggable');\n" +
    "resizeElement.addClass('ba-resizable');\n" +
    // Check if it's a mouse or touch event and pass along the correct value\n" +
    "var startX = (e.pageX) ? e.pageX : e.originalEvent.touches[0].pageX;\n" +
    // Get the initial position
    "var dragWidth = dragElement.outerWidth(),\n" +
    "posX = dragElement.offset().left + dragWidth - startX,\n" +
    "containerOffset = container.offset().left,\n" +
    "containerWidth = container.outerWidth();\n" +
    // Set limits
    "minLeft = containerOffset + 10;\n" +
    "maxLeft = containerOffset + containerWidth - dragWidth - 10;\n" +
    // Calculate the dragging distance on mousemove.
    "dragElement.parents().on('mousemove.ba-events touchmove.ba-events', function(e) {\n" +
    // Check if it's a mouse or touch event and pass along the correct value
    "var moveX = (e.pageX) ? e.pageX : e.originalEvent.touches[0].pageX;\n" +
    "leftValue = moveX + posX - dragWidth;\n" +
    // Prevent going off limits
    "if ( leftValue < minLeft) {\n" +
    "leftValue = minLeft;\n" +
    "} else if (leftValue > maxLeft) {\n" +
    "leftValue = maxLeft;\n" +
    "}\n" +
    // Translate the handle's left value to masked divs width.
    "widthValue = (leftValue + dragWidth/2 - containerOffset)*100/containerWidth+'%';\n" +
    // Set the new values for the slider and the handle. 
    "$('.ba-draggable').css('left', widthValue);\n" +
    "$('.ba-resizable').css('width', widthValue);\n" +
    // Bind mouseup events to stop dragging.
    "}).on('mouseup.ba-events touchend.ba-events touchcancel.ba-events', function(){\n" +
    "dragElement.removeClass('ba-draggable');\n" +
    "resizeElement.removeClass('ba-resizable');\n" +
    // Unbind all events for performance
    "$(this).off('.ba-events'); \n" +
    "});\n" +
    "e.preventDefault();\n" +
    "});\n" +
    "}\n" +
    // Define plugin
    "$.fn.beforeAfter = function() {\n" +
    "var cur = this;\n" +
    // Adjust the slider
    "var width = cur.width()+'px';\n" +
    "cur.find('.resize img').css('width', width);\n" +
    // Bind dragging events
    "drags(cur.find('.handle'), cur.find('.resize'), cur);\n" +
    // Update sliders on resize. 
    // Because we all do this: i.imgur.com/YkbaV.gif
    "$(window).resize(function(){\n" +
    "var width = cur.width()+'px';\n" +
    "cur.find('.resize img').css('width', width);\n" +
    "});\n" +
    "}\n" +
    "}(jQuery));\n" +
    "</script>\n" +

    "</head>\n" +
    "<center>\n" +
    "<TITLE>IMAGE COMPARATOR     by RONC</TITLE>\n" +
    "</head>\n" +
    "<body bgcolor=#202020>\n" +
    "<table border='2'>\n" +
    "<tr>\n" +
    "<td colspan='3';>\n" +
    "<center>\n" +
    "<div style='font-size: 24px; font-weight: bold; font-style: italic;'>IMAGE COMPARATOR &nbsp;&nbsp;&nbsp;&nbsp;by RONC</div>\n" +
    scriptVersion + "\n" +
    " &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;\n" +
    "Using a modified version of Before-After.js Javascript\n" +
    "</center>\n" +
    "</td>\n" +
    "</tr>\n" +
    "<tr>\n" +
    "<td rowspan = '2' style='vertical-align:top'>\n" +
    "<pre>\n" +
    "&nbsp;&nbsp;" + uiCommentsL + "&nbsp;&nbsp;\n" +
    "</pre>\n" +
    "</td>\n" +
    "<td align='center' width = 'imageWidth + 10'  height ='imageHeight + 10'>\n" +

    "<table width = 'imageWidth + 10'  height ='imageHeight + 10'>\n" +
    "<tr>\n" +
    "<td>\n" +

    '<div class="ba-slider">\n' +
    '  <img src="ImageComparatorRight.png" width = "imageWidth"  height ="imageHeight">\n' +
    '  <div class="resize">\n' +
    '      <img src="ImageComparatorLeft.png" width = "imageWidth"  height ="imageHeight">\n' +
    '  </div>\n' +
    '  <span class="handle"></span>\n' +
    '</div>\n' +

    '<script type="text/javascript">\n' +
    '  $(".ba-slider").beforeAfter();\n' +
    '</script>\n' +

    "</td>\n" +
    "</tr>\n" +
    "</table>\n" +

    "</td>\n" +
    "<td rowspan = '2' style='vertical-align:top'>\n" +
    "<pre>\n" +
    "&nbsp;&nbsp;" + uiCommentsR + "&nbsp;&nbsp;\n" +
    "</pre>\n" +
    "</td>\n" +
    "</tr>\n" +
    "<tr>\n" +
    "<td>\n" +
    "<pre>\n" +
    "&nbsp;&nbsp;" + uiCommentsC + "&nbsp;&nbsp;\n" +
    "</pre>\n" +
    "</td>\n" +
    "</tr>\n" +
    "</table>\n" +
    "</center>\n" +
    "</body>\n" +
    "</html>";
  //alert("here", HTMLcode);
  try
  {
    var HTML = new File(uiFoldername + uiFilenameHtml);
    HTML.open("w");
    HTML.writeln(HTMLcode);
    HTML.close();
    HTML.execute();
  }
  catch (e)
  {
    alert("Error, Can Not Open " + uiFoldername + uiFilenameHtml + " in temp folder");
  };
}

main = function ()
{
  if (uiDone == 1) return;
  SelectLayerPNG();
  //alert("commentL", uiCommentsL);
  BuildWriteHTML();
  return;
};

if (hideLayerPalette == true) hideLayers();
if (hideHistoryPalette == true) app.activeDocument.suspendHistory(scriptName + ' END', 'main()');

"Image Comparator  " + uiDone
// EOF