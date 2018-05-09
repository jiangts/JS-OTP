(function() {
  var Hotp, Totp;

  Totp = class Totp {
    // pass in the secret, code dom element, ticker dom element
    constructor(expiry = 30, length = 6) {
      this.expiry = expiry;
      this.length = length;
      // validate input
      if (this.length > 8 || this.length < 6) {
        throw "Error: invalid code length";
      }
    }

    dec2hex(s) {
      return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
    }

    hex2dec(s) {
      return parseInt(s, 16);
    }

    base32tohex(base32) {
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
    }

    leftpad(str, len, pad) {
      if (len + 1 >= str.length) {
        str = Array(len + 1 - str.length).join(pad) + str;
      }
      return str;
    }

    getOtp(secret, now = new Date().getTime()) {
      var epoch, hmac, key, offset, otp, shaObj, time;
      key = this.base32tohex(secret);
      epoch = Math.round(now / 1000.0);
      time = this.leftpad(this.dec2hex(Math.floor(epoch / this.expiry)), 16, "0");
      shaObj = new jsSHA("SHA-1", "HEX");
      shaObj.setHMACKey(key, "HEX");
      shaObj.update(time);
      hmac = shaObj.getHMAC("HEX");
      // hmacObj = new jsSHA(time, "HEX")  # Dependency on sha.js
      // hmac = hmacObj.getHMAC(key, "HEX", "SHA-1", "HEX")
      if (hmac === "KEY MUST BE IN BYTE INCREMENTS") {
        throw "Error: hex key must be in byte increments";
      } else {
        // return null
        offset = this.hex2dec(hmac.substring(hmac.length - 1));
      }
      otp = (this.hex2dec(hmac.substr(offset * 2, 8)) & this.hex2dec("7fffffff")) + "";
      if (otp.length > this.length) {
        otp = otp.substr(otp.length - this.length, this.length);
      } else {
        otp = this.leftpad(otp, this.length, "0");
      }
      return otp;
    }

  };

  Hotp = class Hotp {
    constructor(length = 6) {
      this.length = length;
      // validate input
      if (this.length > 8 || this.length < 6) {
        throw "Error: invalid code length";
      }
    }

    // stuck on this for a long time. Use JSON.stringify to inspect uintToString output!!
    uintToString(uintArray) {
      var decodedString, encodedString;
      encodedString = String.fromCharCode.apply(null, uintArray);
      decodedString = decodeURIComponent(escape(encodedString));
      return decodedString;
    }

    getOtp(key, counter) {
      var digest, h, offset, shaObj, v;
      shaObj = new jsSHA("SHA-1", "TEXT");
      shaObj.setHMACKey(key, "TEXT");
      shaObj.update(this.uintToString(new Uint8Array(this.intToBytes(counter))));
      digest = shaObj.getHMAC("HEX");
      // Get byte array
      h = this.hexToBytes(digest);
      
      // Truncate
      offset = h[19] & 0xf;
      v = (h[offset] & 0x7f) << 24 | (h[offset + 1] & 0xff) << 16 | (h[offset + 2] & 0xff) << 8 | h[offset + 3] & 0xff;
      v = v + '';
      return v.substr(v.length - this.length, this.length);
    }

    intToBytes(num) {
      var bytes, i;
      bytes = [];
      i = 7;
      while (i >= 0) {
        bytes[i] = num & 255;
        num = num >> 8;
        --i;
      }
      return bytes;
    }

    hexToBytes(hex) {
      var C, bytes, c;
      bytes = [];
      c = 0;
      C = hex.length;
      while (c < C) {
        bytes.push(parseInt(hex.substr(c, 2), 16));
        c += 2;
      }
      return bytes;
    }

  };

  window.jsOTP = {};

  jsOTP.totp = Totp;

  jsOTP.hotp = Hotp;

}).call(this);
