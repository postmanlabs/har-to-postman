const {
    decodeURL,
    removeProtocolFromURL
  } = require('./urlUtils'),
  GROUP_BY_PAGE_OPTION_VALUE = 'Page';

/**
 * Gets the name of the folder
 * @param {string} pageTitle The original page title
 * @returns {Array} of ids
 */
function getFolderName(pageTitle) {
  try {
    return decodeURL(removeProtocolFromURL(decodeURL(pageTitle)));
  }
  catch (error) {
    return decodeURL(pageTitle);
  }
}

/**
 * gets the keys (ids) of the pages
 * @param {array} pages The array of entries to group
 * @returns {Array} of ids
 */
function getPagesInformation(pages) {
  if (!pages) {
    return [];
  }
  return pages.map((page) => { return { title: page.title, id: page.id }; });
}

/**
 * filter the entries by the sent key
 * @param {array} entries The array of entries to filter
 * @param {string} field the field to use in filter
 * @param {string} key the key to filter
 * @returns {Array} of ids
 */
function filterEntriesByFieldAndKey(entries, field, key) {
  return entries.filter((entry) => {
    return entry[field] === key;
  });
}

/**
 * Groups the entries by pageref referencing page.id
 * @param {array} entries The array of entries to filter
 * @param {array} pages the array of pages from the har file
 * @returns {Array} of ids
 */
function groupEntriesByPage(entries, pages) {
  let groups = [],
    keys = getPagesInformation(pages);

  keys.forEach((valueKey) => {
    let entriesBykey = filterEntriesByFieldAndKey(entries, 'pageref', valueKey.id);
    groups.push({
      groupName: getFolderName(valueKey.title),
      entries: entriesBykey
    });
  });
  return groups;
}

/**
 * Groups HAR entries by key
 * @param {array} entries The array of entries to group
 * @param {array} pages The array of entries to group
 * @param {string} key Grouping key
 * @returns {Array} Postman's form data params
 */
function groupEntriesByKey(entries, pages, key) {
  if (key && key === GROUP_BY_PAGE_OPTION_VALUE) {
    return groupEntriesByPage(entries, pages);
  }
  return entries;
}

/**
 * Groups HAR entries according to the options
 * @param {array} entries The array of entries to group
 * @param {array} pages The array of entries to group
 * @param {object} options process's options
 * @returns {Array} Postman's form data params
 */
function groupEntriesByOption(entries, pages, options) {
  if (!options || !options.folderStrategy ||
    options.folderStrategy === GROUP_BY_PAGE_OPTION_VALUE) {
    return groupEntriesByKey(entries, pages, GROUP_BY_PAGE_OPTION_VALUE);
  }
  return [];
}

module.exports = {
  getPagesInformation,
  filterEntriesByFieldAndKey,
  groupEntriesByPage,
  groupEntriesByKey,
  groupEntriesByOption,
  getFolderName
};
