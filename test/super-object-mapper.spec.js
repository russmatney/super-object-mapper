var expect = require('chai').expect;

var SuperOM = require('../');

describe('Super Object Mapper', function() {
  it('exists', function() {
    expect(SuperOM).to.exist();
  });

  describe('maps a defined object to a specified map', function() {

    var userMapper = {
      "database": {
        "name": "name",
        "email": "email"
      }
    };

    var collection = 'users';

    SuperOM.addMapper(userMapper, collection);

    var map = 'database';
    var object = {
      name: "Mario",
      email: "mario@toadstool.com",
      secrets: "Sleeps with a blanky named Stewart"
    };
    var mappedObject = SuperOM.mapObject(map, collection, object);

    it('should return a mapped object', function() {
      expect(mappedObject).to.exist();
    });

    it('should transfer keys and values', function() {
      expect(mappedObject.name).to.equal(object.name).and.exist();
      expect(mappedObject.email).to.equal(object.email).and.exist();
    });

    it('should not include fields that are not in the mapper', function() {
      expect(mappedObject.secrets).not.to.exist();
    });

  });
});
