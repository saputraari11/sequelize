const express = require("express")
const app = express()
const customer = require("./router/customer.js")
const product = require("./router/product.js")
const transaksi = require("./router/transaksi.js")
const admin = require("./router/admin.js")
app.use("/customer", customer)
app.use("/product", product)
app.use("/transaksi", transaksi)
app.use("/admin", admin)
app.listen(8080, () => {
    console.log("port has been run on 8080")
})