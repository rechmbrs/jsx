//
//   REC-loadSymbols.js
//   Loading up the symbol definitions like this makes it possible
//   to include several of these generated files in one master file
//   provided a prefix is specified other than the default. It also
//   skips the definitions if PSConstants has already been loaded.
//

/*  // @include 'REC-loadSymbols.js' */


REC_loadSymbols = function ()
{
  var dbgLevel = $.level;
  $.level = 0;
  try
  {
    PSConstants;
    return; // only if PSConstants is defined
  }
  catch (e)
  {}
  finally
  {
    $.level = dbgLevel;
  }
  var needDefs = true;
  $.level = 0;
  try
  {
    PSClass;
    needDefs = false;
  }
  catch (e)
  {}
  finally
  {
    $.level = dbgLevel;
  }
  if (needDefs)
  {
    PSClass = function () {};
    PSEnum = function () {};
    PSEvent = function () {};
    PSForm = function () {};
    PSKey = function () {};
    PSType = function () {};
    PSUnit = function () {};
    PSString = function () {};
  }

  // We may still end up duplicating some of the following definitions
  // but at least we don't redefine PSClass, etc... and wipe out others

  PSClass.Brush = cTID('Brsh');
  PSClass.Channel = cTID('Chnl');
  PSClass.ColorSampler = cTID('ClSm');
  PSClass.Layer = cTID('Lyr ');
  PSClass.Mask = cTID('Msk ');
  PSClass.PencilTool = cTID('PcTl');
  PSClass.Pixel = cTID('Pxel');
  PSClass.Point = cTID('Pnt ');
  PSClass.PNGFormat = cTID('PNGF');
  PSClass.RawFormat = cTID('Rw  ');
  PSClass.RGBColor = cTID('RGBC');
  PSClass.SingleColumn = cTID('Sngc');
  PSClass.Version = cTID('Vrsn');

  PSEnum.AntiAliasNone = cTID('Anno');
  PSEnum.ForegroundColor = cTID('FrgC');
  PSEnum.Left = cTID('Left');
  PSEnum.Macintosh = cTID('Mcnt');
  PSEnum.Multiply = cTID('Mltp');
  PSEnum.PNGFilterAdaptive = cTID('PGAd');
  PSEnum.PNGInterlaceNone = cTID('PGIN');
  PSEnum.RGB = cTID('RGB ');
  PSEnum.Target = cTID('Trgt');

  PSEvent.Copy = cTID('copy');
  PSEvent.Delete = cTID('Dlt ');
  PSEvent.Duplicate = cTID('Dplc');
  PSEvent.Fill = cTID('Fl  ');
  PSEvent.Hide = cTID('Hd  ');
  PSEvent.Make = cTID('Mk  ');
  PSEvent.Move = cTID('move');
  PSEvent.PasteInto = cTID('PstI');
  PSEvent.Show = cTID('Shw ');
  //PSEvent.Rasterize = cTID('Rstr');
  PSEvent.Rasterize = sTID('rasterizeLayer');
  PSEvent.Save = cTID('save');
  PSEvent.Select = cTID('slct');
  PSEvent.Set = cTID('setd');
  PSEvent.Show = cTID('Shw ');

  PSKey.Adjustment = cTID('Adjs');
  PSKey.AntiAlias = cTID('AntA');
  PSKey.As = cTID('As  ');
  PSKey.BitDepth = cTID('BtDp');
  PSKey.Blue = cTID('Bl  ');
  PSKey.ByteOrder = cTID('BytO');
  PSKey.ChannelsInterleaved = cTID('ChnI');
  PSKey.Calculation = cTID('Clcl');
  PSKey.Color = cTID('Clr ');
  PSKey.Compression = cTID('Cmpr');
  PSKey.Copy = cTID('Cpy ');
  PSKey.Depth = cTID('Dpth');
  PSKey.DocumentID = cTID('DocI');
  PSKey.FileCreator = cTID('FlCr');
  PSKey.From = cTID('From');
  PSKey.Green = cTID('Grn ');
  PSKey.Header = cTID('Hdr ');
  PSKey.Height = cTID('Hght');
  PSKey.Horizontal = cTID('Hrzn');
  PSKey.ID = cTID('Idnt');
  PSKey.In = cTID('In  ');
  PSKey.LayerID = cTID('LyrI');
  PSKey.MakeVisible = cTID('MkVs');
  PSKey.Mode = cTID('Md  ');
  PSKey.Name = cTID('Nm  ');
  PSKey.NumberOfChannels = cTID('NmbO');
  PSKey.PNGFilter = cTID('PNGf');
  PSKey.PNGInterlaceType = cTID('PGIT');
  PSKey.Position = cTID('Pstn');
  PSKey.Radius = cTID('Rds ');
  PSKey.Red = cTID('Rd  ');
  PSKey.RetainHeader = cTID('RtnH');
  PSKey.Target = cTID('null');
  PSKey.To = cTID('T   ');
  PSKey.Transparency = cTID('Trns');
  PSKey.Tolerance = cTID('Tlrn');
  PSKey.Type = cTID('Type');
  PSKey.UserMaskEnabled = cTID('UsrM');
  PSKey.UserMaskLinked = cTID('Usrs');
  PSKey.Using = cTID('Usng');
  PSKey.Vertical = cTID('Vrtc');
  PSKey.What = cTID('What');
  PSKey.Width = cTID('Wdth');
  PSKey.With = cTID('With');

  PSString.addToSelection = sTID('addToSelection');
  PSString.blendDivide = sTID('blendDivide');
  PSString.contentLayer = sTID('contentLayer');
  PSString.Copy = sTID('copy');
  PSString.layerStyle = sTID('layerStyle');
  PSString.linearDodge = sTID('linearDodge');
  PSString.masterDiameter = sTID('masterDiameter');
  PSString.mergeLayers = sTID('mergeLayersNew');
  PSString.pasteInto = sTID('pasteInto');
  PSString.rasterizeItem = sTID('rasterizeItem');
  PSString.selection = sTID('selection');
  PSString.selectionModifier = sTID('selectionModifier');
  PSString.selectionModifierType = sTID('selectionModifierType');
  PSString.solidColorLayer = sTID('solidColorLayer');

  PSType.AntiAlias = cTID('Annt');
  PSType.BlendMode = cTID('BlnM');
  PSType.Calculation = cTID('Clcn');
  PSType.FillContents = cTID('FlCn');
  PSType.HorizontalLocation = cTID('HrzL');
  PSType.Ordinal = cTID('Ordn');
  PSType.Platform = cTID('Pltf');
  PSUnit.Distance = cTID('#Rlt');
  PSUnit.Pixels = cTID('#Pxl');
};

REC_loadSymbols(); // load up our symbols
//