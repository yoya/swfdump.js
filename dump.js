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

function tableFooter(table) {
    let thead = table.children[0];
    if (table.children.length > 2) { // with caption
        thead = table.children[1];
    }
    const thead_tr = thead.children[0];
    const colSpan = thead_tr.children.length;
    const tfoot = document.createElement("tfoot");
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = colSpan;
    table.append(tfoot);
    tfoot.append(tr);
    tr.append(td);
    return td;
}


function swfdump(arr) {
    console.debug("swfdump:", arr);
    let bit = new Bit(arr);
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
    //
    if (sig === "FWS") {
        // nothing to do
    } else if (sig === "CWS") {
        const inflate = new Zlib.Inflate(arr.subarray(8));
        bit = new Bit(inflate.decompress());
    } else {
        console.error("Signature:"+sig+" not supported yet");
        return ;
    }
    //
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
    swfdump_tags(display, bit, false);
}

function swfdump_tags(display, bit, inSprite) {
    let prevCode = null;
    while (bit.has(2)) {
        let [code, length] = SWFTagHeader(bit);
        let contentOffset = bit.offset();
        let tagType = SWFTagType(code);
        let swftag_id = ["swfunknowntag","swfdefinitiontag", "swfoveralltag",
                         "swfplaylisttag", "swfactiontag" ] [tagType];
        const swftag = document.getElementById(swftag_id).cloneNode(true);
        swftag.className = swftag.id;
        swftag.id = "";
        let style = "";
        if (! inSprite) {
            style = "margin: 2px ;";
        }
        if ((code !== 1/*ShowFrame*/) || inSprite) {
            style += "float: left ;";
        }
        swftag.style = style;
        display.append(swftag);
        tableEntry(swftag, "Code", SWFTagName(code)+"("+code+")");
        tableEntry(swftag, "Length", length);
        if (code === 39) {
            let spriteId   = bit.u16();
            let frameCount = bit.u16();
            tableEntry(swftag, "SpriteId", spriteId);
            tableEntry(swftag, "FrameCount", frameCount);
            var td = tableFooter(swftag);
            swfdump_tags(td, bit, true);
        }
        if (code === 0/*End*/) {
            break ;
        }
        bit.seek(contentOffset + length);
        prevCode = code;
    }
}
