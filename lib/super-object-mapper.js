var ObjectMapper = require('object-mapper'),
  _ = require('lodash');


//SuperOM presents an API for object-mapper schemas with type enforcement.
//@wankdanker's node-object-mapper does the meat of the work - SuperOM
//simply presents the pattern I found myself repeating while using the o.g. OM

function SuperOM () {
};

SuperOM._mappers = {};

SuperOM.prototype.mapObject = function(map, mapper, object, options) {
  if (!object) return null;
  if (object instanceof Array) {
    var array = object;
    if (array.length == 0) return [];

    var mappedArray = [];
    var self = this;
    array.forEach(function(obj) {
      mappedArray.push(self.mapObject(map, mapper, obj, options));
    });
    return mappedArray;
  }

  if (!options) options = {};

  if (!SuperOM._mappers) {
    //TODO: unit test
    throw new Error('Init fail: No mappers object');
  } else if (!SuperOM._mappers[mapper]) {
    throw new Error('Mapper not found');
  } else if (!SuperOM._mappers[mapper][map]) {
    throw new Error('Map not found');
  }

  var mappedObject = ObjectMapper.merge(object, {}, SuperOM._mappers[mapper][map]);

  if (options.clean) {
    mappedObject = _.pick(mappedObject, _.identity);
  }

  return mappedObject;
};

SuperOM.prototype.addMapper = function(mapper, mapperName) {
  SuperOM._mappers[mapperName] = mapper;
};

module.exports = SuperOM;
