/**
 * gets the keys (ids) of the pages
 * @param {array} pages The array of entries to group
 * @returns {Array} of ids
 */
function getPagesIds(pages) {
  if (!pages) {
    return [];
  }
  return pages.map((page) => { return page.id; });
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
    keys = getPagesIds(pages);

  keys.forEach((valueKey) => {
    let entriesBykey = filterEntriesByFieldAndKey(entries, 'pageref', valueKey);
    groups.push({
      groupName: valueKey,
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
  if (key && key === 'Page') {
    return groupEntriesByPage(entries, pages);
  }
}

/**
 * Groups HAR entries according to the options
 * @param {array} entries The array of entries to group
 * @param {array} pages The array of entries to group
 * @param {object} options process's options
 * @returns {Array} Postman's form data params
 */
function groupEntriesByOption(entries, pages, options) {
  if (!options || !options.folderStrategy) {
    return [];
  }
  const {
    folderStrategy
  } = options;
  return groupEntriesByKey(entries, pages, folderStrategy);
}


module.exports = {
  getPagesIds,
  filterEntriesByFieldAndKey,
  groupEntriesByPage,
  groupEntriesByKey,
  groupEntriesByOption
};
