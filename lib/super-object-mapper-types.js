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
  }

}
