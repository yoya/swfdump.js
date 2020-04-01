"use strict";

document.addEventListener("DOMContentLoaded", function(event) {
    main();
});

function main() {
    dropFunction(document.body, swfdump);
}

function tableEntry(table, key, value) {
    const thead = table.children[0],
          tbody = table.children[1];
    const thead_tr = thead.children[0],
          tbody_tr = tbody.children[0];
    const th = document.createElement("th"),
          td = document.createElement("td")
    th.innerHTML = key;
    td.innerHTML = value;
    thead_tr.append(th);
    tbody_tr.append(td)
}

function swfdump(arr) {
    console.debug("swfdump:", arr);
    const bit = new Bit(arr);
    const display = document.getElementById("display");
    display.innerHTML = "";  // clear all elements in display
    const swfheader = document.getElementById("swfheader").cloneNode(true);
    swfheader.id = "";
    display.append(swfheader);
    let sig     = bit.string(3),
        ver     = bit.u8(),
        filelen = bit.u32();
    tableEntry(swfheader, "Signature" , sig);
    tableEntry(swfheader, "Version"   , ver);
    tableEntry(swfheader, "FileLength", filelen);
    const swfmovieheader = document.getElementById("swfmovieheader").cloneNode(true);
    swfmovieheader.id = "";
    display.append(swfmovieheader);
    const [xMin, xMax, yMin, yMax] = SWFRect(bit);
    const rate  = bit.u16(),
          count = bit.u16();
    tableEntry(swfmovieheader, "FrameSize" , "x:"+xMin+"..."+xMax+", y:"+yMin+"..."+yMax);
    tableEntry(swfmovieheader, "FrameRate" , rate / 0x100);
    tableEntry(swfmovieheader, "FrameCount", count);
}
