const expect = require('chai').expect,
  {
    SchemaPack
  } = require('../../lib/SchemaPack'),
  fs = require('fs'),
  async = require('async'),
  validHAREntriesFolder = './test/data/validHARFiles';

describe('SchemaPack convert unit test  HAR file', function() {
  var validHARsFolder = fs.readdirSync(validHAREntriesFolder);
  async.each(validHARsFolder, function (file) {
    it('Should get an object representing PM Collection from ' + file, function() {
      let fileContent = fs.readFileSync(validHAREntriesFolder + '/' + file, 'utf8');
      const schemaPack = new SchemaPack({
        data: fileContent,
        type: 'string'
      }, {});

      schemaPack.convert((error, result) => {
        expect(error).to.be.null;
        expect(result).to.be.an('object');
        expect(result.output).to.be.an('array');
        expect(result.output[0].data).to.be.an('object');
        expect(result.output[0].type).to.equal('collection');
      });
    });
  });

  it('Should convert the valid input file and take the name from the file', function () {
    const
      VALID_PATH = validHAREntriesFolder + '/queryParams.har',
      schemaPack = new SchemaPack({
        data: VALID_PATH,
        type: 'file'
      }, {});
    schemaPack.convert((error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
      expect(result.output).to.be.an('array');
      expect(result.output[0].data).to.be.an('object');
      expect(result.output[0].data.info.name).to.equal('queryParams.har');
      expect(result.output[0].type).to.equal('collection');
    });

  });
});
