var express = require('express');
var router = express.Router();

const map = require('../models/map')

//============== ADD MAP (METHOD:POST) ===================
router.post('/', function (req, res, next) {
    const { title, lat, lng } = req.body

    let response = {
        success: false,
        message: "",
        data: {}
    }

    const Map = new map({
        title: title,
        lat: lat,
        lng: lng
    })

    Map.save()
        .then(result => {
            response.success = true
            response.message = "data map sudah ditambahkan"
            response.data._id = result._id
            response.data.title = result.title
            response.data.lat = result.lat
            response.data.lng = result.lng
            res.status(201).json(response)
        })
        .catch(err => {
            res.status(500).json(response)
        })

});


// ======================== READ MAP (METHOD:GET) ===========================
router.get('/', function (req, res, next) {
    let response = []

    map.find()
        .then(data => {
            response = data.map(item => {
                return {
                    _id: item._id,
                    title: item.title,
                    lat: item.lat,
                    lng: item.lng,
                }
            })
            res.status(200).json(response)
        })
        .catch(err => {
            res.status(500).json(err)
        })

})

//============== BROWSE MAP (METHOD:POST) ===================
router.post('/search', function (req, res, next) {
    let reg = new RegExp(req.body.title, 'i');
    let response = []
    let filter = {}

    if (req.body.title) {
        filter.title = { $regex: reg };
    }

    map.find(filter)
        .then(data => {
            response = data.map(item => {
                return {
                    _id: item._id,
                    title: item.title,
                    lat: item.lat,
                    lng: item.lng,
                }
            })
            res.status(200).json(response)
        })
        .catch(err => {
            res.status(401).json(err)
        })

});

// ======================== EDIT MAP (METHOD:PUT) ==============================
router.put('/:id', function (req, res, next) {
    let id = req.params.id

    let { title, lat, lng } = req.body

    let response = {
        success: false,
        message: "",
        data: {}
    }

    map.findByIdAndUpdate(id, { title, lat, lng }, {new: true})
        .then(data => {
            response.succes = true
            response.message = "data sudah diupdate"
            response.data._id = data._id
            response.data.title = data.title
            response.data.lat = data.lat
            response.data.lng = data.lng
            res.status(201).json(response)
        })
        .catch(err => {
            response.message = "update failed"
            res.status(500).json(response)
        })
})

// ======================== DELETE MAP (METHOD:DELETE) ==============================
router.delete('/:id', function (req, res, next) {
    let id = req.params.id

    let response = {
        succes: false,
        message: "",
        data: {}
    }

    map.findByIdAndRemove(id)
        .then(data => {
            response.succes = true
            response.message = "data sudah dihapus"
            response.data._id = data._id
            response.data.title = data.title
            response.data.lat = data.lat
            response.data.lng = data.lng
            res.status(201).json(response)
        })
        .catch(err => {
            response.message = "delete failed"
            res.status(500).json(response)
        })
})

// ======================== FIND (METHOD:GET) ==============================
router.get('/:id', function (req, res, next) {
    let id = req.params.id

    let response = {
        succes: false,
        message: "",
        data: {}
    }

    map.findById(id)
        .then(data => {
            response.succes = true
            response.message = "data ditemukan"
            response.data._id = data._id
            response.data.title = data.title
            response.data.lat = data.lat
            response.data.lng = data.lng
            res.status(201).json(response)
        })
        .catch(err => {
            response.message = "data tidak ditemukan"
            res.status(500).json(response)
        })
})

module.exports = router;