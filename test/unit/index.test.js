const { expect } = require('chai'),
  {
    getOptions,
    convert,
    getMetaData
  } = require('../../index'),
  validHAREntriesFolder = 'test/data/validHARFiles';

describe('Index getOptions', function () {
  it('Should return external options when called without parameters', function () {
    const options = getOptions();
    expect(options).to.be.an('array');
    expect(options).to.not.be.empty;
  });
});

describe('convert', function () {
  it('Should convert the valid input file', function () {
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

  it('Should conver a har file into a PM Collection with tab indentation character', function () {
    const
      VALID_WSDL_PATH = validHAREntriesFolder + '/multiplePost.har';
    convert({
      type: 'file',
      data: VALID_WSDL_PATH
    }, { indentCharacter: 'tab' }, (error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
      expect(result.output).to.be.an('array');
      expect(result.output[0].data).to.be.an('object');
      expect(result.output[0].type).to.equal('collection');
      expect(result.output[0].data.item[0].request.body.raw).to.equal('{\n\t"params": null,\n\t"meta": {}\n}');
    });
  });
});

describe('getMetadata', function () {
  it('Should convert the valid input file', function () {
    const
      VALID_WSDL_PATH = validHAREntriesFolder + '/simpleImageRequest.har';
    getMetaData({
      type: 'file',
      data: VALID_WSDL_PATH
    }, (error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
      expect(result.name).to.equal('i.ytimg.com');
      expect(result.output[0].name).to.equal('i.ytimg.com');
      expect(result.output[0].type).to.equal('collection');
    });
  });
});
