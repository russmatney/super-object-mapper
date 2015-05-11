var expect = require('chai').expect;
var SuperOM = require('../');

var ObjectID = require('mongodb-core').BSON.ObjectID;

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
      var mappedObject = superOM.mapObject(object, {map: "domain", mapper: "users"});

      expect(mappedObject.doodle).to.be.a("string").and.equal(object.name)
        .and.exist();
    });

    it('should set field to null if value is null', function() {
      superOM.addMapper({
        "domain": {
          "name": superOMType.string("name")
        }
      }, "users");
      var object = {
        name: null
      };
      var mappedObject = superOM.mapObject(object, {map: "domain", mapper: "users"});

      expect(mappedObject).to.have.property('name').and.eql(null);
    });

    it('should return nothing if value is not passed', function() {
      superOM.addMapper({
        "domain": {
          "name": superOMType.string("name")
        }
      }, "users");
      var object = { };
      var mappedObject = superOM.mapObject(object, {map: "domain", mapper: "users"});

      expect(mappedObject).not.to.have.property("name");
    });

    var testData = [
      {type: "string", value: "Johnny", expected: "Johnny"},
      {type: "number", value: 8, expected: '8'},
      {type: "float", value: 8.1234, expected: '8.1234'},
      {type: "ObjectID", value: ObjectID("123456abcdef654321fedcba"), expected: "123456abcdef654321fedcba"}
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
        var mappedObject = superOM.mapObject(object, {map: "domain", mapper: "users"});

        expect(mappedObject.attr).to.be.a("string").and.equal(tData.expected)
          .and.exist();
      });
    });

  });


  describe('.objectId()', function(){
    var superOM = new SuperOM();

    it('should convert keys properly', function() {
      superOM.addMapper({
        "domain": {
          "name": superOMType.objectId("doodle")
        }
      }, "users");
      var object = {
        name: ObjectID("123456abcdef654321fedcba")
      };
      var mappedObject = superOM.mapObject(object, {map: "domain", mapper: "users"});

      expect(mappedObject.doodle).to.be.an.instanceof(ObjectID).and.eql(object.name)
        .and.exist();
    });

    it('should set field to null if value is null', function() {
      superOM.addMapper({
        "domain": {
          "name": superOMType.objectId("name")
        }
      }, "users");
      var object = {
        name: null
      };
      var mappedObject = superOM.mapObject(object, {map: "domain", mapper: "users"});

      expect(mappedObject).to.have.property('name').and.eql(null);
    });

    it('should return nothing if value is not passed', function() {
      superOM.addMapper({
        "domain": {
          "name": superOMType.objectId("name")
        }
      }, "users");
      var object = { };
      var mappedObject = superOM.mapObject(object, {map: "domain", mapper: "users"});

      expect(mappedObject).not.to.have.property("name");
    });

    var testData = [
      {type: "string", value: "123456abcdef654321fedcba", expected: ObjectID("123456abcdef654321fedcba")},
      {type: "ObjectID", value: ObjectID("123456abcdef654321fedcba"), expected: ObjectID("123456abcdef654321fedcba")}
    ];

    testData.forEach(function(tData) {
      it('should convert ' + tData.type + 's to objectIds', function() {
        superOM.addMapper({
          "domain": {
            "attr": superOMType.objectId("attr")
          }
        }, "users");
        var object = {
          attr: tData.value
        };
        var mappedObject = superOM.mapObject(object, {map: "domain", mapper: "users"});

        expect(mappedObject.attr).to.be.an.instanceof(ObjectID).and.eql(tData.expected)
          .and.exist();
      });
    });

  });

});
