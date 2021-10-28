/**
 * Takes in a har requests and returns its url with variable sustitution
 * if no variable is found then return the url
 * @param {string} url raw url
 * @param {Array} urlVariablesData the variables information
 * @returns {string} url with variable replaced
 */
function replaceVariableInUrl(url, urlVariablesData) {
  let variableInUrl = urlVariablesData.find((variable) => {
    return url.includes(variable.value);
  });
  if (variableInUrl) {
    return url.replace(variableInUrl.value, `{{${variableInUrl.key}}}`);
  }
  return url;
}

module.exports = {
  replaceVariableInUrl
};
