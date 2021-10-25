const DEFAULT_COLLECTION_NAME = 'HAR To Postman Generated',
  DEFAULT_COLLECTION_DESCRIPTION = 'HAR To Postman Generated Collection',
  DEFAULT_ITEM_NAME = 'Generated without pathname and method',
  DEFAULT_ITEM_RESPONSE_NAME = 'Generated without item name and code response',
  NO_RESPONSE_CODE_FOUND = 'no response code found',
  NO_PATHNAME_ITEM_NAME = 'Generated without pathname',
  NO_METHOD_ITEM_NAME = 'Generated without method',
  DEFAULT_COLLECTION_VERSION = '2.0.0',
  { Collection, Response } = require('postman-collection'),
  { mapBody,
    mapBodyResponse
  } = require('./HARToPostmanCollectionBodyMapper'),
  { URL } = require('url'),
  { removeProtocolFromURL } = require('./utils/urlUtils'),
  responseCodes = {
    200: 'successfully',
    201: 'created',
    202: 'accepted',
    204: 'no-content',
    304: 'not modified',
    403: 'forbidden',
    404: 'not found'
  };

/**
 * Gets the possible collection name from pages object
 * if no present returns undefined
 * @param {object} parsedHAR parsed HAR content
 * @returns {string} collection's possible name from pages or undefined
 */
function getCollectionPossibleNameFromPages(parsedHAR) {
  let rawTitle = '';
  if (parsedHAR && parsedHAR.log && parsedHAR.log.pages && parsedHAR.log.pages.length > 0) {
    rawTitle = parsedHAR.log.pages[0].title;
    try {
      return removeProtocolFromURL(rawTitle);
    }
    catch (error) {
      return rawTitle;
    }
  }
  return rawTitle;
}

/**
 * Gets the collection name from the HAR Object or
 * if some name is provided returns the same name
 * or the default one
 * @param {object} parsedHAR parsed HAR content
 * @param {string} collectionName optional collection name
 * @returns {string} collection's name.
 */
function getCollectionName(parsedHAR, collectionName = '') {
  let possibleName = getCollectionPossibleNameFromPages(parsedHAR);
  return possibleName ? possibleName : collectionName ? collectionName : DEFAULT_COLLECTION_NAME;
}

/**
 * Gets the collection description from the HAR Object or
 * or the default one
 * @param {object} parsedHAR parsed HAR content
 * @returns {string} collection's description.
 */
function getCollectionDescription(parsedHAR) {
  if (parsedHAR && parsedHAR.log && parsedHAR.log.comment) {
    return parsedHAR.log.comment;
  }
  return DEFAULT_COLLECTION_DESCRIPTION;
}

/**
 * Returns a default version for the collection
 * or the default one
 * @param {object} parsedHAR parsed HAR content
 * @returns {string} collection's description.
 */
function getCollectionVersion() {
  return DEFAULT_COLLECTION_VERSION;
}

/**
 * Gets the name of the postman item
 * @param {object} harRequest parsed HAR request
 * @param {URL} requestURL parsed HAR reques url
 * @returns {string} item's calculated name
 */
function getItemName(harRequest, requestURL) {
  if (!harRequest && !requestURL) {
    return DEFAULT_ITEM_NAME;
  }
  if (!requestURL) {
    return `${NO_PATHNAME_ITEM_NAME} ${harRequest.method}`;
  }
  if (!harRequest) {
    return `${NO_METHOD_ITEM_NAME} ${requestURL.pathname}`;
  }
  return !requestURL ? DEFAULT_ITEM_NAME : `${requestURL.pathname} ${harRequest.method}`;
}


/**
 * Generates a postman body from the har request
 * @param {object} harRequest parsed HAR request
 * @returns {object} postman request body's information
 */
function getBody(harRequest) {
  return mapBody(harRequest);
}

/**
 * Generates postman's headers from har request headers
 * @param {Array} harRequestHeaders array of headers
 * @returns {Array} postman's headers
 */
function getItemRequestHeaders(harRequestHeaders) {
  return harRequestHeaders.map((header) => {
    return { key: header.name, value: header.value };
  });
}

/**
 * Generates postman's headers from har request headers
 * @param {Array} harResponseHeaders array of headers
 * @returns {Array} postman's headers
 */
function getItemResponseHeaders(harResponseHeaders) {
  return harResponseHeaders.map((header) => {
    return { key: header.name, value: header.value };
  });
}


/**
 * Returns the calculated requesturl
 * @param {object} harRequest the requests information
 * @returns {string} the request.url string representation
 */
function generateItemRequestUrl(harRequest) {
  return harRequest.url;
}

/**
 * Generates the structure of a postman request from the har request
 * @param {object} harRequest the request from HAR file
 * @param {object} options the process option
 * @returns {object} Object with structure {
 *   description: string;
 *   method: any;
 *   url: any[];
 *   header: any[];
 *   body: any;
 *  }
 */
function generateItemRequest(harRequest, options) {
  const itemRequest = {
    description: '',
    method: harRequest.method,
    url: generateItemRequestUrl(harRequest),
    header: getItemRequestHeaders(
      harRequest.headers
    ),
    body: getBody(harRequest, options)
  };

  if (itemRequest.header.length === 0) {
    delete itemRequest.header;
  }
  return itemRequest;
}

/**
 * returns an string representation of a given web response code
 * @param {number} code the code
 * @returns {string} string representation
 */
function responseCodeToString(code) {
  return responseCodes[code] ? responseCodes[code] : '';
}

/**
 * Returns the name of the item response
 * according to the item name and response code
 * @param {string} itemName the corresponding item name
 * @param {number} responseCode the code
 * @returns {string} string representation
 */
function getItemResponseName(itemName, responseCode) {
  if (!itemName && !responseCode) {
    return DEFAULT_ITEM_RESPONSE_NAME;
  }
  if (!itemName) {
    return responseCodeToString(responseCode);
  }
  if (!responseCode) {
    return `${itemName} ${NO_RESPONSE_CODE_FOUND}`;
  }

  return `${itemName} ${responseCodeToString(responseCode)}`;
}

/**
 * Generates postman response object
 * @param {object} harResponse the corresponding har response to map
 * @param {object} item the current postman item
 * @param {object} options the process options
 * @returns {Response} postman response
 */
function generateItemResponse(harResponse, item, options) {
  let bodyResponse = mapBodyResponse(harResponse, options),
    response = new Response({
      name: getItemResponseName(item.name, harResponse.status),
      code: harResponse.status,
      header: getItemResponseHeaders(
        harResponse.headers
      ),
      originalRequest: {
        url: item.request.url,
        method: item.request.method,
        header: item.request.header,
        body: item.request.body
      },
      body: bodyResponse ? bodyResponse.body : bodyResponse
    });
  if (response.body) {
    response._postman_previewlanguage = bodyResponse.language;
  }
  return [response];
}


/**
 * Generates postman item object
 * @param {object} harContentEntry the log.entry from the har file
 * @param {object} options the process options
 * @returns {Response} postman response
 */
function generateItem(harContentEntry, options) {
  const harRequest = harContentEntry.request,
    harRequestUrl = new URL(harRequest.url),
    itemName = getItemName(harRequest, harRequestUrl),
    harResponse = harContentEntry.response;
  let item = {
    name: itemName,
    request: generateItemRequest(harRequest, options),
    response: []
  };
  item.response = generateItemResponse(harResponse, item, options);
  return item;
}

/**
 * Generates the items according to the HAR files
 * @param {object} parsedHAR parsed HAR content
 * @param {object} options process option
 * @returns {object} collection's definition info format  {name: <string>, version: <string>, description: <string>}
 */
function generateItems(parsedHAR, options) {
  const items = [],
    entries = parsedHAR && parsedHAR.log ? parsedHAR.log.entries : [];
  entries.map((currentEntry) => {
    items.push(generateItem(currentEntry, options));
  });
  return items;
}

/**
 * Returns an object with the collection definition information
 * @param {object} parsedHAR parsed HAR content
 * @param {string} collectionName collection's name if defined previously
 * @returns {object} collection's definition info format  {name: <string>, version: <string>, description: <string>}
 */
function getCollectionDefinitionInfo(parsedHAR, collectionName) {
  return {
    name: getCollectionName(parsedHAR, collectionName),
    version: getCollectionVersion(),
    description: getCollectionDescription(parsedHAR)
  };
}

/**
 * Returns an object with the information obtained from the
 * HAR content file
 * @param {object} parsedHAR parsed HAR content
 * @param {object} options process option
 * @param {string} collectionName collection's name if defined previously
 * @returns {object} HAR File info to map
 * format  {info: <object>, item: Array, variable: Array}
 */
function generateMappingObject(parsedHAR, options, collectionName) {
  let collectionDefinition = {};
  collectionDefinition = {
    info: getCollectionDefinitionInfo(parsedHAR, collectionName),
    item: generateItems(parsedHAR, options)
  };

  return collectionDefinition;
}

/**
 * Maps a Parsed HAR Content file into a Postman Collection
 * accordingly to the sent options
 * @param {object} input parsed HAR content
 * @param {object} options process option
 * @param {string} collectionName collection's name if defined previously
 * @returns {Collection} Postman's collection object
 */
function map(input, options, collectionName = '') {
  let postmanCollectionDefinition = generateMappingObject(
      input,
      options,
      collectionName
    ),
    collection = new Collection(postmanCollectionDefinition);
  return collection;
}

module.exports = {
  DEFAULT_COLLECTION_NAME,
  DEFAULT_COLLECTION_DESCRIPTION,
  DEFAULT_ITEM_NAME,
  NO_PATHNAME_ITEM_NAME,
  NO_METHOD_ITEM_NAME,
  DEFAULT_ITEM_RESPONSE_NAME,
  getCollectionName,
  map,
  getCollectionVersion,
  getCollectionDescription,
  generateMappingObject,
  getCollectionDefinitionInfo,
  getItemName,
  getBody,
  getItemRequestHeaders,
  generateItemRequestUrl,
  generateItemRequest,
  responseCodeToString,
  getItemResponseName,
  getItemResponseHeaders,
  generateItemResponse,
  generateItem,
  generateItems,
  getCollectionPossibleNameFromPages
};
