class Totp
  # pass in the secret, code dom element, ticker dom element
  constructor: (@expiry = 30, @length = 6) ->
    # validate input
    if @length > 8 or @length < 6
      throw "Error: invalid code length"

  dec2hex: (s) ->
    ((if s < 15.5 then "0" else "")) + Math.round(s).toString(16)
  
  hex2dec: (s) ->
    parseInt s, 16
  
  base32tohex: (base32) ->
    base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
    bits = ""
    hex = ""
  
    i = 0
    while i < base32.length
      val = base32chars.indexOf(base32.charAt(i).toUpperCase())
      bits += @leftpad(val.toString(2), 5, "0")
      i++
  
    i = 0
    while i + 4 <= bits.length
      chunk = bits.substr(i, 4)
      hex = hex + parseInt(chunk, 2).toString(16)
      i += 4
    return hex
  
  leftpad: (str, len, pad) ->
    str = Array(len + 1 - str.length).join(pad) + str  if len + 1 >= str.length
    return str
  
  getOtp: (secret, now = new Date().getTime()) ->
    key = @base32tohex(secret)
    epoch = Math.round(now / 1000.0)
    time = @leftpad(@dec2hex(Math.floor(epoch / @expiry)), 16, "0")
    shaObj = new jsSHA("SHA-1", "HEX")
    shaObj.setHMACKey(key, "HEX")
    shaObj.update(time)
    hmac = shaObj.getHMAC("HEX")
    # hmacObj = new jsSHA(time, "HEX")  # Dependency on sha.js
    # hmac = hmacObj.getHMAC(key, "HEX", "SHA-1", "HEX")
  
    if hmac is "KEY MUST BE IN BYTE INCREMENTS"
      throw "Error: hex key must be in byte increments"
      # return null
    else
      offset = @hex2dec(hmac.substring(hmac.length - 1))
  
    otp = (@hex2dec(hmac.substr(offset * 2, 8)) & @hex2dec("7fffffff")) + ""
    otp = (otp).substr(otp.length - @length, @length)
    return otp

class Hotp
  constructor: (@length = 6) ->
    # validate input
    if @length > 8 or @length < 6
      throw "Error: invalid code length"

  # stuck on this for a long time. Use JSON.stringify to inspect uintToString output!!
  uintToString: (uintArray) ->
    encodedString = String.fromCharCode.apply(null, uintArray)
    decodedString = decodeURIComponent(escape(encodedString))
    return decodedString

  getOtp: (key, counter) ->
    shaObj = new jsSHA("SHA-1", "TEXT")
    shaObj.setHMACKey(key, "TEXT")
    shaObj.update(@uintToString(new Uint8Array(@intToBytes(counter))))
    digest = shaObj.getHMAC("HEX")
    # Get byte array
    h = @hexToBytes(digest)
  
    # Truncate
    offset = h[19] & 0xf
    v = (h[offset] & 0x7f) << 24 |
        (h[offset + 1] & 0xff) << 16 |
        (h[offset + 2] & 0xff) << 8 |
        h[offset + 3] & 0xff
  
    v = v + ''
    v.substr v.length - @length, @length

  intToBytes: (num) ->
    bytes = []
    i = 7
    while i >= 0
      bytes[i] = num & 255
      num = num >> 8
      --i
    return bytes

  hexToBytes: (hex) ->
    bytes = []
    c = 0
    C = hex.length
    while c < C
      bytes.push parseInt(hex.substr(c, 2), 16)
      c += 2
    return bytes
  
window.jsOTP = {}
jsOTP.totp = Totp
jsOTP.hotp = Hotp
