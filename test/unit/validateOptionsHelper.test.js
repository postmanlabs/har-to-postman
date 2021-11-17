const { expect } = require('chai'),
  { validateOptions } = require('../../lib/utils/validateOptionsHelper');
const { getOptions } = require('../../lib/utils/options');

describe('validateOptions', function() {
  const availableOptions = getOptions();
  it('Should throw an error when user provides a wrong value for any option', function() {
    const providedOptions = {
        folderStrategy: 'NotValidValue'
      },
      expectedMessage = 'Value \'NotValidValue\' is not allowed by' +
        ' \'folderStrategy\' option.\n      Allowed values are (None, Page).';
    try {
      validateOptions(providedOptions, availableOptions);
      expect.fail('Should fail');
    }
    catch (error) {
      expect(error.message).to.equal(expectedMessage);
    }
  });

  it('Should pass when user provides an allowed value for all options', function() {
    const providedOptions = {
      folderStrategy: 'None',
      indentCharacter: 'Tab'
    };
    let passed = false;
    try {
      validateOptions(providedOptions, availableOptions);
      passed = true;
    }
    catch (error) {
      expect(error).to.be.null;
    }
    expect(passed).to.be.true;
  });

  it('Should pass when user provides no option', function () {
    let res = validateOptions();
    expect(res).to.be.true;
  });
});
