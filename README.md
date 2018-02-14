# AddressBookAPI
To fire up the application, a docker container must be fired up first. You can do so in your terminal by running the command:

      - docker run -it -p 9200:9200 -p 9300:9300 elasticsearch

Once the container is up and running, fire up the express server once all packages have been installed.


      - to run tests, have both the express server and the docker container running


      - simply type - mocha - in your terminal to run end-to-end tests.


Contacts Index/model is define below:
{
  index: 'contacts',
  type: 'document',
  id: {linked to name},
  body: {
    name,
    address,
    number,
  }
}
