const { spawn } = require("child_process");


 function runShellCommand(command) {
    console.log("reqached ere")
    return new Promise((resolve, reject) => {
      const shell = spawn("/bin/bash", ["-c", `source ../logic/node_vars.env && ${command}`]);
  
      let output = "";
      shell.stdout.on("data", (data) => (output += data.toString()));
      shell.stderr.on("data", (data) => console.error("stderr:", data.toString()));
  
      shell.on("error", (error) => reject(`Error: ${error.message}`));
      shell.on("close", (code) => {
        if (code === 0) resolve(output.trim());
        else reject(`Process exited with code ${code}`);
      });
    });
  }
  module.exports = { runShellCommand };