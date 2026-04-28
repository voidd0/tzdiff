// tzdiff — compare timezones side by side.
//
// Uses Intl.DateTimeFormat for the actual conversion (zero deps), with a
// short alias map for common abbreviations -> IANA names. Anything that
// resolves via Intl works directly (e.g. America/Los_Angeles, Europe/London).

const ALIASES = {
  // North America
  PST: 'America/Los_Angeles', PDT: 'America/Los_Angeles',
  MST: 'America/Denver',      MDT: 'America/Denver',
  CST: 'America/Chicago',     CDT: 'America/Chicago',
  EST: 'America/New_York',    EDT: 'America/New_York',
  AKST: 'America/Anchorage',  AKDT: 'America/Anchorage',
  HST: 'Pacific/Honolulu',
  // Europe
  GMT: 'Etc/GMT',  UTC: 'Etc/UTC',
  BST: 'Europe/London',
  CET: 'Europe/Berlin', CEST: 'Europe/Berlin',
  EET: 'Europe/Athens', EEST: 'Europe/Athens',
  MSK: 'Europe/Moscow',
  // Middle East
  IDT: 'Asia/Jerusalem', IST_IL: 'Asia/Jerusalem',
  GST: 'Asia/Dubai', AST: 'Asia/Riyadh',
  // Asia
  IST: 'Asia/Kolkata',  // India
  PKT: 'Asia/Karachi',
  ICT: 'Asia/Bangkok',  WIB: 'Asia/Jakarta',
  HKT: 'Asia/Hong_Kong', SGT: 'Asia/Singapore',
  CST_CN: 'Asia/Shanghai', JST: 'Asia/Tokyo', TYO: 'Asia/Tokyo',
  KST: 'Asia/Seoul',
  // Oceania
  AEDT: 'Australia/Sydney', AEST: 'Australia/Sydney', SYD: 'Australia/Sydney',
  ACDT: 'Australia/Adelaide', ACST: 'Australia/Adelaide',
  AWST: 'Australia/Perth',
  NZDT: 'Pacific/Auckland', NZST: 'Pacific/Auckland',
};

export function resolveZone(input) {
  const upper = input.toUpperCase();
  if (upper in ALIASES) return ALIASES[upper];
  // Already IANA-form?
  if (/^[A-Za-z_]+\/[A-Za-z_]+$/.test(input) || /^[A-Za-z_]+\/[A-Za-z_]+\/[A-Za-z_]+$/.test(input)) {
    return input;
  }
  // Etc/GMT+N pattern
  if (/^GMT[+-]\d+$/i.test(input)) {
    const n = parseInt(input.slice(3), 10);
    return `Etc/GMT${-n >= 0 ? '+' : ''}${-n}`;
  }
  return null;
}

export function formatInZone(date, zone) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    year: 'numeric', month: 'short', day: '2-digit',
    weekday: 'short', hour: '2-digit', minute: '2-digit',
    hour12: false, timeZoneName: 'shortOffset',
  });
  const parts = fmt.formatToParts(date);
  const get = type => (parts.find(p => p.type === type) || {}).value || '';
  return {
    weekday: get('weekday'),
    month:   get('month'),
    day:     get('day'),
    hour:    get('hour'),
    minute:  get('minute'),
    offset:  get('timeZoneName'),
  };
}

export function compare(zones, atDate = new Date()) {
  const rows = [];
  for (const z of zones) {
    const resolved = resolveZone(z);
    if (!resolved) {
      rows.push({ input: z, error: 'unknown timezone' });
      continue;
    }
    try {
      const f = formatInZone(atDate, resolved);
      rows.push({
        input: z,
        zone: resolved,
        weekday: f.weekday.toLowerCase(),
        date: `${f.month.toLowerCase()} ${f.day}`,
        time: `${f.hour}:${f.minute}`,
        offset: f.offset.replace('GMT', '').replace('UTC', ''),
      });
    } catch (err) {
      rows.push({ input: z, error: err.message });
    }
  }
  return rows;
}

export function format(rows) {
  const lines = [];
  for (const r of rows) {
    if (r.error) {
      lines.push(`${r.input.padEnd(8)} (error: ${r.error})`);
      continue;
    }
    const label = r.input.toLowerCase();
    lines.push(
      `${label.padEnd(8)} ${r.weekday} ${r.time}  ${r.date}  ${r.offset || '+0000'}`
    );
  }
  return lines.join('\n');
}
