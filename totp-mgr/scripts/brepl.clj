(require
  '[cljs.build.api :as b]
  '[cljs.repl :as repl]
  '[cljs.repl.browser :as browser])

(b/build "src"
  {:main 'totp-mgr.core
   :output-to "out/totp_mgr.js"
   :output-dir "out"
   :verbose true})

(repl/repl* (browser/repl-env)
  {:output-dir "out"})
