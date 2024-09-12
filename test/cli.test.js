const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');


function runCommand(command) {
    try {
        const output = execSync(`node ./cli.js ${command}`, { cwd: __dirname, encoding: 'utf-8' });
        return output.trim();
    } catch (err) {
        console.error(err);
        return err.stdout.toString().trim(); // Return error output for debugging
    }
}

// Helper to create temporary test files 
const createTestFile = (filePath, content) => {
    fs.writeFileSync(filePath, content, 'utf-8');
};

// Helper to delete test files
const deleteTestFile = (filePath) => {
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
};

describe('Ironclad CLI', () => {
    // ============ Hashing ============
    it('should hash a string with SHA-256 (default)', () => {
        const output = runCommand('hash "teststring"');
        expect(output).toMatch(/Hashed string \(sha256\): [a-f0-9]+/); // Check for hex output
    });

    it('should hash a string with SHA-512', () => {
        const output = runCommand('hash "teststring" -a sha512');
        expect(output).toMatch(/Hashed string \(sha512\): [a-f0-9]+/);
    });

    it('should handle errors gracefully when hashing', () => {
        const output = runCommand('hash'); // No string provided
        expect(output).toMatch(/Error: Please provide a string to hash./);
    });

    // ============ Salt Generation ============
    it('should generate a salt with default length', () => {
        const output = runCommand('generate-salt');
        expect(output).toMatch(/Generated Salt: [a-f0-9]{32}/); // 16 bytes = 32 hex characters
    });

    it('should generate a salt with a specific length', () => {
        const output = runCommand('generate-salt -l 24');
        expect(output).toMatch(/Generated Salt: [a-f0-9]{48}/); // 24 bytes = 48 hex characters
    });

    // ============ String Comparison ============ 
    it('should compare strings correctly (match)', () => {
        const testString = 'test-comparison';
        const hash = runCommand(`hash "${testString}" -a sha512`).split(': ')[1];
        const output = runCommand(`compare "${testString}" ${hash} -a sha512`);
        expect(output).toBe('Match: true');
    });

    it('should compare strings correctly (no match)', () => {
        const output = runCommand('compare "string1" "some-incorrect-hash"');
        expect(output).toBe('Match: false');
    });


    it('should mask a string with default options', () => {
        const output = runCommand('mask "1234-5678-9012-3456"');
        expect(output).toBe('Masked string: 12**********56');
    });


    it('should redact sensitive data from a file', () => {
        const testFilePath = path.join(__dirname, 'test.txt');
        const testOutputFile = path.join(__dirname, 'test-redacted.txt');
        const testContent = 'My credit card is 1234-5678-9012-3456 and my email is test@example.com';
        createTestFile(testFilePath, testContent);

        const rules = `{
      "\\d{4}-\\d{4}-\\d{4}-\\d{4}": {"visibleStart": 4, "visibleEnd": 4},
      "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}": {"sensitivity": "high"}
    }`;

        runCommand(`redact -f ${testFilePath} -r '${rules}' -o ${testOutputFile}`);

        const redactedContent = fs.readFileSync(testOutputFile, 'utf-8');
        expect(redactedContent).toBe('My credit card is 1234-****-****-3456 and my email is ****************');

        deleteTestFile(testFilePath);
        deleteTestFile(testOutputFile);
    });

    // (Add more redaction tests for different rules and file handling scenarios)

    // ============ Help Command ============ 
    it('should display the help message', () => {
        const output = runCommand('help');
        expect(output).toContain('Usage: ironclad <command>');
        expect(output).toContain('Available Commands:');
    });
});