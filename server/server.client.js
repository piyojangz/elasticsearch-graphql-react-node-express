const ElasticSearch = require('elasticsearch');

/**
 * *** ElasticSearch *** client
 * @type {Client}
 */
const client = new ElasticSearch.Client({
  hosts: ['http://127.0.0.1:9200']
});
// const client = new ElasticSearch.Client({
//   hosts: ['https://search-ntlsearch-zqpmznzooprsty2invckomdrqu.ap-southeast-1.es.amazonaws.com']
// });

module.exports = client;
