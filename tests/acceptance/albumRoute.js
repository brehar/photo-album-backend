'use strict';

var supertest = require('supertest');
var expect = require('chai').expect;
var mongoose = require('mongoose');

var app = require('../../app');

var dbUrl = 'mongodb://localhost/photo-album-test';

var id;

before(function(cb) {
    mongoose.connection.close(function() {
        mongoose.connect(dbUrl, cb);
    });
});

after(function(cb) {
    mongoose.connection.close(cb);
});

describe('/api/albums', function() {
    describe('POST /', function() {
        it('should create a new album', function(cb) {
            supertest(app).post('/api/albums').send({name: 'Websites'}).end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(200);

                id = res.body._id;

                cb();
            });
        });

        it('should NOT create a new album - missing name', function(cb) {
            supertest(app).post('/api/albums').end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(400);

                cb();
            });
        });
    });

    describe('GET /', function() {
        it('should respond with the array of albums', function(cb) {
            supertest(app).get('/api/albums').end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.length(1);
                expect(res.body[0].name).to.equal('Websites');

                cb();
            });
        });
    });

    describe('GET /:id', function() {
        it('should respond with the requested album', function(cb) {
            supertest(app).get('/api/albums/' + id).end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object');
                expect(res.body.name).to.equal('Websites');

                cb();
            });
        });
    });

    describe('PUT /:album/updateName', function() {
        it('should update the name of the queried album', function(cb) {
            supertest(app).put('/api/albums/' + id + '/updateName').send({name: 'Images from Websites'}).end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object');
                expect(res.body.name).to.equal('Images from Websites');

                cb();
            });
        });
    });

    describe('DELETE /:id', function() {
        it('should delete the queried album', function(cb) {
            supertest(app).delete('/api/albums/' + id).end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(200);

                cb();
            });
        });
    });
});