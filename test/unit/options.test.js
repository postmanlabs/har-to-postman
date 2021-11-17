const expect = require('chai').expect,
  {
    getOptions
  } = require('../../lib/utils/options'),
  optionIds = [
    'indentCharacter',
    'includeCookies',
    'includeResponses',
    'folderStrategy'
  ];

describe('SchemaPack getOptions', function () {

  it('must have a valid structure', function () {
    const options = getOptions();
    options.forEach((option) => {
      expect(option).to.have.property('name');
      expect(option).to.have.property('id');
      expect(option).to.have.property('type');
      expect(option).to.have.property('default');
      expect(option).to.have.property('description');
    });
  });

  it('Should return external options when called without parameters', function () {
    getOptions().forEach((option) => {
      expect(option.id).to.be.oneOf(optionIds);
      expect(option.external).to.be.true;
    });
  });

  it('Should return external options when called with mode = document', function () {
    const options = getOptions('document');
    expect(options).to.be.an('array');
    expect(options.length).to.eq(4);
  });

  it('Should return external options when called with mode = use', function () {
    const options = getOptions('use');
    expect(options).to.be.an('object');
    expect(options).to.haveOwnProperty('indentCharacter');
    expect(options.indentCharacter).to.eq('  ');
  });

  it('Should return external options when called with criteria usage conversion', function () {
    getOptions({
      usage: ['CONVERSION']
    }).forEach((option) => {
      expect(option.id).to.be.oneOf(optionIds);
      expect(option.usage).to.include('CONVERSION');
    });
  });

  it('Should return external options when called with criteria usage validation', function () {
    getOptions({
      usage: ['VALIDATION']
    }).forEach((option) => {
      expect(option.id).to.be.oneOf(optionIds);
      expect(option.usage).to.include('VALIDATION');
    });
  });

  it('Should return external options when called with mode use and usage conversion', function () {
    const options = getOptions('use', {
      usage: ['CONVERSION']
    });
    expect(options).to.be.an('object');
    expect(options).to.haveOwnProperty('indentCharacter');
    expect(options).to.haveOwnProperty('includeCookies');
  });

  it('Should return external options when called with mode document and usage conversion', function () {
    const options = getOptions('document', {
      usage: ['CONVERSION']
    });
    expect(options).to.be.an('array');
    expect(options.length).to.eq(4);
  });

  it('Should return external options when called with mode document and usage not an object', function () {
    const options = getOptions('document', 2);
    expect(options).to.be.an('array');
    expect(options.length).to.eq(4);
  });

  it('Should return default empty array in validationPropertiesToIgnore', function () {
    const options = getOptions('use', {
      usage: ['VALIDATION']
    });
    expect(options).to.be.an('object');
    expect(Object.keys(options)).to.be.empty;
  });

});
