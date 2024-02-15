/**
 * get protocol and host from a given url
 * @param {string} url the url we want to get protocol and host
 * @returns {object} an object with protocol and host { protocol : <string> , host<string> }
 */
function getProtocolAndHost(url) {
  const urlSplitted = url.split('//'),
    hasProtocol = urlSplitted.length > 1,
    getHost = (pathWithoutProtocol) => {
      const pathSplitted = pathWithoutProtocol.split('/');
      return pathSplitted[0];
    };
  let protocol = hasProtocol ? `${urlSplitted[0]}//` : '',
    host = hasProtocol ? getHost(urlSplitted[1]) : getHost(urlSplitted[0]);
  return {
    protocol,
    host
  };
}

/**
 * Removes the protocol from url, if entry es not url throws an error
 * @param {string} url the url we want to get protocol and host
 * @returns {string} the url without protocol
 */
function removeProtocolFromURL(url) {
  let titleURL = new URL(url);
  return titleURL.href.replace(titleURL.protocol + '//', '');
}

/**
 * get host from a url string
 * @param {string} url the url we want to get protocol and host
 * @returns {string} string host
 */
function getHost(url) {
  let titleURL = new URL(url);
  return titleURL.host;
}

/**
 * substitute encoded characters from a url
 * @param {string} url the url we want to get protocol and host
 * @returns {string} decoded url
 */
function decodeURL(url) {
  if (url === undefined) {
    return '';
  }

  try {
    return decodeURIComponent((String(url)).replace(/\+/g, '%20'));
  }
  catch (e) {
    return String(url);
  }
}

module.exports = {
  getProtocolAndHost,
  removeProtocolFromURL,
  getHost,
  decodeURL
};
