/** Decimal odds as shown on outcome buttons, e.g. "1.37" or "15.00". */
export const DECIMAL_ODDS = /\d+\.\d{2}/;

/** Streaming platforms the site is known to embed. A new one should be a conscious decision, not a surprise. */
export const KNOWN_STREAM_HOSTS = /(^|\.)(kick\.com|twitch\.tv|youtube\.com)$/;

/** External Help Center opened in a new tab. */
export const HELP_CENTER_URL = /^https:\/\/help\.playepic\.io/;
