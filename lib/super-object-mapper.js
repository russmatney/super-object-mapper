var ObjectMapper = require('object-mapper'),
  _ = require('lodash');

var defaults = {
  options: {
    clean: false
  }
};

function SuperOM () {};

SuperOM.Types = require('./super-object-mapper-types');

SuperOM._mappers = {};

SuperOM.prototype.mapObject = function(object, options) {
  if (!object) return null;
  //TODO: validation could be more direct, like so:
  //if (!object.mapper) throw new Error("SuperOM expected object.mapper");
  //if (!object.map) throw new Error("SuperOM expected object.map");

  //Handle Arrays
  if (object instanceof Array) {
    var array = object;
    if (array.length == 0) return [];
    var self = this;
    return array.map(function(obj) {
      return self.mapObject(obj, options);
    });
  }

  var mapper = "";
  if (options.mapper instanceof Function) {
    mapper = options.mapper(object);
    console.log(mapper);
  } else {
    mapper = options.mapper;
  }

  //TODO: append values
  if (!options) options = defaults.options;

  if (!SuperOM._mappers) {
    throw new Error('Init fail: No mappers object');
  } else if (!SuperOM._mappers[mapper]) {
    throw new Error('Mapper not found');
  } else if (!SuperOM._mappers[mapper][options.map]) {
    throw new Error('Map not found');
  }

  //define mapObject
  var mapObject = SuperOM._mappers[mapper][options.map];

  //collect explict nulls for persisting
  var persistedFalsyValues = {};
  for (var key in object) {
    if (!object[key]) {
      var mappedKey = ObjectMapper.getKeyValue(mapObject, key);
      //TODO: fork or fix node-object-mapper so this always returns the key
      if (typeof mappedKey !== 'string') {
        mappedKey = mappedKey.key;
      }
      persistedFalsyValues[mappedKey] = true;
    }
  }

  //Do the work
  var mappedObject = ObjectMapper.merge(object, {}, mapObject);

  //removes all falsy vals from object
  mappedObject = _.pick(mappedObject, _.identity);

  //if clean is false, adds explict nulls back to object
  if (!options.clean) {
    for (var key in persistedFalsyValues) {
      mappedObject[key] = null;
    }
  }

  return mappedObject;
};

SuperOM.prototype.addMapper = function(mapper, mapperName) {
  SuperOM._mappers[mapperName] = mapper;
};

module.exports = SuperOM;
