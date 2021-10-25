/**
 * This class helps to identify and encapsulates errors in process
 * constructor HARError
 * @constructor
 * @param {*} message errorMessage
 */
class HARError {
  constructor(message, data) {
    this.message = message || '';
    this.data = data || {};
  }
}

HARError.prototype = Error();

module.exports = HARError;
