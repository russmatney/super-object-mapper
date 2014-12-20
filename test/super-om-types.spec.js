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

    var testData = [
      {type: "string", value: "Johnny", expected: "Johnny"},
      {type: "number", value: 8, expected: '8'},
      {type: "float", value: 8.1234, expected: '8.1234'}
      //TODO: test for MongoIds
    ];

    testData.forEach(function(tData) {
      it('should convert ' + tData.type + 's to strings', function() {
        superOM.addMapper({
          "domain": {
            "attr": superOMType.string("attr")
          }
        }, "users");
        var object = {
          attr: tData.value
        };
        var mappedObject = superOM.mapObject("domain", "users", object);

        expect(mappedObject.attr).to.be.a("string").and.equal(tData.expected)
          .and.exist();
      });
    });

  });
});
