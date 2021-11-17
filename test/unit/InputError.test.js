const { expect } = require('chai'),
  InputError = require('../../lib/InputError');

describe('InputError constructor', function () {
  it('Should return an error with the specified message', function () {
    const error = new InputError('error message', {});
    expect(error.message).to.equal('error message');
  });

  it('Should return an error without message', function () {
    const error = new InputError();
    expect(error.message).to.equal('');
  });
});
