const { hash } = require('../src/index');

describe('hash', () => {
    it('should hash a string with default parameters', () => {
        const hashed = hash('test');
        expect(hashed).toBeDefined();
        expect(typeof hashed).toBe('string');
    });

    it('should hash a string with a specific algorithm', () => {
        const hashed = hash('test', 'sha512');
        expect(hashed).toBeDefined();
        expect(typeof hashed).toBe('string');
    });

    it('should hash a string with a specific encoding', () => {
        const hashed = hash('test', 'sha256', 'base64');
        expect(hashed).toBeDefined();
        expect(typeof hashed).toBe('string');
    });

    it('should throw an error for a non-string input', () => {
        expect(() => hash(123)).toThrow(TypeError);
        expect(() => hash({})).toThrow(TypeError);
    });
});