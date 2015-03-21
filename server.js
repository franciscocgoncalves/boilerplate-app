// Generated by CoffeeScript 1.9.1
var Hapi, exec, isDev, spawn, startServer;

exec = require("child_process").exec;

spawn = require("child_process").spawn;

Hapi = require("hapi");

isDev = process.argv[2];

exec("npm i", function() {
  if (isDev) {
    spawn("jade", ["-w", "./public/templates"]);
    spawn("sass", ["-w", "./public/stylesheets"]);
    return exec("coffeescript-concat -I ./public/js -o ./public/js/app", function() {
      return spawn("coffee", ["-cb", "./public/js/app"], {
        stdio: "inherit"
      }).on("close", function() {
        return exec("rm -rf ./public/js/app", function() {
          return startServer();
        });
      });
    });
  } else {
    return startServer();
  }
});

startServer = function() {
  var server;
  server = new Hapi.Server();
  server.connection({
    address: "0.0.0.0",
    port: 80
  });
  server.route({
    method: "GET",
    path: "/",
    config: {
      handler: {
        file: "./public/templates/index.html"
      }
    }
  });
  server.route({
    method: "GET",
    path: "/{path*}",
    config: {
      handler: {
        directory: {
          path: "./public/"
        }
      }
    }
  });
  return server.start(function() {
    return console.log("Server running at:", server.info.uri);
  });
};