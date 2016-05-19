'use strict';

var express = require('express');
var router = express.Router();

var Image = require('../models/image');
var Album = require('../models/album');

router.get('/', (req, res) => {
    Image.find({}).exec((err, images) => {
        res.status(err ? 400 : 200).send(err || images);
    });
});

router.get('/:id', (req, res) => {
    Image.findById(req.params.id).exec((err, image) => {
        res.status(err ? 400 : 200).send(err || image);
    });
});

router.post('/', (req, res) => {
    var image = new Image(req.body);
    
    image.save((err, savedImage) => {
        res.status(err ? 400 : 200).send(err || savedImage);
    });
});

router.put('/:id/updateDescription', (req, res) => {
    Image.findById(req.params.id, (err, image) => {
        image.description = req.body.description;

        image.save((err, savedImage) => {
            res.status(err ? 400 : 200).send(err || savedImage);
        });
    });
});

router.delete('/:id', (req, res) => {
    Image.findByIdAndRemove(req.params.id, err => {
        if (err) {
            res.status(400).send(err);
        } else {
            Album.find({images: req.params.id}).exec((err, albums) => {
                if (err) return res.status(400).send(err);

                for (var i = 0; i < albums.length; i++) {
                    var index = albums[i].images.indexOf(req.params.id);
                    albums[i].images.splice(index, 1);

                    albums[i].save((err, savedAlbum) => {
                        if (err) return res.status(400).send(err);
                    });
                }

                res.status(200).send();
            });
        }
    });
});

module.exports = router;