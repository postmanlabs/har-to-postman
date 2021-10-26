const InputError = require('./InputError'),
  {
    readInput
  } = require('./utils/readInput'),
  Ajv = require('ajv'),
  schemas = require('./schemas/HAR/harSchemas'),
  addFormats = require('ajv-formats');

/**
 * Class to validate inputObject.
 */
class Validator {

  /**
   * generates a valid result object.
   * @param {string} jsonData jsonData content in string representation
   * @param {boolean} result true when input is valid and viceversa
   * @param {string} reason Return the reason of the result
   * @returns {object} A valid Result object with format {result: <boolean>, reason: <string>}
   */
  result(jsonData, result, reason) {
    return {
      jsonData,
      valResult: {
        result,
        reason
      }
    };
  }

  /**
   * Validates if input contains necessary format and content.
   * In case of files it validates if provided file path exists.
   * @param {object} input  Contains type (string/file) of input and data (stringValue/filePath)
   *                        Format: {data: <string>, type: <string>}
   * @param {object} xmlParser xml parser
   * @returns {object} A valid result object with format {result: <boolean>, reason: <string>}
   */
  validate(input) {
    let data;

    try {
      data = readInput(input);
    }
    catch (inputError) {
      return this.result(undefined, false, inputError.message);
    }

    return this.result(data, true, 'Success');
  }

  validateStructure(data, name = 'har') {
    data = data || {};
    let validate,
      res,
      ajv = new Ajv({
        allErrors: true,
        strict: false
      });
    addFormats(ajv);
    ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-06.json'));
    ajv.addSchema(schemas);

    validate = ajv.getSchema(name + '.json');
    res = validate(data);

    if (!res) {
      throw new InputError(
        'Invalid syntax provided for HAR content',
        validate.errors
      );
    }

  }

}

module.exports = {
  Validator
};
