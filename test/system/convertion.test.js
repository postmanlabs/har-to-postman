const expect = require('chai').expect,
  Index = require('../../index.js'),
  fs = require('fs');

describe('E2E Flows convert a HAR file into a PM Collection', function () {
  let fileContent = fs.readFileSync('test/data/externalHARfile/patio.wizeline.receivers.har', 'utf8');

  it('Should be indented with Space by default', function () {
    let defaultIndent = '{\n \"client_id\": \"4MwrrncB4YlTYeeBNbC1oGuHG6sFbU1A\",\n \"code_verifier\":' +
    ' \"jfwEN9xGWcB7MzcPA3feyHrtDV_Gmwk8zvsV16G_4bh\",\n \"code\": \"Cb_-eFX3fqQCRDZ1\",\n \"grant_type\":' +
    ' \"authorization_code\",\n \"redirect_uri\": \"http://localhost:3000/callback\"\n}';
    Index.convert(
      { data: fileContent, type: 'string' },
      {},
      (error, result) => {
        expect(error).to.be.null;
        expect(result.output[0].data.item[0].item[0].request.body.raw).to.equal(defaultIndent);
      }
    );
  });

  it('Should be indented with Tab', function () {
    let TabIndent = '{\n\t\"client_id\": \"4MwrrncB4YlTYeeBNbC1oGuHG6sFbU1A\",\n\t\"code_verifier\": ' +
    '\"jfwEN9xGWcB7MzcPA3feyHrtDV_Gmwk8zvsV16G_4bh\",\n\t\"code\": \"Cb_-eFX3fqQCRDZ1\",\n\t\"grant_type\":' +
    ' \"authorization_code\",\n\t\"redirect_uri\": \"http://localhost:3000/callback\"\n}';
    Index.convert(
      { data: fileContent, type: 'string' },
      { indentCharacter: 'Tab' },
      (error, result) => {
        expect(error).to.be.null;
        expect(result.output[0].data.item[0].item[0].request.body.raw).to.equal(TabIndent);
      }
    );
  });

  it('Should have one variable for URL', function () {
    Index.convert(
      { data: fileContent, type: 'string' },
      {},
      (error, result) => {
        expect(error).to.be.null;
        expect(result.output[0].data.variable[0].key).to.equal('baseUrl1');
        expect(result.output[0].data.variable[0].value).to.equal('https://maskedURI');
      }
    );
  });

  it('Should have multiples variables', function () {
    fileContent = fs.readFileSync('test/data/externalHARfile/patio.wizeline.givers.original.har', 'utf8');
    Index.convert(
      { data: fileContent, type: 'string' },
      {},
      (error, result) => {
        expect(error).to.be.null;
        expect(result.output[0].data.variable.length).to.equal(5);
        expect(result.output[0].data.variable[0].key).to.equal('baseUrl1');
        expect(result.output[0].data.variable[0].value).to.equal('https://localhost:3000');
        expect(result.output[0].data.variable[1].key).to.equal('baseUrl2');
        expect(result.output[0].data.variable[1].value).to.equal('https://localhost1:3000');
        expect(result.output[0].data.variable[2].key).to.equal('baseUrl3');
        expect(result.output[0].data.variable[2].value).to.equal('https://lh3.googleusercontent.com');
        expect(result.output[0].data.variable[3].key).to.equal('baseUrl4');
        expect(result.output[0].data.variable[3].value)
          .to.equal('https://spf8c0usjl.execute-api.us-east-1.amazonaws.com');
        expect(result.output[0].data.variable[4].key).to.equal('baseUrl5');
        expect(result.output[0].data.variable[4].value).to.equal('https://avatars.slack-edge.com');
        expect(result.output[0].data.item[0].item[10].response[0].cookie).to.be.empty;
      }
    );
  });

  it('Should have Cookies excluded by default', function () {
    fileContent = fs.readFileSync('test/data/externalHARfile/patio.wizeline.givers.original.har', 'utf8');
    Index.convert(
      { data: fileContent, type: 'string' },
      {},
      (error, result) => {
        expect(error).to.be.null;
        expect(result.output[0].data.item[0].item[9].request.header.length).to.eql(12);
        expect(result.output[0].data.item[0].item[9].response[0].cookie).to.be.empty;
      }
    );
  });

  it('Should include cookies when enabled in options', function () {
    fileContent = fs.readFileSync('test/data/externalHARfile/patio.wizeline.givers.original.har', 'utf8');
    Index.convert(
      { data: fileContent, type: 'string' },
      { includeCookies: true },
      (error, result) => {
        expect(error).to.be.null;
        expect(result.output[0].data.item[0].item[9].request.header.length).to.eql(13);
        expect(result.output[0].data.item[0].item[9].response[0].cookie).not.to.be.empty;
      }
    );
  });

  it('Should have multiple args for Request URL', function () {
    fileContent = fs.readFileSync('test/data/externalHARfile/patio.wizeline.givers.har', 'utf8');
    Index.convert(
      { data: fileContent, type: 'string' },
      {},
      (error, result) => {
        expect(error).to.be.null;
        expect(result.output[0].data.item[0].item[0].request.url.query[0].key).to.equal('page');
        expect(result.output[0].data.item[0].item[0].request.url.query[0].value).to.equal('1');
        expect(result.output[0].data.item[0].item[0].request.url.query[1].key).to.equal('limit');
        expect(result.output[0].data.item[0].item[0].request.url.query[1].value).to.equal('20');
        expect(result.output[0].data.item[0].item[0].request.url.query[2].key).to.equal('searchTerm');
        expect(result.output[0].data.item[0].item[0].request.url.query[2].value).to.equal('');
        expect(result.output[0].data.item[0].item[0].request.url.query[3].key).to.equal('year');
        expect(result.output[0].data.item[0].item[0].request.url.query[3].value).to.equal('2021');
        expect(result.output[0].data.item[0].item[0].request.url.query[4].key).to.equal('month');
        expect(result.output[0].data.item[0].item[0].request.url.query[4].value).to.equal('Oct');
      }
    );
  });

  it('Should exclude responses when options is sent as false', function () {
    fileContent = fs.readFileSync('test/data/externalHARfile/patio.wizeline.givers.har', 'utf8');
    Index.convert(
      { data: fileContent, type: 'string' },
      { includeResponses: false },
      (error, result) => {
        expect(error).to.be.null;
        expect(result.output[0].data.item[0].item[0].response).to.be.an('array');
        expect(result.output[0].data.item[0].item[0].response).to.be.empty;
      }
    );
  });

  it('Should decode URL and title from har', function () {
    let name = 'localhost1:3000/authorize?audience=https://spf8c0usjl.execute-api.us-east-1.amazonaws.com/prod/&' +
    'client_id=4MwrrncB4YlTYeeBNbC1oGuHG6sFbU1A&redirect_uri=https://localhost:3000/callback&scope=openid%20' +
    'profile%20email&response_type=code&response_mode=web_message&state=fmNMMGRFSTJGcklscDQ3bGpzVko1SVFZcTJq' +
    'U1UyLUxrWFRSczN3T1N2UA==&nonce=N0Iwb1g1czVCN1YxdFNUOG1heHUtN0hKTTM1RFN4cGNod2ZDbXUwM1BQVw==&code_challenge' +
    '=RzgHAZSgknVCrSqW7106E6zZIWfvvFxAfIWm6qUpR5k&code_challenge_method=S256&prompt=none&auth0Client=' +
    'eyJuYW1lIjoiYXV0aDAtcmVhY3QiLCJ2ZXJzaW9uIjoiMS41LjAifQ==';
    fileContent = fs.readFileSync('test/data/externalHARfile/patio.wizeline.givers.original.har', 'utf8');
    Index.convert(
      { data: fileContent, type: 'string' },
      {},
      (error, result) => {
        expect(error).to.be.null;
        expect(result.output[0].data.info.name).to.be.eql('localhost:3000');
        expect(result.output[0].data.item[0].item[9].name).to.be.eql(name);
      }
    );
  });

  it('Should add a default body to non-text based bodies in response', function () {
    fileContent = fs.readFileSync('test/data/externalHARfile/patio.wizeline.givers.original.har', 'utf8');
    const expectedBodyContent = 'This content type is not supported in the response body';
    Index.convert(
      { data: fileContent, type: 'string' },
      {},
      (error, result) => {
        expect(error).to.be.null;
        expect(result.output[0].data.item[0].item[14].response[0].body).to.be.equal(expectedBodyContent);
      }
    );
  });
});
