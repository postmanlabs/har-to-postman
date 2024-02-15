const { expect } = require('chai'),
  { getProtocolAndHost,
    removeProtocolFromURL,
    getHost,
    decodeURL
  } = require('../../lib/utils/urlUtils');

describe('getProtocolAndHost method', function () {
  it('Should return the correct host and protocol from a url', function () {
    const url = 'http://supertest.test',
      {
        host,
        protocol
      } = getProtocolAndHost(url);
    expect(host).to.be.equal('supertest.test');
    expect(protocol).to.be.equal('http://');
  });

  it('Should return the correct host and protocol from a url with subroutes', function () {
    const url = 'http://supertest.test/subroute/test',
      {
        host,
        protocol
      } = getProtocolAndHost(url);
    expect(host).to.be.equal('supertest.test');
    expect(protocol).to.be.equal('http://');
  });

  it('Should return the correct host and an empty protocol from a url without protocol', function () {
    const url = 'supertest.test/subroute',
      {
        host,
        protocol
      } = getProtocolAndHost(url);
    expect(host).to.be.equal('supertest.test');
    expect(protocol).to.be.equal('');
  });

  it('Should return empty host and protocol from an empty url', function () {
    const url = '',
      {
        host,
        protocol
      } = getProtocolAndHost(url);
    expect(host).to.be.equal('');
    expect(protocol).to.be.equal('');
  });
});

describe('removeProtocolFromURL method', function () {
  it('should return localhost:3000/projects for entry "http://localhost:3000/projects"', function () {
    const result = removeProtocolFromURL('http://localhost:3000/projects');
    expect(result).to.equal('localhost:3000/projects');
  });

  it('should throw an error with entry "not url"', function () {
    try {
      removeProtocolFromURL('not url');
      assert.fail('we expected an error');
    }
    catch (inputError) {
      expect(inputError.message).to.include('Invalid URL');
    }
  });

});

describe('getHost method', function () {
  it('should return localhost:3000 for entry "http://localhost:3000/projects"', function () {
    const result = getHost('http://localhost:3000/projects');
    expect(result).to.equal('localhost:3000');
  });

  it('should return en.wikipedia.org for entry "http://en.wikipedia.org/wiki/1920%E2%80%9321_Cardiff_City.json"',
    function () {
      const result = getHost('http://en.wikipedia.org/wiki/1920%E2%80%9321_Cardiff_City.json');
      expect(result).to.equal('en.wikipedia.org');
    });
});

describe('decodeURL method', function () {
  it('should return "en.wikipedia.org/wiki/1920–21_Cardiff_City.json" for entry' +
  ' "en.wikipedia.org%2Fwiki%2F1920%E2%80%9321_Cardiff_City.json"', function () {
    const result = decodeURL('en.wikipedia.org%2Fwiki%2F1920%E2%80%9321_Cardiff_City.json');
    expect(result).to.equal('en.wikipedia.org/wiki/1920–21_Cardiff_City.json');
  });

  it('should return "" for entry "" ', function () {
    const result = decodeURL('');
    expect(result).to.equal('');
  });

  it('should return "" for entry undefined ', function () {
    const result = decodeURL();
    expect(result).to.equal('');
  });

  it('should return provided URL as is if we fail to decode url', function () {
    const result = decodeURL('%E0%A4%A');
    expect(result).to.equal('%E0%A4%A');
  });
});
