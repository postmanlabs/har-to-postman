const expect = require('chai').expect,
  fs = require('fs'),
  {
    readInput,
    getCollectionNameFromFileOrEmpty,
    sortEntries
  } = require('../../lib/utils/readInput');

describe('readInput utility', function () {
  const mockInput = function (data = '', type = 'string') {
    return {
      type,
      data
    };
  };

  describe('When input.type is "string"', function () {
    it('Should throw an error when input.data is null', function () {
      const nullInput = mockInput(null, 'string'),
        errorExpectedMessage = 'Input.data not provided';
      try {
        readInput(nullInput);
        assert.fail('we expected an error');
      }
      catch (inputError) {
        expect(inputError.message).to.equal(errorExpectedMessage);
      }
    });

    it('Should throw an error when input.data is undefined', function () {
      const undefinedInput = mockInput(undefined, 'string'),
        errorExpectedMessage = 'Input.data not provided';
      try {
        readInput(undefinedInput);
        assert.fail('we expected an error');
      }
      catch (inputError) {
        expect(inputError.message).to.equal(errorExpectedMessage);
      }
    });

    it('Should throw an error when input.data is empty', function () {
      const emptyInput = mockInput('', 'string'),
        errorExpectedMessage = 'Input.data not provided';
      try {
        readInput(emptyInput);
        assert.fail('we expected an error');
      }
      catch (inputError) {
        expect(inputError.message).to.equal(errorExpectedMessage);
      }
    });

    it('Should return a string if input.data is a string', function () {
      const input = mockInput('{ "log": {}}', 'string');
      expect(readInput(input)).to.be.a('string');
    });

    describe('getCollectionNameFromFileOrEmpty method', function () {
      it('Should return an empty string as name', function () {
        const input = mockInput('{ "log": {}}', 'string'),
          name = getCollectionNameFromFileOrEmpty(input);
        expect(name).to.be.a('string')
          .to.equal('');
      });

      it('Should throw an error when input is neither string or file', function () {
        const input = {
          type: 'notvalid'
        };
        let result = getCollectionNameFromFileOrEmpty(input);
        expect(result).to.be.an('object')
          .and.to.include({
            result: false,
            reason: 'Invalid input type (notvalid). Type must be file/string.'
          });
      });

      it('Should throw an error when input.data null', function () {
        const input = {
          type: 'file'
        };
        let result = getCollectionNameFromFileOrEmpty(input);
        expect(result).to.be.an('object')
          .and.to.include({
            result: false,
            reason: 'Input not provided'
          });
      });

    });
  });

  describe('When input.type is "file"', function () {
    const mockFilePath = __dirname + '/temporal_file_mock.txt',
      mockFilePathNoExt = __dirname + '/temporal_file_mock',
      mockFilePathDoubleDot = __dirname + '/softwareishard.com.har',
      mockFileContent = '{ "log": {}}';
    before(function () {
      fs.writeFileSync(mockFilePath, mockFileContent, (error) => {
        if (error) {
          console.error('There was an error mocking the test file.');
        }
      });
    });

    after(function () {
      fs.unlinkSync(mockFilePath, function (error) {
        if (error) {
          console.error('There was an error deleting mock temporal file');
        }
      });
    });

    it('Should return a string if input.data is a valid file path', function () {
      const input = mockInput(mockFilePath, 'file'),
        result = readInput(input);
      expect(result).to.be.a('string').and.to.equal(mockFileContent);
    });

    it('Should throw an error if provided file path does not exists', function () {
      const input = mockInput('this/path/does/not/exists.txt', 'file');
      try {
        readInput(input);
        assert.fail('we expected an error');
      }
      catch (error) {
        expect(error.message).to.equal(`File ${input.data.split('/').reverse()[0]} not found`);
      }
    });

    it('Should throw an error when input.data is null', function () {
      const nullInput = mockInput(null, 'string'),
        errorExpectedMessage = 'Input.data not provided';
      try {
        readInput(nullInput);
        assert.fail('we expected an error');
      }
      catch (inputError) {
        expect(inputError.message).to.equal(errorExpectedMessage);
      }
    });

    it('Should throw an error when input.data is undefined', function () {
      const undefinedInput = mockInput(undefined, 'string'),
        errorExpectedMessage = 'Input.data not provided';
      try {
        readInput(undefinedInput);
        assert.fail('we expected an error');
      }
      catch (inputError) {
        expect(inputError.message).to.equal(errorExpectedMessage);
      }
    });

    it('Should throw an error when input.data is empty', function () {
      const emptyInput = mockInput('', 'string'),
        errorExpectedMessage = 'Input.data not provided';
      try {
        readInput(emptyInput);
        assert.fail('we expected an error');
      }
      catch (inputError) {
        expect(inputError.message).to.equal(errorExpectedMessage);
      }
    });

    describe('getCollectionNameFromFileOrEmpty method', function () {
      it('Should return the provided file name with extension', function () {
        const input = mockInput(mockFilePath, 'file'),
          name = getCollectionNameFromFileOrEmpty(input);
        expect(name).to.be.a('string')
          .to.equal('temporal_file_mock');
      });

      it('Should return the provided file name without extension', function () {
        const input = mockInput(mockFilePathNoExt, 'file'),
          name = getCollectionNameFromFileOrEmpty(input);
        expect(name).to.be.a('string')
          .to.equal('temporal_file_mock');
      });

      it('Should return the provided file name with two dots', function () {
        const input = mockInput(mockFilePathDoubleDot, 'file'),
          name = getCollectionNameFromFileOrEmpty(input);
        expect(name).to.be.a('string')
          .to.equal('softwareishard.com');
      });
    });
  });

  describe('When input.type is "other"', function () {
    it('Should throw an error when input.data is null', function () {
      const nullInput = mockInput('data', 'other'),
        errorExpectedMessage = 'Invalid input type (other). Type must be file/string.';
      try {
        readInput(nullInput);
        assert.fail('we expected an error');
      }
      catch (inputError) {
        expect(inputError.message).to.equal(errorExpectedMessage);
      }
    });
  });
});

describe('sortEntries utility', function() {
  it('Should sort a not ordered array of entries', function() {
    const entriesDateMock = [
        { startedDateTime: '2021-10-18T22:06:46.351Z' },
        { startedDateTime: '2021-10-18T22:06:46.350Z' },
        { startedDateTime: '2021-10-18T22:06:46.288Z' },
        { startedDateTime: '2021-10-18T22:06:46.350Z' },
        { startedDateTime: '2021-10-18T22:06:46.351Z' },
        { startedDateTime: '2021-10-18T22:06:46.351Z' },
        { startedDateTime: '2021-10-18T22:06:46.409Z' },
        { startedDateTime: '2021-10-18T22:06:46.408Z' },
        { startedDateTime: '2021-10-18T22:06:46.351Z' },
        { startedDateTime: '2021-10-18T22:06:46.351Z' },
        { startedDateTime: '2021-10-18T22:06:46.408Z' },
        { startedDateTime: '2021-10-18T22:06:46.351Z' },
        { startedDateTime: '2021-10-18T22:06:46.409Z' },
        { startedDateTime: '2021-10-18T22:06:46.408Z' }
      ],
      expectedOrder = [
        { startedDateTime: '2021-10-18T22:06:46.288Z' },
        { startedDateTime: '2021-10-18T22:06:46.350Z' },
        { startedDateTime: '2021-10-18T22:06:46.350Z' },
        { startedDateTime: '2021-10-18T22:06:46.351Z' },
        { startedDateTime: '2021-10-18T22:06:46.351Z' },
        { startedDateTime: '2021-10-18T22:06:46.351Z' },
        { startedDateTime: '2021-10-18T22:06:46.351Z' },
        { startedDateTime: '2021-10-18T22:06:46.351Z' },
        { startedDateTime: '2021-10-18T22:06:46.351Z' },
        { startedDateTime: '2021-10-18T22:06:46.408Z' },
        { startedDateTime: '2021-10-18T22:06:46.408Z' },
        { startedDateTime: '2021-10-18T22:06:46.408Z' },
        { startedDateTime: '2021-10-18T22:06:46.409Z' },
        { startedDateTime: '2021-10-18T22:06:46.409Z' }
      ],
      sortedArray = sortEntries(entriesDateMock);
    expect(sortedArray).to.be.an('array');
    expect(JSON.stringify(sortedArray)).to.be.equal(JSON.stringify(expectedOrder));
  });
});


