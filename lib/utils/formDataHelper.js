const multipart = require('parse-multipart-data');

/**
 * Maps a Parsed HAR request postData params into a postman Collection body form data
 * @param {Array} harParams params from the har request
 * @returns {Array} Postman's form data params
 */
function mapHARParamsIntoFormData(harParams) {
  return harParams.map((harParam) => {
    return {
      key: harParam.name,
      value: harParam.value,
      type: 'text'
    };
  });
}

/**
 * Finds the content type header from a request
 * @param {object} harRequest har request object
 * @returns {object} found header or undefined
 */
function getContentTypeHeader(harRequest) {
  return harRequest.headers.find((currentHeader) => {
    return currentHeader.name.toLowerCase() === 'content-type';
  });
}

/**
 * Returns the header content type boundary
 * @param {object} header har request header
 * @returns {object} found header or undefined
 */
function getBoundaryFromHeader(header) {
  if (header) {
    const items = header.value.split(';');
    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i].trim();
        if (item.indexOf('boundary') >= 0) {
          const k = item.split('=');
          return k[1].trim();
        }
      }
    }
  }
  return '';
}


/**
 * Finds the content type header from a request
 * @param {object} harRequest har request object
 * @returns {string} boundary from content type header
 */
function getBoundaryFromHeaders(harRequest) {
  return getBoundaryFromHeader(getContentTypeHeader(harRequest));
}

/**
 * Maps a Parsed HAR request postData text into a postman Collection body form data
 * @param {Array} harRequest params from the har request
 * @returns {Array} Postman's form data params
 */
function mapHARPostDataTextIntoFormData(harRequest) {
  const boundary = getBoundaryFromHeaders(harRequest),
    parts = multipart.parse(Buffer.from(harRequest.postData.text), boundary);
  return parts.map((part) => {
    return {
      key: part.name,
      value: part.data.toString(),
      type: 'text'
    };
  });
}

/**
 * Maps a Parsed HAR request postData into a postman Collection body form data
 * @param {object} harRequest parsed HAR request content
 * @param {object} options process option
 * @param {string} collectionName collection's name if defined previously
 * @returns {object} Postman's request body
 */
function getPMBodyFromFormData(harRequest) {
  let formData = [];
  if (harRequest && harRequest.postData) {
    if (harRequest.postData.params && harRequest.postData.params.length > 0) {
      formData = mapHARParamsIntoFormData(harRequest.postData.params);
    }
    else if (harRequest.postData.params) {
      formData = mapHARPostDataTextIntoFormData(harRequest);
    }

  }
  return {
    mode: 'formdata',
    formdata: formData
  };
}

module.exports = {
  getPMBodyFromFormData,
  getBoundaryFromHeader,
  getContentTypeHeader,
  getBoundaryFromHeaders,
  mapHARPostDataTextIntoFormData
};
