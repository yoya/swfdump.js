"use strict";


document.addEventListener("DOMContentLoaded", function(event) {
    main();
});

function main() {
    dropFunction(document.body, swfdump);
}

function tableEntry(table, key, value) {
    console.log(table);
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
    for (let e of display.children) {  // clear elements in display
        display.removeChild(e);
    }
    let swfheader = document.getElementById("swfheader").cloneNode(true);
    swfheader.id = "";
    display.append(swfheader);
    let sig     = bit.string(3),
        ver     = bit.u8(),
        filelen = bit.u32();
    tableEntry(swfheader, "Signature" , sig);
    tableEntry(swfheader, "Version"   , ver);
    tableEntry(swfheader, "FileLength", filelen);
}
