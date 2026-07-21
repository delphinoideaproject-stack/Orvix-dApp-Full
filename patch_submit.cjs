const fs = require('fs');
let content = fs.readFileSync('src/pages/SubmitWizard.tsx', 'utf-8');

content = content.replace(
  "// For demo, we don't actually add it yet since it's pending review",
  "// TODO: Add token submission backend integration here"
);

fs.writeFileSync('src/pages/SubmitWizard.tsx', content);
console.log('SubmitWizard patched');
