// src/index.js 

const crypto = require('crypto');

/**
 *  Provides advanced string handling functionality with a focus on 
 *  ease of use and real-world security best practices.
 */
const stringUtils = {
    /**
     * Hashes a string using a variety of robust algorithms.
     *
     * @param {string} str - The string to hash.
     * @param {Object} [options] - Configuration options for hashing.
     * @param {string} [options.algorithm='sha256'] - The hashing algorithm ('sha256', 'sha512').
     * @param {string} [options.encoding='hex'] - Encoding for output ('hex', 'base64').
     * @param {string|Buffer} [options.salt] - Optional salt for added security (auto-generated if not provided).
     * @returns {string} The hashed string.
     * @throws {TypeError} For invalid input types or unsupported algorithms.
     */
    hash: function (str, options = {}) {
        if (typeof str !== 'string') {
            throw new TypeError('Input must be a string');
        }

        const { algorithm = 'sha256', encoding = 'hex', salt } = options;

        if (['sha256', 'sha512'].includes(algorithm)) {
            const hashObj = crypto.createHash(algorithm);
            if (salt) {
                this._validateSalt(salt);
                hashObj.update(salt, 'utf8');
            }
            hashObj.update(str, 'utf8');
            return hashObj.digest(encoding);
        } else {
            throw new TypeError(`Unsupported hashing algorithm: ${algorithm}`);
        }
    },

    /**
     * Generates a cryptographically secure random salt.
     *
     * @param {number} [length=16] - The desired length of the salt (in bytes).
     * @returns {string} The randomly generated salt in hexadecimal format.
     */
    generateSalt: function (length = 16) {
        return crypto.randomBytes(length).toString('hex');
    },

    /**
     * Compares a plaintext string to a hash.
     * 
     * @param {string} str - The plaintext string to compare.
     * @param {string} hash - The hash to compare against.
     * @param {string} [algorithm='sha256'] - The algorithm used for hashing ('sha256', 'sha512').
     * @returns {boolean} True if the string matches the hash, false otherwise.
     * @throws {TypeError} For invalid input types or unsupported algorithms.
     */
    compare: function (str, hash, algorithm = 'sha256') {
        if (typeof str !== 'string' || typeof hash !== 'string') {
            throw new TypeError('Inputs must be strings');
        }

        if (['sha256', 'sha512'].includes(algorithm)) {
            const hashedStr = this.hash(str, { algorithm });
            return hashedStr === hash;
        } else {
            throw new TypeError(`Unsupported comparison algorithm: ${algorithm}`);
        }
    },

    /**
     * Masks a portion of a string, keeping a specified number of characters 
     * visible from the beginning and end. Allows for custom masking strategies.
     * 
     * @param {string} str - The string to mask.
     * @param {Object} [options] - Masking options.
     * @param {number} [options.visibleStart=2] - Visible characters from the beginning.
     * @param {number} [options.visibleEnd=2] - Visible characters from the end.
     * @param {string|function} [options.maskChar='*'] - Masking character or a function that generates masking string.
     * @param {string} [options.sensitivity='medium'] - Sensitivity level for dynamic masking ('low', 'medium', 'high').
     * @returns {string} - The masked string.
     */
    mask: function (str, options = {}) {
        if (typeof str !== 'string') {
            return '';
        }

        const {
            visibleStart = 2,
            visibleEnd = 2,
            maskChar = '*',
            sensitivity = 'medium',
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

        const maskedPartLength = Math.round(
            (strLength - visibleStart - visibleEnd) * maskRatio
        );

        const maskedPart =
            typeof maskChar === 'function'
                ? maskChar(maskedPartLength)
                : maskChar.repeat(maskedPartLength);

        return (
            str.substring(0, visibleStart) +
            maskedPart +
            str.substring(strLength - visibleEnd)
        );
    },

    /**
     * Generates a cryptographically secure random string.
     * 
     * @param {number} length - The length of the random string.
     * @param {string} [charset='alphanumeric'] - The character set to use for generating the string.
     * @returns {string} - The randomly generated string.
     */
    random: function (length, charset = 'alphanumeric') {
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
    },

    /**
     * Bloom Filter for efficient string searching.
     */
    BloomFilter: require('./bloomFilter'),

    // Internal helper to validate salt input
    _validateSalt: function (salt) {
        if (typeof salt !== 'string' && !Buffer.isBuffer(salt)) {
            throw new TypeError('Salt must be a string or a Buffer');
        }
    }
};

module.exports = stringUtils;