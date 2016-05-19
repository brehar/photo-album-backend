'use strict';

var express = require('express');
var router = express.Router();

var Album = require('../models/album');

router.get('/', (req, res) => {
    Album.find({}).exec((err, albums) => {
        res.status(err ? 400 : 200).send(err || albums);
    });
});

router.get('/:id', (req, res) => {
    Album.findById(req.params.id).populate('images').exec((err, album) => {
        res.status(err ? 400 : 200).send(err || album);
    });
});

router.post('/', (req, res) => {
    var album = new Album(req.body);

    album.save((err, savedAlbum) => {
        res.status(err ? 400 : 200).send(err || savedAlbum);
    });
});

router.put('/:album/updateName', (req, res) => {
    Album.findById(req.params.album, (err, album) => {
        album.name = req.body.name;

        album.save((err, savedAlbum) => {
            res.status(err ? 400 : 200).send(err || savedAlbum);
        });
    });
});

router.put('/:album/addImage/:image', (req, res) => {
    Album.findById(req.params.album, (err, album) => {
        if (err) return res.status(400).send(err);

        album.images.push(req.params.image);

        album.save((err, savedAlbum) => {
            res.status(err ? 400 : 200).send(err || savedAlbum);
        });
    });
});

router.put('/:album/removeImage/:image', (req, res) => {
    Album.findById(req.params.album, (err, album) => {
        if (err) return res.status(400).send(err);

        var index = album.images.indexOf(req.params.image);
        album.images.splice(index, 1);

        album.save((err, savedAlbum) => {
            res.status(err ? 400 : 200).send(err || savedAlbum);
        });
    });
});

router.delete('/:id', (req, res) => {
    Album.findByIdAndRemove(req.params.id, err => {
        if (err) {
            res.status(400).send(err);
        } else {
            res.status(200).send();
        }
    });
});

module.exports = router;