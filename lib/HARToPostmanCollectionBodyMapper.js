const JSON_MODE = 'raw',
  JSON_LANGUAGE_ID = 'json';

/**
 * Maps a har request post data into a postman body when is json
 * @param {object} harRequest parsed HAR content
 * @returns {object} Postman's body structure
 */
function mapBodyFromJson(harRequest) {
  return {
    mode: JSON_MODE,
    raw: harRequest && harRequest.postData ? harRequest.postData.text : '',
    options: { raw: { language: JSON_LANGUAGE_ID } }
  };
}

/**
 * Maps a har request post data into a postman body when is json
 * @param {object} harResponse parsed HAR response content
 * @returns {object} Postman's body structure
 */
function mapBodyFromJsonResponse(harResponse) {
  return {
    body: harResponse && harResponse.content ? harResponse.content.text : '',
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
