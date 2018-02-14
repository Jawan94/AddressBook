var request = require('supertest');
var should = require('should');
// var app  = require('../bin/www');
var port = 3000;

// Please be sure to run Express server before running the below end - to - end tests!
// Tests written in mocha -- simply typing mocha in this projects directory will run the below tests automatically!
// Both, Express server and Docker container must be running!

var baseUrl = 'http://localhost:' + port;

describe('app', function () {

  it('POST /contact', function (done) {
    request(baseUrl)
      .post('/contact')
      .send({name: "randomName123", address: "9667", number: "7035079795"})
      .set('Accept', 'application/json')
      .expect(200, function(err, res){
        should.equal(JSON.parse(res.res.text).created, true, "Contact not added to elasticsearch properly")
        done()
      })
  });

  it('GET /contact', function (done) {
    request(baseUrl)
      .get('/contact?pageSize=1&page=1&query=name:randomName123')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function(err, res){
        done()
      })
  });

  it('GET /contact/randomName123', function (done) {
    request(baseUrl)
      .get('/contact/randomName123')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function(err, res){
        should.equal(JSON.parse(res.res.text)._shards.failed, 0, "Get request failing!" )
        done();
      })
  });

  it('PUT /contact/randomName123', function (done) {
    request(baseUrl)
      .put('/contact/randomName123')
      .send({name: "randomName123", address: "THIS WAS CHANGED", number: "THIS WAS CHANGED"})
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function(err, res){
        should.equal(JSON.parse(res.res.text).result, "updated", "Updates not occuring!")
        done();
      })
  });

  it('DELETE /contact/randomName123', function (done) {
    request(baseUrl)
      .delete('/contact/randomName123')
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, function(err, res){
        should.equal(JSON.parse(res.res.text).found, true, "Contact not deleted!")
        done();
      })
  });

});
