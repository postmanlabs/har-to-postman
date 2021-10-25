const { expect } = require('chai'),
  {
    mapBodyFromJson,
    mapBody,
    mapBodyFromJsonResponse,
    mapBodyResponse
  } = require('../../lib/HARToPostmanCollectionBodyMapper');


describe('HARToPostmanCollectionBodyMapper mapBodyFromJson', function () {

  it('Should get body with raw and json type', function () {
    const harRequest = { postData: { text: '{some:value}' } },
      result = mapBodyFromJson(harRequest);
    expect(result).to.not.be.undefined;
    expect(result.mode).to.equal('raw');
    expect(result.options.raw.language).to.equal('json');
    expect(result.raw).to.equal('{some:value}');
  });

  it('Should get empty body when no post data is present', function () {
    const harRequest = {},
      result = mapBodyFromJson(harRequest);
    expect(result).to.not.be.undefined;
    expect(result.mode).to.equal('raw');
    expect(result.options.raw.language).to.equal('json');
    expect(result.raw).to.equal('');
  });

  it('Should get empty body when no har request is present', function () {
    const result = mapBodyFromJson();
    expect(result).to.not.be.undefined;
    expect(result.mode).to.equal('raw');
    expect(result.options.raw.language).to.equal('json');
    expect(result.raw).to.equal('');
  });

});

describe('HARToPostmanCollectionBodyMapper mapBody', function () {

  it('Should get body with raw and json type', function () {
    const harRequest = { bodySize: 25, postData: { text: '{some:value}', mimeType: 'application/json' } },
      result = mapBody(harRequest);
    expect(result).to.not.be.undefined;
    expect(result.mode).to.equal('raw');
    expect(result.options.raw.language).to.equal('json');
    expect(result.raw).to.equal('{some:value}');
  });

  it('Should get undefined when body size is 0', function () {
    const harRequest = { bodySize: 0, postData: { text: '{some:value}', mimeType: 'application/json' } },
      result = mapBody(harRequest);
    expect(result).to.be.undefined;
  });

  it('Should get undefined when mime type is not json', function () {
    const harRequest = { bodySize: 24, postData: { text: '{some:value}', mimeType: 'application/pdf' } },
      result = mapBody(harRequest);
    expect(result).to.be.undefined;
  });

});


describe('HARToPostmanCollectionBodyMapper mapBodyFromJsonResponse', function () {

  it('Should get body with raw and json type', function () {
    const harResponse = { content: { text: '{some:value}' } },
      result = mapBodyFromJsonResponse(harResponse);
    expect(result).to.not.be.undefined;
    expect(result.language).to.equal('json');
    expect(result.body).to.equal('{some:value}');
  });

  it('Should get empty body when no post data is present', function () {
    const harResponse = {},
      result = mapBodyFromJsonResponse(harResponse);
    expect(result).to.not.be.undefined;
    expect(result.language).to.equal('json');
    expect(result.body).to.equal('');
  });

  it('Should get empty body when no har request is present', function () {
    const result = mapBodyFromJsonResponse();
    expect(result).to.not.be.undefined;
    expect(result.language).to.equal('json');
    expect(result.body).to.equal('');
  });

});


describe('HARToPostmanCollectionBodyMapper mapBodyResponse', function () {

  it('Should get body with raw and json type', function () {
    const harResponse = { bodySize: 25, content: { text: '{some:value}', mimeType: 'application/json' } },
      result = mapBodyResponse(harResponse);
    expect(result).to.not.be.undefined;
    expect(result.language).to.equal('json');
    expect(result.body).to.equal('{some:value}');
  });

  it('Should get undefined when body size is 0', function () {
    const harResponse = { bodySize: 0, content: { text: '{some:value}', mimeType: 'application/json' } },
      result = mapBodyResponse(harResponse);
    expect(result).to.be.undefined;
  });

  it('Should get undefined when mime type is not json', function () {
    const harResponse = { bodySize: 24, content: { text: '{some:value}', mimeType: 'application/pdf' } },
      result = mapBodyResponse(harResponse);
    expect(result).to.be.undefined;
  });

});
