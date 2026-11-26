#!/usr/bin/env node
import { readFileSync as __readPkgVersion } from 'node:fs';
if (process.argv[2] === '--version' || process.argv[2] === '-V') { console.log(JSON.parse(__readPkgVersion(new URL('../package.json', import.meta.url), 'utf8')).version); process.exit(0); }
import { compare, format } from '../src/index.js';

const args = process.argv.slice(2);

function help() {
  console.log(`tzdiff: compare time zones side by side

Usage:
  tzdiff <zone> <zone> ...             show the current time in each zone
  tzdiff --at "<date time>" <zones>    show that moment in each zone
  tzdiff --json <zones>                print JSON
  tzdiff -V, --version                 print the version
  tzdiff -h, --help                    show this help

A zone is an IANA name (America/Los_Angeles) or an abbreviation (PST, IDT, JST).

Examples:
  tzdiff IDT PST UTC TYO
  tzdiff Asia/Tokyo Europe/London America/New_York
  tzdiff --at "2026-04-28 09:00 UTC" PST EST IST

Docs and issues: https://github.com/voidd0/tzdiff`);
}

if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
  help();
  process.exit(0);
}

let at = new Date();
const positional = [];
const wantJson = args.includes('--json');
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--at') {
    const raw = args[++i];
    const parsed = new Date(raw);
    if (isNaN(parsed.getTime())) {
      console.error(`tzdiff: cannot parse --at "${raw}"`);
      process.exit(1);
    }
    at = parsed;
  } else if (a === '--json' || a === '-h' || a === '--help') {
    // handled
  } else {
    positional.push(a);
  }
}

if (positional.length === 0) {
  console.error('tzdiff: no zones given. try `tzdiff --help`.');
  process.exit(1);
}

const rows = compare(positional, at);
if (wantJson) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  console.log(format(rows));
}
