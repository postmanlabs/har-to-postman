const HARError = require('./HARError');

/**
 * Returns a HAR content fiel parsed into a javascript object
 * @param {string} harContent the HAR File content string
 * @returns {object} the  parsed HAR
 */
function parse(harContent) {
  let harContentParsed;
  try {
    harContentParsed = JSON.parse(harContent);
  }
  catch (e) {
    throw new HARError('Cannot parse json object', e);
  }
  return harContentParsed;
}

module.exports = {
  parse
};
