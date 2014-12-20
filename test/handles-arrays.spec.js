var expect = require('chai').expect;
var SuperOM = require('../');

describe('Super Object Mapper handles arrays', function() {

  beforeEach(function() {
    SuperOM._mappers = {};
  });

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

    expect(mappedArray[0].name).to.eql("Luigi");
    expect(mappedArray[1].name).to.eql("Peach");
    expect(mappedArray[1]).not.to.have.property('mustache');
    expect(mappedArray[1]).not.to.have.property('last_egg_laid');
    expect(mappedArray[2].name).to.eql('Yoshi');
    expect(mappedArray[2].last_egg_laid).to.exist();
  });
});


