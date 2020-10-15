const express = require("express")
const router = express.Router()
const multer = require("multer")
const fs = require("fs")
const path = require("path")
const models = require("../models/index")
const product = models.product
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./product_image")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

router.get("/", async(req, res) => {
    product.findAll().then(data => {
        res.json({ data: data })
    }).catch(err => {
        res.json({ massage: err.massage })
    })
})
router.get("/:product_id", async(req, res) => {
    product.findAll({ where: { product_id: req.params.product_id } }).then(data => {
        res.json({ data: data })
    }).catch(err => {
        res.json({ massage: err.massage })
    })
})
router.post("/", upload.single("image"), async(req, res) => {
    if (!req.file) {
        res.json({ massage: "image is not found" })
    } else {
        let data = {
            name: req.body.name,
            price: req.body.price,
            stock: req.body.stock,
            image: req.file.filename
        }
        product.create(data).then(data => {
            res.json({ massage: "Data has been created" })
        }).catch(err => {
            res.json({ massage: err.massage })
        })
    }
})
router.put("/", upload.single("image"), async(req, res) => {
    let data = {
        name: req.body.name,
        price: req.body.price,
        stock: req.body.stock
    }
    let params = {
        product_id: req.body.product_id
    }
    if (req.file) {
        let x = await product.findOne({ where: params })
        let image = x.image
        let tempat = path.join(__dirname, "../product_image", image)
        fs.unlink(tempat, err => { console.log(err) })
        data.image = req.file.filename
    }
    product.update(data, { where: params }).then(data => {
        res.json({ massage: "Data has been updated" })
    }).catch(err => {
        res.json({ massage: err.massage })
    })
})
router.delete("/:product_id", async(req, res) => {
    try {
        let params = {
            product_id: req.params.product_id
        }
        let x = await product.findOne({ where: params })
        let image = x.image
        let tempat = path.join(__dirname, "../product_image", image)
        fs.unlink(tempat, err => { console.log(err) })
        await product.destroy({ where: { product_id: req.params.product_id } })
        res.json({ massage: "Data has been deleted" })

    } catch (err) { res.json(err) }
})
module.exports = router