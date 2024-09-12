// src/bloomFilter.js
class BloomFilter {
    constructor(size = 100, hashFunctions = []) {
        this.size = size;
        this.bitArray = new Array(size).fill(0);
        this.hashFunctions = hashFunctions;
    }

    // Simple hash function example (you'll likely want more robust ones)
    _hash(str, seed) {
        let hash = seed;
        for (let i = 0; i < str.length; i++) {
            hash = (hash << 5) - hash + str.charCodeAt(i);
            hash |= 0; // Convert to 32bit integer
        }
        return Math.abs(hash) % this.size;
    }

    add(str) {
        for (const hashFunction of this.hashFunctions) {
            const index = this._hash(str, hashFunction);
            this.bitArray[index] = 1;
        }
    }

    check(str) {
        for (const hashFunction of this.hashFunctions) {
            const index = this._hash(str, hashFunction);
            if (this.bitArray[index] === 0) {
                return false;
            }
        }
        return true; // May be a false positive
    }
}

module.exports = BloomFilter;