/**
 * Services content module (C3). Verbatim seed from
 * `src/lib/components/TargoServices.svelte` — titles, descriptions, tags and
 * numbering copied word-for-word; nothing added, no client names, metrics or
 * testimonials invented.
 *
 * Extended detail fields (`deliverables`, `detail`) beyond the verbatim card
 * copy are UNCONFIRMED placeholders drafted from the card description alone —
 * do not present them as fact until the owner confirms.
 */
export interface Service {
  slug: string;
  num: string;
  title: string;
  /** Verbatim card description from TargoServices. */
  description: string;
  tag: string | null;
  /** UNCONFIRMED placeholder — generic sub-topics of the verbatim description. */
  deliverables: string[];
  /** UNCONFIRMED placeholder — elaboration of the verbatim description. */
  detail: string;
}

export const SERVICES: Service[] = [
  {
    slug: 'web-development',
    num: '01',
    title: 'Web Development',
    description:
      'Business websites, portfolios, landing pages and e-commerce stores. Fast, mobile-first, and built to convert visitors into customers.',
    tag: 'Most requested',
    deliverables: [
      'Business websites',
      'Portfolios',
      'Landing pages',
      'E-commerce stores'
    ],
    detail:
      'UNCONFIRMED placeholder: fast, mobile-first builds shaped around turning visitors into customers. Confirm scope with the owner.'
  },
  {
    slug: 'ai-automation',
    num: '02',
    title: 'AI Automation',
    description:
      'WhatsApp bots, lead qualification, follow-up sequences and business reports — automation that runs your routine work while you sleep.',
    tag: null,
    deliverables: [
      'WhatsApp bots',
      'Lead qualification',
      'Follow-up sequences',
      'Business reports'
    ],
    detail:
      'UNCONFIRMED placeholder: automation for routine work such as bots, qualification, follow-ups and reports. Confirm scope with the owner.'
  },
  {
    slug: 'poster-design',
    num: '03',
    title: 'Poster Design',
    description:
      'Festival creatives, offer posters, event flyers and brand kits that stop the scroll.',
    tag: null,
    deliverables: [
      'Festival creatives',
      'Offer posters',
      'Event flyers',
      'Brand kits'
    ],
    detail:
      'UNCONFIRMED placeholder: scroll-stopping creatives for festivals, offers, events and brand kits. Confirm scope with the owner.'
  },
  {
    slug: 'content-creation',
    num: '04',
    title: 'Content Creation',
    description:
      'Product videos, reels, business profiles and presentation decks that tell your story.',
    tag: null,
    deliverables: [
      'Product videos',
      'Reels',
      'Business profiles',
      'Presentation decks'
    ],
    detail:
      'UNCONFIRMED placeholder: story-led videos, reels, profiles and decks. Confirm scope with the owner.'
  },
  {
    slug: 'digital-marketing',
    num: '05',
    title: 'Digital Marketing',
    description:
      'SEO, social media and WhatsApp campaigns that bring a steady flow of new customers.',
    tag: null,
    deliverables: ['SEO', 'Social media', 'WhatsApp campaigns'],
    detail:
      'UNCONFIRMED placeholder: SEO, social and WhatsApp campaigns aimed at a steady flow of new customers. Confirm scope with the owner.'
  }
];

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
