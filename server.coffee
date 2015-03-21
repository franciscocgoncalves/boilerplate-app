exec = require("child_process").exec
spawn = require("child_process").spawn
Hapi = require "hapi"

isDev = process.argv[2]

exec "npm i", ->
  if isDev
    spawn "jade", ["-w", "./public/templates"]#, stdio: "inherit"
    spawn "sass", ["-w", "./public/stylesheets"]#, stdio: "inherit"
    exec "coffeescript-concat -I ./public/js -o ./public/js/app", ->
      spawn("coffee", ["-cb", "./public/js/app"], stdio: "inherit").on "close", ->
        exec "rm -rf ./public/js/app", ->
          startServer()
  else
    startServer()

startServer = ->
  server = new Hapi.Server()
  server.connection address: "0.0.0.0", port: 80
  
  #Customize behaviour
  
  server.route
    method: "GET"
    path: "/"
    config:
      handler:
        file: "./public/templates/index.html"

  server.route
    method: "GET"
    path: "/{path*}"
    config:
      handler:
        directory:
          path: "./public/"

  server.start ->
      console.log "Server running at:", server.info.uri
