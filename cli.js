#!/usr/bin/env node

const crypto = require('crypto');
const fs = require('fs');

// ================ CLI Commands ================

const commands = {
    "hash": {
        description: "Hash a string securely",
        options: {
            "-a, --algorithm <algorithm>": "Hashing algorithm (sha256, sha512)",
            "-s, --salt <salt>": "Salt for hashing"
        },
        handler: (args, options) => {
            const algorithm = options.algorithm || 'sha256';
            const salt = options.salt || '';
            if (!args[0]) {
                console.error('Error: Please provide a string to hash.');
                return;
            }
            try {
                const hashed = hash(args[0], { algorithm, salt });
                console.log(`Hashed string (${algorithm}): ${hashed}`);
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
        }
    },
    "generate-salt": {
        description: "Generate a cryptographically secure random salt",
        options: {
            "-l, --length <length>": "Desired length of the salt (in bytes, default: 16)"
        },
        handler: (args, options) => {
            const length = parseInt(options.length, 10) || 16;
            try {
                const salt = generateSalt(length);
                console.log(`Generated Salt: ${salt}`);
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
        }
    },
    "compare": {
        description: "Compare a string to a hash securely (SHA-256/SHA-512 only)",
        options: {
            "-a, --algorithm <algorithm>": "Hashing algorithm (sha256, sha512)",
        },
        handler: (args, options) => {
            const algorithm = options.algorithm || 'sha256';
            const [string, hash] = args;
            if (!string || !hash) {
                console.error('Error: Please provide both the string and hash to compare.');
                return;
            }
            try {
                const match = compare(string, hash, algorithm);
                console.log(`Match: ${match}`);
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
        }
    },
    "mask": {
        description: "Mask a string securely",
        options: {
            "-s, --visibleStart <start>": "Number of visible characters from the start (default: 2)",
            "-e, --visibleEnd <end>": "Number of visible characters from the end (default: 2)",
            "-l, --sensitivity <level>": "Sensitivity level (low, medium, high, default: medium)"
        },
        handler: (args, options) => {
            const visibleStart = parseInt(options.visibleStart, 10) || 2;
            const visibleEnd = parseInt(options.visibleEnd, 10) || 2;
            const sensitivity = options.sensitivity || 'medium';
            if (!args[0]) {
                console.error('Error: Please provide a string to mask.');
                return;
            }
            try {
                const masked = mask(args[0], { visibleStart, visibleEnd, sensitivity });
                console.log(`Masked string: ${masked}`);
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
        }
    },
    "random": {
        description: "Generate a random string",
        options: {
            "-l, --length <length>": "Desired length of the string (default: 16)",
            "-c, --charset <charset>": "Character set (alphanumeric, numeric, hex, default: alphanumeric)"
        },
        handler: (args, options) => {
            const length = parseInt(options.length, 10) || 16;
            const charset = options.charset || 'alphanumeric';
            try {
                const randomStr = random(length, charset);
                console.log(`Generated Random String: ${randomStr}`);
            } catch (error) {
                console.error(`Error: ${error.message}`);
            }
        }
    },
    "redact": {
        description: "Redact sensitive data from a file",
        options: {
            "-f, --file <path>": "Path to the file to redact (required)",
            "-r, --rules <rules>": "Redaction rules (JSON format, required). Example: '{\"creditCard\": {\"visibleStart\": 4, \"visibleEnd\": 4}}'",
            "-o, --output <path>": "Path to save the redacted file (default: overwrite original)"
        },
        handler: (args, options) => {
            const filePath = options.file;
            const rulesString = options.rules;
            const outputPath = options.output || filePath; // Overwrite by default

            if (!filePath || !rulesString) {
                console.error("Error: Please provide both the file path (-f) and redaction rules (-r)");
                return;
            }

            try {
                const rules = JSON.parse(rulesString);
                redactFile(filePath, rules, outputPath);
            } catch (error) {
                console.error("Error:", error.message);
            }
        }
    },
    "help": {
        description: "Show help information",
        handler: () => {
            console.log("Usage: ironclad <command> [options] [arguments]");
            console.log("\nAvailable Commands:");
            for (const [commandName, command] of Object.entries(commands)) {
                console.log(`  ${commandName.padEnd(16)} ${command.description}`);
                if (command.options) {
                    for (const [option, description] of Object.entries(command.options)) {
                        console.log(`    ${option.padEnd(20)} ${description}`);
                    }
                }
            }
        }
    }
};

// ================ Helper Functions ================

function redactFile(filePath, rules, outputPath) {
    fs.readFile(filePath, 'utf-8', (err, data) => {
        if (err) {
            console.error(`Error reading file: ${err.message}`);
            return;
        }

        let redactedData = data;
        for (const [key, rule] of Object.entries(rules)) {
            try {
                const regex = new RegExp(key, 'g');
                redactedData = redactedData.replace(regex, (match) => {
                    return mask(match, rule);
                });
            } catch (error) {
                console.error(`Error applying rule '${key}': ${error.message}`);
                // Consider adding options to control whether to stop on error or continue with other rules.
            }
        }

        fs.writeFile(outputPath, redactedData, 'utf-8', (err) => {
            if (err) {
                console.error(`Error writing to file: ${err.message}`);
            } else {
                console.log(`File redacted successfully. ${outputPath !== filePath ? `Redacted content saved to: ${outputPath}` : 'Original file overwritten.'}`);
            }
        });
    });
}

const [commandName, ...args] = process.argv.slice(2);
const command = commands[commandName] || commands.help;

if (command.handler) {
    const options = {};
    for (let i = 0; i < args.length; i++) {
        if (args[i].startsWith('-')) {
            const optionName = args[i].replace(/^--?/, '');
            options[optionName] = args[i + 1] || true;
            i++;
        }
    }
    command.handler(args, options);
} else {
    console.error(`Unknown command: ${commandName}`);
    commands.help.handler();
}