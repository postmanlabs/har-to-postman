/**
 * NOTE: The schemas below aren't strictly validating HAR. Only
 * those fields that are either mandatory or required for
 * converting to a Postman collection are defined below
 */

module.exports = {
  afterRequest: require('./afterRequest.json'),
  beforeRequest: require('./beforeRequest.json'),
  cache: require('./cache.json'),
  content: require('./content.json'),
  cookie: require('./cookie.json'),
  creator: require('./creator.json'),
  entry: require('./entry.json'),
  har: require('./har.json'),
  header: require('./header.json'),
  log: require('./log.json'),
  page: require('./page.json'),
  pageTimings: require('./pageTimings.json'),
  postData: require('./postData.json'),
  query: require('./query.json'),
  request: require('./request.json'),
  response: require('./response.json'),
  timings: require('./timings.json')
};
