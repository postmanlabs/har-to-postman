const { sortEntries } = require('./utils/readInput');

const DEFAULT_COLLECTION_NAME = 'HAR To Postman Generated',
  DEFAULT_COLLECTION_DESCRIPTION = 'HAR To Postman Generated Collection',
  DEFAULT_ITEM_NAME = 'Generated without pathname',
  NO_RESPONSE_CODE_FOUND = 'no response code found',
  DEFAULT_COLLECTION_VERSION = '2.0.0',
  { Collection, Response } = require('postman-collection'),
  { mapBody,
    mapBodyResponse
  } = require('./HARToPostmanCollectionBodyMapper'),
  { removeProtocolFromURL,
    getHost
  } = require('./utils/urlUtils'),
  responseCodes = {
    200: 'successfully',
    201: 'created',
    202: 'accepted',
    204: 'no-content',
    304: 'not modified',
    403: 'forbidden',
    404: 'not found'
  },
  {
    getProtocolAndHost,
    decodeURL
  } = require('./utils/urlUtils'),
  {
    replaceVariableInUrl
  } = require('./utils/postmanVariablesUtils'),
  pseudoHeaders = [':method', ':scheme', ':authority', ':path'],
  COOKIE_HEADER_KEY = 'Cookie';


/**
 * Gets the different urls and its index to create variables for them
 * @param {object} parsedHAR the parsed HAR information
 * @returns {Array} unique urls and its index or key for variables
 */
function getUrlDataFromEntries(parsedHAR) {
  const entries = parsedHAR && parsedHAR.log ? parsedHAR.log.entries : [];
  let urlsData = [],
    index = 0,
    keys = new Set();
  entries.forEach((entry) => {
    if (!keys.has(entry.request.url)) {
      urlsData.push({
        index,
        url: entry.request.url
      });
      keys.add(entry.request.url);
      index++;
    }
  });
  return urlsData;
}


/**
 * Gets the variables information from the url data list
 * if urls are repeated then will only point to one variable
 * @param {Array} urlDataList the requests urls information
 * @returns {Array} information for variables
 */
function getVariablesFromUrlDataList(urlDataList) {
  let keys = new Set(),
    variables = [];
  if (!urlDataList) {
    return variables;
  }
  urlDataList.filter((urlData) => {
    if (urlData.url) {
      return urlData;
    }
  }).forEach((urlData) => {
    const {
      protocol,
      host
    } = getProtocolAndHost(urlData.url);
    if (!keys.has(`${protocol}${host}`)) {
      keys.add(`${protocol}${host}`);

      variables.push({
        key: `baseUrl${urlData.index}`,
        value: `${protocol}${host}`
      });
    }
  });
  return variables;
}

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
      return decodeURL(getHost(rawTitle));
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
 * @returns {string} collection's version.
 */
function getCollectionVersion() {
  return DEFAULT_COLLECTION_VERSION;
}

/**
 * Gets the name of the postman item
 * @param {object} harRequest parsed HAR request
 * @returns {string} item's calculated name
 */
function getItemName(harRequest) {
  if (!harRequest || !harRequest.url) {
    return DEFAULT_ITEM_NAME;
  }
  try {
    return decodeURL(removeProtocolFromURL(harRequest.url));
  }
  catch (error) {
    return decodeURL(harRequest.url);
  }
}

/**
 * Generates a postman body from the har request
 * @param {object} harRequest parsed HAR request
 * @param {object} options the process option
 * @returns {object} postman request body's information
 */
function getBody(harRequest, options) {
  return mapBody(harRequest, options);
}

/**
 * Exclude the pseudo header
 * @param {Array} header the header to check if we are going to exclude
 * @param {string} headerName name of the header to exclude
 * @returns {Array} filtered headers
 */
function excludePseudoHeader(header) {
  return !pseudoHeaders.includes(header.name.toLowerCase());
}


/**
 * Exclude the provided header from the list
 * @param {Array} headersList array of headers
 * @param {string} headerName name of the header to exclude
 * @returns {Array} filtered headers
 */
function excludeHeaderFromList(headersList, headerName) {
  return headersList.filter((header) => { return header.name.toLowerCase() !== headerName.toLowerCase(); });
}

/**
 * Exclude the cookie header from a list of headers
 * @param {Array} headersList array of headers
 * @returns {Array} filtered headers
 */
function excludeCookieHeader(headersList) {
  return excludeHeaderFromList(headersList, COOKIE_HEADER_KEY);
}

/**
 * Exclude the cookie header if the option is not true
 * @param {Array} harRequestHeaders array of headers
 * @param {object} options the process option
 * @returns {Array} filtered headers
 */
function filterCookiesFromHeader(harRequestHeaders, options) {
  if (!options && harRequestHeaders) {
    return excludeCookieHeader(harRequestHeaders);
  }
  let {
    includeCookies
  } = options;

  if (includeCookies && harRequestHeaders && harRequestHeaders.length > 0) {
    return harRequestHeaders;
  }
  return excludeCookieHeader(harRequestHeaders);
}

/**
 * Generates postman's headers from har request headers
 * @param {Array} harRequestHeaders array of headers
 * @param {object} options the process option
 * @returns {Array} postman's headers
 */
function getItemRequestHeaders(harRequestHeaders, options) {
  let filteredHeaders = filterCookiesFromHeader(harRequestHeaders, options).filter(excludePseudoHeader),
    headersFromHARHeaders = filteredHeaders.map((header) => {
      return { key: header.name, value: header.value };
    });
  return headersFromHARHeaders;
}

/**
 * Generates postman's headers from har request headers
 * @param {Array} harResponseHeaders array of headers
 * @returns {Array} postman's headers
 */
function getItemResponseHeaders(harResponseHeaders) {
  return harResponseHeaders.filter(excludePseudoHeader).map((header) => {
    return { key: header.name, value: header.value };
  });
}


/**
 * Returns the calculated requesturl
 * @param {object} harRequest the requests information
* @param {Array} urlVariablesData the generated variables for the process
 * @returns {string} the request.url string representation
 */
function generateItemRequestUrl(harRequest, urlVariablesData) {
  return replaceVariableInUrl(harRequest.url, urlVariablesData);
}

/**
 * Generates the structure of a postman request from the har request
 * @param {object} harRequest the request from HAR file
 * @param {Array} urlVariablesData the generated variables
 * @param {object} options the process options
 * @returns {object} Object with structure {
 *   description: string;
 *   method: any;
 *   url: any[];
 *   header: any[];
 *   body: any;
 *  }
 */
function generateItemRequest(harRequest, urlVariablesData, options) {
  const itemRequest = {
    description: '',
    method: harRequest.method,
    url: generateItemRequestUrl(harRequest, urlVariablesData),
    header: getItemRequestHeaders(
      harRequest.headers,
      options
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
 * @param {number} responseCode the code
 * @returns {string} string representation
 */
function getItemResponseName(responseCode) {
  if (!responseCode) {
    return `${NO_RESPONSE_CODE_FOUND}`;
  }
  return `${responseCodeToString(responseCode)} / ${responseCode}`;
}

/**
 * Generates postman response cookies
 * @param {object} harResponse the corresponding har response to map
 * @param {object} options the process options
 * @returns {Array} postman cookies structure object
 */
function getResponseCookies(harResponse, options) {
  if (!options || !options.includeCookies || !harResponse ||
      !harResponse.cookies || harResponse.cookies.length === 0) {
    return;
  }
  let cookies = [];
  cookies = harResponse.cookies.map((cookie) => {
    return {
      name: cookie.name,
      expires: Math.floor(new Date(cookie.expires) / 1000),
      domain: cookie.domain,
      path: cookie.path,
      secure: false,
      httpOnly: cookie.httpOnly,
      session: false,
      value: cookie.value
    };
  });
  return cookies;
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
      name: getItemResponseName(harResponse.status),
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
      body: bodyResponse ? bodyResponse.body : bodyResponse,
      cookie: getResponseCookies(harResponse, options)
    });
  if (response.body) {
    response._postman_previewlanguage = bodyResponse.language;
  }
  return [response];
}

/**
 * Process the responses according to the options
 * @param {object} harResponse parsed HAR response
 * @param {object} item the postman item
 * @param {object} options the process options
 * @returns {Response} postman response
 */
function processResponseAccordingToOptions(harResponse, item, options) {
  if (!options || options.includeResponses === undefined ||
    options.includeResponses === null || options.includeResponses === true) {
    return generateItemResponse(harResponse, item, options);
  }
  return [];
}

/**
 * Generates postman item object
 * @param {object} harContentEntry the log.entry from the har file
 * @param {Array} urlVariablesData the generated variables for the process
 * @param {object} options the process options
 * @returns {Response} postman response
 */
function generateItem(harContentEntry, urlVariablesData, options) {
  const harRequest = harContentEntry.request,
    itemName = getItemName(harRequest),
    harResponse = harContentEntry.response;
  let item = {
    name: itemName,
    request: generateItemRequest(harRequest, urlVariablesData, options),
    response: []
  };
  item.response = processResponseAccordingToOptions(harResponse, item, options);
  return item;
}

/**
 * Generates the items according to the HAR files
 * @param {object} parsedHAR parsed HAR content
 * @param {Array} urlVariablesData the generated variables
 * @param {object} options process option
 * @returns {object} collection's definition info format  {name: <string>, version: <string>, description: <string>}
 */
function generateItems(parsedHAR, urlVariablesData, options) {
  const items = [],
    entries = parsedHAR && parsedHAR.log ? parsedHAR.log.entries : [],
    sortedEntries = sortEntries(entries);
  sortedEntries.map((currentEntry) => {
    items.push(generateItem(currentEntry, urlVariablesData, options));
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
  let collectionDefinition = {},
    urlVariablesData = getVariablesFromUrlDataList(getUrlDataFromEntries(parsedHAR));
  collectionDefinition = {
    info: getCollectionDefinitionInfo(parsedHAR, collectionName),
    item: generateItems(parsedHAR, urlVariablesData, options),
    variable: urlVariablesData
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
  getCollectionPossibleNameFromPages,
  getUrlDataFromEntries,
  getVariablesFromUrlDataList,
  filterCookiesFromHeader,
  getResponseCookies
};
