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

  //TODO: explict defaults object
  if (!options) options = {};

  if (!SuperOM._mappers) {
    throw new Error('Init fail: No mappers object'); //TODO: unit test
  } else if (!SuperOM._mappers[mapper]) {
    throw new Error('Mapper not found');
  } else if (!SuperOM._mappers[mapper][map]) {
    throw new Error('Map not found');
  }

  //TODO: ugly implementation of persisted nulls. there is a better way.
  var persistedNullProperties = {};
  for (var key in object) {
    if (!object[key]) {
      persistedNullProperties[key] = true;
    }
  }
  var mappedPersistedNullProperties = ObjectMapper.merge(persistedNullProperties, {}, SuperOM._mappers[mapper][map]);

  var mappedObject = ObjectMapper.merge(object, {}, SuperOM._mappers[mapper][map]);

  //removes falsy vals from object
  mappedObject = _.pick(mappedObject, _.identity);

  //if !clean set, adds explict nulls back to object
  if (!options.clean) {
    for (var key in mappedPersistedNullProperties) {
      if (mappedPersistedNullProperties[key]) {
        mappedObject[key] = null;
      }
    }
  }

  return mappedObject;
};

SuperOM.prototype.addMapper = function(mapper, mapperName) {
  SuperOM._mappers[mapperName] = mapper;
};

module.exports = SuperOM;
