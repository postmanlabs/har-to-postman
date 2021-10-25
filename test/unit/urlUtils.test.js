const { expect } = require('chai'),
  { getProtocolAndHost,
    removeProtocolFromURL
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
      expect(inputError.message).to.equal('Invalid URL: not url');
    }
  });

});
