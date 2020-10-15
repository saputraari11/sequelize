const express = require("express")
const router = express.Router()
const jwt = require("jsonwebtoken")
const SECRET_KEY = "Indonesia1011"
const auth = require("../auth")
const models = require("../models/index")
const admin = models.admin
const sha256 = require("sha256")
router.use(express.urlencoded({ extended: true }))

router.get("/", auth, async(req, res) => {

    admin.findAll().then(result => {
        res.json({ data: result })
    }).catch(err => {
        res.json({ massage: err.massage })
    })


})
router.get("/:admin_id", auth, async(req, res) => {

    admin.findOne({ where: { admin_id: req.params.admin_id } }).then(result => {
        res.json({ data: result })
    }).catch(err => {
        res.json({ massage: err.massage })
    })


})
router.post("/", async(req, res) => {
    let data = {
        nama: req.body.nama,
        username: req.body.username,
        password: sha256(req.body.password)
    }
    admin.create(data).then(result => {
        res.json({ massage: "Data has been Inserted" })
    }).catch(err => {
        res.json({ massage: err.massage })
    })
})
router.put("/", auth, async(req, res) => {
    let data = {
        nama: req.body.nama,
        username: req.body.username,
    }
    for (x in data) {
        if (x === undefined) {
            delete x
        }
    }
    if (req.body.password) {
        data.password = sha256(req.body.password)
    }
    let params = {
        admin_id: req.body.admin_id
    }
    admin.update(data, { where: params }).then(result => {
        res.json({ massage: "Data has been updated" })
    }).catch(err => {
        res.json({ massage: err.massage })
    })
})
router.delete("/:admin_id", auth, async(req, res) => {
    try {
        await admin.destroy({ where: { admin_id: req.params.admin_id } })
        res.json({ massage: "Data has been deleted" })
    } catch (err) {
        res.json({ massage: err.massage })
    }
})
router.post("/auth", async(req, res) => {
    let params = {
        username: req.body.username,
        password: sha256(req.body.password)
    }
    try {
        let option = { algorithm: "HS256" }
        let result = await admin.findOne({ where: params })
        let data = JSON.stringify(result)
        let token = jwt.sign(data, SECRET_KEY, option)
        res.json({ data: result, token: token })
    } catch (err) {
        res.json({ massage: err.massage })
    }
})
module.exports = router