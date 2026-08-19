const fs = require("fs");
const [,,inFile,outFile] = process.argv;
const b64 = fs.readFileSync(inFile, "utf8").replace(/\s+/g, "");
fs.writeFileSync(outFile, Buffer.from(b64, "base64").toString("utf8"), "utf8");
console.log("Decoded " + outFile);
