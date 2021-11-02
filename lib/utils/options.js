// default options
// if mode=document, returns an array of name/id/default etc.

/**
 * name - human-readable name for the option
 * id - key to pass the option with
 * type - boolean or enum for now
 * default - the value that's assumed if not specified
 * availableOptions - allowed values (only for type=enum)
 * description - human-readable description of the item
 * external - whether the option is settable via the API
 * usage - array of supported types of usage (i.e. CONVERSION, VALIDATION)
 *
 * @param {string} [mode='document'] Describes use-case. 'document' will return an array
 * with all options being described. 'use' will return the default values of all options
 * @param {Object} criteria Decribes required criteria for options to be returned. can have properties
 *   external: <boolean>
 *   usage: <array> (Array of supported usage type - CONVERSION, o)
 * @returns {mixed} An array or object (depending on mode) that describes available options
 */
function getOptions(mode = 'document', criteria = {}) {
  // Override mode & criteria if first arg is criteria (objects)
  if (typeof mode === 'object') {
    criteria = mode;
    mode = 'document';
  }

  let optsArray = [
    {
      name: 'Set indent character',
      id: 'indentCharacter',
      type: 'enum',
      default: 'Space',
      availableOptions: ['Space', 'Tab'],
      description: 'Option for setting indentation character',
      external: true,
      usage: ['CONVERSION']
    },
    {
      name: 'Include cookies from import',
      id: 'includeCookies',
      type: 'boolean',
      default: false,
      description: 'Option for include cookies (cookies could have sensitive data)',
      external: true,
      usage: ['CONVERSION']
    },
    {
      name: 'Include responses from import',
      id: 'includeResponses',
      type: 'boolean',
      default: true,
      description: 'Option for include responses',
      external: true,
      usage: ['CONVERSION']
    }
  ];

  if (criteria && typeof criteria === 'object') {
    if (Array.isArray(criteria.usage)) {
      let tempOptsArray = [];

      criteria.usage.forEach((usageCriteria) => {
        tempOptsArray = [...tempOptsArray, ...optsArray.filter((option) => {
          return option.usage.includes(usageCriteria);
        })];
      });
      optsArray = tempOptsArray;
    }
  }

  if (mode === 'use') {
    let defOptions = {};
    optsArray.forEach((option) => {
      if (option.id === 'indentCharacter') {
        defOptions[option.id] = option.default === 'tab' ? '\t' : '  ';
      }
      else {
        defOptions[option.id] = option.default;
      }
    });
    return defOptions;
  }
  return optsArray.filter((option) => {
    return option.disabled !== true;
  });
}

module.exports = {
  getOptions
};
