const { expect } = require('chai'),
  {
    getOptions,
    convert,
    getMetaData
  } = require('../../index'),
  validHAREntriesFolder = 'test/data/validHARFiles';

describe('Index getOptions', function() {
  it('Should return external options when called without parameters', function() {
    const options = getOptions();
    expect(options).to.be.an('array');
    expect(options).to.not.be.empty;
  });
});

describe('convert', function() {
  it('Should convert the valid input file', function() {
    const
      VALID_WSDL_PATH = validHAREntriesFolder + '/simpleImageRequest.har';
    convert({
      type: 'file',
      data: VALID_WSDL_PATH
    }, {}, (error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
      expect(result.output).to.be.an('array');
      expect(result.output[0].data).to.be.an('object');
      expect(result.output[0].type).to.equal('collection');
    });
  });
});

describe('getMetadata', function() {
  it('Should convert the valid input file', function() {
    const
      VALID_WSDL_PATH = validHAREntriesFolder + '/simpleImageRequest.har';
    getMetaData({
      type: 'file',
      data: VALID_WSDL_PATH
    }, (error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
      expect(result.name).to.equal('i.ytimg.com/vi/nmXMgqjQzls/mqdefault.jpg');
      expect(result.output[0].name).to.equal('i.ytimg.com/vi/nmXMgqjQzls/mqdefault.jpg');
      expect(result.output[0].type).to.equal('collection');
    });
  });
});
