"use strict";

document.addEventListener("DOMContentLoaded", function(event) {
    main();
});

function main() {
    dropFunction(document.body, swfdump);
}

function tableEntry(table, key, value) {
    let thead = table.children[0];
    let tbody  = table.children[1];
    if (table.children.length > 2) { // with caption
        thead = table.children[1];
        tbody = table.children[2];
    }
    const thead_tr = thead.children[0],
          tbody_tr = tbody.children[0];
    const th = document.createElement("th"),
          td = document.createElement("td");
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
    swfheader.style = "float:left";
    display.append(swfheader);
    let sig     = bit.string(3),
        ver     = bit.u8(),
        filelen = bit.u32();
    tableEntry(swfheader, "Signature" , sig);
    tableEntry(swfheader, "Version"   , ver);
    tableEntry(swfheader, "FileLength", filelen);
    const swfmovieheader = document.getElementById("swfmovieheader").cloneNode(true);
    swfmovieheader.id = "";
    // swfmovieheader.style = "float:left";
    display.append(swfmovieheader);
    const rect = new SWFRect(bit);
    const rate  = bit.u16(),
          count = bit.u16();
    tableEntry(swfmovieheader, "FrameSize" , rect.string());
    tableEntry(swfmovieheader, "FrameRate" , rate / 0x100);
    tableEntry(swfmovieheader, "FrameCount", count);
    swfdump_tags(display, bit, 0);
}

function swfdump_tags(display, bit, count) {
    let prevCode = null;
    while (bit.has(2)) {
        let [code, length] = SWFTagHeader(bit);
        let tagType = SWFTagType(code);
        let swftag_id = ["swfunknowntag","swfdefinitiontag", "swfoveralltag",
                         "swfplaylisttag", "swfactiontag" ] [tagType];
        const swftag = document.getElementById(swftag_id).cloneNode(true);
        swftag.className = swftag.id;
        swftag.id = "";
        if (code !== 1) {
            swftag.style = "float:left";
        }
        display.append(swftag);
        tableEntry(swftag, "Code", SWFTagName(code)+"("+code+")");
        tableEntry(swftag, "Length", length);
        bit.seek(bit.offset() + length);
        prevCode = code;
    }
}
