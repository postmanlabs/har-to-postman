const expect = require('chai').expect,
    {
        SchemaPack
    } = require('../../lib/SchemaPack'),
    fs = require('fs'),
    outputDirectory = 'test/data/output/';

describe('E2E flows', function () {
    it('Should conver a har file into a PM Collection', function () {
        let fileContent = fs.readFileSync('test/data/externalHARfile/patio.wizeline.givers.har', 'utf8');
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
            fs.writeFileSync(outputDirectory + 'collection.json',
                JSON.stringify(result.output[0].data));
        });
    
    });
});