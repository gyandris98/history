// @ts-ignore
const hljs = require('highlight.js/lib/highlight');

hljs.registerLanguage('json', require('highlight.js/lib/languages/json'));

module.exports = hljs;
