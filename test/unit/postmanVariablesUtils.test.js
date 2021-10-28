const { expect } = require('chai'),
  {
    replaceVariableInUrl
  } = require('../../lib/utils/postmanVariablesUtils');


describe('HARToPostmanCollectionMapper replaceVariableInUrl', function() {

  it('should return 1 variables for 2 equal urls', function() {
    const variables = [{
        key: '0BaseUrl',
        value: 'http://localhost:3000',
        urlData: {
          index: 0,
          url: 'http://localhost:3000/api/categories/queries/getCategories'
        }
      }],
      replaced = replaceVariableInUrl('http://localhost:3000/api/categories/queries/getCategories', variables);
    expect(replaced).to.not.be.undefined;
    expect(replaced).to.equal('{{0BaseUrl}}/api/categories/queries/getCategories');

  });

  it('should return same url when there is no variable for it', function() {
    const variables = [{
        key: '0BaseUrl',
        value: 'http://localhost:3000',
        urlData: {
          index: 0,
          url: 'http://localhost:3000/api/categories/queries/getCategories'
        }
      }],
      replaced = replaceVariableInUrl('http://localhost:5000/api/categories/queries/getCategories', variables);
    expect(replaced).to.not.be.undefined;
    expect(replaced).to.equal('http://localhost:5000/api/categories/queries/getCategories');

  });

});
