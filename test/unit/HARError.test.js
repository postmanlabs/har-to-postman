const { expect } = require('chai'),
  HARError = require('../../lib/HARError');

describe('InputError constructor', function () {
  it('Should return an error with the specified message', function () {
    const error = new HARError('error message', {});
    expect(error.message).to.equal('error message');
  });

  it('Should return an error without message', function () {
    const error = new HARError();
    expect(error.message).to.equal('');
  });
});
