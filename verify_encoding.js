const fs = require('fs');
const path = 'c:\\Users\\carlo\\Documents\\Projetos\\Quest4Couple_v3\\js\\articlesData.js';
const buf = fs.readFileSync(path);
console.log('File size:', buf.length, 'bytes');
console.log('First 3 bytes:', buf[0], buf[1], buf[2]);

const text = buf.toString('utf8');
const lines = text.split('\n');
console.log('Total lines:', lines.length);
console.log('Line 2:', lines[1].trim().substring(0, 80));
console.log('Line 3:', lines[2].trim().substring(0, 100));

// Check for garbled patterns
const garbled = text.match(/Ã¢|Ã©|Ã£|Ãº|Ã§|Ã³|Ã­|Ãª|Ã¡/g);
if (garbled) {
    console.log('WARNING: Found', garbled.length, 'garbled character occurrences');
} else {
    console.log('OK: No garbled characters found');
}

// Check for proper Portuguese chars
if (text.includes('Dinâmicas')) {
    console.log('OK: "Dinâmicas" found correctly');
} else {
    console.log('WARNING: "Dinâmicas" NOT found correctly');
}

// Check if has order fields
const orderMatches = text.match(/order:\s*\d+/g);
console.log('Order fields found:', orderMatches ? orderMatches.length : 0);
