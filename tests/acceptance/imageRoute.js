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

describe('/api/images', function() {
    describe('POST /', function() {
        it('should create a new image', function(cb) {
            supertest(app).post('/api/images').send({imageUrl: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png', description: 'Google homepage image'}).end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(200);

                id = res.body._id;

                cb();
            });
        });

        it('should NOT create a new image - missing imageUrl', function(cb) {
            supertest(app).post('/api/images').send({description: 'Google homepage image'}).end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(400);

                cb();
            });
        });
    });

    describe('GET /', function() {
        it('should respond with the array of images', function(cb) {
            supertest(app).get('/api/images').end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.length(1);
                expect(res.body[0].description).to.equal('Google homepage image');

                cb();
            });
        });
    });

    describe('GET /:id', function() {
        it('should respond with the requested image', function(cb) {
            supertest(app).get('/api/images/' + id).end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object');
                expect(res.body.description).to.equal('Google homepage image');

                cb();
            });
        });
    });

    describe('PUT /:id/updateDescription', function() {
        it('should update the description of the queried image', function(cb) {
            supertest(app).put('/api/images/' + id + '/updateDescription').send({description: 'Homepage image for Google'}).end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('object');
                expect(res.body.description).to.equal('Homepage image for Google');

                cb();
            });
        });
    });

    describe('DELETE /:id', function() {
        it('should delete the queried image', function(cb) {
            supertest(app).delete('/api/images/' + id).end(function(err, res) {
                expect(err).to.not.exist;
                expect(res.statusCode).to.equal(200);

                cb();
            });
        });
    });
});