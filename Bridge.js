var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'localhost:9200',
  log: 'trace'
});
module.exports = {
  // client.ping below tests to see if the container is online in Docker
  // in production env. index should already be created -- doing this via the ping function below.
  // need to run the below command in terminal for docker:
  // docker run -it -p 9200:9200 -p 9300:9300 elasticsearch
  // 9200:9200 maps our localhost 9200 to the containers 9200 port - same goes for 9300:9300
  // should see All is well logged in your terminal if its connected!
  // index is also initilized here -- must be done everytime docker container is reset - both Express and Docker container must be started in unison:)
  pingElasticServer: function(){
    client.ping({
      requestTimeout: 30000,
    }, function (error) {
      if (error) {
        console.error('elasticsearch cluster is down!');
      } else {
        console.log('All is well');
        // creats our index "contacts"
        client.indices.create({
          index: 'contacts'
        },function(err,resp,status) {
          if(err) {
            console.log(err);
          }
          else {
            console.log("index created", resp);
          }
        })
      }
    })
  },

// http://localhost:3000/contact?pageSize=100&page=1&query=name:j*
// The above is how the below route would work if you wanted to find everyone thats
// name starts with the letter J

  contactGet: function(req, res, next) {
    client.search({
      index: 'contacts',
      q: req.query.query,
      size: req.query.pageSize,
      from: (req.query.pageSize*(req.query.page-1))
    }, function(error, response){
      console.log("LOOOOOK")
      res.send(response)
    })
  },

  contactPost: function(req, res, next){
    // This endpoint should create the contact.
    // Given that name should be unique, this may need to be enforced manually.
    // check to see if phone number is valid -- covert to string if passed a int and check to see if length is less than 11 digits.
    const stringVersion = String(req.body.number);
    if(stringVersion.length > 11){
      return res.send(400)
    }
    client.create({
      index: 'contacts',
      type: 'document',
      // by setting the id to contacts name - it will not allow name duplicates - names must be unique
      id: req.body.name,
      body: {
        name: req.body.name,
        address: req.body.address,
        number: req.body.number,
      }
    }, function(error, response){
      res.send(response);
    })
  },

  contactNameGet: function(req, res, next) {
    //This endpoint should return the contact by a unique name.
    //This name should be specified by the person entering the data.
    client.search({
      index: 'contacts',
      q: 'name:' + req.params.name  //ex: id:steven
    }, function(error, response){
      res.send(response)
    })
  },

  contactNamePut: function(req, res, next){
    //This endpoint should update the contact by a unique name (and should error if not found)
    client.update({
      index: 'contacts',
      type: 'document',
      id: req.params.name,
      body: {
        // assuming when you update contact you are sending an object
        // with keys: address, number
        // I am assuming that name would not change, only address and number would.
        doc : {
        address: req.body.address,
        number: req.body.number
      }
      }
    }, function(error, response) {
      if (error){
        // handles error by sending 400 -- could also shoot back the error itself
        console.log(error)
        return res.send(400)
      }
      else{
        return res.send(response);
      }
    })
  },

  deleteContact: function(req, res, next) {
    //This endpoint should delate contact with {name} credentials.
    client.delete({
      index: 'contacts',
      type: 'document',
      id: req.params.name
    }, function(error, response){
      res.send(response)
    })
  }
}
