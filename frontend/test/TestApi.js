var expect = require("chai").expect;
var index = require("../index");
var assert = require("assert");
var supertest = require("supertest");
var should = require("should");
var server = supertest.agent("http://localhost:3001");

var request = require("request");

describe("login", function () {
    it("login", function (done) {
        server
            .post("/login")
            .send({ userEmail: "user1@gmail.com", userPassword: "qwerty12345" })
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                done();
            });
    });
});

describe("restaurantsbyItemName", function () {
    it("restaurantsbyItemName", function (done) {
        server
            .post("/restaurant/restaurantsbyItemName")
            .send({ itemName: "chicken" })
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                done();
            });
    });
});

describe("restaurantsbyItemCuisine", function () {
    it("restaurantsbyItemCuisine", function (done) {
        server
            .post("/restaurant/restaurantsbyItemCuisine")
            .send({
                cuisineName: "Indian", itemName: "chicken"
            })
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                done();
            });
    });
});

describe("itemsByRestaurant", function () {
    it("itemsByRestaurant", function (done) {
        server
            .post("/restaurant/itemsByRestaurant")
            .send({ restId: 1 })
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                done();
            });
    });
});


describe("getCuisines", function () {
    it("getCuisines", function (done) {
        server
            .get("/restaurant/getCuisines")
            .send({})
            .expect(200)
            .end(function (err, res) {
                res.status.should.equal(200);
                done();
            });
    });
});