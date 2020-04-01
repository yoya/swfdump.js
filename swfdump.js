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
    let headerTable = document.getElementById("swfheader");
    let sig = bit.string(3), ver = bit.u8();
    tableEntry(headerTable, "signature", sig);
    tableEntry(headerTable, "version", ver);
}


function dropFunction(target, func) {
    var cancelEvent = function(e) {
        e.preventDefault();
        e.stopPropagation();
        return false;
    }
    target.addEventListener("dragover" , cancelEvent, false);
    target.addEventListener("dragenter", cancelEvent, false);
    target.addEventListener("drop"     , function(e) {
        e.preventDefault();
        e.stopPropagation();
        var file = e.dataTransfer.files[0];
        if (file) {
            var reader = new FileReader();
            reader.onload = function(e) {
                let arr = new Uint8Array(e.target.result);
                func(arr);
            }
            reader.readAsArrayBuffer(file);
        }
    }, false);
}
