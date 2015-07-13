(function() {
  var TotpManager;

  TotpManager = (function() {
    function TotpManager(expiry, length) {
      this.expiry = expiry != null ? expiry : 30;
      this.length = length != null ? length : 6;
      if (this.length > 8 || this.length < 6) {
        throw "Error: invalid code length";
      }
    }

    TotpManager.prototype.dec2hex = function(s) {
      return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
    };

    TotpManager.prototype.hex2dec = function(s) {
      return parseInt(s, 16);
    };

    TotpManager.prototype.base32tohex = function(base32) {
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

    TotpManager.prototype.leftpad = function(str, len, pad) {
      if (len + 1 >= str.length) {
        str = Array(len + 1 - str.length).join(pad) + str;
      }
      return str;
    };

    TotpManager.prototype.getOtp = function(secret) {
      var epoch, hmac, hmacObj, key, offset, otp, time;
      key = this.base32tohex(secret);
      epoch = Math.round(new Date().getTime() / 1000.0);
      time = this.leftpad(this.dec2hex(Math.floor(epoch / this.expiry)), 16, "0");
      hmacObj = new jsSHA(time, "HEX");
      hmac = hmacObj.getHMAC(key, "HEX", "SHA-1", "HEX");
      if (hmac === "KEY MUST BE IN BYTE INCREMENTS") {
        throw "Error: hex key must be in byte increments";
      } else {
        offset = this.hex2dec(hmac.substring(hmac.length - 1));
      }
      otp = (this.hex2dec(hmac.substr(offset * 2, 8)) & this.hex2dec("7fffffff")) + "";
      otp = otp.substr(otp.length - this.length, this.length);
      return otp;
    };

    return TotpManager;

  })();

  window.TotpManager = TotpManager;

}).call(this);
