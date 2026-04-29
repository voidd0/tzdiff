# tzdiff

[![npm version](https://img.shields.io/npm/v/@v0idd0/tzdiff.svg?color=A0573A)](https://www.npmjs.com/package/@v0idd0/tzdiff)
[![npm downloads](https://img.shields.io/npm/dw/@v0idd0/tzdiff.svg?color=1F1A14)](https://www.npmjs.com/package/@v0idd0/tzdiff)
[![License: MIT](https://img.shields.io/badge/license-MIT-A0573A.svg)](LICENSE)
[![Node ≥14](https://img.shields.io/badge/node-%E2%89%A514-1F1A14)](package.json)

Compare timezones at a glance. For humans, not crontabs.

```
$ tzdiff IDT PST UTC TYO
idt      tue 14:30  apr 28  +0300
pst      tue 04:30  apr 28  -0700
utc      tue 11:30  apr 28  +0000
tyo      tue 20:30  apr 28  +0900
```

## Why tzdiff

Scheduling a sync between Tel Aviv, San Francisco, and Tokyo in your head is a tax. The website-based timezone converters take two clicks per zone and break in incognito because they want your localStorage. Your terminal already knows the right answer; it just doesn't print it in a comparable shape. `dig` for DNS, `tzdiff` for time.

## Install

```bash
npm install -g @v0idd0/tzdiff
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

## Compared to alternatives

| tool | offline? | DST aware | output for grep/Slack | install |
|---|---|---|---|---|
| tzdiff | yes | yes (via Intl/IANA) | yes, aligned columns | one npm install |
| `date -u` chains | yes | partially | requires shell-fu | bundled with OS |
| World Time Buddy / time.is | no | yes | screenshot only | web |
| `tz` (older CLI) | yes | yes | column drift | unmaintained |

Tools like timeanddate.com handle the broader case (recurring meetings, DST historical lookups). `tzdiff` is the speed-of-typing case: you have 4 abbreviations in your head and want a 4-row answer in 200ms.

## FAQ

**Why "IST" defaults to India and not Israel?** Because India is +0530 year-round and Israel toggles between IST/IDT seasonally. We default IST to India to avoid quietly changing meaning twice a year. For Israel use `IDT` (summer) or `Asia/Jerusalem`.

**Does `--at` accept your home timezone?** Pass it explicitly: `--at "2026-07-31 17:00 PDT"`. The parser accepts `<datetime> <tz>` in that order.

**Will it ever DST-jump output rows?** Each row is computed independently against its zone's TZ database, so yes — running on the spring-forward Sunday will show the forward jump in the affected zone only.

**Can I save a recurring meeting?** No. tzdiff is one-shot by design. For recurring time-math, use a calendar app — that's a different problem.

## Programmatic API

```javascript
import { compare, format } from '@v0idd0/tzdiff';

const rows = compare(['UTC', 'IDT', 'TYO']);
console.log(format(rows));

// Or with a specific moment:
const at = new Date('2026-07-31T17:00:00Z');
const rows = compare(['PST', 'IDT'], at);
```

## Tips for meeting math

- **Pin one zone as your anchor.** When scheduling, write the time once in UTC and let recipients run `tzdiff --at "2026-05-12 14:00 UTC" <their zone>` — eliminates the "is that 2pm yours or mine" thread.
- **DST-sensitive ranges.** If a meeting falls within a few weeks of a DST boundary, run tzdiff for both pre- and post-boundary dates; the zones won't always agree on which week the change lands.
- **Slack format.** The aligned columnar output pastes cleanly into Slack code blocks (`\`\`\``) — no Markdown table conversion needed.

## More from the studio

This is one tool out of many — see [`from-the-studio.md`](from-the-studio.md) for the full lineup of vøiddo products (other CLI tools, browser extensions, the studio's flagship products and games).

## License

MIT.

---

Built by [vøiddo](https://voiddo.com/) — a small studio shipping AI-flavoured products, free dev tools, Chrome extensions and weird browser games.
