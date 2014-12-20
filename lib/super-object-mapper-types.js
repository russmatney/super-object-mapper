module.exports = {

  string: function(key) {
    return {
      key: key,
      transform: function(value) {
        return value;
      }
    }
  }

}
