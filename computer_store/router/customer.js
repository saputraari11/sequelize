const express = require("express")
const router = express.Router()
const multer = require("multer")
const fs = require("fs")
const path = require("path")
const models = require("../models/index")
const { param } = require("./transaksi")
const customer = models.customer

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./customer_image")
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname))
    }
})
const upload = multer({ storage: storage })

router.get("/", async(req, res) => {

    // let result = await customer.findAll()
    // try {
    //     res.json({ data: result })
    // } catch (err) {
    //     res.json({ massage: err.massage })
    // }

    customer.findAll().then(result => {
        res.json({ data: result })
    }).catch(err => {
        res.json({ massage: err.massage })
    })
})
router.get("/:customer_id", async(req, res) => {

    // let result = await customer.findAll()
    // try {
    //     res.json({ data: result })
    // } catch (err) {
    //     res.json({ massage: err.massage })
    // }
    let params = {
        customer_id: req.params.customer_id
    }
    customer.findOne({ where: params }).then(result => {
        res.json({ data: result })
    }).catch(err => {
        res.json({ massage: err.massage })
    })
})
router.post("/", upload.single("image"), async(req, res) => {
    let data = {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address,
        image: req.file.filename
    }
    customer.create(data).then(result => {
        res.json({ massage: "Data has been inserted" })
    }).catch(err => {
        res.json({ massage: err.massage })
    })
})
router.put("/", upload.single("image"), async(req, res) => {
    let data = {
        name: req.body.name,
        phone: req.body.phone,
        address: req.body.address
    }
    for (x in data) {
        if (x == undefined) {
            delete x
        }
    }
    let params = {
        customer_id: req.body.customer_id
    }
    if (req.file) {
        let x = await customer.findOne({ where: params })
        let foto = x.image
        let tempat = path.join(__dirname, "../customer_image", foto)
        fs.unlink(tempat, (err => { console.log(err) }))
        data.image = req.file.filename
    }

    customer.update(data, { where: params }).then(result => {
        res.json({ massage: "Data has been updated" })

    }).catch(err => {
        res.json({ massage: err.massage })
    })
})

router.delete("/:customer_id", async(req, res) => {
    try {
        let params = {
            customer_id: req.params.customer_id
        }
        const x = await customer.findOne({ where: params })
        let foto = x.image
        let dir = path.join(__dirname, "../customer_image", foto)
        fs.unlink(dir, (err => { console.log(err) }))
        await customer.destroy({ where: params })
        res.json({ massage: "Data has been deleted" })
    } catch (err) { res.json(err) }
})

module.exports = router