ObjectMapper = require('object-mapper');

//SuperOM presents an API for object-mapper schemas with type enforcement.
//@wankdanker's node-object-mapper does the meat of the work - SuperOM
//simply presents the pattern I found myself repeating while using the o.g. OM

function SuperOM () {
};

SuperOM._mappers = {};

SuperOM.prototype.mapObject = function(map, collection, object) {
  if (!SuperOM._mappers) {
    //TODO: unit test
    throw new Error('Init fail: No mappers object');
  } else if (!SuperOM._mappers[collection]) {
    throw new Error('Collection not found');
  }

  return ObjectMapper.merge(object, {}, SuperOM._mappers[collection][map]);
};

SuperOM.prototype.addMapper = function(mapper, collectionName) {
  SuperOM._mappers[collectionName] = mapper;
};

module.exports = SuperOM;
