grunt
sed -i -e 's/(undefined)/(window)/g' dist/jsOTP-es5.js
grunt uglify
