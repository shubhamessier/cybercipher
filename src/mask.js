/**
 * Masks a portion of a string with a specified character, 
 * keeping a specified number of characters visible from the beginning and end.
 * Allows for custom masking strategies.
 * 
 * @param {string} str - The string to mask.
 * @param {Object} [options] - Masking options.
 * @param {number} [options.visibleStart=2] - Visible characters from the beginning.
 * @param {number} [options.visibleEnd=2] - Visible characters from the end.
 * @param {string|function} [options.maskChar='*'] - Masking character or a function that generates masking string.
 * @returns {string} - The masked string.
 */
// src/mask.js 
const mask = (str, options = {}) => {
    if (typeof str !== 'string') {
        return '';
    }

    const {
        visibleStart = 2,
        visibleEnd = 2,
        maskChar = '*',
        sensitivity = 'medium', // Add sensitivity option
    } = options;

    const strLength = str.length;

    if (visibleStart + visibleEnd >= strLength) {
        return str;
    }

    const sensitivityLevels = {
        low: 0.3,
        medium: 0.7,
        high: 1,
    };

    const maskRatio = sensitivityLevels[sensitivity] || sensitivityLevels.medium;

    const maskedPartLength = Math.round((strLength - visibleStart - visibleEnd) * maskRatio);

    const maskedPart =
        typeof maskChar === 'function'
            ? maskChar(maskedPartLength)
            : maskChar.repeat(maskedPartLength);

    return (
        str.substring(0, visibleStart) +
        maskedPart +
        str.substring(strLength - visibleEnd)
    );
};

module.exports = mask;