var expect = require('chai').expect;
var SuperOM = require('../');

describe('Super Object Mapper type enforcement', function() {
  var superOMType = SuperOM.Types;
  it('should expose a Type object', function() {
    expect(superOMType).to.exist();
  });

  describe('.string()', function(){
    var superOM = new SuperOM();

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

      expect(typeof mappedObject.name).to.equal("string");
    });

  });
});
