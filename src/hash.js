const crypto = require('crypto');

/**
 *  Provides advanced hashing functionality with a focus on ease of use 
 *  and real-world security best practices.
 */
const hashUtils = {
    /**
     * Hashes a string using a variety of robust algorithms and options.
     *
     * @param {string} str - The string to hash.
     * @param {Object} [options] - Configuration options for hashing.
     * @param {string} [options.algorithm='sha256'] - The hashing algorithm ('sha256', 'sha512', 'bcrypt').
     * @param {string} [options.encoding='hex'] - Encoding for output ('hex', 'base64').
     * @param {number} [options.rounds=10] - Number of bcrypt rounds (applies only to 'bcrypt'). 
     * @param {string|Buffer} [options.salt] - Optional salt for added security (auto-generated if not provided).
     * @returns {string} The hashed string.
     * @throws {TypeError} For invalid input types or unsupported algorithms.
     */
    hash: function (str, options = {}) {
        if (typeof str !== 'string') {
            throw new TypeError('Input must be a string');
        }

        const { algorithm = 'sha256', encoding = 'hex', rounds = 10, salt } = options;

        if (algorithm === 'bcrypt') {
            // Use bcrypt for password hashing 
            if (!salt) {
                throw new TypeError('Salt is required for bcrypt.');
            }
            return bcrypt.hashSync(str, rounds);
        } else if (['sha256', 'sha512'].includes(algorithm)) {
            // Use built-in crypto for SHA algorithms
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
     * Compares a plaintext string to a hash (supports bcrypt).
     *
     * @param {string} str - The plaintext string to compare.
     * @param {string} hash - The hash to compare against.
     * @param {string} [algorithm='bcrypt'] - The algorithm used for hashing ('bcrypt', 'sha256', 'sha512').
     * @returns {Promise<boolean>} A promise that resolves to `true` if the string matches the hash, `false` otherwise.
     * @throws {TypeError} For invalid input types or unsupported algorithms.
     */
    compare: function (str, hash, algorithm = 'bcrypt') {
        if (typeof str !== 'string' || typeof hash !== 'string') {
            throw new TypeError('Inputs must be strings');
        }

        if (algorithm === 'bcrypt') {
            // bcrypt.compare returns a promise
            return bcrypt.compare(str, hash);
        } else if (['sha256', 'sha512'].includes(algorithm)) {
            // For SHA, we can compare directly after hashing
            const hashedStr = this.hash(str, { algorithm });
            return Promise.resolve(hashedStr === hash);
        } else {
            throw new TypeError(`Unsupported comparison algorithm: ${algorithm}`);
        }
    },

    // ... [Add more utility functions here if needed]

    // Internal helper to validate salt input
    _validateSalt: function (salt) {
        if (typeof salt !== 'string' && !Buffer.isBuffer(salt)) {
            throw new TypeError('Salt must be a string or a Buffer');
        }
    }
};

module.exports = hashUtils; 