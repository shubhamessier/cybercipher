const { compare } = require('../src/index');

describe('compare', () => {
    it('should return true for equal strings', () => {
        expect(compare('test', 'test')).toBe(true);
        expect(compare('', '')).toBe(true); // Empty string case
        expect(compare('complex string', 'complex string')).toBe(true);
    });

    it('should return false for different strings', () => {
        expect(compare('test1', 'test2')).toBe(false);
        expect(compare('test', 'Test')).toBe(false); // Case-sensitive
    });

    it('should return false for different length strings', () => {
        expect(compare('test', 'testing')).toBe(false);
        expect(compare('testing', 'test')).toBe(false);
    });

    it('should return false for non-string inputs', () => {
        expect(compare(123, '123')).toBe(false);
        expect(compare('123', {})).toBe(false);
        expect(compare(null, undefined)).toBe(false);
    });
});