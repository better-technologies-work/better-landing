const fs = require('fs');
const p = 'c:/Users/Admin/Desktop/better-technologies/app/[locale]/page.tsx';
const s = fs.readFileSync(p,'utf8');
const start = s.indexOf('export const ui = {');
if (start === -1) { console.log('ui start not found'); process.exit(0); }
let depth = 0;
let i = start;
let closeIndex = -1;
for (; i < s.length; i++) {
  const ch = s[i];
  if (ch === '{') depth++;
  else if (ch === '}') {
    depth--;
    if (depth === 0) { closeIndex = i; break; }
  }
}
console.log('start at', start);
console.log('closeIndex', closeIndex);
console.log('ui snippet:');
console.log(s.slice(start, closeIndex+1));
console.log('\nRemaining after close (next 200 chars):');
console.log(s.slice(closeIndex+1, closeIndex+201));
console.log('\nFinal depth', depth);
