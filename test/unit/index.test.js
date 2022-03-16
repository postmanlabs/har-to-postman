const { expect } = require('chai'),
  {
    getOptions,
    convert,
    getMetaData,
    validate
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

  it('Should convert the valid input file null status text and redirectURL', function () {
    const
      VALID_WSDL_PATH = validHAREntriesFolder + '/example.har';
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

  it('Should convert a har file into a PM Collection with tab indentation character', function () {
    const
      VALID_WSDL_PATH = validHAREntriesFolder + '/multiplePost.har';
    convert({
      type: 'file',
      data: VALID_WSDL_PATH
    }, { indentCharacter: 'Tab', folderStrategy: 'None' }, (error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
      expect(result.output).to.be.an('array');
      expect(result.output[0].data).to.be.an('object');
      expect(result.output[0].type).to.equal('collection');
      expect(result.output[0].data.item[0].request.body.raw).to.equal('{\n\t"params": null,\n\t"meta": {}\n}');
    });
  });

  it('Should return an error when indentCharacter option value is not allowed', function () {
    const
      VALID_WSDL_PATH = validHAREntriesFolder + '/multiplePost.har';

    convert({
      type: 'file',
      data: VALID_WSDL_PATH
    }, { indentCharacter: 'tab', folderStrategy: 'No folders' }, (error, result) => {
      expect(result).to.be.undefined;
      expect(error).to.be.an('object');
      expect(error.message).to.equal('Value \'tab\' is not allowed by' +
        ' \'indentCharacter\' option.\n      Allowed values are (Space, Tab).');
    });
  });

  it('Should return an error when folderStrategy option value is not allowed', function () {
    const
      VALID_WSDL_PATH = validHAREntriesFolder + '/multiplePost.har';

    convert({
      type: 'file',
      data: VALID_WSDL_PATH
    }, { indentCharacter: 'Tab', folderStrategy: 'No folders' }, (error, result) => {
      expect(result).to.be.undefined;
      expect(error).to.be.an('object');
      expect(error.message).to.be.equal('Value \'No folders\' is not allowed by' +
      ' \'folderStrategy\' option.\n      Allowed values are (None, Page).');
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

describe('Validate', function () {
  it('Should validate a correct input', function () {
    const
      VALID_WSDL_PATH = validHAREntriesFolder + '/simpleImageRequest.har',
      result = validate({
        type: 'file',
        data: VALID_WSDL_PATH
      });
    expect(result.result).to.be.true;
  });
});
