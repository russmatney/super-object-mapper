var expect = require('chai').expect;
var SuperOM = require('../');

describe('Super Object Mapper', function() {
  it('exists', function() {
    expect(SuperOM).to.exist();
  });

  beforeEach(function() {
    SuperOM._mappers = {};
  });

  describe('maps a defined object to a specified map', function() {

    var superOM = new SuperOM();

    var userMapper = {
      "database": {
        "name": "name",
        "email": "emailAddress"
      }
    };

    var mapper = 'users';

    superOM.addMapper(userMapper, mapper);

    var map = 'database';
    var object = {
      name: "Mario",
      email: "mario@toadstool.com",
      secrets: "Sleeps with a blanky named Stewart"
    };
    var mappedObject = superOM.mapObject(map, mapper, object);

    it('should return a mapped object', function() {
      expect(mappedObject).to.exist();
    });

    it('should transfer values', function() {
      expect(mappedObject.name).to.equal(object.name).and.exist();
    });

    it('should change keys as specified', function() {
      expect(mappedObject.emailAddress).to.equal(object.email).and.exist();
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

    it('should share mappers between implementations', function(){
      superOM1.addMapper(userMapper, "users");
      superOM2.addMapper(locationMapper, "locations");

      expect(SuperOM._mappers.locations).to.exist();
      expect(SuperOM._mappers.users).to.exist();
    });
  });

  describe('handles missing mappers', function() {
    var superOM = new SuperOM();
    it('should throw a missing mapper error', function() {
      var object = {
        "name": "William Franklyn Bowser"
      };
      var mapObjectFunc = superOM.mapObject.bind(superOM, "database", "gremlins", object);

      expect(mapObjectFunc).to.throw(/Mapper not found/);
    });
  });

  describe('handles missing maps', function() {
    var superOM = new SuperOM();
    it('should throw a missing map error', function() {
      var mapper = {};
      superOM.addMapper(mapper, "koopas");
      var object = {
        "name": "William Franklyn Bowser"
      };
      var mapObjectFunc = superOM.mapObject.bind(superOM, "database", "koopas", object);

      expect(mapObjectFunc).to.throw(/Map not found/);
    });
  });

  describe.only('handles null', function() {
    var superOM = new SuperOM();
    it('should return null if the object is null', function() {
      superOM.addMapper({"domain":{}}, "users");
      var mappedObject = superOM.mapObject("domain", "users", null);

      expect(mappedObject).to.equal(null);
    });

    it('should keep null or undefined fields by default', function() {
      superOM.addMapper({
        "domain":{
          name: 'name',
          fieldSetToNull: 'fieldSetToNull',
          fieldSetToUndefined: 'fieldSetToUndefined'
        }
      }, "users");
      var object = {
        name: 'Peaches',
        fieldSetToNull: null,
        fieldSetToUndefined: null
      };
      var mappedObject = superOM.mapObject("domain", "users", object);

      expect(mappedObject).to.have.property('fieldSetToNull')
      expect(mappedObject).to.have.property('fieldSetToUndefined')
    });

    it('should remove null or undefined fields if specified', function() {
      superOM.addMapper({
        "domain":{
          name: 'name',
          fieldSetToNull: 'fieldSetToNull',
          fieldSetToUndefined: 'fieldSetToUndefined'
        }
      }, "users");
      var object = {
        name: 'Peaches',
        fieldSetToNull: null,
        fieldSetToUndefined: null
      };
      var mappedObject = superOM.mapObject("domain", "users", object, {clean: true});

      expect(mappedObject).not.to.have.property('fieldSetToNull')
      expect(mappedObject).not.to.have.property('fieldSetToUndefined')
    });

    it('(unless {clean:true}) should not set properties that are not on the original object', function() {
      superOM.addMapper({
        "domain": {
          "name": "name",
          "notOnObject": "notOnObject"
        }
      }, "users");
      var object = {
        name: 'Johnny Bravo'
      };
      var mappedObject = superOM.mapObject('domain', 'users', object);
      console.log(mappedObject);

      expect(mappedObject).not.to.have.property('notOnObject');
    });

    it('(unless {clean:true}) should retain properties that are set to null on the original object', function() {
      superOM.addMapper({
        "domain": {
          "name": "name",
          "setToNull": "setToNull"
        }
      }, "users");
      var object = {
        name: 'Johnny Bravo',
        setToNull: null
      };
      var mappedObject = superOM.mapObject('domain', 'users', object);
      console.log(mappedObject);

      expect(mappedObject).to.have.property('setToNull').and.eql(null);
    });

  });

  describe('handles arrays of objects', function () {
    var superOM = new SuperOM();

    it('should return an empty array if one is passed', function() {
      superOM.addMapper({
        "domain":{
          name: 'name'
        }
      }, "users");
      var array = [];
      var mappedArray = superOM.mapObject("domain", "users", array);

      expect(mappedArray).to.eql([]);
    });

    it('should return an array of mapped objects in order', function() {
      superOM.addMapper({
        "domain":{
          name: 'name',
          lastEggLaid: 'last_egg_laid',
          "email": "email"
        }
      }, "users");
      var array = [
        {
          name: "Luigi",
          color: "green. no, purple"
        }, {
          name: "Peach",
          mustache: true
        }, {
          name: "Yoshi",
          lastEggLaid: "June, 1986"
        }
      ];
      var mappedArray = superOM.mapObject("domain", "users", array);
      console.log(mappedArray);

      expect(mappedArray[0].name).to.eql("Luigi");
      expect(mappedArray[1].name).to.eql("Peach");
      expect(mappedArray[1]).not.to.have.property('mustache');
      expect(mappedArray[1]).not.to.have.property('last_egg_laid');
      expect(mappedArray[2].name).to.eql('Yoshi');
      expect(mappedArray[2].last_egg_laid).to.exist();
    });

  });

});

//TODO: dive into type-setting
//TODO: break this file into smaller pieces

