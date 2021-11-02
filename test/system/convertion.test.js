const expect = require('chai').expect,
    Index = require('../../index.js'),
    fs = require('fs'),
    outputDirectory = 'test/data/output/';

describe('E2E Flows convert a HAR file into a PM Collection', function () {
    let fileContent = fs.readFileSync('test/data/externalHARfile/patio.wizeline.receivers.har', 'utf8');

    it('Should be indented with Space by default', function () {
        let defaultIndent = "{\n \"client_id\": \"4MwrrncB4YlTYeeBNbC1oGuHG6sFbU1A\",\n \"code_verifier\": \"jfwEN9xGWcB7MzcPA3feyHrtDV_Gmwk8zvsV16G_4bh\",\n \"code\": \"Cb_-eFX3fqQCRDZ1\",\n \"grant_type\": \"authorization_code\",\n \"redirect_uri\": \"http://localhost:3000/callback\"\n}";
        Index.convert(
            { data: fileContent, type: 'string' },
            {},
            ( error, result) => {
                expect(error).to.be.null;
                expect(result.output[0].data.item[0].request.body.raw).to.equal(defaultIndent);
            }
        );
    });
    
    it('Should be indented with Tab', function () {
        let TabIndent = "{\n\t\"client_id\": \"4MwrrncB4YlTYeeBNbC1oGuHG6sFbU1A\",\n\t\"code_verifier\": \"jfwEN9xGWcB7MzcPA3feyHrtDV_Gmwk8zvsV16G_4bh\",\n\t\"code\": \"Cb_-eFX3fqQCRDZ1\",\n\t\"grant_type\": \"authorization_code\",\n\t\"redirect_uri\": \"http://localhost:3000/callback\"\n}";
        Index.convert(
            { data: fileContent, type: 'string' },
            { indentCharacter: 'Tab' },
            ( error, result) => {
                expect(error).to.be.null;
                expect(result.output[0].data.item[0].request.body.raw).to.equal(TabIndent);
            }
        );
    });

    it('Should have one variable for URL', function () {
        Index.convert(
            { data: fileContent, type: 'string' },
            {},
            (error, result) => {
                expect(error).to.be.null;
                expect(result.output[0].data.variable[0].key).to.equal('baseUrl0');
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
                expect(result.output[0].data.variable[0].key).to.equal('baseUrl0');
                expect(result.output[0].data.variable[0].value).to.equal('https://localhost:3000');
                expect(result.output[0].data.variable[1].key).to.equal('baseUrl9');
                expect(result.output[0].data.variable[1].value).to.equal('https://localhost1:3000');
                expect(result.output[0].data.variable[2].key).to.equal('baseUrl14');
                expect(result.output[0].data.variable[2].value).to.equal('https://lh3.googleusercontent.com');
                expect(result.output[0].data.variable[3].key).to.equal('baseUrl17');
                expect(result.output[0].data.variable[3].value).to.equal('https://spf8c0usjl.execute-api.us-east-1.amazonaws.com');
                expect(result.output[0].data.variable[4].key).to.equal('baseUrl18');
                expect(result.output[0].data.variable[4].value).to.equal('https://avatars.slack-edge.com');
                expect(result.output[0].data.item[10].response[0].cookie).to.be.empty;
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
                expect(result.output[0].data.item[9].request.header.length).to.eql(16);
                expect(result.output[0].data.item[9].response[0].cookie).to.be.empty;
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
                expect(result.output[0].data.item[9].request.header.length).to.eql(17);
                expect(result.output[0].data.item[9].response[0].cookie).not.to.be.empty;
            }
        );
    });

    it('Should contain multiple args', function () {
        fileContent = fs.readFileSync('test/data/externalHARfile/patio.wizeline.givers.har', 'utf8');
        Index.convert(
            { data: fileContent, type: 'string' },
            {},
            (error, result) => {
                expect(error).to.be.null;
                expect(result.output[0].data.item[0].request.url.query[0].key).to.equal('page');
                expect(result.output[0].data.item[0].request.url.query[0].value).to.equal('1');
                expect(result.output[0].data.item[0].request.url.query[1].key).to.equal('limit');
                expect(result.output[0].data.item[0].request.url.query[1].value).to.equal('20');
                expect(result.output[0].data.item[0].request.url.query[2].key).to.equal('searchTerm');
                expect(result.output[0].data.item[0].request.url.query[2].value).to.equal('');
                expect(result.output[0].data.item[0].request.url.query[3].key).to.equal('year');
                expect(result.output[0].data.item[0].request.url.query[3].value).to.equal('2021');
                expect(result.output[0].data.item[0].request.url.query[4].key).to.equal('month');
                expect(result.output[0].data.item[0].request.url.query[4].value).to.equal('Oct');
            }
        );
    });

    it('Should exlcude responses', function () {
        fileContent = fs.readFileSync('test/data/externalHARfile/patio.wizeline.givers.har', 'utf8');
        Index.convert(
            { data: fileContent, type: 'string' },
            { includeResponses: false },
            (error, result) => {
                expect(error).to.be.null;
                expect(result.output[0].data.item[0].response).to.be.an('array');
                expect(result.output[0].data.item[0].response).to.be.empty;
            }
        );
    });
});