const InputError = require('./InputError'),
  {
    readInput
  } = require('./utils/readInput'),
  Ajv = require('ajv'),
  schemas = require('./schemas/HAR/harSchemas'),
  { parse } = require('./HARParser'),
  addFormats = require('ajv-formats');

/**
 * Class to validate inputObject.
 */
class Validator {

  /**
   * generates a valid result object.
   * @param {string} jsonData jsonData content in string representation
   * @param {object} parsedData HAR parsed object
   * @param {boolean} result true when input is valid and viceversa
   * @param {string} reason Return the reason of the result
   * @returns {object} A valid Result object with format {result: <boolean>, reason: <string>}
   */
  result(jsonData, parsedData, result, reason) {
    return {
      jsonData,
      parsedData,
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
    let data, parsedData;

    try {
      data = readInput(input);
      parsedData = parse(data);
      this.validateStructure(parsedData);
    }
    catch (inputError) {
      let errorDescription = this.formatMessageFromInputError(inputError);
      return this.result(undefined, undefined, false, errorDescription);
    }

    return this.result(data, parsedData, true, 'Success');
  }

  /**
   * Gets the real message from Ajv
   * @param {InputError} inputError Generated input error
   * @returns {string} Description of input error and first error data message
   */
  formatMessageFromInputError(inputError) {
    if (this.hasDataMessage(inputError)) {
      return inputError.message + ' ' + inputError.data[0].message;
    }
    return inputError.message;
  }

  /**
   * verifies if the input has the data message set
   * @param {InputError} inputError Generated input error
   * @returns {boolean} determines if the data message property can be read
   */
  hasDataMessage(inputError) {
    return inputError.data && inputError.data[0] && inputError.data[0].message;
  }

  /**
   * Validates if input contains necessary format and content.
   * @param {object} data HAR parsed data
   * @param {string} schemaName optional the name of the schema to use in validation
   * @returns {undefined} throws an error if document data is not valid har file
   */
  validateStructure(data, schemaName = 'har') {
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
    ajv.addFormat('ipv6brackets', /(\[(?:[:0-9A-Fa-f]+)\])/);
    validate = ajv.getSchema(schemaName + '.json');
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
