# JS OTP
Javascript Implementation of HOTP and TOTP

---

A small javascript library (~~13k minified, 5k minified and gzipped~~) that handles generation of [HMAC-based One-time Password Algorithm (HOTP) codes](https://en.wikipedia.org/wiki/HMAC-based_One-time_Password_Algorithm) as per the [HOTP RFC Draft](https://tools.ietf.org/html/rfc4226) and the [Time-based One-time Password Algorithm (TOTP) codes](http://en.wikipedia.org/wiki/Time-based_One-time_Password_Algorithm) as per the [TOTP RFC Draft](http://tools.ietf.org/id/draft-mraihi-totp-timebased-06.html). This library produces the same codes as the Google Authenticator app.

This package only exposes `jsOTP` and `jsSHA` to global scope and does not depend on jQuery.

## Usage:
Usage is simple. Just include `dist/jsOTP.js` to your page and pass it a config.

    <script src='dist/jsOTP.min.js'></script>
    <script>
    // hotp
    var hotp = new jsOTP.hotp();
    var hmacCode = hotp.getOtp(<your OTP key>, <counter>);
    
    // totp
    var totp = new jsOTP.totp();
    var timeCode = totp.getOtp(<your OTP key>);
    </script>

## Additional Configs
You can also configure the expiry time for each code (defaults to 30 seconds) and the length of the code (between 6 and 8, defaults to 6) by passing two optional arguments to the `totp` constructor:

    var totp = new jsOTP.totp(<expiry seconds>, <code length>);

You can also input the time for TOTP calculations as an optional second argument:

    var timeCode = totp.getOtp(<OTP key>, <milliseconds time>);

## Acknowledgements
This package is adapted from the following [fiddle](http://jsfiddle.net/nt18yhmL/) and the [Node OTP](https://github.com/guyht/notp/) library and uses Brian Turek's [jsSHA](https://github.com/caligatio/jsSHA/).
