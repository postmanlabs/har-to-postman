const { expect } = require('chai'),
  {
    getPMBodyFromFormData,
    getBoundaryFromHeader,
    getContentTypeHeader,
    getBoundaryFromHeaders,
    mapHARPostDataTextIntoFormData
  } = require('../../lib/utils/formDataHelper');

describe('getPMBodyFromFormData method', function () {
  it('should return mapped request from har to PM body', function () {
    const harRequest = {
        postData:
        {
          mimeType: 'multipart/form-data; boundary=----WebKitFormBoundaryKUwp7Td66vN5koO0',
          params: [
            {
              name: 'name',
              value: 'John'
            },
            {
              name: 'surname',
              value: 'Smith'
            }
          ],
          text: '------WebKitFormBoundaryKUwp7Td66vN5koO0\r\nContent-Disposition: form-data;' +
            ' name=\"name\"\r\n\r\nJohn\r\n------WebKitFormBoundaryKUwp7Td66vN5koO0\r\nContent-Disposition:' +
            ' form-data; name=\"surname\"\r\n\r\nSmith\r\n------WebKitFormBoundaryKUwp7Td66vN5koO0--\r\n'
        }
      },
      result = getPMBodyFromFormData(harRequest);
    expect(result).to.not.be.undefined;
    expect(result.mode).to.equal('formdata');
    expect(result.formdata).to.be.an('array');
    expect(result.formdata[0].key).to.equal('name');
    expect(result.formdata[0].value).to.equal('John');
    expect(result.formdata[0].type).to.equal('text');
    expect(result.formdata[1].key).to.equal('surname');
    expect(result.formdata[1].value).to.equal('Smith');
    expect(result.formdata[1].type).to.equal('text');

  });

  it('should return mapped empty body with undefined har entry', function () {
    const
      result = getPMBodyFromFormData();
    expect(result).to.not.be.undefined;
    expect(result.mode).to.equal('formdata');
    expect(result.formdata).to.be.an('array');
    expect(result.formdata).to.be.empty;
  });

  it('should return mapped empty body with undefined post data entry', function () {
    const
      result = getPMBodyFromFormData({});
    expect(result).to.not.be.undefined;
    expect(result.mode).to.equal('formdata');
    expect(result.formdata).to.be.an('array');
    expect(result.formdata).to.be.empty;
  });

  it('should return mapped empty body with undefined postdata params entry', function () {
    const
      result = getPMBodyFromFormData({ postData: {} });
    expect(result).to.not.be.undefined;
    expect(result.mode).to.equal('formdata');
    expect(result.formdata).to.be.an('array');
    expect(result.formdata).to.be.empty;
  });

});

describe('getBoundary method', function () {
  it('should return "----WebKitFormBoundarylmNoMbpR1eVqUa6j" for entry header', function () {
    const result = getBoundaryFromHeader(
      {
        name: 'Content-Type',
        value: 'multipart/form-data; boundary=----WebKitFormBoundarylmNoMbpR1eVqUa6j'
      });
    expect(result).to.equal('----WebKitFormBoundarylmNoMbpR1eVqUa6j');
  });

  it('should return "----WebKitFormBoundarylmNoMbpR1eVqUa6j" for entry header no semicolon', function () {
    const result = getBoundaryFromHeader(
      {
        name: 'Content-Type',
        value: 'multipart/form-databoundary=----WebKitFormBoundarylmNoMbpR1eVqUa6j'
      });
    expect(result).to.equal('----WebKitFormBoundarylmNoMbpR1eVqUa6j');
  });

  it('should return "" for entry header no boundary', function () {
    const result = getBoundaryFromHeader(
      {
        name: 'Content-Type',
        value: 'multipart/form-=----WebKitFormBoundarylmNoMbpR1eVqUa6j'
      });
    expect(result).to.equal('');
  });

});

describe('getContentTypeHeader method', function () {
  it('should return correct header from list', function () {
    const harRequest = {
        headers: [
          {
            name: 'Accept',
            value: '*/*'
          },
          {
            name: 'Content-Type',
            value: 'multipart/form-data; boundary=----WebKitFormBoundarylmNoMbpR1eVqUa6j'
          },
          {
            name: 'Origin',
            value: 'https://javascript.info'
          }]
      },
      result = getContentTypeHeader(harRequest);
    expect(result).to.not.be.undefined;
    expect(result.name).to.equal('Content-Type');
  });

  it('should return undefined header from list when is not present', function () {
    const harRequest = {
        headers: [
          {
            name: 'Accept',
            value: '*/*'
          },
          {
            name: 'Content',
            value: 'multipart/form-data; boundary=----WebKitFormBoundarylmNoMbpR1eVqUa6j'
          },
          {
            name: 'Origin',
            value: 'https://javascript.info'
          }]
      },
      result = getContentTypeHeader(harRequest);
    expect(result).to.be.undefined;
  });
});

describe('getBoundaryFromHeaders method', function () {
  it('should return ----WebKitFormBoundarylmNoMbpR1eVqUa6j from headers list', function () {
    const harRequest = {
        headers: [
          {
            name: 'Accept',
            value: '*/*'
          },
          {
            name: 'Content-Type',
            value: 'multipart/form-data; boundary=----WebKitFormBoundarylmNoMbpR1eVqUa6j'
          },
          {
            name: 'Origin',
            value: 'https://javascript.info'
          }]
      },
      result = getBoundaryFromHeaders(harRequest);
    expect(result).to.equal('----WebKitFormBoundarylmNoMbpR1eVqUa6j');
  });

  it('should return "" for non content type header', function () {
    const harRequest = {
        headers: [
          {
            name: 'Accept',
            value: '*/*'
          },
          {
            name: 'Content',
            value: 'multipart/form-data; boundary=----WebKitFormBoundarylmNoMbpR1eVqUa6j'
          },
          {
            name: 'Origin',
            value: 'https://javascript.info'
          }]
      },
      result = getBoundaryFromHeaders(harRequest);
    expect(result).to.equal('');
  });
});

describe('mapHARPostDataTextIntoFormData method', function () {
  it('should return localhost:3000 for entry "http://localhost:3000/projects"', function () {
    const request = {
        headers: [
          {
            name: 'Content-Type',
            value: 'multipart/form-data; boundary=----WebKitFormBoundarylmNoMbpR1eVqUa6j'
          }
        ],
        queryString: [],
        headersSize: 147,
        bodySize: 238,
        postData: {
          mimeType: 'multipart/form-data; boundary=----WebKitFormBoundarylmNoMbpR1eVqUa6j',
          text: '------WebKitFormBoundarylmNoMbpR1eVqUa6j\r\nContent-Disposition: form-data;' +
          ' name=\"name\"\r\n\r\nJohn\r\n------WebKitFormBoundarylmNoMbpR1eVqUa6j\r\nContent-Disposition:' +
          ' form-data; name=\"surname\"\r\n\r\nSmith\r\n------WebKitFormBoundarylmNoMbpR1eVqUa6j--\r\n',
          params: []
        }
      },
      result = mapHARPostDataTextIntoFormData(request);
    expect(result.length).to.equal(2);
    expect(result[0].key).to.equal('name');
    expect(result[0].value).to.equal('John');
    expect(result[1].key).to.equal('surname');
    expect(result[1].value).to.equal('Smith');
  });
});


