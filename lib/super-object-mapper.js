var ObjectMapper = require('object-mapper'),
  _ = require('lodash');

var defaults = {
  options: {
    clean: false
  }
};

function SuperOM () {
};

SuperOM._mappers = {};

SuperOM.prototype.mapObject = function(map, mapper, object, options) {
  if (!object) return null;

  //Handle Array
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

  if (!options) options = defaults.options;

  if (!SuperOM._mappers) {
    throw new Error('Init fail: No mappers object'); //TODO: unit test
  } else if (!SuperOM._mappers[mapper]) {
    throw new Error('Mapper not found');
  } else if (!SuperOM._mappers[mapper][map]) {
    throw new Error('Map not found');
  }

  var persistedFalsyValues = {};
  for (var key in object) {
    if (!object[key]) {
      persistedFalsyValues[key] = ObjectMapper.getKeyValue(SuperOM._mappers[mapper][map], key);
    }
  }

  var mappedObject = ObjectMapper.merge(object, {}, SuperOM._mappers[mapper][map]);

  //removes falsy vals from object
  mappedObject = _.pick(mappedObject, _.identity);

  //if clean is false, adds explict nulls back to object
  if (!options.clean) {
    for (var key in persistedFalsyValues) {
      if (persistedFalsyValues[key]) {
        mappedObject[persistedFalsyValues[key]] = null;
      }
    }
  }

  return mappedObject;
};

SuperOM.prototype.addMapper = function(mapper, mapperName) {
  SuperOM._mappers[mapperName] = mapper;
};

module.exports = SuperOM;
