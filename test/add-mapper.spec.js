var expect = require('chai').expect;
var SuperOM = require('../');

describe('Super Object Mapper .addMapper()', function() {

  beforeEach(function() {
    SuperOM._mappers = {};
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

    it('should share mappers between implementations', function(){
      superOM1.addMapper(userMapper, "users");
      superOM2.addMapper(locationMapper, "locations");

      expect(SuperOM._mappers.locations).to.exist();
      expect(SuperOM._mappers.users).to.exist();
    });
  });
});

