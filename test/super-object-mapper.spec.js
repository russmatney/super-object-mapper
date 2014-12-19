var expect = require('chai').expect;
var SuperOM = require('../');

describe('Super Object Mapper', function() {
  it('exists', function() {
    expect(SuperOM).to.exist();
  });

  describe('maps a defined object to a specified map', function() {

    var superOM = new SuperOM();

    var userMapper = {
      "database": {
        "name": "name",
        "email": "email"
      }
    };

    var collection = 'users';

    superOM.addMapper(userMapper, collection);

    var map = 'database';
    var object = {
      name: "Mario",
      email: "mario@toadstool.com",
      secrets: "Sleeps with a blanky named Stewart"
    };
    var mappedObject = superOM.mapObject(map, collection, object);

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

  describe('caches mappers globally', function() {
    var superOM1 = new SuperOM();
    var superOM2 = new SuperOM();

    var userMapper = {
      "database": {
        "name": "name"
      }
    };

    var locationMapper = {
      "database": {
        "name": "name"
      }
    };

    superOM1.addMapper(userMapper, "users");
    superOM2.addMapper(locationMapper, "locations");

    it('should share mappers between implementations', function(){
      expect(SuperOM._mappers.locations).to.exist();
      expect(SuperOM._mappers.users).to.exist();
    });

  });

  describe('handles missing collections', function() {
    var superOM = new SuperOM();
    var object = {
      "name": "William Franklyn Bowser"
    };
    var mapObjectFunc = superOM.mapObject.bind(superOM, "database", "gremlins", object);

    it('should throw a missing collection error', function() {
      expect(mapObjectFunc).to.throw(/Collection not found/);
    });
  });
});
