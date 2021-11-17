const { expect } = require('chai'),
  OptionError = require('../../lib/OptionError');

describe('InputError constructor', function () {
  it('Should return an error with the specified message', function () {
    const error = new OptionError('error message', {});
    expect(error.message).to.equal('error message');
  });

  it('Should return an error without message', function () {
    const error = new OptionError();
    expect(error.message).to.equal('');
  });
});
