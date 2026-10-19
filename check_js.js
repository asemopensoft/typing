const fs = require('fs');
const vm = require('vm');

const candidates = [
  'C:\\Users\\user3\\Desktop\\typing\\Barqtype.html',
  'C:\\Users\\user3\\Desktop\\typing\\server\\public\\index.html',
  'D:\\asem\\typing\\Barqtype.html',
  'D:\\asem\\typing\\index.html'
];
const htmlPath = candidates.find(p => fs.existsSync(p));
if (!htmlPath) {
  console.error('No HTML file found to check!');
  process.exit(1);
}
console.log('Validating JS in:', htmlPath);
const html = fs.readFileSync(htmlPath, 'utf8');

// Extract script tags
const scriptRegex = /<script(?:\s+[^>]*)?>([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
while ((match = scriptRegex.exec(html)) !== null) {
  count++;
  const code = match[1];
  if (!code.trim()) continue;
  try {
    // Only check syntax
    new vm.Script(code);
    console.log(`Script #${count}: SYNTAX OK (${code.length} chars)`);
  } catch (err) {
    console.error(`Script #${count} ERROR:`, err.message);
  }
}
console.log(`Checked ${count} scripts.`);
