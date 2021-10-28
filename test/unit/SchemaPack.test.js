const expect = require('chai').expect,
  {
    SchemaPack
  } = require('../../lib/SchemaPack'),
  fs = require('fs'),
  async = require('async'),
  validHAREntriesFolder = './test/data/validHARFiles',
  inValidHAREntriesFolder = './test/data/invalidHARFiles';

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

describe('SchemaPack get metadata unit test  HAR file', function() {
  it('Should get the metadata from a valid input file and take the name from the file', function () {
    const
      VALID_PATH = validHAREntriesFolder + '/queryParams.har',
      schemaPack = new SchemaPack({
        data: VALID_PATH,
        type: 'file'
      }, {});
    schemaPack.getMetaData((error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
      expect(result.name).to.equal('queryParams.har');
      expect(result.output[0].name).to.equal('queryParams.har');
      expect(result.output[0].type).to.equal('collection');
    });

  });

  it('Should get the metadata from a valid input file and take the name from the page', function () {
    let fileContent = fs.readFileSync(validHAREntriesFolder + '/onePostJson.har', 'utf8');
    const schemaPack = new SchemaPack({
      data: fileContent,
      type: 'string'
    }, {});
    schemaPack.getMetaData((error, result) => {
      expect(error).to.be.null;
      expect(result).to.be.an('object');
      expect(result.name).to.equal('localhost:3000/projects');
      expect(result.output[0].name).to.equal('localhost:3000/projects');
      expect(result.output[0].type).to.equal('collection');
    });
  });
});

describe('SchemaPack validate invalid HAR file', function() {
  var validHARsFolder = fs.readdirSync(inValidHAREntriesFolder);
  async.each(validHARsFolder, function (file) {
    it('Should get an object representing PM Collection from ' + file, function() {
      let fileContent = fs.readFileSync(inValidHAREntriesFolder + '/' + file, 'utf8');
      const schemaPack = new SchemaPack({
        data: fileContent,
        type: 'string'
      }, {});

      expect(schemaPack.validationResult.result).to.be.false;
    });
  });
});


describe('SchemaPack get options  ', function () {
  it('Should get options statically', function () {
    const options = SchemaPack.getOptions();
    expect(Object.keys(options).length > 0).to.equal(true);
  });
});
