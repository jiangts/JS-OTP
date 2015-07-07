# totp-mgr

ClojureScript implementation of TotpManager library.

## Overview

Easily extensible ClojureScript implementation. Doing this to learn/practice ClojureScript development.

## Setup

To building your project once in dev mode:

    ./scripts/build

To auto build your project in dev mode:

    ./script/watch

To start an auto-building Node REPL (requires
[rlwrap](http://utopia.knoware.nl/~hlub/uck/rlwrap/), on OS X
installable via brew):

    ./scripts/repl

To get source map support in the Node REPL:

    lein npm install

To start an browser REPL:
    
    1. Uncomment the following line in src/[project name]/core.cljs: 
       ;; (repl/connect "http://localhost:9000/repl")
    2. Run `./scripts/brepl`
    4. Browse to http://localhost:9000 (you should see Hello World! in web console)
    5. (back to step 3) you should now see the REPL prompt: ClojureScript:cljs.user> 
    6. You may now evaluate ClojureScript statements in the browser context. 

For more info using the browser as a REPL environment, see
[this](https://github.com/clojure/clojurescript/wiki/The-REPL-and-Evaluation-Environments#browser-as-evaluation-environment).

Clean project specific out:

    lein clean

To build a single release artifact:

    ./scripts/release

## License

Copyright © 2015 Allan Jiang

