# tzdiff

Shows the current time, or a given moment, in several time zones side by side. Use it to plan a call across offsets without opening a converter.

[![npm](https://img.shields.io/npm/v/@v0idd0/tzdiff?color=00f6d0&labelColor=050914)](https://www.npmjs.com/package/@v0idd0/tzdiff)
[![test](https://github.com/voidd0/tzdiff/actions/workflows/test.yml/badge.svg)](https://github.com/voidd0/tzdiff/actions/workflows/test.yml)
[![license](https://img.shields.io/badge/license-MIT-00f6d0?labelColor=050914)](LICENSE)

## Install

```bash
npm install -g @v0idd0/tzdiff
```

Or run it once without installing: `npx @v0idd0/tzdiff --help`. Needs Node.js 18 or newer. No dependencies.

## Example

Show the current time in four zones. Output from a real run on 2026-11-26, so the times will differ when you run it:

```console
$ tzdiff IDT PST UTC TYO
idt      thu 14:20  nov 26  +2
pst      thu 04:20  nov 26  -8
utc      thu 12:20  nov 26  +0
tyo      thu 21:20  nov 26  +9
```

Show a fixed moment in each zone. The offsets follow daylight saving time:

```console
$ tzdiff --at "2026-07-01 09:00 UTC" PST IST
pst      wed 02:00  jul 01  -7
ist      wed 14:30  jul 01  +5:30
```

## Usage

```text
tzdiff: compare time zones side by side

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

Docs and issues: https://github.com/voidd0/tzdiff
```

## Notes

The value of `--at` is parsed by JavaScript's `Date`, so write it as a date and time with an offset or `UTC` (for example `2026-07-01 09:00 UTC` or `2026-07-01T09:00:00+03:00`). A zone abbreviation such as `IDT` inside `--at` is not understood, and the tool prints an error.

## License

MIT, see [LICENSE](LICENSE).

---

Made by [vøiddo](https://voiddo.com/?src=gh). More command line tools: [voiddo.com/packages](https://voiddo.com/packages/?src=gh).
We also run data scrapers for job boards, shops and ad libraries: [voiddo.com/scrapers](https://voiddo.com/scrapers/?src=gh).
