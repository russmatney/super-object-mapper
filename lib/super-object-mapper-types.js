var ObjectID = require('mongodb-core').BSON.ObjectID;

module.exports = {

  string: function(key) {
    return {
      key: key,
      transform: function(value) {
        if (!value) return;
        if (typeof value == 'string') {
          return value;
        } else {
          return String(value);
        }
      }
    }
  },

  objectId: function(key) {
    return {
      key: key,
      transform: function(value) {
        if (!value) return;
        if (value instanceof ObjectID) {
          return ObjectID(value.toString());
        } else {
          return ObjectID(value);
        }
      }
    }
  }


}
