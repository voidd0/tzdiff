# tzdiff

Compare timezones at a glance. For humans, not crontabs.

```
$ tzdiff IDT PST UTC TYO
idt      tue 14:30  apr 28  +0300
pst      tue 04:30  apr 28  -0700
utc      tue 11:30  apr 28  +0000
tyo      tue 20:30  apr 28  +0900
```

## Install

```bash
npm install -g bruh-tzdiff
```

## Usage

```bash
# Current time in multiple zones
tzdiff IDT PST UTC TYO

# Use IANA names too
tzdiff Asia/Tokyo Europe/London America/New_York

# Specific moment in time
tzdiff --at "2026-04-28 09:00 UTC" PST EST IST

# JSON for scripting
tzdiff --json UTC IDT TYO | jq '.[] | .time'
```

## Supported aliases

**Americas:** PST, PDT, MST, MDT, CST, CDT, EST, EDT, AKST, HST  
**Europe:** GMT, UTC, BST, CET, CEST, EET, EEST, MSK  
**Middle East:** IDT, GST, AST  
**Asia:** IST (India), PKT, ICT, WIB, HKT, SGT, JST, TYO, KST  
**Oceania:** AEDT, AEST, SYD, ACDT, AWST, NZDT, NZST

Anything else → use the IANA name directly (`America/Sao_Paulo`, `Africa/Cairo`, etc.).

## Why

Scheduling a meeting across 4 time zones in your head is a tax. `dig` for DNS, `tzdiff` for time. Output is grep-friendly so you can pipe it into Slack/email.

## Programmatic API

```javascript
import { compare, format } from 'bruh-tzdiff';

const rows = compare(['UTC', 'IDT', 'TYO']);
console.log(format(rows));

// Or with a specific moment:
const at = new Date('2026-07-31T17:00:00Z');
const rows = compare(['PST', 'IDT'], at);
```

## License

MIT — part of the [vøiddo](https://voiddo.com) tools collection.
