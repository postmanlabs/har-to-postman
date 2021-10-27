const JSON_MODE = 'raw',
  JSON_LANGUAGE_ID = 'json';


/**
 * Maps a har request post data into a postman body when is json
 * @param {object} processOptions process options
 * @returns {object} Postman's body structure
 */
function getCharForIndentation(processOptions) {
  if (processOptions && processOptions.indentCharacter) {
    if (typeof processOptions.indentCharacter === 'string' &&
      processOptions.indentCharacter.toLowerCase() === 'tab') {
      return '\t';
    }
    else if (typeof processOptions.indentCharacter === 'string') {
      return processOptions.indentCharacter;
    }
  }
  return ' ';
}

/**
 * Parses and format a json message
 * @param {string} message message from either request or response
 * @param {object} options process options
 * @returns {object} Postman's body structure
 */
function parseAndFormat(message, options) {
  if (message) {
    return JSON.stringify(JSON.parse(message), null, getCharForIndentation(options));
  }
}

/**
 * Maps a har request post data into a postman body when is json
 * @param {object} harRequest parsed HAR content
 * @param {object} options process options
 * @returns {object} Postman's body structure
 */
function mapBodyFromJson(harRequest, options) {
  let textToReturn = '';
  if (harRequest && harRequest.postData) {
    textToReturn = parseAndFormat(harRequest.postData.text, options);
  }
  return {
    mode: JSON_MODE,
    raw: textToReturn,
    options: { raw: { language: JSON_LANGUAGE_ID } }
  };
}

/**
 * Maps a har request post data into a postman body when is json
 * @param {object} harResponse parsed HAR response content
 * @param {object} options process options
 * @returns {object} Postman's body structure
 */
function mapBodyFromJsonResponse(harResponse, options) {
  let textToReturn = '';
  if (harResponse && harResponse.content) {
    textToReturn = parseAndFormat(harResponse.content.text, options);
  }
  return {
    body: textToReturn,
    language: JSON_LANGUAGE_ID
  };
}

/**
 * Maps a Parsed HAR request postData into a postman Collection body file into a Postman Collection
 * accordingly to the sent options
 * @param {object} harRequest parsed HAR content
 * @param {object} options process option
 * @param {string} collectionName collection's name if defined previously
 * @returns {Collection} Postman's collection object
 */
function mapBody(harRequest, options) {
  if (harRequest.bodySize > 0 && harRequest.postData.mimeType === 'application/json') {
    return mapBodyFromJson(harRequest, options);
  }
  return undefined;
}

/**
 * Maps a Parsed HAR request postData into a postman Collection body file into a Postman Collection
 * accordingly to the sent options
 * @param {object} harResponse parsed HAR response content
 * @param {object} options process option
 * @param {string} collectionName collection's name if defined previously
 * @returns {Collection} Postman's collection object
 */
function mapBodyResponse(harResponse, options) {
  if (harResponse.bodySize > 0 && harResponse.content.mimeType === 'application/json') {
    return mapBodyFromJsonResponse(harResponse, options);
  }
  return undefined;
}

module.exports = {
  mapBodyFromJson,
  mapBody,
  mapBodyFromJsonResponse,
  mapBodyResponse
};
