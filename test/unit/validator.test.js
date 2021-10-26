const InputError = require('../../lib/InputError');

const expect = require('chai').expect,
  fs = require('fs'),
  {
    Validator
  } = require('../../lib/Validator'),
  async = require('async'),
  assert = require('chai').assert,
  validHAREntriesFolder = './test/data/validHARFiles',
  {
    parse
  } = require('../../lib/HARParser');

describe('Validator', function () {

  describe('constructor', function () {
    it('Should create an instance of validator', function () {
      const validator = new Validator();
      expect(validator).to.not.be.undefined;
    });
  });

  describe('validateStructure', function () {
    it('Should throw required log when empty object is sent', function () {
      const validator = new Validator();
      try {
        validator.validateStructure({});
      }
      catch (error) {
        expect(error.message).to.equal('Invalid syntax provided for HAR content');
        expect(error.data[0].message).to.equal('must have required property \'log\'');
      }
    });

    var validHARsFolder = fs.readdirSync(validHAREntriesFolder);
    async.each(validHARsFolder, function (file) {
      it('Should validate HAR content as correct from ' + file, function () {
        const validator = new Validator(),
          fileContent = fs.readFileSync(validHAREntriesFolder + '/' + file, 'utf8'),
          result = parse(fileContent);
        try {
          validator.validateStructure(result);
        }
        catch (error) {
          assert.fail(error.data.map((item) => { return `datapath: ${item.dataPath}, message: ${item.message}`; }));
        }
      });
    });

  });
});

describe('validateStructure', function () {
  it('Should format a message with the first error element', function () {
    const validator = new Validator(),
      errorMessage = validator.formatMessageFromInputError(new InputError(
        'Invalid syntax provided for HAR content',
        [{ message: 'error message' }]
      ));
    expect(errorMessage).to.equal('Invalid syntax provided for HAR content error message');
  });

  it('Should format a message with no aditional data', function () {
    const validator = new Validator(),
      errorMessage = validator.formatMessageFromInputError(new InputError(
        'Invalid syntax provided for HAR content'
      ));
    expect(errorMessage).to.equal('Invalid syntax provided for HAR content');
  });

  it('Should format a message with no aditional data message', function () {
    const validator = new Validator(),
      errorMessage = validator.formatMessageFromInputError(new InputError(
        'Invalid syntax provided for HAR content',
        []
      ));
    expect(errorMessage).to.equal('Invalid syntax provided for HAR content');
  });

  it('Should format a message with empty object', function () {
    const validator = new Validator(),
      errorMessage = validator.formatMessageFromInputError(new InputError(
        'Invalid syntax provided for HAR content',
        [{}]
      ));
    expect(errorMessage).to.equal('Invalid syntax provided for HAR content');
  });

});
