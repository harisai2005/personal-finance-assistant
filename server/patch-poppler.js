// patch-poppler.js

const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, 'node_modules', 'pdf-poppler', 'index.js');

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) return console.error('Failed to read pdf-poppler/index.js:', err);

  // Remove the line that throws the Linux error
  const patched = data.replace(/throw new Error\("linux is NOT supported."\);/g, '');

  fs.writeFile(filePath, patched, 'utf8', (err) => {
    if (err) return console.error('Failed to patch pdf-poppler:', err);
    console.log('✅ Successfully patched pdf-poppler to support Linux on Render');
  });
});
