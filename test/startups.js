var request = require('supertest')
  , should  = require('should')
  , app     = require('../app')

describe('startups', function() {
  describe('GET /startups/locations', function() {
    it('should return a json array with startups', function(done) {
      request(app)
        .get('/startups/locations')
        .end(function(err, res) {
          if (err) throw err
          res.statusCode.should.equal(200)
          res.type.should.include('application/json')
          done()
      })
    })
  })
})