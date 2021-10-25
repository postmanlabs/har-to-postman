const COLLECTION_TYPE = 'collection',
  getOptions = require('./utils/options').getOptions,
  { parse } = require('../lib/HARParser'),
  {
    map,
    getCollectionName
  } = require('../lib/HARToPostmanCollectionMapper'),
  {
    getCollectionNameFromFileOrEmpty
  } = require('./utils/readInput'),
  {
    Validator
  } = require('./Validator');


/**
 * Class to validate and convert files with HAR specification to Postman collection format.
 * @param {object} input Input object with format {data: <string>, type: <string>}
 * @param {object} options Contains some options to modify conversion result
 */
class SchemaPack {
  constructor(input, options = {}) {
    this.input = input;
    this.options = options;
    this.validationResult;
    this.validated = false;
    this.parsedData;
    this.name = getCollectionNameFromFileOrEmpty(this.input);
    this.validate();
  }

  /**
   * Validates if provided input has a correct format and contents
   * @returns {object} A validation object with format {result: <boolean>, reason: <string>}
   */
  validate() {
    let result = new Validator().validate(this.input);
    this.parsedData = parse(result.jsonData);
    this.validationResult = result.valResult;
    this.input = {
      type: 'string',
      data: result.jsonData
    };
    this.validated = true;
    return this.validationResult;
  }

  /**
   * Run the HAR to postman collection process
   * @param {function} callback A function to excecute after conversion process finishes
   * @returns {function} A callback execution
   */
  convert(callback) {
    let collectionJSON;
    try {
      let postmanCollection = map(this.parsedData, this.options, this.name);
      collectionJSON = postmanCollection.toJSON();
    }
    catch (error) {
      return callback(error);
    }
    return callback(null, {
      result: true,
      output: [
        {
          type: COLLECTION_TYPE,
          data: collectionJSON
        }
      ]
    });
  }

  /**
   *
   * @description Returns the name and type of the conversion
   *
   * @param {*} callback return
   * @returns {object} type and name properties
   */
  getMetaData(callback) {
    if (!this.validationResult.result) {
      return callback(null, this.validationResult);
    }
    let collectionName = getCollectionName(this.parsedData, this.name);
    return callback(null, {
      result: true,
      name: collectionName,
      output: [
        {
          type: COLLECTION_TYPE,
          name: collectionName
        }
      ]
    });
  }


  /**
   *
   * @description returns the available options for the process
   * @param {string} [mode='document'] Describes use-case. 'document' will return an array
   * with all options being described. 'use' will return the default values of all options
   * @param {Object} criteria Decribes required criteria for options to be returned. can have properties
   * @param {*} callback return
   * @returns {Array} An array or object (depending on mode) that describes available options
   * with format {
   *    name: <string>,
   *    id: <string>,
   *    type: <string>,
   *    default: <string>,
   *    availableOptions: Array of <string>
   *    description: <string>,
   *    external: <boolean>,
   *    usage:  Array of <string> }
   */
  static getOptions(mode, criteria) {
    return getOptions(mode, criteria);
  }
}

module.exports = {
  SchemaPack
};
