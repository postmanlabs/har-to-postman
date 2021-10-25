const { expect } = require('chai'),
  fs = require('fs'),
  validHARFolder = 'test/data/validHARFiles',
  {
    parse
  } = require('../../lib/HARParser');

describe('HARParser parse', function() {

  it('Should parse simpleImageRequest.json file', function() {
    const fileContent = fs.readFileSync(validHARFolder + '/simpleImageRequest.har', 'utf8'),
      result = parse(fileContent);
    expect(result).to.not.be.undefined;
    expect(result.log).to.not.be.undefined;
  });

  it('Should return error with empty input', function() {
    try {
      parse('');
      expect.fail('This should return error empty input');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot parse json object');
    }
  });

  it('Should return error with undefined input', function() {
    try {
      parse();
      expect.fail('This should return error empty input');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot parse json object');
    }
  });

  it('Should return error with no json input', function() {
    try {
      parse('this is not json');
      expect.fail('This should return error empty input');
    }
    catch (error) {
      expect(error.message).to.equal('Cannot parse json object');
    }
  });
});
