var expect = require('chai').expect;
var SuperOM = require('../');

describe('Super Object Mapper .mapObject()', function() {

  beforeEach(function() {
    SuperOM._mappers = {};
  });

  describe('maps a defined object to a specified map', function() {

    describe('hardcoded mapper name', function() {
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
      var mappedObject = superOM.mapObject(object, {mapper: mapper, map: map});

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

    describe('mapper name as closure', function() {
      var superOM = new SuperOM();

      var userMapper = {
        "userToDatabase": {
          "name": "name",
          "email": "emailAddress"
        }
      };

      var adminMapper = {
        "userToDatabase": {
          "name": "name",
          "email": "emailAddress",
          "admin": "admin"
        }
      };

      var userSession = {
      };
      var adminSession = {
        admin: true
      };
      function isAdmin(user) {
        return user.admin ? true : false;
      }
      var adminCheck = function(user) {
        return function() {
          if (isAdmin(user)) {
            return 'admin';
          } else {
            return 'user';
          }
        };
      };

      superOM.addMapper(userMapper, "user");
      superOM.addMapper(adminMapper, "admin");

      var map = 'userToDatabase';
      var object = {
        name: "Mario",
        email: "mario@toadstool.com",
        secrets: "Sleeps with a blanky named Stewart",
        admin: true
      };
      var userMappedObject = superOM.mapObject(object, {mapper: adminCheck(userSession), map: map});
      var adminMappedObject = superOM.mapObject(object, {mapper: adminCheck(adminSession), map: map});

      it('should return a mapped object', function() {
        expect(userMappedObject).to.exist();
        expect(adminMappedObject).to.exist();
      });

      it('should transfer values', function() {
        expect(userMappedObject.name).to.equal(object.name).and.exist();
        expect(adminMappedObject.name).to.equal(object.name).and.exist();
      });

      it('should change keys as specified', function() {
        expect(userMappedObject.emailAddress).to.equal(object.email).and.exist();
        expect(adminMappedObject.emailAddress).to.equal(object.email).and.exist();
      });

      it('should not include fields that are not in the mapper', function() {
        expect(userMappedObject.secrets).not.to.exist();
        expect(adminMappedObject.secrets).not.to.exist();
      });

      it('should select the proper mapper based on user', function() {
        expect(userMappedObject.admin).not.to.exist();
        expect(adminMappedObject.admin).to.equal(true);
      });
    });
  });

  describe('handles missing mappers', function() {
    var superOM = new SuperOM();
    it('should throw a missing mapper error', function() {
      var object = {
        "name": "William Franklyn Bowser"
      };
      var mapObjectFunc = superOM.mapObject.bind(superOM, object, {map: "database", mapper: "gremlins"});

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
      var mapObjectFunc = superOM.mapObject.bind(superOM, object, {map: "database", mapper: "koopas"});

      expect(mapObjectFunc).to.throw(/Map not found/);
    });
  });

  describe('handles null', function() {
    var superOM = new SuperOM();
    it('should return null if the object is null', function() {
      superOM.addMapper({"domain":{}}, "users");
      var mappedObject = superOM.mapObject(null, {map: "domain", mapper: "users"});

      expect(mappedObject).to.equal(null);
    });

    it('should persist explicit null or undefined fields by default', function() {
      superOM.addMapper({
        "domain": {
          name: 'name',
          fieldSetToNull: 'fieldSetToNull',
          fieldSetToUndefined: 'fieldSetToUndefined',
          nullField: 'nullFieldChangedName'
        }
      }, "users");
      var object = {
        name: 'Peaches',
        fieldSetToNull: null,
        fieldSetToUndefined: null,
        nullField: null
      };
      var mappedObject = superOM.mapObject(object, {map: "domain", mapper: "users"});

      expect(mappedObject).to.have.property('fieldSetToNull').and.eql(null);
      expect(mappedObject).to.have.property('fieldSetToUndefined').and.eql(null);
      expect(mappedObject).to.have.property('nullFieldChangedName').and.eql(null);
    });

    it('should remove null or undefined fields if {clean: true} passed as an option', function() {
      superOM.addMapper({
        "domain": {
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
      var mappedObject = superOM.mapObject(object, {map: "domain", mapper: "users", clean: true});

      expect(mappedObject).not.to.have.property('fieldSetToNull');
      expect(mappedObject).not.to.have.property('fieldSetToUndefined');
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
      var mappedObject = superOM.mapObject(object, {map: 'domain', mapper: 'users'});

      expect(mappedObject).not.to.have.property('notOnObject');
    });

  });
});

