const OptionError = require('../OptionError');

/**
 * Validates that the value provided for a specified option is allowed
 * @param {string} optionKey The key of the option provided
 * @param {string} optionValue the value provided in the option
 * @param {array} availableOptions The array of available options
 * @returns {void} It throws an error when the provided option is not valid
 */
function validateOption(optionKey, optionValue, availableOptions) {
  const optionBody = availableOptions.find((option) => {
      return option.id === optionKey;
    }),
    allowedValues = optionBody.type === 'boolean' ? [true, false] :
      optionBody.availableOptions,
    isValid = allowedValues.includes(optionValue);
  if (!isValid) {
    let message = `Value '${optionValue}' is not allowed by '${optionKey}' option.
      Allowed values are (${allowedValues.join(', ')}).`;
    throw new OptionError(message);
  }
}


/**
 * Validate all provided options values and throws an error if any is not allowed
 * @param {object} providedOptions The object with the user's provided options
 * @param {array} availableOptions Array of available options
 * @returns {boolean} true if all option's values are allowed
 */
function validateOptions(providedOptions, availableOptions) {
  if (providedOptions) {
    Object.entries(providedOptions).forEach(([key, value]) => {
      validateOption(key, value, availableOptions);
    });
  }
  return true;
}

module.exports = {
  validateOptions
};
