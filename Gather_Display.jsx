// Gather_Display.jsx
#target photoshop
app.bringToFront();

var scriptName = 'GATHER DISPLAY  by RONC';
var scriptVersion = 'V0.928-21May2017';
var scriptAuthor = ''; //'Ron Chambers';
var scriptAbstract = 'Gather Display - reordering to common x-ordinal gathers';

/*
    Copyright <2017> <Ron Chambers>               MIT License

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

// Includes an external .js file
// @include 'REC-global_lib.js' 
//
// Dialog
//
var uiSeparatorLine = '________________________________________________________________________________________';
var uiSeparator = 1;
var uiSampling = 1;
var uiDone = 0;

var dlg = new Window('dialog', scriptName + '  ' + scriptVersion);
dlg.alignment = "center";
dlg.openPnl = dlg.add('panel', undefined, scriptAuthor);
var bga = dlg.openPnl.add("group");
bga.orientation = "column";
bga.alignment = "center";
txt1 = bga.add('statictext', undefined, scriptAbstract);
txt2 = bga.add('statictext', undefined, uiSeparatorLine);

var cb = dlg.openPnl.add("group");
cb.orientation = "row";
cb.alignment = "center";
cb1 = cb.add("checkbox", undefined, "SEPARATOR (YES/no)");
cb1.helpTip = 'SEPARATOR - place a vertical line between gathers';
cb1.value = true;
cb1.onClick = doSeparator;
cb2 = cb.add("checkbox", undefined, "SAMPLING (ALL/periodic)");
cb2.helpTip = 'SAMPLING - display all gathers or every nth gather';
cb2.value = true;
cb2.onClick = doSampling;
var dda= dlg.openPnl.add("group");
dda.orientation = "column";
dda.alignment = "center";
txt3 = dda.add ("statictext", undefined, uiSeparatorLine);

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
txt2 = bgb.add('statictext', undefined, '(ESC key cancels during execution)');

dlg.show();

function doSeparator()
{
    // alert("Congratulations - it all worked!");
    uiSeparator = 1 - uiSeparator;
    return;
}

function doSampling()
{
    // alert("Congratulations - it all worked!");
    uiSampling = 1 - uiSampling;
    return;
}

function dobuild()
{
    // alert("Congratulations - it all worked!");
    dlg.close();
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
    openURL("Gather_Display-help.html");
    uiDone = 1;
    dlg.close();
    return;
}

function openURL(url)
{
    var fname = "shortcut.url";
    var shortcut = new File(Folder.temp + '/' + fname);
    shortcut.open('w');
    shortcut.writeln('[InternetShortcut]');
    shortcut.writeln('URL=' + url);
    shortcut.writeln();
    shortcut.close();
    shortcut.execute();
    shortcut.remove();
};

// @include 'REC-layers_lib.js' 
hideLayerPalette = true;
hideHistoryPalette = true;
if (hideLayerPalette == true) hideLayers();

cTID = function (s)
{
    return app.charIDToTypeID(s);
};
sTID = function (s)
{
    return app.stringIDToTypeID(s);
};

//
//==================== Gather_Display ==============
//

var doc = activeDocument;
var os = $.os.toLowerCase().indexOf('mac') >= 0 ? "MAC" : "WINDOWS";
var tempFolder = Folder.temp;
var tempFile = tempFolder + "01.raw";
var width = doc.width;
var height = doc.height;
var width = Math.round(doc.width.value);
var height = Math.round(doc.height.value);

// layer names

var layerNum = doc.layers.length;
var layerNames = [];
var sepNum = uiSeparator; //
var totalNum = layerNum + sepNum;
var locName;
var locX;
var locXinc = 1; //
if (uiSampling == 0) locXinc = totalNum;
var nl = 0;
var nx = 0;
var newWidth;
//prompt("Layers number:", layerNum);
for (var i = 0; i < layerNum; i++)
{
    layerNames[i] = doc.layers[layerNum - i - 1].name;
}
//prompt("Layers Names:", layerNames);

if (uiSampling == 1) newWidth = width * totalNum - sepNum;
if (uiSampling == 0) newWidth = Math.ceil(width / totalNum) * locXinc - sepNum;
//prompt("Layers width:", newWidth);

var color = app.foregroundColor;
color.rgb.red = 0.0;
color.rgb.green = 0.0;
color.rgb.blue = 0.0;
app.foregroundColor = color;

var channels = doc.activeChannels;
var numberChannels = channels.length;
var headerLength = 0;
var docBits = 8;
if (doc.bitsPerChannel == BitsPerChannelType.SIXTEEN)
    docBits = 16;
if (doc.bitsPerChannel == BitsPerChannelType.THIRTYTWO)
    docBits = 32;

function hex2float(num)
{
    var sign = (num & 0x80000000) ? -1 : 1;
    var exponent = ((num >> 23) & 0xff) - 127;
    var mantissa = 1 + ((num & 0x7fffff) / 0x7fffff);
    return sign * mantissa * Math.pow(2, exponent);
}

function Gather_Display()
{
    // Make
    function step01(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putClass(PSString.contentLayer);
        desc1.putReference(PSKey.Target, ref1);
        var desc2 = new ActionDescriptor();
        var desc3 = new ActionDescriptor();
        var desc4 = new ActionDescriptor();
        desc4.putDouble(PSKey.Red, 0.0);
        desc4.putDouble(PSKey.Green, 0.0);
        desc4.putDouble(PSKey.Blue, 0.0);
        desc3.putObject(PSKey.Color, PSClass.RGBColor, desc4);
        desc2.putObject(PSKey.Type, PSString.solidColorLayer, desc3);
        desc2.putString(PSKey.Name, "Gather_Display");
        desc1.putObject(PSKey.Using, PSString.contentLayer, desc2);
        executeAction(PSEvent.Make, desc1, dialogMode);
    };

    // Canvas Size
    function step02(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        desc1.putUnitDouble(PSKey.Width, PSUnit.Pixels, newWidth);
        desc1.putEnumerated(PSKey.Horizontal, PSType.HorizontalLocation, PSEnum
            .Left);
        executeAction(sTID('canvasSize'), desc1, dialogMode);
    };

    // Select
    function step03(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Channel, PSClass.Channel, PSClass.Mask);
        desc1.putReference(PSKey.Target, ref1);
        executeAction(PSEvent.Select, desc1, dialogMode);
    };

    // Delete
    function step04(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Channel, PSType.Ordinal, PSEnum.Target);
        desc1.putReference(PSKey.Target, ref1);
        executeAction(PSEvent.Delete, desc1, dialogMode);
    };

    // Rasterize
    function step05(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
        desc1.putReference(PSKey.Target, ref1);
        executeAction(PSEvent.Rasterize, desc1, dialogMode);
    };

    // Move
    function step06(enabled, withDialog)
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
        executeAction(PSEvent.Move, desc1, dialogMode);
    };

    // Set
    function step07(enabled, withDialog)
    {
        if (enabled != undefined && !enabled)
            return;
        var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
        var desc1 = new ActionDescriptor();
        var ref1 = new ActionReference();
        ref1.putEnumerated(PSClass.Layer, PSType.Ordinal, PSEnum.Target);
        desc1.putReference(PSKey.Target, ref1);
        desc1.putBoolean(PSKey.MakeVisible, false);
        var desc2 = new ActionDescriptor();
        desc2.putString(PSKey.Name, "Gather_Display");
        desc1.putObject(PSKey.To, PSClass.Layer, desc2);
        executeAction(PSEvent.Set, desc1, dialogMode);
    };


    step01(); // Make
    step02(); // Canvas Size  
    step03(); // Select
    step04(); // Delete
    step05(); // Rasterize
    step06(); // Move
    step07(); // Set

		// Select
		function step30(enabled, withDialog)
		{
				if (enabled != undefined && !enabled)
						return;
				var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
				var desc1 = new ActionDescriptor();
				var ref1 = new ActionReference();
				ref1.putName(PSClass.Layer, locName);
				desc1.putReference(PSKey.Target, ref1);
				desc1.putBoolean(PSKey.MakeVisible, false);
				var list1 = new ActionList();
				list1.putInteger(26);
				desc1.putList(PSKey.LayerID, list1);
				executeAction(PSEvent.Select, desc1, dialogMode);
		};

		// Set
		function step31(enabled, withDialog)
		{
				if (enabled != undefined && !enabled)
						return;
				var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
				var desc1 = new ActionDescriptor();
				var ref1 = new ActionReference();
				ref1.putProperty(PSClass.Channel, PSString.selection);
				desc1.putReference(PSKey.Target, ref1);
				var desc2 = new ActionDescriptor();
				desc2.putUnitDouble(PSEnum.Left, PSUnit.Pixels, nx);
				desc1.putObject(PSKey.To, PSClass.SingleColumn, desc2);
				executeAction(PSEvent.Set, desc1, dialogMode);
		};

		// Copy
		function step32(enabled, withDialog)
		{
				if (enabled != undefined && !enabled)
						return;
				var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
				executeAction(PSEvent.Copy, undefined, dialogMode);
		};

		// Show
		function step33(enabled, withDialog)
		{
				if (enabled != undefined && !enabled)
						return;
				var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
				var desc1 = new ActionDescriptor();
				var list1 = new ActionList();
				var ref1 = new ActionReference();
				ref1.putName(PSClass.Layer, "Gather_Display");
				list1.putReference(ref1);
				desc1.putList(PSKey.Target, list1);
				executeAction(PSEvent.Show, desc1, dialogMode);
		};

		// Select
		function step34(enabled, withDialog)
		{
				if (enabled != undefined && !enabled)
						return;
				var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
				var desc1 = new ActionDescriptor();
				var ref1 = new ActionReference();
				ref1.putName(PSClass.Layer, "Gather_Display");
				desc1.putReference(PSKey.Target, ref1);
				desc1.putBoolean(PSKey.MakeVisible, false);
				var list1 = new ActionList();
				list1.putInteger(381);
				desc1.putList(PSKey.LayerID, list1);
				executeAction(PSEvent.Select, desc1, dialogMode);
		};

		// Set
		function step35(enabled, withDialog)
		{
				if (enabled != undefined && !enabled)
						return;
				var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
				var desc1 = new ActionDescriptor();
				var ref1 = new ActionReference();
				ref1.putProperty(PSClass.Channel, PSString.selection);
				desc1.putReference(PSKey.Target, ref1);
				var desc2 = new ActionDescriptor();
				desc2.putUnitDouble(PSEnum.Left, PSUnit.Pixels, locX);
				desc1.putObject(PSKey.To, PSClass.SingleColumn, desc2);
				executeAction(PSEvent.Set, desc1, dialogMode);
		};

		// Paste Into
		function step36(enabled, withDialog)
		{
				if (enabled != undefined && !enabled)
						return;
				var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
				var desc1 = new ActionDescriptor();
				desc1.putEnumerated(PSKey.AntiAlias, PSType.AntiAlias, PSEnum.AntiAliasNone);
				desc1.putClass(PSKey.As, PSClass.Pixel);
				executeAction(sTID('pasteInto'), desc1, dialogMode);
		};

		// Merge Layers
		function step37(enabled, withDialog)
		{
				if (enabled != undefined && !enabled)
						return;
				var dialogMode = (withDialog ? DialogModes.ALL : DialogModes.NO);
				var desc1 = new ActionDescriptor();
				executeAction(sTID('mergeLayersNew'), desc1, dialogMode);
		};
		
    for (nl = 0; nl < layerNum; nl = nl + 1)
    {
        locName = layerNames[nl];
        //prompt("locName:", locName);

        for (nx = 0; nx < width; nx = nx + locXinc)
        {
            locX = nl + (nx * totalNum) / locXinc;
            //prompt("locX:", locX);

            step30(); // Select
            step31(); // Set
            step32(); // Copy
            step33(); // Show
            step34(); // Select
            step35(); // Set
            step36(); // Paste Into
            step37(); // Merge Layers
        }
    }
};
//
// loadSymbols
//   Loading up the symbol definitions like this makes it possible
//   to include several of these generated files in one master file
//   provided a prefix is specified other than the default. It also
//   skips the definitions if PSConstants has already been loaded.
//
// @include 'REC-loadSymbols.js' // load up our symbols

//
//=========================================
//                    Gather_Display.main
//=========================================
//

Gather_Display.main = function ()
{
    if (uiDone == 1) return;
    Gather_Display();
};

if (hideLayerPalette == true) hideLayers();
if (hideHistoryPalette == true) app.activeDocument.suspendHistory(scriptName +
    ' END', 'Gather_Display.main()');
//Gather_Displaymain();

// EOF

"Gather_Display  " + uiDone
// EOF