ObjectMapper = require('object-mapper');

function superOM () {
};

superOM.mapObject = function(map, collection, object) {
  return ObjectMapper.merge(object, {}, this.mappers[collection][map]);
};

superOM.addMapper = function(mapper, collectionName) {
  if (!this.mappers) {
    this.mappers = {};
  }

  this.mappers[collectionName] = mapper;
};

module.exports = superOM;
