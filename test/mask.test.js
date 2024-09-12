const { mask } = require('../src/index');

describe('mask', () => {
    it('should mask string with default values', () => {
        expect(mask('secret1234')).toBe('se****34');
    });

    it('should mask string with custom visible characters', () => {
        expect(mask('password123', { visibleStart: 4, visibleEnd: 2 })).toBe('pass******23');
    });

    it('should mask string with custom mask character', () => {
        expect(mask('confidential', { visibleStart: 3, visibleEnd: 1, maskChar: '#' })).toBe('con########l');
    });

    it('should mask string with custom masking function', () => {
        const customMask = (len) => '[redacted]'.repeat(Math.ceil(len / 9)).substring(0, len);
        expect(mask('confidential-info', { maskChar: customMask })).toBe('co[redacted]fo');
    });

    it('should return original string if visible characters cover the entire string', () => {
        expect(mask('short', { visibleStart: 3, visibleEnd: 3 })).toBe('short');
    });

    it('should return empty string for non-string input', () => {
        expect(mask(123)).toBe('');
        expect(mask({})).toBe('');
    });


    it('should mask with different sensitivity levels', () => {
        const str = 'confidential-info';
        expect(mask(str, { sensitivity: 'low' })).toBe('con**********nfo');
        expect(mask(str, { sensitivity: 'medium' })).toBe('con***********fo');
        expect(mask(str, { sensitivity: 'high' })).toBe('****************');
    });
});