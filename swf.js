"use strict";

const TWIPS = 20;

const SWFUnknownTag         = 0;
const SWFDefinitionTag      = 1;
const SWFOverallControlTag  = 2;
const SWFPlayListControlTag = 3;
const SWFActionControlTag   = 4;

const SWFDefinitionTags = [
    2/*DefineShape*/, 6/*DefineBits*/, 7/*DefineButton*/,
    8/*JEGTables*/, 10/*DefineFont*/, 11/*DefineText*/, 13/*DefineFontInfo*/,
    14/*DefineSound*/, 17/*DefineButtonSound*/,
    18/*SoundStreamHead*/, 19/*SoundStreamBlock*/,
    20/*DefineBitsLossless*/,  21/*DefineBitsJPEG2*/,
    22/*DefineShape2*/, 23/*DefineButtonCxform*/, 32/*DefineShape3*/,
    33/*DefineText2*/, 34/*DefineButton2*/,
    35/*DefineBitsJPEG3*/, 36/*DefineBitsLossless2*/,
    37/*DefineEditText*/, 39/*DefineSprite*/, 45/*SoundStreamHead2*/,
    46/*DefineMorphShape*/, 48/*DefineFont2*/,
    60/*DefineVideoStream*/, 61/*VideoFrame*/,
    62/*DefineFontInfo2*/, 73/*DefineFontAlignZones*/, 74/*CSMTextSettings*/,
    75/*DefineFont3*/, 78/*DefineScalingGrid*/,
    83/*DefineShape4*/, 84/*DefineMorphShape2*/,
    86/*DefineSceneAndFrameLabelData*/, 87/*DefineBinaryData*/,
    88/*DefineFontName*/, 88/*DefineFontName*/,
    90/*DefineBitsJPEG4*/, 91/*DefineFont4*/,
];

const SWFOverallControlTags = [
    0/*End*/,
    9/*SetBackgroundColor*/,
    24/*Protect*/, 43/*FrameLabel*/,
    56/*ExportAsset*/, 57/*ImportAssets*/, 58/*EnableDebugger*/,
    64/*EnableDebugger2*/, 65/*ScriptLimits*/, 66/*SetTabIndex*/,
    69/*FileAttributes*/, 71/*ImportAssets2*/, 77/*MetaData*/,
];

const SWFPlayListControlTags = [
    1/*ShowFrame*/, 4/*PlaceObject*/, 5/*RemoveObject*/, 15/*StartSound*/,
    26/*PlaceObject2*/, 28/*RemoveObject2*/, 70/*PlaceObject3*/,
    89/*StartSound2*/
];

const SWFActionControlTags = [
    12/*DoAction*/, 59/*DoInitAction*/,
    76/*SymbolClass*/, 82/*DoABC*/
];

const SWFTags = {
    // id => name, function
    0: ["End"],
    1: ["ShowFrame"],
    2: ["DefineShape"],
    3: ["FreeCharacter"], // 3 missing private use
    4: ["PlaceObject"],
    5: ["RemoveObject"],
    6: ["DefineBits"],
    7: ["DefineButton"],
    8: ["JEGTables"],
    9: ["SetBackgroundColor"],
    10: ["DefineFont"],
    11: ["DefineText"],
    12: ["DoAction"],
    13: ["DefineFontInfo"],
    14: ["DefineSound"],
    15: ["StartSound"],
    // 16 missing
    17: ["DefineButtonSound"],
    18: ["SoundStreamHead"],
    19: ["SoundStreamBlock"],
    20: ["DefineBitsLossless"],
    21: ["DefineBitsJPEG2"],
    22: ["DefineShape2"],
    23: ["DefineButtonCxform"],
    24: ["Protect"],
    // 25 missing
    26: ["PlaceObject2"],
    // 27 missing
    28: ["RemoveObject2"],
    // 29,30,31 missing
    32: ["DefineShape3"],
    33: ["DefineText2"],
    34: ["DefineButton2"],
    35: ["DefineBitsJPEG3"],
    36: ["DefineBitsLossless2"],
    37: ["DefineEditText"],
    // 38 miggin
    39: ["DefineSprite"],
    // 40,41,42 missing
    43: ["FrameLabel"],
    // 44 missing
    45: ["SoundStreamHead2"],
    46: ["DefineMorphShape"],
    48: ["DefineFont2"],
    56: ["ExportAssets"],
    57: ["ImportAssets"],
    58: ["EnableDebugger"],
    59: ["DoInitAction"],
    60: ["DefineVideoStream"],
    61: ["VideoFrame"],
    62: ["DefineFontInfo2"],
    // 63 missing
    64: ["EnableDebugger2"],
    65: ["ScriptLimits"],
    66: ["SetTabIndex"],
    // 67,68 missing
    69: ["FileAttributes"],
    70: ["PlaceObject3"],
    71: ["ImportAssets2"],
    // 72 missing
    73: ["DefineFontAlignZones"],
    74: ["CSMTextSettings"],
    75: ["DefineFont3"],
    76: ["SymbolClass"],
    77: ["MetaData"],
    78: ["DefineScalingGrid"],
    // 79,80,81 missing
    82: ["DoABC"],
    83: ["DefineShape4"],
    84: ["DefineMorphShape2"],
    // 85 missing
    86: ["DefineSceneAndFrameLabelData"],
    87: ["DefineBinaryData"],
    88: ["DefineFontName"],
    88: ["DefineFontName"],
    89: ["StartSound2"],
    90: ["DefineBitsJPEG4"],
    91: ["DefineFont4"],
    777: ["Reflex"], // swftools
}

function SWFTagName(id) {
    return SWFTags[id][0];
}

function SWFTagType(code) {
    if (SWFDefinitionTags.indexOf(code) >= 0) {
        return SWFDefinitionTag;
    } else if (SWFOverallControlTags.indexOf(code) >= 0) {
        return SWFOverallControlTag;
    } else if (SWFPlayListControlTags.indexOf(code) >= 0) {
        return SWFPlayListControlTag;
    } else if (SWFActionControlTags.indexOf(code) >= 0) {
        return SWFActionControlTag;
    }
    return SWFUnknownTag;
}

/*
  type
*/
function SWFRect(bit) {
    const rectBit = bit.ub(5),
          xMin = bit.sb(rectBit) / TWIPS,
          xMax = bit.sb(rectBit) / TWIPS,
          yMin = bit.sb(rectBit) / TWIPS,
          yMax = bit.sb(rectBit) / TWIPS;
    this.__proto__ = {
        string: function() {
            return "X:"+xMin+"..."+xMax+", Y:"+yMin+"..."+yMax;
        }
    }
    return this;
}

/*
  basic structure
*/

function SWFTagHeader(bit) {
    const tag_and_length = bit.u16();
    const tag = tag_and_length >> 6;
    let length = tag_and_length & 0x3f;
    if (length == 0x3f) {
        length = bit.u32();
    }
    return [tag, length];
}
