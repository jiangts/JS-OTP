(function() {
  var TotpManager,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  TotpManager = (function() {
    function TotpManager(secret, codeEl, tickEl, expiry, length) {
      this.expiry = expiry != null ? expiry : 30;
      this.length = length != null ? length : 6;
      this.timer = __bind(this.timer, this);
      if (this.length > 8 || this.length < 6) {
        throw "invalid code length";
      }
      this.accounts = [];
      this.add(secret, codeEl, tickEl);
      setInterval(this.timer, 1000);
      return;
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
      console.log("time var is " + time);
      hmacObj = new jsSHA(time, "HEX");
      console.log("key var is " + key);
      hmac = hmacObj.getHMAC(key, "HEX", "SHA-1", "HEX");
      if (hmac === "KEY MUST BE IN BYTE INCREMENTS") {
        throw "Error creating code";
      } else {
        offset = this.hex2dec(hmac.substring(hmac.length - 1));
      }
      otp = (this.hex2dec(hmac.substr(offset * 2, 8)) & this.hex2dec("7fffffff")) + "";
      otp = otp.substr(otp.length - this.length, this.length);
      return otp;
    };

    TotpManager.prototype.updateOtp = function() {
      var account, _i, _len, _ref, _results;
      _ref = this.accounts;
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        account = _ref[_i];
        _results.push(account.codeEl.innerHTML = this.getOtp(account.secret));
      }
      return _results;
    };

    TotpManager.prototype.timer = function() {
      var account, countDown, epoch, _i, _len, _ref;
      epoch = Math.round(new Date().getTime() / 1000.0);
      countDown = this.expiry - (epoch % this.expiry);
      if (epoch % this.expiry === 0) {
        this.updateOtp();
      }
      _ref = this.accounts;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        account = _ref[_i];
        account.tickEl.innerHTML = countDown;
      }
    };

    TotpManager.prototype.add = function(secret, codeEl, tickEl) {
      this.accounts.push({
        secret: secret,
        codeEl: codeEl,
        tickEl: tickEl
      });
      return this.updateOtp();
    };

    return TotpManager;

  })();

  window.TotpManager = TotpManager;

}).call(this);
