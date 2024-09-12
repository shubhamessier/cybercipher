/**
 * Compares two strings with constant time complexity to prevent timing attacks.
 * 
 * @param {string} str1 
 * @param {string} str2 
 * @returns {boolean} 
 */
function compare(str1, str2) {
    if (typeof str1 !== 'string' || typeof str2 !== 'string') {
        return false;
    }

    if (str1.length !== str2.length) {
        return false;
    }

    let result = 0;
    for (let i = 0; i < str1.length; i++) {
        result |= str1.charCodeAt(i) ^ str2.charCodeAt(i);
    }

    return result === 0;
}

module.exports = compare;