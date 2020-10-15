const express = require("express")
const { urlencoded } = require("express")
const router = express.Router()
const multer = require("multer")
const models = require("../models/index")
const transaksi = models.transaksi
const detail_transaksi = models.detail_transaksi
router.use(express.urlencoded({ extended: true }))
router.get("/", async(req, res) => {
    transaksi.findAll({
        include: ["customer", { association: "detail_transaksi", include: "product" }]
    }).then(data => { res.json({ data: data }) }).catch(err => {
        res.json({ massage: err.massage })
    })
})
router.get("/:transaksi_id", async(req, res) => {
    transaksi.findOne({
        where: { transaksi_id: req.params.transaksi_id },
        include: ["customer", {
            association: "detail_transaksi",
            include: ["product"]
        }]
    }).then(data => { res.json({ data: data }) }).catch(err => {
        res.json({ massage: err.massage })
    })
})
router.post("/", async(req, res) => {
    let data = null

    data = {
        customer_id: req.body.customer_id,
        waktu: req.body.waktu
    }
    transaksi.create(data).then(result => {
        let transaksi_id = result.transaksi_id
        let detail = JSON.parse(req.body.detail_transaksi)

        detail.forEach(element => {
            element.transaksi_id = transaksi_id
        });
        detail_transaksi.bulkCreate(detail).then(result => {
            res.json({ massage: "Data has been Inserted" })
        }).catch(err => {
            res.json({ massage: err.massage })
        })

    }).catch(err => {
        res.json({ massage: err.massage })
    })

})

router.put("/", async(req, res) => {
    let data = null

    data = {
        customer_id: req.body.customer_id,
        waktu: req.body.waktu
    }
    let params = { transaksi_id: req.body.transaksi_id }

    for (x in data) {
        if (x == undefined) {
            delete x
        }
    }
    transaksi.update(data, { where: params }).then(result => {

        let detail = JSON.parse(req.body.detail_transaksi)

        detail.forEach(element => {
            element.transaksi_id = params.transaksi_id
        });
        detail_transaksi.bulkCreate(detail).then(result => {
            res.json({ massage: "Data has been updated" })
        }).catch(err => {
            res.json({ massage: err.massage })
        })

    }).catch(err => {
        res.json({ massage: err.massage })
    })

})
router.delete("/:transaksi_id", async(req, res) => {
    try {
        let params = { transaksi_id: req.params.transaksi_id }
        await detail_transaksi.destroy({
            where: params
        })
        await transaksi.destroy({
            where: params
        })
        res.json({ massage: "Data has been deleted" })

    } catch (err) {
        res.json({ massage: err.massage })
    }
})

module.exports = router