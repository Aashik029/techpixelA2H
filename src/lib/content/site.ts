/**
 * Contact-truth module (C2). Single source of truth for site URL,
 * contact channels, nav items and social links. Nav + footer consume this.
 *
 * NOTE: SITE_URL is the production deployment URL (Owner decision A1,
 * confirmed for first Vercel deploy). Update if a custom domain is added.
 */
export const SITE_URL_UNCONFIRMED = false;

/** Owner decision A1 value — production URL, confirmed for first deploy. */
export const SITE_URL = 'https://tech-pixel-a2h.vercel.app';

export const DOMAIN = 'tech-pixel-a2h.vercel.app';

export const PHONE_DISPLAY = '+91 95977 96186';
export const PHONE_TEL = 'tel:+919597796186';
export const EMAIL = 'techpixela2h@gmail.com';
export const EMAIL_HREF = 'mailto:techpixela2h@gmail.com';
export const WHATSAPP_NUMBER = '919597796186';
export const WHATSAPP_HREF =
  'https://wa.me/919597796186?text=Hi%20Tech%20Pixel%20A2H!';
export const LOCATION = 'India';

/**
 * Consent-gated analytics (C5). Plausible EU, cookieless. The script loads
 * ONLY after opt-in consent (Owner action A4 funds/points the account);
 * default-deny banner persisted in localStorage. No real key — owner action.
 */
export const PLAUSIBLE_HOST = 'plausible.io';
export const PLAUSIBLE_SCRIPT_SRC = 'https://plausible.io/js/script.js';
export const CONSENT_STORAGE_KEY = 'targo-consent';

/** Widened page-id union so C3/C4 register pages without another type edit. */
export type PageId =
  | 'home'
  | 'about'
  | 'services'
  | 'work'
  | 'contact'
  | 'privacy'
  | 'terms'
  | 'not-found'
  | (string & {});

export interface NavItem {
  id: PageId;
  label: string;
  href: string;
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'Home', href: '/' },
  { id: 'about', label: 'About', href: '/about' },
  { id: 'services', label: 'Services', href: '/services' },
  { id: 'work', label: 'Work', href: '/work' }
];

export const CONTACT_HREF = '/#contact';

export interface SocialLink {
  label: string;
  href: string;
  external?: boolean;
}

export const SOCIALS: SocialLink[] = [
  { label: 'WhatsApp →', href: WHATSAPP_HREF, external: true },
  { label: 'Email →', href: EMAIL_HREF }
];
