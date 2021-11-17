const JSON_MODE = 'raw',
  JSON_LANGUAGE_ID = 'json',
  HTML_LANGUAGE_ID = 'html',
  XML_LANGUAGE_ID = 'xml',
  PLAIN_TEXT_LANGUAGE_ID = 'text',
  SUPPORTED_BODY_TYPES = {
    applicationJson: 'application/json',
    textCss: 'text/css',
    textHtml: 'text/html',
    textPlain: 'text/plain',
    textJavascript: 'text/javascript',
    applicationJavascript: 'application/javascript',
    applicationXml: 'application/xml',
    formData: 'multipart/form-data',
    urlEncoded: 'application/x-www-form-urlencoded'
  },
  {
    getPMBodyFromFormData
  } = require('./utils/formDataHelper');

/**
 * Returns the indent character from process options
 * if is "tab" returns the correct scaped character
 * otherwise returns the character if exists, if not then a
 * whitespace
 * @param {object} processOptions process options
 * @returns {string} the indentation character
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
 * Maps a har response post data into a postman body when is json
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
 * Maps a har response post data into a postman body when the content does not need any format
 * @param {object} harResponse parsed HAR response content
 * @param {string} language The preview language to use in preview ('text' by default)
 * @returns {object} Postman's body structure
 */
function mapBodyFromUnformattedTypeResponse(harResponse, language = PLAIN_TEXT_LANGUAGE_ID) {
  let textToReturn;
  if (harResponse && harResponse.content) {
    textToReturn = harResponse.content.text;
  }
  return {
    body: textToReturn,
    language: language
  };
}

/**
 * Maps a har response post data into a postman body when the content does not need any format
 * @param {object} harRequest parsed HAR response content: ;
 * @param {string} language The preview language to use in preview ('text' by default)
 * @returns {object} Postman's body structure
 */
function mapBodyFromUnformattedTypeRequest(harRequest, language = PLAIN_TEXT_LANGUAGE_ID) {
  let textToReturn = '';
  if (harRequest && harRequest.postData) {
    textToReturn = harRequest.postData.text;
  }
  return {
    mode: JSON_MODE,
    raw: textToReturn,
    options: { raw: { language } }
  };
}

/**
 * Generate a postman structure by default with text language
 * @returns {object} Postman's body structure
 */
function handleUnsupportedResponseType() {
  return {
    body: 'This content type is not supported in the response body',
    language: PLAIN_TEXT_LANGUAGE_ID
  };
}

/**
 * Validate if the provided mime type matches with the expected one
 * @param {text} mimeType The mime type to evaluate with the supported types
 * @param {text} expectedMimeType The expected mime type
 * @returns {boolean} If the expected mimetype matches with the provided one
 */
function isMimeType(mimeType, expectedMimeType) {

  return mimeType ? mimeType.includes(expectedMimeType) : false;
}

/**
 * It proceses and return the params from an url encoded request body
 * @param {object} harRequest The har request
 * @returns {array} the list of parameters in the url
 */
function getParamsFromEncoded(harRequest) {
  const urlParamsArray = harRequest.postData.params,
    urlParamsAsText = harRequest.postData.text;
  let params = [];
  if (urlParamsArray.length > 0) {
    params = urlParamsArray.map((param) => {
      return {
        key: param.name,
        value: param.value
      };
    });
  }
  else if (urlParamsAsText) {
    params = urlParamsAsText.split('&')
      .map((keyValueAsText) => {
        let [key, value] = keyValueAsText.split('=');
        return {
          key,
          value
        };
      });
  }
  return {
    mode: 'urlencoded',
    urlencoded: params
  };
}

/**
 * Validates if the the request provides from a har file generated in safari browser
 * @param {object} harRequest har request
 * @returns {boolean} true if request privides from a har generated in safari
 */
function isSafariUrlEncoded(harRequest) {
  const hasNoParams = harRequest.postData.params !== undefined &&
    harRequest.postData.params.length === 0,
    hasNoMimeType = harRequest.postData.mimeType === '',
    paramsInTextPattern = new RegExp('\\w*=[\\w\\s]+', 'g'),
    contentText = harRequest.postData.text,
    paramsInTextByPattern = contentText.match(paramsInTextPattern),
    paramsInTextBySplit = contentText.split('&'),
    textContainsParams = paramsInTextByPattern &&
      paramsInTextByPattern.length === paramsInTextBySplit.length,
    isSafariUrlEncoded = hasNoParams && hasNoMimeType && textContainsParams;

  return isSafariUrlEncoded;
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
  let handledBody;
  if (harRequest.bodySize > 0) {
    const mimeType = harRequest.postData.mimeType;
    if (isMimeType(mimeType, SUPPORTED_BODY_TYPES.applicationJson)) {
      handledBody = mapBodyFromJson(harRequest, options);
    }
    else if (isMimeType(mimeType, SUPPORTED_BODY_TYPES.applicationXml)) {
      handledBody = mapBodyFromUnformattedTypeRequest(harRequest, XML_LANGUAGE_ID);
    }
    else if (isMimeType(mimeType, SUPPORTED_BODY_TYPES.formData)) {
      handledBody = getPMBodyFromFormData(harRequest);
    }
    else if (isMimeType(mimeType, SUPPORTED_BODY_TYPES.textJavascript)) {
      handledBody = mapBodyFromUnformattedTypeRequest(harRequest, PLAIN_TEXT_LANGUAGE_ID);
    }
    else if (isMimeType(mimeType, SUPPORTED_BODY_TYPES.textPlain)) {
      handledBody = mapBodyFromUnformattedTypeRequest(harRequest, PLAIN_TEXT_LANGUAGE_ID);
    }
    else if (
      isMimeType(mimeType, SUPPORTED_BODY_TYPES.urlEncoded) ||
      isSafariUrlEncoded(harRequest)
    ) {
      handledBody = getParamsFromEncoded(harRequest);
    }
  }
  return handledBody;
}

/**
 * Maps a Parsed HAR request postData into a postman Collection body
 * accordingly to the sent options
 * @param {object} harResponse parsed HAR response content
 * @param {object} options process option
 * @param {string} collectionName collection's name if defined previously
 * @returns {Collection} Postman's response body
 */
function mapBodyResponse(harResponse, options) {
  let handledBody;
  if (harResponse.content.size > 0) {
    const mimeType = harResponse.content.mimeType;

    switch (mimeType) {
      case SUPPORTED_BODY_TYPES.applicationJson:
        handledBody = mapBodyFromJsonResponse(harResponse, options);
        break;
      case SUPPORTED_BODY_TYPES.applicationJavascript:
        handledBody = mapBodyFromUnformattedTypeResponse(harResponse);
        break;
      case SUPPORTED_BODY_TYPES.textCss:
        handledBody = mapBodyFromUnformattedTypeResponse(harResponse);
        break;
      case SUPPORTED_BODY_TYPES.textHtml:
        handledBody = mapBodyFromUnformattedTypeResponse(harResponse, HTML_LANGUAGE_ID);
        break;
      case SUPPORTED_BODY_TYPES.textPlain:
        handledBody = mapBodyFromUnformattedTypeResponse(harResponse);
        break;
      case SUPPORTED_BODY_TYPES.textJavascript:
        handledBody = mapBodyFromUnformattedTypeResponse(harResponse);
        break;
      case SUPPORTED_BODY_TYPES.applicationXml:
        handledBody = mapBodyFromUnformattedTypeResponse(harResponse, XML_LANGUAGE_ID);
        break;
      default:
        handledBody = handleUnsupportedResponseType();
        break;
    }
  }
  return handledBody;
}

module.exports = {
  mapBodyFromJson,
  mapBody,
  mapBodyFromJsonResponse,
  mapBodyResponse
};
