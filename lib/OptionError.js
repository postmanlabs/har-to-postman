/**
 * This class helps to identify and encapsulates errors in option values
 * @constructor
 * @param {*} message errorMessage
 */
class OptionError {
  constructor(message, data) {
    this.message = message || '';
    this.data = data || {};
  }
}

OptionError.prototype = Error();

module.exports = OptionError;
