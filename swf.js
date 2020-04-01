"use strict";

var TWIPS = 20;

function SWFRect(bit) {
    let rectBit = bit.ub(5),
        xMin = bit.sb(rectBit) / TWIPS,
        xMax = bit.sb(rectBit) / TWIPS,
        yMin = bit.sb(rectBit) / TWIPS,
        yMax = bit.sb(rectBit) / TWIPS;
    return [xMin, xMax, yMin, yMax];
}
