const expect = require('chai').expect,
  fs = require('fs'),
  exec = require('child_process').exec,
  moduleVersion = require('../../package.json').version;

describe('har2postman ', function () {
  const tempOutputFile = 'tempOutput.json';

  after(function () {
    if (fs.existsSync(tempOutputFile)) {
      fs.unlinkSync(tempOutputFile);
    }
  });

  it('should print help to console', function (done) {
    exec('./bin/har2postman.js --help', function (err, stdout) {
      expect(err).to.be.null;
      expect(stdout).to.include('Converts a given HAR specification to POSTMAN Collections v2.1.0 ');
      done();
    });
  });

  it('should print version to console', function (done) {
    exec('./bin/har2postman.js -v', function (err, stdout) {
      expect(err).to.be.null;
      expect(stdout).to.include(moduleVersion);
      done();
    });
  });

  it('should print to the console testing conversion when test option is sent', function (done) {
    exec('./bin/har2postman.js -t', function (err, stdout) {
      expect(err).to.be.null;
      expect(stdout).to.include('testing conversion...');
      expect(stdout).to.include('localhost:3000/projects');
      done();
    });
  });

  it('should print to file', function (done) {
    exec('./bin/har2postman.js -s test/data/validHARFiles/onePostJson.har -o tempOutput.json',
      function (err) {
        expect(err).to.be.null;
        fs.readFile(tempOutputFile, 'utf8', (err, data) => {
          let collection = JSON.parse(data);
          expect(collection.info.name).to.equal('localhost:3000/projects');
          expect(collection.item.length).to.equal(1);
          done();
        });
      });
  });

  it('should print to file with options', function (done) {
    exec('./bin/har2postman.js -s test/data/validHARFiles/multipleGetsPost.har -o tempOutput.json' +
      ' -O indentCharacter=tab',
    function (err) {
      expect(err).to.be.null;
      fs.readFile(tempOutputFile, 'utf8', (err, data) => {
        let collection = JSON.parse(data);
        expect(collection.info.name).to.equal('localhost:3000/projects');
        expect(collection.item.length).to.equal(22);
        done();
      });
    });
  });

  it('should show appropriate messages for invalid input', function (done) {
    exec('./bin/har2postman.js -s test/data/invalidHARFiles/invalidHAR.har', function (err, stdout) {
      expect(err).to.be.null;
      expect(stdout).to.include('Invalid syntax provided for HAR content must have required property \'log\'');
      done();
    });
  });
});
