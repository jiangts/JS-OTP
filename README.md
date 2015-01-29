# TotpManager
Javascript Implementation of 2 Factor Auth

---

A small javascript library (13k minified, 5k minified and gzipped) that handles generation of [Time-based One-time Password Algorithm (TOTP) codes](http://en.wikipedia.org/wiki/Time-based_One-time_Password_Algorithm) as per the [TOTP RFC Draft](http://tools.ietf.org/id/draft-mraihi-totp-timebased-06.html). If you're familiar with Google Authenticator, this code produces the same codes as the Authenticator app.

This package only exposes `TotpManager` and `jsSHA` to global scope and does not depend on jQuery.

## Usage:
Usage is simple. Just include `dist/TotpManager.js` to your page and pass it a config.
```
<script src='dist/TotpManager.min.js'></script>
<script>
var totpManager = new TotpManager("super secret secret", codeEl, tickEl);
</script>
```

- The first argument is your secret string, 
- the second is a DOM element where you want to display your code, 
- the third is a DOM element where you want to show a countdown before code expiry.

Make sure the elements you pass in are already initialized.


It is simple to manage multiple codes. Just add them to the manager!
```
var totpManager.add("23TplPdS46Juzcyx", codeEl2, tickEl2);
```

Finally, you can also configure the expiry time for each code (defaults to 30 seconds) and the length of the code (between 6 and 8, defaults to 6) by passing two additional arguments to the constructor:
```
var totpManager = new TotpManager(<secret>, <code elem>, <tick elem>, 
                                  <expiry seconds>, <code length>);
```

## Acknowledgements
This package is adapted from the following [fiddle](http://jsfiddle.net/nt18yhmL/) and uses Brian Turek's [jsSHA](https://github.com/caligatio/jsSHA/).
