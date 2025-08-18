import fs from 'fs';
import path from 'path';

const horoscopeCsvPath = path.resolve('./src/utils/horoscope.csv');
const zodiacCsvPath = path.resolve('./src/utils/zodiac.csv');
const outputDir = path.resolve('./src/utils');

// --- Read CSV contents ---
const horoscopeCsv = fs.readFileSync(horoscopeCsvPath, 'utf8');
const zodiacCsv = fs.readFileSync(zodiacCsvPath, 'utf8');

// --- Process horoscopeData ---
const lines = horoscopeCsv.split(/\r?\n/).filter(Boolean);

const horoscopeData = [];
for (let i = 0; i < lines.length; i++) {
  const current = lines[i];
  const next = lines[(i + 1) % lines.length];
  horoscopeData.push({ [current]: 0 });
  horoscopeData.push({ [current]: next });
}

// fs.writeFileSync(
//   path.join(outputDir, 'horoscopeData.js'),
//   `export const horoscopeData = ${JSON.stringify(horoscopeData, null, 2)};`
// );

fs.writeFileSync(
  path.join(outputDir, 'horoscopeData.ts'),
  `export const horoscopeData: { [key: string]: string | number }[] = ${JSON.stringify(horoscopeData, null, 2)};`
);

// --- Process zodiacData ---
const zodiacLines = zodiacCsv.split(/\r?\n/).filter(Boolean);
const zodiacData = zodiacLines.map(line => ({ sign: line }));

// fs.writeFileSync(
//   path.join(outputDir, 'zodiacData.js'),
//   `export const zodiacData = ${JSON.stringify(zodiacData, null, 2)};`
// );
fs.writeFileSync(
  path.join(outputDir, 'zodiacData.ts'),
  `export const zodiacData: { sign: string }[] = ${JSON.stringify(zodiacData, null, 2)};`
);

console.log('horoscopeData.js and zodiacData.js generated successfully.');
