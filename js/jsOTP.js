(function() {
  var Hotp, Totp;

  Totp = (function() {
    function Totp(expiry, length) {
      this.expiry = expiry != null ? expiry : 30;
      this.length = length != null ? length : 6;
      if (this.length > 8 || this.length < 6) {
        throw "Error: invalid code length";
      }
    }

    Totp.prototype.dec2hex = function(s) {
      return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
    };

    Totp.prototype.hex2dec = function(s) {
      return parseInt(s, 16);
    };

    Totp.prototype.base32tohex = function(base32) {
      var base32chars, bits, chunk, hex, i, val;
      base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
      bits = "";
      hex = "";
      i = 0;
      while (i < base32.length) {
        val = base32chars.indexOf(base32.charAt(i).toUpperCase());
        bits += this.leftpad(val.toString(2), 5, "0");
        i++;
      }
      i = 0;
      while (i + 4 <= bits.length) {
        chunk = bits.substr(i, 4);
        hex = hex + parseInt(chunk, 2).toString(16);
        i += 4;
      }
      return hex;
    };

    Totp.prototype.leftpad = function(str, len, pad) {
      if (len + 1 >= str.length) {
        str = Array(len + 1 - str.length).join(pad) + str;
      }
      return str;
    };

    Totp.prototype.getOtp = function(secret, now) {
      var epoch, hmac, key, offset, otp, shaObj, time;
      if (now == null) {
        now = new Date().getTime();
      }
      key = this.base32tohex(secret);
      epoch = Math.round(now / 1000.0);
      time = this.leftpad(this.dec2hex(Math.floor(epoch / this.expiry)), 16, "0");
      shaObj = new jsSHA("SHA-1", "HEX");
      shaObj.setHMACKey(key, "HEX");
      shaObj.update(time);
      hmac = shaObj.getHMAC("HEX");
      if (hmac === "KEY MUST BE IN BYTE INCREMENTS") {
        throw "Error: hex key must be in byte increments";
      } else {
        offset = this.hex2dec(hmac.substring(hmac.length - 1));
      }
      otp = (this.hex2dec(hmac.substr(offset * 2, 8)) & this.hex2dec("7fffffff")) + "";
      otp = otp.substr(otp.length - this.length, this.length);
      return otp;
    };

    return Totp;

  })();

  Hotp = (function() {
    function Hotp(length) {
      this.length = length != null ? length : 6;
      if (this.length > 8 || this.length < 6) {
        throw "Error: invalid code length";
      }
    }

    Hotp.prototype.uintToString = function(uintArray) {
      var decodedString, encodedString;
      encodedString = String.fromCharCode.apply(null, uintArray);
      decodedString = decodeURIComponent(escape(encodedString));
      return decodedString;
    };

    Hotp.prototype.getOtp = function(key, counter) {
      var digest, h, offset, shaObj, v;
      shaObj = new jsSHA("SHA-1", "TEXT");
      shaObj.setHMACKey(key, "TEXT");
      shaObj.update(this.uintToString(new Uint8Array(this.intToBytes(counter))));
      digest = shaObj.getHMAC("HEX");
      h = this.hexToBytes(digest);
      offset = h[19] & 0xf;
      v = (h[offset] & 0x7f) << 24 | (h[offset + 1] & 0xff) << 16 | (h[offset + 2] & 0xff) << 8 | h[offset + 3] & 0xff;
      v = v + '';
      return v.substr(v.length - this.length, this.length);
    };

    Hotp.prototype.intToBytes = function(num) {
      var bytes, i;
      bytes = [];
      i = 7;
      while (i >= 0) {
        bytes[i] = num & 255;
        num = num >> 8;
        --i;
      }
      return bytes;
    };

    Hotp.prototype.hexToBytes = function(hex) {
      var C, bytes, c;
      bytes = [];
      c = 0;
      C = hex.length;
      while (c < C) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
        c += 2;
      }
      return bytes;
    };

    return Hotp;

  })();

  window.jsOTP = {};

  jsOTP.totp = Totp;

  jsOTP.hotp = Hotp;

}).call(this);
