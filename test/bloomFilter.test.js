// test/bloomFilter.test.js
const { BloomFilter } = require('../src/index');

describe('BloomFilter', () => {
    it('should add and check strings correctly', () => {
        const filter = new BloomFilter(100, [1, 7]); // Example hash seeds
        filter.add('apple');
        filter.add('banana');

        expect(filter.check('apple')).toBe(true);
        expect(filter.check('banana')).toBe(true);
        expect(filter.check('grape')).toBe(false); // Likely
    });
});