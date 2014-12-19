ObjectMapper = require('object-mapper');

function superOM () {
};

superOM.mapObject = function(map, collection, object) {
  return ObjectMapper.merge(object, {}, this._mappers[collection][map]);
};

superOM.addMapper = function(mapper, collectionName) {
  if (!this._mappers) {
    this._mappers = {};
  }

  this._mappers[collectionName] = mapper;
};

module.exports = superOM;
