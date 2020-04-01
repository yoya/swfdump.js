"use strict";

function Bit(arr) {
    var offset = 0;
    var bitOffset = 0;
    this.__proto__ = {
        carryup: function() {
            while (bitOffset > 7) {
                bitOffset -= 8;  offset++;
            }
        },
        align: function() {
            this.carryup();
            if (bitOffset > 0) {
                bitOffset = 0;  offset++;
            }
        },
        bit: function() {
            this.carryup();
            console.log(bitOffset);
            return (arr[offset] >> (7 - bitOffset++)) & 1;
        },
        ub: function(n) {
            let v = 0;
            while (n-- > 0) {
                v = (v << 1) + this.bit();
                console.log(v);
            }
            return v;
        },
        sb: function(n) {
            let v = this.ub(n);
            return v;
            if (v & (1 << (n-1))) {
                v -= (1 << n);
            }
            return v;
        },
        u8: function() {
            console.debug("u8()", arr, offset, arr[offset]);
            this.align();
            return arr[offset++];
        },
        u16: function() {
            this.align();
            return arr[offset++] + (arr[offset++] << 8);
        },
        u32: function() {
            this.align();
            return arr[offset++] + (arr[offset++] << 8) +
                (arr[offset++] << 16) + (arr[offset++] << 24);
        },
        string: function(n) {
            let data = []
            while (n--) {
                data.push(String.fromCharCode(this.u8()));
            }
            return data.join("");
        },
    }
}
