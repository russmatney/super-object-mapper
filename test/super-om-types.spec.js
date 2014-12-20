var expect = require('chai').expect;
var SuperOM = require('../');

describe('Super Object Mapper type enforcement', function() {
  var superOMType = SuperOM.Types;
  it('should expose a Type object', function() {
    expect(superOMType).to.exist();
  });

  describe('.string()', function(){
    var superOM = new SuperOM();

    it('should convert keys properly', function() {
      superOM.addMapper({
        "domain": {
          "name": superOMType.string("doodle")
        }
      }, "users");
      var object = {
        name: "Johnny"
      };
      var mappedObject = superOM.mapObject("domain", "users", object);

      expect(mappedObject.doodle).to.be.a("string").and.equal(object.name)
        .and.exist();
    });

    it('should return nothing if value is null', function() {
      superOM.addMapper({
        "domain": {
          "name": superOMType.string("name")
        }
      }, "users");
      var object = {
        name: null
      };
      var mappedObject = superOM.mapObject("domain", "users", object);

      console.log(mappedObject);

      expect(mappedObject.name).not.to.exist();
    });

    it('should return nothing if value is not passed', function() {
      superOM.addMapper({
        "domain": {
          "name": superOMType.string("name")
        }
      }, "users");
      var object = { };
      var mappedObject = superOM.mapObject("domain", "users", object);

      expect(mappedObject.name).not.to.exist();
    });


    it('should convert strings to strings', function() {
      superOM.addMapper({
        "domain": {
          "name": superOMType.string("name")
        }
      }, "users");
      var object = {
        name: "Johnny"
      };
      var mappedObject = superOM.mapObject("domain", "users", object);

      expect(mappedObject.name).to.be.a("string").and.equal(object.name)
        .and.exist();
    });

    it('should convert numbers to strings', function() {
      superOM.addMapper({
        "domain": {
          "count": superOMType.string("count")
        }
      }, "users");
      var object = {
        count: 8
      };
      var mappedObject = superOM.mapObject("domain", "users", object);

      expect(mappedObject.count).to.be.a("string").and.equal('8')
        .and.exist();

    });

  });
});
