const { expect } = require('chai'),
  fs = require('fs'),
  { getCollectionName,
    getCollectionDescription,
    getCollectionVersion,
    generateMappingObject,
    map,
    getCollectionDefinitionInfo,
    getItemName,
    getBody,
    getItemRequestHeaders,
    generateItemRequestUrl,
    generateItemRequest,
    responseCodeToString,
    getItemResponseName,
    generateItemResponse,
    generateItem,
    generateItems,
    getItemResponseHeaders,
    getCollectionPossibleNameFromPages,
    getUrlDataFromEntries,
    getVariablesFromUrlDataList,
    filterCookiesFromHeader,
    getResponseCookies,
    DEFAULT_COLLECTION_NAME,
    DEFAULT_COLLECTION_DESCRIPTION,
    DEFAULT_ITEM_NAME
  } = require('../../lib/HARToPostmanCollectionMapper'),
  validHAREntriesFolder = 'test/data/entries',
  getOptions = require('../../lib/utils/options').getOptions;


describe('HARToPostmanCollectionMapper getCollectionPossibleNameFromPages', function () {

  it('Should get the name from first page\'s title', function () {
    const fileContent = fs.readFileSync(validHAREntriesFolder + '/multipleCorrectEntries.json', 'utf8'),
      logEntry = JSON.parse(fileContent),
      result = getCollectionPossibleNameFromPages(logEntry);
    expect(result).to.equal('localhost:3000');
  });
});

describe('HARToPostmanCollectionMapper getCollectionName', function () {

  it('Should get the name from first page\'s title', function () {
    const fileContent = fs.readFileSync(validHAREntriesFolder + '/multipleCorrectEntries.json', 'utf8'),
      logEntry = JSON.parse(fileContent),
      result = getCollectionName(logEntry);
    expect(result).to.equal('localhost:3000');
  });

  it('Should get the name from first page\'s title even with provided name', function () {
    const fileContent = fs.readFileSync(validHAREntriesFolder + '/multipleCorrectEntries.json', 'utf8'),
      logEntry = JSON.parse(fileContent),
      result = getCollectionName(logEntry, 'file.har');
    expect(result).to.equal('localhost:3000');
  });

  it('Should return the same collection name if it is provided', function () {
    const result = getCollectionName({}, 'Already defined');
    expect(result).to.equal('Already defined');
  });

  it('Should get "HAR To Postman Generated" when har is empty and empty name is provided', function () {
    const result = getCollectionName({}, '');
    expect(result).to.equal(DEFAULT_COLLECTION_NAME);
  });

  it('Should get "HAR To Postman Generated" when har is empty and not name is provided', function () {
    const result = getCollectionName({});
    expect(result).to.equal(DEFAULT_COLLECTION_NAME);
  });

  it('Should get "HAR To Postman Generated" when no har is present and not name is provided', function () {
    const result = getCollectionName();
    expect(result).to.equal(DEFAULT_COLLECTION_NAME);
  });

  it('Should get "HAR To Postman Generated" when har has empty pages and empty name is provided', function () {
    const result = getCollectionName({ log: { pages: [] } }, '');
    expect(result).to.equal(DEFAULT_COLLECTION_NAME);
  });

  it('Should get the same title when is not an url', function () {
    const result = getCollectionName({ log: { pages: [{ title: 'not url' }] } }, '');
    expect(result).to.equal('not url');
  });

});

describe('HARToPostmanCollectionMapper getCollectionDescription', function () {

  it('Should get "HAR To Postman Generated Collection" when har is empty and not name is provided', function () {
    const result = getCollectionDescription({});
    expect(result).to.equal(DEFAULT_COLLECTION_DESCRIPTION);
  });

  it('Should get "HAR To Postman Generated Collection" when no har is present and not name is provided', function () {
    const result = getCollectionDescription();
    expect(result).to.equal(DEFAULT_COLLECTION_DESCRIPTION);
  });

  it('Should get har comment when is pressent', function () {
    const result = getCollectionDescription({ log: { comment: 'some description' } });
    expect(result).to.equal('some description');
  });

});

describe('HARToPostmanCollectionMapper getCollectionVersion', function () {
  it('Should get "2.0.0"', function () {
    expect(getCollectionVersion()).to.equal('2.0.0');
  });
});

describe('HARToPostmanCollectionMapper getCollectionDefinitionInfo', function () {
  it('Should get an object when minimum info is sent', function () {
    const result = getCollectionDefinitionInfo();
    expect(result).to.not.be.undefined;
  });

  it('Should get an object when name set', function () {
    const result = getCollectionDefinitionInfo({}, 'sent name');
    expect(result).to.not.be.undefined;
    expect(result.name).to.equal('sent name');
    expect(result.description).to.equal(DEFAULT_COLLECTION_DESCRIPTION);
    expect(result.version).to.equal('2.0.0');
  });
});

describe('HARToPostmanCollectionMapper generateMappingObject', function () {
  it('Should get an object when minimum info is sent', function () {
    const result = generateMappingObject();
    expect(result).to.not.be.undefined;
  });

  it('Should get an object when name set', function () {
    const result = generateMappingObject({}, {}, 'sent name');
    expect(result).to.not.be.undefined;
    expect(result.info.name).to.equal('sent name');
    expect(result.info.description).to.equal(DEFAULT_COLLECTION_DESCRIPTION);
    expect(result.info.version).to.equal('2.0.0');
  });

  it('Should generate an item for simple entry', function () {
    const
      fileContent = fs.readFileSync(validHAREntriesFolder + '/multipleCorrectEntries.json', 'utf8'),
      logEntries = JSON.parse(fileContent),
      mappingObj = generateMappingObject(logEntries, {});
    expect(mappingObj).to.not.be.undefined;
    expect(mappingObj.item.length).to.equal(12);
    expect(mappingObj.info).to.not.be.undefined;
    expect(mappingObj.variable.length).to.equal(1);
  });

});

describe('HARToPostmanCollectionMapper map', function () {
  it('Should get an object when minimum info is sent', function () {
    const result = map();
    expect(result).to.not.be.undefined;
  });

  it('Should get an object when name set', function () {
    const result = map({}, {}, 'sent name');
    expect(result).to.not.be.undefined;
    expect(result.name).to.equal('sent name');
    expect(result.description.content).to.equal(DEFAULT_COLLECTION_DESCRIPTION);
    expect(result.version.raw).to.equal('2.0.0');
  });

  it('Should generate an item for simple entry', function () {
    const
      fileContent = fs.readFileSync(validHAREntriesFolder + '/multipleCorrectEntries.json', 'utf8'),
      logEntries = JSON.parse(fileContent),
      mappingObj = map(logEntries, {});
    expect(mappingObj).to.not.be.undefined;
    expect(mappingObj.items.members.length).to.equal(12);
    expect(mappingObj.name).equal('localhost:3000');
    expect(mappingObj.variables.members.length).to.equal(1);
  });


});

describe('HARToPostmanCollectionMapper getItemName', function () {
  it('Should get an object when empty harRequest is sent', function () {
    const result = getItemName();
    expect(result).to.eq(DEFAULT_ITEM_NAME);
  });

  it('Should get an object when empty harRequestURL is sent', function () {
    const result = getItemName({ method: 'GET' });
    expect(result.includes(DEFAULT_ITEM_NAME)).to.be.true;
  });

  it('Should get an object when harRequest and path info is sent', function () {
    const result = getItemName({ url: 'https://i.ytimg.com/vi/nmXMgqjQzls/mqdefault.jpg' });
    expect(result).to.eq('i.ytimg.com/vi/nmXMgqjQzls/mqdefault.jpg');
  });

  it('Should get same string when entry is not a valid url', function () {
    const result = getItemName({ url: 'invalid url' });
    expect(result).to.eq('invalid url');
  });
});

describe('HARToPostmanCollectionMapper getBody', function () {

  it('Should get body with raw and json type', function () {
    const harRequest = { bodySize: 25, postData: { text: '{"some":"value"}', mimeType: 'application/json' } },
      result = getBody(harRequest);
    expect(result).to.not.be.undefined;
    expect(result.mode).to.equal('raw');
    expect(result.options.raw.language).to.equal('json');
    expect(result.raw).to.equal('{\n "some": "value"\n}');
  });
});

describe('HARToPostmanCollectionMapper getItemRequestHeaders', function () {

  it('Should get a mapped array of headers', function () {
    const harRequestHeaders = [
        {
          'name': 'Host',
          'value': 'localhost:3000'
        },
        {
          'name': 'Content-Length',
          'value': '23'
        }],
      result = getItemRequestHeaders(harRequestHeaders);
    expect(result).to.not.be.undefined;
    expect(Array.isArray(result)).to.be.true;
    expect(result.length).to.equal(2);
    expect(result[0].key).to.equal('Host');
    expect(result[0].value).to.equal('localhost:3000');
    expect(result.length).to.equal(2);
  });

  it('Should get empty array when har request has no headers', function () {

    const result = getItemRequestHeaders([]);
    expect(result).to.not.be.undefined;
    expect(Array.isArray(result)).to.be.true;
    expect(result.length).to.equal(0);
  });

});


describe('HARToPostmanCollectionMapper generateItemRequestUrl', function () {

  it('Should replace the variables from the url', function () {

    const variables = [
        {
          key: '0BaseUrl',
          value: 'http://localhost:3000',
          urlData: {
            index: 0,
            url: 'http://localhost:3000/some?param1=2&param2=3'
          }
        }
      ],
      replaced = generateItemRequestUrl({ url: 'http://localhost:3000/some?param1=2&param2=3' }, variables);
    expect(replaced).to.not.be.undefined;
    expect(replaced).to.equal('{{0BaseUrl}}/some?param1=2&param2=3');

  });
});

describe('HARToPostmanCollectionMapper generateItemRequest', function () {

  it('Should generate a simple request only one get element', function () {
    const variables = [
        {
          key: '0BaseUrl',
          value: 'http://localhost:3000',
          urlData: {
            index: 0,
            url: 'http://localhost:3000/some?param1=2&param2=3'
          }
        }
      ],
      request = {
        method: 'GET',
        url: 'http://localhost:3000/some?param1=2&param2=3',
        httpVersion: '',
        headers: [
          {
            name: 'sec-ch-ua',
            value: '\'Chromium\';v=\'94\', \'Google Chrome\';v=\'94\', \';Not A Brand\';v=\'99\''
          },
          {
            name: 'sec-ch-ua-mobile',
            value: '?0'
          },
          {
            name: 'sec-ch-ua-platform',
            value: '\'macOS\''
          },
          {
            name: 'Upgrade-Insecure-Requests',
            value: '1'
          }
        ],
        queryString: [
          {
            name: 'param1',
            value: '2'
          },
          {
            name: 'param2',
            value: '3'
          }
        ],
        'cookies': [],
        'headersSize': -1,
        'bodySize': 0
      },
      itemRequest = generateItemRequest(request, variables);
    expect(itemRequest).to.not.be.undefined;
    expect(itemRequest.url).to.equal('{{0BaseUrl}}/some?param1=2&param2=3');
    expect(itemRequest.method).to.equal('GET');
    expect(itemRequest.body).to.be.undefined;
    expect(itemRequest.header.length).to.equal(4);

  });

  it('Should generate a simple request with only one POST element', function () {
    const variables = [
        {
          key: '0BaseUrl',
          value: 'http://localhost:3000',
          urlData: {
            index: 0,
            url: 'http://localhost:3000/some?param1=2&param2=3'
          }
        }
      ],
      request = {
        method: 'POST',
        url: 'http://localhost:3000/api/categories/queries/getCategories',
        httpVersion: 'HTTP/1.1',
        headers: [
          {
            name: 'Host',
            value: 'localhost:3000'
          },
          {
            name: 'Connection',
            value: 'keep-alive'
          },
          {
            name: 'Content-Length',
            value: '23'
          },
          {
            name: 'Sec-Fetch-Mode',
            value: 'cors'
          },
          {
            name: 'Sec-Fetch-Dest',
            value: 'empty'
          },
          {
            name: 'Referer',
            value: 'http://localhost:3000/projects/full/full'
          },
          {
            name: 'Accept-Encoding',
            value: 'gzip, deflate, br'
          },
          {
            name: 'Accept-Language',
            value: 'en-US,en;q=0.9'
          },
          {
            name: 'Cookie',
            value: 'value'
          }
        ],
        queryString: [],
        cookies: [
          {
            name: 'proposalHunt_sSessionToken',
            value: '%3D',
            path: '/',
            domain: 'localhost',
            expires: '2021-11-17T22:06:19.927Z',
            httpOnly: true,
            secure: false,
            sameSite: 'Lax'
          }
        ],
        headersSize: 1330,
        bodySize: 23,
        postData: {
          mimeType: 'application/json',
          text: '{"params":{},"meta":{}}'
        }
      },
      itemRequest = generateItemRequest(request, variables);
    expect(itemRequest).to.not.be.undefined;
    expect(itemRequest.url).to.equal('{{0BaseUrl}}/api/categories/queries/getCategories');
    expect(itemRequest.method).to.equal('POST');
    expect(itemRequest.body).to.not.be.undefined;
    expect(itemRequest.body.raw).to.equal('{\n "params": {},\n "meta": {}\n}');
    expect(itemRequest.body.options.raw.language).to.equal('json');
    expect(itemRequest.header.length).to.equal(8);

  });

  it('should generate a simple request no headers', function () {
    const variables = [
        {
          key: '0BaseUrl',
          value: 'http://localhost:3000',
          urlData: {
            index: 0,
            url: 'http://localhost:3000/some?param1=2&param2=3'
          }
        }
      ],
      request = {
        method: 'POST',
        url: 'http://localhost:3000/api/categories/queries/getCategories',
        httpVersion: 'HTTP/1.1',
        headers: [],
        queryString: [],
        cookies: [
          {
            name: 'proposalHunt_sSessionToken',
            value: '%3D',
            path: '/',
            domain: 'localhost',
            expires: '2021-11-17T22:06:19.927Z',
            httpOnly: true,
            secure: false,
            sameSite: 'Lax'
          }
        ],
        headersSize: 1330,
        bodySize: 23,
        postData: {
          mimeType: 'application/json',
          text: '{"params":{},"meta":{}}'
        }
      },
      itemRequest = generateItemRequest(request, variables);
    expect(itemRequest).to.not.be.undefined;
    expect(itemRequest.url).to.equal('{{0BaseUrl}}/api/categories/queries/getCategories');
    expect(itemRequest.method).to.equal('POST');
    expect(itemRequest.body).to.not.be.undefined;
    expect(itemRequest.body.raw).to.equal('{\n "params": {},\n "meta": {}\n}');
    expect(itemRequest.body.options.raw.language).to.equal('json');
    expect(Object.keys(itemRequest).find((property) => { return property === 'header'; })).to.be.undefined;

  });


  it('Should generate a simple request with only one POST element with cookies', function () {
    const options = getOptions({ usage: ['CONVERSION'] }),
      includeCookies = options.find((option) => { return option.id === 'includeCookies'; }),
      variables = [
        {
          key: '0BaseUrl',
          value: 'http://localhost:3000',
          urlData: {
            index: 0,
            url: 'http://localhost:3000/some?param1=2&param2=3'
          }
        }
      ],
      request = {
        method: 'POST',
        url: 'http://localhost:3000/api/categories/queries/getCategories',
        httpVersion: 'HTTP/1.1',
        headers: [
          {
            name: 'Host',
            value: 'localhost:3000'
          },
          {
            name: 'Connection',
            value: 'keep-alive'
          },
          {
            name: 'Content-Length',
            value: '23'
          },
          {
            name: 'Sec-Fetch-Mode',
            value: 'cors'
          },
          {
            name: 'Sec-Fetch-Dest',
            value: 'empty'
          },
          {
            name: 'Cookie',
            value: 'express:sess.sig=uL8C4WneWd3LfQhDurtnQwAyDfc'
          }
        ],
        queryString: [],
        cookies: [
          {
            name: 'proposalHunt_sSessionToken',
            value: '%3D',
            path: '/',
            domain: 'localhost',
            expires: '2021-11-17T22:06:19.927Z',
            httpOnly: true,
            secure: false,
            sameSite: 'Lax'
          }
        ],
        headersSize: 1330,
        bodySize: 23,
        postData: {
          mimeType: 'application/json',
          text: '{"params":{},"meta":{}}'
        }
      },
      optionFromOptions = {};
    optionFromOptions[`${includeCookies.id}`] = true;
    let itemRequest = generateItemRequest(request, variables, optionFromOptions);
    expect(itemRequest).to.not.be.undefined;
    expect(itemRequest.url).to.equal('{{0BaseUrl}}/api/categories/queries/getCategories');
    expect(itemRequest.method).to.equal('POST');
    expect(itemRequest.body).to.not.be.undefined;
    expect(itemRequest.body.raw).to.equal('{\n "params": {},\n "meta": {}\n}');
    expect(itemRequest.body.options.raw.language).to.equal('json');
    expect(itemRequest.header.length).to.equal(6);
    expect(itemRequest.header.find((header) => { return header.key === 'Cookie'; })).to.not.be.undefined;
  });

});

describe('HARToPostmanCollectionMapper responseCodeToString', function () {

  it('Should return the correct name for responses codes', function () {
    let result = responseCodeToString(200);
    expect(result).to.equal('successfully');
    result = responseCodeToString(201);
    expect(result).to.equal('created');
    result = responseCodeToString(202);
    expect(result).to.equal('accepted');
    result = responseCodeToString(204);
    expect(result).to.equal('no-content');
    result = responseCodeToString(403);
    expect(result).to.equal('forbidden');
    result = responseCodeToString();
    expect(result).to.equal('');
  });
});

describe('HARToPostmanCollectionMapper getItemResponseName', function () {

  it('Should return the correct name for response', function () {
    let result = getItemResponseName(200);
    expect(result).to.equal('successfully / 200');
  });

  it('Should return the correct name for empty code', function () {
    let result = getItemResponseName('');
    expect(result).to.equal('no response code found');
  });

  it('Should return the correct name for no code', function () {
    let result = getItemResponseName();
    expect(result).to.equal('no response code found');
  });

  it('Should return the correct name for response no code', function () {
    let result = getItemResponseName(900);
    expect(result).to.equal(' / 900');
  });

});

describe('HARToPostmanCollectionMapper getItemResponseHeaders', function () {

  it('Should get a mapped array of headers', function () {
    const harResponseHeaders = [
        {
          'name': 'Host',
          'value': 'localhost:3000'
        },
        {
          'name': 'Content-Length',
          'value': '23'
        }],
      result = getItemResponseHeaders(harResponseHeaders);
    expect(result).to.not.be.undefined;
    expect(Array.isArray(result)).to.be.true;
    expect(result.length).to.equal(2);
    expect(result[0].key).to.equal('Host');
    expect(result[0].value).to.equal('localhost:3000');
    expect(result.length).to.equal(2);
  });

  it('Should get empty array when har request has no headers', function () {

    const result = getItemResponseHeaders([]);
    expect(result).to.not.be.undefined;
    expect(Array.isArray(result)).to.be.true;
    expect(result.length).to.equal(0);
  });

});

describe('HARToPostmanCollectionMapper generateItemResponse', function () {

  it('Should generate a simple response with only one get element', function () {
    const responsePayload = '{"result":[{"name":"Business Enabler"},{"name":"Experiment"},' +
      '{"name":"Strategic Differentiator"},{"name":"Value Creator"}],"error":null,"meta":{}}',
      formatedPayload = '{\n \"result\": [\n  {\n   \"name\": \"Business Enabler\"\n  },\n  {\n ' +
    '  \"name\": \"Experiment\"\n  },\n  {\n   \"name\": \"Strategic Differentiator\"\n  },\n  {\n' +
    '   \"name\": \"Value Creator\"\n  }\n ],\n \"error\": null,\n \"meta\": {}\n}',
      harResponse = {
        status: 200,
        statusText: 'OK',
        httpVersion: 'HTTP/1.1',
        headers: [
          {
            name: 'Content-Type',
            value: 'application/json; charset=utf-8'
          },
          {
            name: 'ETag',
            value: '\'92-M/UJ1IZ/ZaHU2DQuX7f6xpOxTaQ\''
          },
          {
            name: 'Content-Length',
            value: '146'
          },
          {
            name: 'Vary',
            value: 'Accept-Encoding'
          }
        ],
        cookies: [],
        content: {
          size: 146,
          mimeType: 'application/json',
          compression: 0,
          text: responsePayload
        },
        redirectURL: '',
        headersSize: 234,
        bodySize: 146,
        _transferSize: 380,
        _error: null
      },
      itemResponse = generateItemResponse(harResponse, {
        name: 'item name',
        request: {
          description: '""',
          method: 'GET',
          url: '{{0BaseUrl}}/api/categories/queries/getCategories',
          header: [
            {
              key: 'Host',
              value: 'localhost:3000'
            },
            {
              key: 'Connection',
              value: 'keep-alive'
            }
          ]
        }
      });
    expect(itemResponse[0]).to.not.be.undefined;
    expect(itemResponse[0].name).to.equal('successfully / 200');
    expect(itemResponse[0].status).to.equal('OK');
    expect(itemResponse[0]._postman_previewlanguage).to.equal('json');
    expect(itemResponse[0].body).to.equal(formatedPayload);
    expect(itemResponse[0].headers.members.length).to.equal(4);

  });

  it('Should generate a simple response with only one Post element', function () {
    const responsePayload = '{"result":[{"name":"Business Enabler"},{"name":"Experiment"},' +
    '{"name":"Strategic Differentiator"},{"name":"Value Creator"}],"error":null,"meta":{}}',
      formatedPayload = '{\n \"result\": [\n  {\n   \"name\": \"Business Enabler\"\n  },\n  {\n ' +
    '  \"name\": \"Experiment\"\n  },\n  {\n   \"name\": \"Strategic Differentiator\"\n  },\n  {\n' +
    '   \"name\": \"Value Creator\"\n  }\n ],\n \"error\": null,\n \"meta\": {}\n}',
      harResponse = {
        status: 200,
        statusText: 'OK',
        httpVersion: 'HTTP/1.1',
        headers: [
          {
            name: 'Content-Type',
            value: 'application/json; charset=utf-8'
          },
          {
            name: 'ETag',
            value: '\'92-M/UJ1IZ/ZaHU2DQuX7f6xpOxTaQ\''
          },
          {
            name: 'Content-Length',
            value: '146'
          },
          {
            name: 'Vary',
            value: 'Accept-Encoding'
          }
        ],
        cookies: [],
        content: {
          size: 146,
          mimeType: 'application/json',
          compression: 0,
          text: responsePayload
        },
        redirectURL: '',
        headersSize: 234,
        bodySize: 146,
        _transferSize: 380,
        _error: null
      },
      itemResponse = generateItemResponse(harResponse, {
        name: 'item name',
        request: {
          description: '""',
          method: 'POST',
          url: '{{0BaseUrl}}/api/categories/queries/getCategories',
          header: [
            {
              key: 'Host',
              value: 'localhost:3000'
            },
            {
              key: 'Connection',
              value: 'keep-alive'
            }
          ],
          body: {
            mode: 'raw',
            raw: '{"params":{},"meta":{}}',
            options: {
              raw: {
                language: 'json'
              }
            }
          }
        }
      });
    expect(itemResponse[0]).to.not.be.undefined;
    expect(itemResponse[0].name).to.equal('successfully / 200');
    expect(itemResponse[0].status).to.equal('OK');
    expect(itemResponse[0]._postman_previewlanguage).to.equal('json');
    expect(itemResponse[0].body).to.equal(formatedPayload);
    expect(itemResponse[0].headers.members.length).to.equal(4);

  });

  it('Should generate a simple response with only one Post element include cookies', function () {
    const options = getOptions({ usage: ['CONVERSION'] }),
      includeCookies = options.find((option) => { return option.id === 'includeCookies'; }),
      responsePayload = '{"result":[{"name":"Business Enabler"},{"name":"Experiment"},' +
    '{"name":"Strategic Differentiator"},{"name":"Value Creator"}],"error":null,"meta":{}}',
      formatedPayload = '{\n \"result\": [\n  {\n   \"name\": \"Business Enabler\"\n  },\n  {\n ' +
    '  \"name\": \"Experiment\"\n  },\n  {\n   \"name\": \"Strategic Differentiator\"\n  },\n  {\n' +
    '   \"name\": \"Value Creator\"\n  }\n ],\n \"error\": null,\n \"meta\": {}\n}',
      harResponse = {
        status: 200,
        statusText: 'OK',
        httpVersion: 'HTTP/1.1',
        headers: [
          {
            name: 'Content-Type',
            value: 'application/json; charset=utf-8'
          }
        ],
        cookies: [{
          name: 'proposalHunt_sAntiCsrfToken',
          value: 'bMBNEsvnocdYBmF8YVzA9-tCXHyvHhpq',
          path: '/',
          domain: 'localhost',
          expires: '2021-11-17T22:06:19.927Z',
          httpOnly: false,
          secure: false,
          sameSite: 'Lax'
        }],
        content: {
          size: 146,
          mimeType: 'application/json',
          compression: 0,
          text: responsePayload
        },
        redirectURL: '',
        headersSize: 234,
        bodySize: 146,
        _transferSize: 380,
        _error: null
      };
    let itemResponse,
      optionFromOptions = {};
    optionFromOptions[`${includeCookies.id}`] = true;
    itemResponse = generateItemResponse(harResponse, {
      name: 'item name',
      request: {
        description: '""',
        method: 'POST',
        url: '{{0BaseUrl}}/api/categories/queries/getCategories',
        header: [
          {
            key: 'Host',
            value: 'localhost:3000'
          },
          {
            key: 'Connection',
            value: 'keep-alive'
          }
        ],
        body: {
          mode: 'raw',
          raw: '{"params":{},"meta":{}}',
          options: {
            raw: {
              language: 'json'
            }
          }
        }
      }
    }, optionFromOptions);
    expect(itemResponse[0]).to.not.be.undefined;
    expect(itemResponse[0].name).to.equal('successfully / 200');
    expect(itemResponse[0].status).to.equal('OK');
    expect(itemResponse[0]._postman_previewlanguage).to.equal('json');
    expect(itemResponse[0].body).to.equal(formatedPayload);
    expect(itemResponse[0].headers.members.length).to.equal(1);
    expect(itemResponse[0].cookies.members.length).to.equal(1);

  });
});

describe('HARToPostmanCollectionMapper generateItem', function () {

  it('Should generate an item for simple entry', function () {
    const variables = [
        {
          key: '0BaseUrl',
          value: 'http://localhost:3000',
          urlData: {
            index: 0,
            url: 'http://localhost:3000/some?param1=2&param2=3'
          }
        }
      ],
      fileContent = fs.readFileSync(validHAREntriesFolder + '/simpleCorrectEntry.json', 'utf8'),
      logEntry = JSON.parse(fileContent),
      item = generateItem(logEntry, variables);
    expect(item).to.not.be.undefined;
    expect(item.name).to.equal('localhost:3000/api/users/queries/getCurrentUser');
    expect(item.request.method).to.equal('POST');
    expect(item.request.body.raw).to.equal('{\n "params": null,\n "meta": {}\n}');
    expect(item.response[0].name).to.equal('successfully / 200');
    expect(item.response[0].body)
      .to.equal('{\n \"result\": {\n  \"id\": 1,\n  \"name\": \"Luis Tejeda Sanchez\",\n' +
      '  \"email\": \"luis.tejeda@wizeline.com\",\n  \"role\": \"USER\"\n },\n \"error\": null,\n \"meta\": {}\n}');
    expect(item.response[0].originalRequest.body.raw).to.equal('{\n "params": null,\n "meta": {}\n}');
  });

  it('Should generate an item for simple entry without response when option is false', function () {
    const variables = [
        {
          key: '0BaseUrl',
          value: 'http://localhost:3000',
          urlData: {
            index: 0,
            url: 'http://localhost:3000/some?param1=2&param2=3'
          }
        }
      ],
      options = getOptions({ usage: ['CONVERSION'] }),
      includeResponses = options.find((option) => { return option.id === 'includeResponses'; }),
      fileContent = fs.readFileSync(validHAREntriesFolder + '/simpleCorrectEntry.json', 'utf8'),
      logEntry = JSON.parse(fileContent);
    let item,
      optionToProcess = {};
    optionToProcess[`${includeResponses.id}`] = false;
    item = generateItem(logEntry, variables, optionToProcess);
    expect(item).to.not.be.undefined;
    expect(item.name).to.equal('localhost:3000/api/users/queries/getCurrentUser');
    expect(item.request.method).to.equal('POST');
    expect(item.request.body.raw).to.equal('{\n "params": null,\n "meta": {}\n}');
    expect(item.response).to.be.empty;
  });

  it('Should generate an item for simple entry with response when option is true', function () {
    const variables = [
        {
          key: '0BaseUrl',
          value: 'http://localhost:3000',
          urlData: {
            index: 0,
            url: 'http://localhost:3000/some?param1=2&param2=3'
          }
        }
      ],
      options = getOptions({ usage: ['CONVERSION'] }),
      includeResponses = options.find((option) => { return option.id === 'includeResponses'; }),
      fileContent = fs.readFileSync(validHAREntriesFolder + '/simpleCorrectEntry.json', 'utf8'),
      logEntry = JSON.parse(fileContent);
    let item,
      optionToProcess = {};
    optionToProcess[`${includeResponses.id}`] = true;
    item = generateItem(logEntry, variables, optionToProcess);
    expect(item).to.not.be.undefined;
    expect(item.name).to.equal('localhost:3000/api/users/queries/getCurrentUser');
    expect(item.request.method).to.equal('POST');
    expect(item.request.body.raw).to.equal('{\n "params": null,\n "meta": {}\n}');
    expect(item.response[0].name).to.equal('successfully / 200');
    expect(item.response[0].body)
      .to.equal('{\n \"result\": {\n  \"id\": 1,\n  \"name\": \"Luis Tejeda Sanchez\",\n' +
      '  \"email\": \"luis.tejeda@wizeline.com\",\n  \"role\": \"USER\"\n },\n \"error\": null,\n \"meta\": {}\n}');
    expect(item.response[0].originalRequest.body.raw).to.equal('{\n "params": null,\n "meta": {}\n}');
  });

  it('Should generate an item for simple entry with response when option for include is not present', function () {
    const variables = [
        {
          key: '0BaseUrl',
          value: 'http://localhost:3000',
          urlData: {
            index: 0,
            url: 'http://localhost:3000/some?param1=2&param2=3'
          }
        }
      ],
      fileContent = fs.readFileSync(validHAREntriesFolder + '/simpleCorrectEntry.json', 'utf8'),
      logEntry = JSON.parse(fileContent);
    let item = generateItem(logEntry, variables, {});
    expect(item).to.not.be.undefined;
    expect(item.name).to.equal('localhost:3000/api/users/queries/getCurrentUser');
    expect(item.request.method).to.equal('POST');
    expect(item.request.body.raw).to.equal('{\n "params": null,\n "meta": {}\n}');
    expect(item.response[0].name).to.equal('successfully / 200');
    expect(item.response[0].body)
      .to.equal('{\n \"result\": {\n  \"id\": 1,\n  \"name\": \"Luis Tejeda Sanchez\",\n' +
      '  \"email\": \"luis.tejeda@wizeline.com\",\n  \"role\": \"USER\"\n },\n \"error\": null,\n \"meta\": {}\n}');
    expect(item.response[0].originalRequest.body.raw).to.equal('{\n "params": null,\n "meta": {}\n}');
  });

  it('Should generate an item for simple entry with response when option is null', function () {
    const variables = [
        {
          key: '0BaseUrl',
          value: 'http://localhost:3000',
          urlData: {
            index: 0,
            url: 'http://localhost:3000/some?param1=2&param2=3'
          }
        }
      ],
      options = getOptions({ usage: ['CONVERSION'] }),
      includeResponses = options.find((option) => { return option.id === 'includeResponses'; }),
      fileContent = fs.readFileSync(validHAREntriesFolder + '/simpleCorrectEntry.json', 'utf8'),
      logEntry = JSON.parse(fileContent);
    let item,
      optionToProcess = {};
    optionToProcess[`${includeResponses.id}`] = null;
    item = generateItem(logEntry, variables, optionToProcess);
    expect(item).to.not.be.undefined;
    expect(item.name).to.equal('localhost:3000/api/users/queries/getCurrentUser');
    expect(item.request.method).to.equal('POST');
    expect(item.request.body.raw).to.equal('{\n "params": null,\n "meta": {}\n}');
    expect(item.response[0].name).to.equal('successfully / 200');
    expect(item.response[0].body)
      .to.equal('{\n \"result\": {\n  \"id\": 1,\n  \"name\": \"Luis Tejeda Sanchez\",\n' +
      '  \"email\": \"luis.tejeda@wizeline.com\",\n  \"role\": \"USER\"\n },\n \"error\": null,\n \"meta\": {}\n}');
    expect(item.response[0].originalRequest.body.raw).to.equal('{\n "params": null,\n "meta": {}\n}');
  });

});

describe('HARToPostmanCollectionMapper generateItems', function () {

  it('Should generate items for simple entry', function () {
    const variables = [
        {
          key: '0BaseUrl',
          value: 'http://localhost:3000',
          urlData: {
            index: 0,
            url: 'http://localhost:3000/some?param1=2&param2=3'
          }
        }
      ],
      fileContent = fs.readFileSync(validHAREntriesFolder + '/multipleCorrectEntries.json', 'utf8'),
      logEntries = JSON.parse(fileContent),
      items = generateItems(logEntries, variables);
    expect(items).to.not.be.undefined;
    expect(items.length).to.equal(12);
    expect(items[0].name).to.equal('localhost:3000/api/users/queries/getCurrentUser');
    expect(items[1].name).to.equal('localhost:3000/api/categories/queries/getCategories');
    expect(items[2].name).to.equal('localhost:3000/api/skills/queries/getSkills');
    expect(items[3].name).to.equal('localhost:3000/api/labels/queries/getLabels');
    expect(items[4].name).to.equal('localhost:3000/api/profiles/queries/searchProfiles');
    expect(items[5].name).to.equal('localhost:3000/api/projects/mutations/createProject');
    expect(items[6].name).to.equal('localhost:3000/_next/static/chunks/pages/projects/%5BprojectId%5D.js');
    expect(items[7].name).to.equal('localhost:3000/_next/static/webpack/283c808214c965e442e6.hot-update.json');
    expect(items[8].name).to.equal('localhost:3000/_next/static/webpack/webpack.283c808214c965e442e6.hot-update.js');
    expect(items[9].name).to.equal('localhost:3000/api/projects/queries/getProject');
    expect(items[10].name).to.equal('localhost:3000/edit.svg');
    expect(items[11].name).to.equal('localhost:3000/api/users/queries/getCurrentUser');

  });
});


describe('HARToPostmanCollectionMapper getUrlDataFromEntries', function () {

  it('Should get only one diff url when 2 sent are equal', function () {
    const parsedHAR = {
        log: {
          entries: [
            {
              request:
              {
                url: 'http://localhost:3000/api/categories/queries/getCategories'
              }
            },
            {
              request:
              {
                url: 'http://localhost:3000/api/categories/queries/getCategories'
              }
            }
          ]
        }
      },
      result = getUrlDataFromEntries(parsedHAR);
    expect(Array.isArray(result)).to.equal(true);
    expect(result.length).to.equal(1);
    expect(result[0].url).to.equal('http://localhost:3000/api/categories/queries/getCategories');

  });

  it('Should get 2 diff url when 2 sent are diff', function () {
    const parsedHAR = {
        log: {
          entries: [
            {
              request:
              {
                url: 'http://localhost:3000/api/categories/queries/getCategories'
              }
            },
            {
              request:
              {
                url: 'http://localhost:3000/api/categories/queries/getCategories2'
              }
            }
          ]
        }
      },
      result = getUrlDataFromEntries(parsedHAR);
    expect(Array.isArray(result)).to.equal(true);
    expect(result.length).to.equal(2);
    expect(result[0].url).to.equal('http://localhost:3000/api/categories/queries/getCategories');
    expect(result[1].url).to.equal('http://localhost:3000/api/categories/queries/getCategories2');

  });

  it('Should get empty array when no parsedHar is passed', function () {
    const result = getUrlDataFromEntries();
    expect(Array.isArray(result)).to.equal(true);
    expect(result.length).to.equal(0);
  });


  it('Should get empty array when no log is passed', function () {
    const result = getUrlDataFromEntries({});
    expect(Array.isArray(result)).to.equal(true);
    expect(result.length).to.equal(0);
  });

  it('Should get empty array when no entries are passed', function () {
    const result = getUrlDataFromEntries({ log: undefined });
    expect(Array.isArray(result)).to.equal(true);
    expect(result.length).to.equal(0);
  });

});

describe('HARToPostmanCollectionMapper getVariablesFromUrlDataList', function () {

  it('should return 2 variables for 2 diff urls', function () {
    const parsedHAR = {
        log: {
          entries: [
            {
              request:
              {
                url: 'http://localhost:3000/api/categories/queries/getCategories'
              }
            },
            {
              request:
              {
                url: 'http://localhost:3000/api/categories/queries/getCategories2'
              }
            }
          ]
        }
      },
      urlData = getUrlDataFromEntries(parsedHAR),
      variables = getVariablesFromUrlDataList(urlData);
    expect(variables).to.not.be.undefined;
    expect(variables.length).to.equal(1);
    expect(variables[0].key).to.equal('baseUrl0');
    expect(variables[0].value).to.equal('http://localhost:3000');
  });

  it('should return 1 variables for 2 equal urls', function () {
    const parsedHAR = {
        log: {
          entries: [
            {
              request:
              {
                url: 'http://localhost:3000/api/categories/queries/getCategories'
              }
            },
            {
              request:
              {
                url: 'http://localhost:5000/api/categories/queries/getCategories'
              }
            }
          ]
        }
      },
      urlData = getUrlDataFromEntries(parsedHAR),
      variables = getVariablesFromUrlDataList(urlData);
    expect(variables).to.not.be.undefined;
    expect(variables.length).to.equal(2);
    expect(variables[0].key).to.equal('baseUrl0');
    expect(variables[0].value).to.equal('http://localhost:3000');
    expect(variables[1].key).to.equal('baseUrl1');
    expect(variables[1].value).to.equal('http://localhost:5000');
  });

  it('should return 0 variables when url data list is empty', function () {
    const variables = getVariablesFromUrlDataList([]);
    expect(variables).to.not.be.undefined;
    expect(variables.length).to.equal(0);
  });

  it('should return 0 variables when url data list is undefined', function () {
    const variables = getVariablesFromUrlDataList();
    expect(variables).to.not.be.undefined;
    expect(variables.length).to.equal(0);
  });

});

describe('HARToPostmanCollectionMapper filterCookiesFromHeader', function () {

  it('should return a valid header with one cookie', function () {
    const options = getOptions({ usage: ['CONVERSION'] }),
      includeCookies = options.find((option) => { return option.id === 'includeCookies'; });
    let header = {},
      optionFromOptions = {};
    optionFromOptions[`${includeCookies.id}`] = true;
    header = filterCookiesFromHeader([{
      name: 'Cookie',
      value: 'proposalHunt_sAntiCsrfToken=bMBNEsvnocdYBmF8YVzA9-tCXHyvHhpq'
    }], optionFromOptions);
    expect(header).to.not.be.undefined;
    expect(header[0].name).to.equal('Cookie');
    expect(header[0].value).to.equal('proposalHunt_sAntiCsrfToken=bMBNEsvnocdYBmF8YVzA9-tCXHyvHhpq');

  });

  it('should return a valid header with 2 cookies', function () {
    const options = getOptions({ usage: ['CONVERSION'] }),
      includeCookies = options.find((option) => { return option.id === 'includeCookies'; });
    let header = {},
      optionFromOptions = {};
    optionFromOptions[`${includeCookies.id}`] = true;
    header = filterCookiesFromHeader([{
      name: 'Cookie',
      value: 'proposalHunt_sAntiCsrfToken=bMBNEsvnocdYBmF8YVzA9-tCXHyvHhpq; ' +
        'express:sess.sig=uL8C4WneWd3LfQhDurtnQwAyDfc'
    }], optionFromOptions);
    expect(header).to.not.be.undefined;
    expect(header[0].name).to.equal('Cookie');
    expect(header[0].value)
      .to.equal('proposalHunt_sAntiCsrfToken=bMBNEsvnocdYBmF8YVzA9-tCXHyvHhpq;' +
      ' express:sess.sig=uL8C4WneWd3LfQhDurtnQwAyDfc');

  });

  it('should return undefined when there is no options', function () {
    let header = {};
    header = filterCookiesFromHeader([{
      name: 'Cookie',
      value: 'proposalHunt_sAntiCsrfToken=bMBNEsvnocdYBmF8YVzA9-tCXHyvHhpq'
    }]);
    expect(header.length).to.equal(0);
  });

  it('should return undefined when there is no option for include cookies', function () {
    let header = {};
    header = filterCookiesFromHeader([{
      name: 'Cookie',
      value: 'proposalHunt_sAntiCsrfToken=bMBNEsvnocdYBmF8YVzA9-tCXHyvHhpq'
    }], {});
    expect(header).to.be.empty;

  });

  it('should return undefined when there is no option for include cookies lowercase', function () {
    let header = {};
    header = filterCookiesFromHeader([{
      name: 'cookie',
      value: 'proposalHunt_sAntiCsrfToken=bMBNEsvnocdYBmF8YVzA9-tCXHyvHhpq'
    }], {});
    expect(header).to.be.empty;

  });

  it('should return undefined when include cookies options is set to false', function () {
    const options = getOptions({ usage: ['CONVERSION'] }),
      includeCookies = options.find((option) => { return option.id === 'includeCookies'; });
    let header = {},
      optionFromOptions = {};
    optionFromOptions[`${includeCookies.id}`] = false;

    header = filterCookiesFromHeader([{
      name: 'Cookie',
      value: 'proposalHunt_sAntiCsrfToken=bMBNEsvnocdYBmF8YVzA9-tCXHyvHhpq'
    }], optionFromOptions);
    expect(header).to.be.empty;

  });

});

describe('HARToPostmanCollectionMapper getResponseCookies', function () {

  it('should return a valid header array with one cookie', function () {
    const options = getOptions({ usage: ['CONVERSION'] }),
      includeCookies = options.find((option) => { return option.id === 'includeCookies'; });
    let cookies = [],
      optionFromOptions = {};
    optionFromOptions[`${includeCookies.id}`] = true;
    cookies = getResponseCookies({
      cookies: [{
        name: 'proposalHunt_sAntiCsrfToken',
        value: 'bMBNEsvnocdYBmF8YVzA9-tCXHyvHhpq',
        path: '/',
        domain: 'localhost',
        expires: '2021-11-17T22:06:19.927Z',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax'
      }]
    }, optionFromOptions);
    expect(cookies).to.not.be.undefined;
    expect(cookies.length).to.equal(1);
    expect(cookies[0].name).to.equal('proposalHunt_sAntiCsrfToken');
    expect(cookies[0].domain).to.equal('localhost');
    expect(cookies[0].path).to.equal('/');
    expect(cookies[0].secure).to.equal(false);
    expect(cookies[0].value).to.equal('bMBNEsvnocdYBmF8YVzA9-tCXHyvHhpq');
  });

  it('should return a valid header with 2 cookies', function () {
    const options = getOptions({ usage: ['CONVERSION'] }),
      includeCookies = options.find((option) => { return option.id === 'includeCookies'; });
    let cookies = [],
      optionFromOptions = {};
    optionFromOptions[`${includeCookies.id}`] = true;
    cookies = getResponseCookies({ cookies: [{
      name: 'proposalHunt_sAntiCsrfToken',
      value: 'bMBNEsvnocdYBmF8YVzA9-tCXHyvHhpq',
      path: '/',
      domain: 'localhost',
      expires: '2021-11-17T22:06:19.927Z',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax'
    },
    {
      name: 'other_cookie',
      value: 'other_value',
      path: '/',
      domain: 'localhost',
      expires: '2021-11-17T22:06:19.927Z',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax'
    }] }, optionFromOptions);
    expect(cookies).to.not.be.undefined;
    expect(cookies.length).to.equal(2);
  });

  it('should return undefined array when there is no options', function () {
    let cookies = [];
    cookies = getResponseCookies({
      cookies: [{
        name: 'proposalHunt_sAntiCsrfToken',
        value: 'bMBNEsvnocdYBmF8YVzA9-tCXHyvHhpq',
        path: '/',
        domain: 'localhost',
        expires: '2021-11-17T22:06:19.927Z',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax'
      }]
    });
    expect(cookies).to.be.undefined;

  });

  it('should return undefined when there is no option for include cookies', function () {
    let header = {};
    header = getResponseCookies({ cookies: [{
      name: 'proposalHunt_sAntiCsrfToken',
      value: 'bMBNEsvnocdYBmF8YVzA9-tCXHyvHhpq',
      path: '/',
      domain: 'localhost',
      expires: '2021-11-17T22:06:19.927Z',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax'
    }] }, {});
    expect(header).to.be.undefined;

  });

  it('should return undefined when include cookies options is set to false', function () {
    const options = getOptions({ usage: ['CONVERSION'] }),
      includeCookies = options.find((option) => { return option.id === 'includeCookies'; });
    let header = {},
      optionFromOptions = {};
    optionFromOptions[`${includeCookies.id}`] = false;

    header = getResponseCookies({ cookies: [{
      name: 'proposalHunt_sAntiCsrfToken',
      value: 'bMBNEsvnocdYBmF8YVzA9-tCXHyvHhpq',
      path: '/',
      domain: 'localhost',
      expires: '2021-11-17T22:06:19.927Z',
      httpOnly: false,
      secure: false,
      sameSite: 'Lax'
    }] }, optionFromOptions);
    expect(header).to.be.undefined;

  });

});
