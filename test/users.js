var request = require('supertest')
  , should  = require('should')
  , app     = require('../app')

describe('users', function() {
  describe('POST /signup', function() {
    it('should create a new user', function(done) {
      request(app)
        .post('/signup')
        .send({username: 'test123', password: 'test123'})
        .end(function(err, res) {
          if (err) throw err
          res.statusCode.should.equal(302)
          done()
        })
    })
    it('should return duplicate error', function(done) {
      request(app)
        .post('/signup')
        .send({username: 'test123', password: 'test123'})
        .end(function(err, res) {
          if (err) throw err
          res.statusCode.should.equal(409)
          done()
        })
    })
  })
  
  describe('DELETE /user', function() {
    it('should delete a user', function(done) {
      request(app)
        .del('/user/test123')
        .end(function(err, res) {
          if (err) throw err
          res.statusCode.should.equal(200)
          done()
        })
    })
  })
})