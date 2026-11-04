// Studio settings used across pages. Anything marked TBC needs Josh before launch.
export { email } from './lib/site'; // edited in Pages CMS, Site settings

// TBC: Josh's Cal.com booking link for a 20-minute call.
export const calUrl = 'https://cal.com/';

// Web3Forms access key. Public by design (brief 11), so it can live in the code.
// Josh's key (2 Nov 2026); enquiries go to the address it was made with.
export const web3formsKey = 'b0431abd-cc0a-4622-9c7d-7e1c97154e36';

// Cloudflare Turnstile site key (public), from the PUBLIC_TURNSTILE_SITE_KEY environment variable in the
// Cloudflare Pages project. Empty means no widget at all, so a test key can never show on the live site.
// The widget runs in "interaction-only" appearance: invisible unless Cloudflare needs the visitor to click.
export const turnstileSiteKey: string = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY ?? '';
