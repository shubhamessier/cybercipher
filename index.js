// src/index.js 

const compare = require('./srcompare');
const mask = require('./mask');
const hash = require('./hash');
const random = require('./random');
const BloomFilter = require('./bloomFilter');

module.exports = {
    compare,
    mask,
    hash,
    random,
    BloomFilter
};