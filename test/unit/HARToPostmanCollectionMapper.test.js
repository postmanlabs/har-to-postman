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
    DEFAULT_COLLECTION_NAME,
    DEFAULT_COLLECTION_DESCRIPTION,
    DEFAULT_ITEM_NAME
  } = require('../../lib/HARToPostmanCollectionMapper'),
  validHAREntriesFolder = 'test/data/entries';


describe('HARToPostmanCollectionMapper getCollectionPossibleNameFromPages', function () {

  it('Should get the name from first page\'s title', function () {
    const fileContent = fs.readFileSync(validHAREntriesFolder + '/multipleCorrectEntries.json', 'utf8'),
      logEntry = JSON.parse(fileContent),
      result = getCollectionPossibleNameFromPages(logEntry);
    expect(result).to.equal('localhost:3000/projects');
  });
});

describe('HARToPostmanCollectionMapper getCollectionName', function () {

  it('Should get the name from first page\'s title', function () {
    const fileContent = fs.readFileSync(validHAREntriesFolder + '/multipleCorrectEntries.json', 'utf8'),
      logEntry = JSON.parse(fileContent),
      result = getCollectionName(logEntry);
    expect(result).to.equal('localhost:3000/projects');
  });

  it('Should get the name from first page\'s title even with provided name', function () {
    const fileContent = fs.readFileSync(validHAREntriesFolder + '/multipleCorrectEntries.json', 'utf8'),
      logEntry = JSON.parse(fileContent),
      result = getCollectionName(logEntry, 'file.har');
    expect(result).to.equal('localhost:3000/projects');
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
    expect(mappingObj.name).equal('localhost:3000/projects');
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
    const harRequest = { bodySize: 25, postData: { text: '{some:value}', mimeType: 'application/json' } },
      result = getBody(harRequest);
    expect(result).to.not.be.undefined;
    expect(result.mode).to.equal('raw');
    expect(result.options.raw.language).to.equal('json');
    expect(result.raw).to.equal('{some:value}');
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
    const url = generateItemRequestUrl({ url: 'http://localhost:3000/some?param1=2&param2=3' });
    expect(url).to.not.be.undefined;
    expect(url).to.equal('http://localhost:3000/some?param1=2&param2=3');

  });
});

describe('HARToPostmanCollectionMapper generateItemRequest', function () {

  it('Should generate a simple request only one get element', function () {
    const request = {
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
      itemRequest = generateItemRequest(request);
    expect(itemRequest).to.not.be.undefined;
    expect(itemRequest.url).to.equal('http://localhost:3000/some?param1=2&param2=3');
    expect(itemRequest.method).to.equal('GET');
    expect(itemRequest.body).to.be.undefined;
    expect(itemRequest.header.length).to.equal(4);

  });

  it('Should generate a simple request with only one POST element', function () {
    const request = {
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
          text: '{\'params\':{},\'meta\':{}}'
        }
      },
      itemRequest = generateItemRequest(request);
    expect(itemRequest).to.not.be.undefined;
    expect(itemRequest.url).to.equal('http://localhost:3000/api/categories/queries/getCategories');
    expect(itemRequest.method).to.equal('POST');
    expect(itemRequest.body).to.not.be.undefined;
    expect(itemRequest.body.raw).to.equal('{\'params\':{},\'meta\':{}}');
    expect(itemRequest.body.options.raw.language).to.equal('json');
    expect(itemRequest.header.length).to.equal(9);

  });

  it('should generate a simple request no headers', function () {
    const request = {
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
          text: '{\'params\':{},\'meta\':{}}'
        }
      },
      itemRequest = generateItemRequest(request);
    expect(itemRequest).to.not.be.undefined;
    expect(itemRequest.url).to.equal('http://localhost:3000/api/categories/queries/getCategories');
    expect(itemRequest.method).to.equal('POST');
    expect(itemRequest.body).to.not.be.undefined;
    expect(itemRequest.body.raw).to.equal('{\'params\':{},\'meta\':{}}');
    expect(itemRequest.body.options.raw.language).to.equal('json');
    expect(Object.keys(itemRequest).find((property) => { return property === 'header'; })).to.be.undefined;

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
    const responsePayload = '{\'result\':[{\'name\':\'Business Enabler\'},{\'name\':\'Experiment\'},' +
      '{\'name\':\'Strategic Differentiator\'},{\'name\':\'Value Creator\'}],\'error\':null,\'meta\':{}}',
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
            raw: '{\'params\':{},\'meta\':{}}',
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
    expect(itemResponse[0].body).to.equal(responsePayload);
    expect(itemResponse[0].headers.members.length).to.equal(4);

  });

  it('Should generate a simple response with only one Post element', function () {
    const request = {
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
          text: '{\'params\':{},\'meta\':{}}'
        }
      },
      itemRequest = generateItemRequest(request);
    expect(itemRequest).to.not.be.undefined;
    expect(itemRequest.url).to.equal('http://localhost:3000/api/categories/queries/getCategories');
    expect(itemRequest.method).to.equal('POST');
    expect(itemRequest.body).to.not.be.undefined;
    expect(itemRequest.body.raw).to.equal('{\'params\':{},\'meta\':{}}');
    expect(itemRequest.body.options.raw.language).to.equal('json');
    expect(itemRequest.header.length).to.equal(9);

  });
});


describe('HARToPostmanCollectionMapper generateItem', function () {

  it('Should generate an item for simple entry', function () {
    const fileContent = fs.readFileSync(validHAREntriesFolder + '/simpleCorrectEntry.json', 'utf8'),
      logEntry = JSON.parse(fileContent),
      item = generateItem(logEntry);
    expect(item).to.not.be.undefined;
    expect(item.name).to.equal('localhost:3000/api/users/queries/getCurrentUser');
    expect(item.request.method).to.equal('POST');
    expect(item.request.body.raw).to.equal('{"params":null,"meta":{}}');
    expect(item.response[0].name).to.equal('successfully / 200');
    expect(item.response[0].body)
      .to.equal('{\"result\":{\"id\":1,\"name\":\"Luis Tejeda Sanchez\",\"email\":\"luis.tejeda@wizeline.com\",' +
        '\"role\":\"USER\"},\"error\":null,\"meta\":{}}');
    expect(item.response[0].originalRequest.body.raw).to.equal('{"params":null,"meta":{}}');
  });

  // it('should generate an item for simple entry', function () {
  //   const variables = [
  //     {
  //       key: '0BaseUrl',
  //       value: 'http://localhost:3000',
  //       urlData: {
  //         index: 0,
  //         url: 'http://localhost:3000/some?param1=2&param2=3',
  //       },
  //     },
  //   ],
  //   logEntry = {
  //     _initiator: {
  //       type: 'other'
  //     },
  //     _priority: 'VeryHigh',
  //     _resourceType: 'document',
  //     cache: {},
  //     request: {
  //       method: 'GET',
  //       url: 'http://localhost:3000/some?param1=2&param2=3',
  //       httpVersion: '',
  //       headers: [
  //         {
  //           name: 'sec-ch-ua',
  //           value: '\'Chromium\';v=\'94\', \'Google Chrome\';v=\'94\', \';Not A Brand\';v=\'99\''
  //         },
  //         {
  //           name: 'sec-ch-ua-mobile',
  //           value: '?0'
  //         },
  //         {
  //           name: 'sec-ch-ua-platform',
  //           value: '\'macOS\''
  //         },
  //         {
  //           name: 'Upgrade-Insecure-Requests',
  //           value: '1'
  //         },
  //         {
  //           name: 'User-Agent',
  //           value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)
  //  Chrome/94.0.4606.81 Safari/537.36'
  //         }
  //       ],
  //       queryString: [
  //         {
  //           name: 'param1',
  //           value: '2'
  //         },
  //         {
  //           name: 'param2',
  //           value: '3'
  //         }
  //       ],
  //       cookies: [],
  //       headersSize: -1,
  //       bodySize: 0
  //     },
  //     response: {
  //       status: 0,
  //       statusText: '',
  //       httpVersion: '',
  //       headers: [],
  //       cookies: [],
  //       content: {
  //         size: 0,
  //         mimeType: 'x-unknown'
  //       },
  //       redirectURL: '',
  //       headersSize: -1,
  //       bodySize: -1,
  //       _transferSize: 0,
  //       _error: 'net::ERR_CONNECTION_REFUSED'
  //     },
  //     serverIPAddress: '',
  //     startedDateTime: '2021-10-21T15:55:58.305Z',
  //     time: 6.194000001414679,
  //     timings: {
  //       blocked: 6.194000001414679,
  //       dns: -1,
  //       ssl: -1,
  //       connect: -1,
  //       send: 0,
  //       wait: 0,
  //       receive: 0,
  //       _blocked_queueing: -1
  //     }
  //   },
  //     item = generateItem(logEntry, variables);
  //   expect(item).to.not.be.undefined;

  // });
});

describe('HARToPostmanCollectionMapper generateItems', function () {

  it('Should generate items for simple entry', function () {
    const fileContent = fs.readFileSync(validHAREntriesFolder + '/multipleCorrectEntries.json', 'utf8'),
      logEntries = JSON.parse(fileContent),
      items = generateItems(logEntries);
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
