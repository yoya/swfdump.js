"use strict";

var TWIPS = 20;

document.addEventListener("DOMContentLoaded", function(event) {
    main();
});

function main() {
    dropFunction(document.body, swfdump);
}

function tableEntry(table, key, value) {
    var thead = table.children[0];
    var tbody = table.children[1];
    let thead_tr = thead.children[0];
    let tbody_tr = tbody.children[0];
    var th = document.createElement("th")
    var td = document.createElement("td")
    th.innerHTML = key;
    td.innerHTML = value;
    thead_tr.append(th);
    tbody_tr.append(td)
}

function swfdump(arr) {
    console.log("swfdump:", arr);
    let bit = new Bit(arr);
    let display = document.getElementById("display");
    display.innerHTML = "";  // clear all elements in display
    let swfheader = document.getElementById("swfheader").cloneNode(true);
    swfheader.id = "";
    display.append(swfheader);
    let sig     = bit.string(3),
        ver     = bit.u8(),
        filelen = bit.u32();
    tableEntry(swfheader, "Signature" , sig);
    tableEntry(swfheader, "Version"   , ver);
    tableEntry(swfheader, "FileLength", filelen);
    let swfmovieheader = document.getElementById("swfmovieheader").cloneNode(true);
    swfmovieheader.id = "";
    display.append(swfmovieheader);
    let rectBit = bit.ub(5),
        xMin = bit.sb(rectBit) / TWIPS,
        xMax = bit.sb(rectBit) / TWIPS,
        yMin = bit.sb(rectBit) / TWIPS,
        yMax = bit.sb(rectBit) / TWIPS;
    let rate  = bit.u16(),
        count = bit.u16();
    tableEntry(swfheader, "FrameSize" , "x:"+xMin+"..."+xMax+", y:"+yMin+"..."+yMax);
    tableEntry(swfheader, "FrameRate" , rate / 0x100);
    tableEntry(swfheader, "FrameCount", count);
}
