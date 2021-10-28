/* eslint-disable no-restricted-modules */
const InputError = require('../InputError'),
  fs = require('fs');

/**
 *
 * @description Takes an input object {data: <string>, type: <string>} and returns
 * the processed information according to the nput
 *
 * @param {*} input {data: <string>, type: <string>}
 * @returns {object} file/string content and input data
 */
function readInput(input) {
  let data;
  if (!input.data) {
    throw new InputError('Input.data not provided');
  }
  else if (input.type === 'file') {
    try {
      data = fs.readFileSync(input.data, 'utf-8');
    }
    catch (error) {
      throw new InputError(`File ${input.data.split('/').reverse()[0]} not found`);
    }
  }
  else if (input.type === 'string') {
    data = input.data;
  }
  else {
    throw new InputError(`Invalid input type (${input.type}). Type must be file/string.`);
  }
  return data;
}

/** Method to help defining where the name will be extracted
 * Return the file name if input is file type, else return an empty string
 * @param {inputObject} input input object of type {type: <string>, data: <string>}
 * @returns {string} Return the file name if input is file type, else return an empty string
 */
function getCollectionNameFromFileOrEmpty(input) {
  let name;
  if (input.type === 'file') {
    if (!input.data) {
      return {
        result: false,
        reason: 'Input not provided'
      };
    }
    name = input.data.split('/').reverse()[0];
  }
  else if (input.type === 'string') {
    name = '';
  }
  else {
    return {
      result: false,
      reason: `Invalid input type (${input.type}). Type must be file/string.`
    };
  }
  return name;
}

/**
 * Sort an array of entries by startedDateTime property
 * @param {array} entries The array of entries to sort
 * @returns {array} Resultant sorted array
 */
function sortEntries(entries) {
  const sortedEntries = entries.sort((a, b) => {
    return new Date(a.startedDateTime) - new Date(b.startedDateTime);
  });
  return sortedEntries;
}

module.exports = {
  readInput,
  getCollectionNameFromFileOrEmpty,
  sortEntries
};
