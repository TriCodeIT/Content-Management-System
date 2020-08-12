'use strict'

const chai = require('chai');
const chaiHTTP = require('chai-http');

const server = require('../app');
const user = require('../models/user')

const { expect } = require('chai');
const { response } = require('express');

const should = chai.should();
chai.use(chaiHTTP);

describe('users', function () {
    //menghapus semua data 
    user.collection.drop();

    //sebelum test menambahkan data test
    beforeEach(function (done) {
        let User = new user({
            email: 'test@gmail.com',
            password: 'testing',
            token: ''
        });

        User.save(function (err) {
            if (err) console.log(err);
            else {
                done();
            }
        })
    })

    //sesudah test menghapus semua data
    afterEach(function (done) {
        user.collection.drop();
        done();
    })

    //======================== TEST UNIT REGISTER USER ==================================
    it('seharusnya data user berhasil di tambahkan dengan metode POST', function (done) {
        chai.request(server)
            .post('/api/users/register')
            .send({
                'email': 'tri.sutrisna@gmail.com',
                'password': '1234',
                'retypepassword': '1234'
            })
            .end(function (err, res) {
                res.should.have.status(201);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('data');
                res.body.should.have.property('token');
                expect(res.body.token).to.exist;
                res.body.message.should.equal('register success');
                res.body.data.email.should.equal('tri.sutrisna@gmail.com');
                done();
            })
    })
})

 //======================== TEST UNIT LOGIN USER ==================================
 it('seharusnya berhasil login dengan metode POST', function (done) {
    chai.request(server)
       .post('/api/users/login')
       .send({
          'email': 'tri.sutrisna@gmail.com',
          'password': '1234'
       })
       .end(function (err, res) {
          console.log(res.body);
          res.should.have.status(201);
          res.should.be.json;
          res.body.should.be.a('object');
          res.body.should.have.property('token');
          res.body.should.have.property('data');
          res.body.should.have.property('message');
          res.body.message.should.equal('Login success!');
          expect(res.body.token).to.exist;
          res.body.data.should.be.a('object');
          res.body.data.email.should.equal('tri.sutrisna@gmail.com');
          done()
       })
 })
    

 