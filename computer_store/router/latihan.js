let pass = "ari"
let sha256 = require("sha256")
let enc = require("cryptr")
let encrypt = enc.bind(pass, sha256)
enc.prototype()
console.log(encodeURI(encrypt));