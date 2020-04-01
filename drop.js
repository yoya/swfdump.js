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
