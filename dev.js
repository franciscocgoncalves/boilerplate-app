var spawn = require("child_process").spawn;

spawn("coffee", ["-cb", "server.coffee"], {stdio: "inherit"}).on("close", function () {
  spawn("node", ["server.js", "true"], {stdio: "inherit"});
});
