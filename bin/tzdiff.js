#!/usr/bin/env node
import { compare, format } from '../src/index.js';

const args = process.argv.slice(2);

function help() {
  console.log(`
tzdiff — compare timezones side by side. for humans, not crontabs.

  tzdiff <zone1> <zone2> ...     show current time in each zone
  tzdiff --at "2026-04-28 14:30 IDT" <zones>  show that moment in each zone
  tzdiff --json <zones>          json output
  tzdiff -h, --help              show this

zones can be IANA names (America/Los_Angeles) or aliases (PST, IDT, JST, ...).

examples:
  tzdiff IDT PST UTC TYO
  tzdiff Asia/Tokyo Europe/London America/New_York
  tzdiff --at "2026-04-28 09:00 UTC" PST EST IST
`);
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
