'use strict';

const {
  SchemaPack
} = require('./lib/SchemaPack.js');

module.exports = {
  convert: function (input, options, cb) {
    let schema;
    try {
      schema = new SchemaPack(input, options);
    }
    catch (error) {
      return cb(error);
    }

    if (schema.validationResult.result) {
      return schema.convert(cb);
    }
    return cb(null, schema.validationResult);
  },

  validate: function (input) {
    const schema = new SchemaPack(input);
    return schema.validationResult;
  },

  getMetaData: function (input, cb) {
    const schema = new SchemaPack(input);
    schema.getMetaData(cb);
  },


  getOptions: function (mode, criteria) {
    return SchemaPack.getOptions(mode, criteria);
  },

  SchemaPack
};
