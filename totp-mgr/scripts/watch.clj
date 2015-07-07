(require '[cljs.build.api :as b])

(b/watch "src"
  {:main 'totp-mgr.core
   :output-to "out/totp_mgr.js"
   :output-dir "out"})
