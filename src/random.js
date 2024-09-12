const crypto = require('crypto');

/**
 * Generates a cryptographically secure random string.
 * 
 * @param {number} length - The length of the random string.
 * @param {string} [charset='alphanumeric'] - The character set to use for generating the string.
 * @returns {string} - The randomly generated string.
 */
function random(length, charset = 'alphanumeric') {
    if (typeof length !== 'number' || length <= 0) {
        throw new TypeError('Length must be a positive integer');
    }

    const charsets = {
        alphanumeric: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
        numeric: '0123456789',
        hex: '0123456789abcdef',
    };

    const validCharset = charsets[charset] || charsets.alphanumeric;
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = crypto.randomInt(0, validCharset.length);
        result += validCharset.charAt(randomIndex);
    }

    return result;
}

module.exports = random;