/**
 * Evidence-bound case-study content (C4). Seeded verbatim from the six
 * `TargoWork.svelte` cards — no invented client names, metrics,
 * testimonials, or percentages. Every entry carries a non-empty
 * `disclosure` label; the HRMS entry is labelled concept work.
 */

export interface WorkEntry {
  slug: string;
  cat: string;
  title: string;
  summary: string;
  disclosure: string;
  body: string[];
}

export const WORK: WorkEntry[] = [
  {
    slug: 'local-store-online',
    cat: 'E-commerce Website',
    title: 'Local Store, Online Overnight',
    summary:
      'A complete online store for a neighborhood retailer — product catalog, WhatsApp ordering, and festival offer banners.',
    disclosure: 'Sample work — illustrative example, not a client engagement.',
    body: [
      'A complete online store for a neighborhood retailer — product catalog, WhatsApp ordering, and festival offer banners.',
      'Scope shown here is illustrative: catalog browsing, WhatsApp ordering, and festival offer banners.'
    ]
  },
  {
    slug: 'team-workspace',
    cat: 'B2B Web Application',
    title: 'One Workspace for the Whole Team',
    summary:
      'A shared dashboard where a growing business tracks projects, clients, and daily tasks — all in one place.',
    disclosure: 'Sample work — illustrative example, not a client engagement.',
    body: [
      'A shared dashboard where a growing business tracks projects, clients, and daily tasks — all in one place.',
      'Scope shown here is illustrative: project, client, and task tracking in one shared view.'
    ]
  },
  {
    slug: 'hrms-concept',
    cat: 'HRMS Concept',
    title: 'HR Without the Spreadsheets',
    summary:
      'Attendance, leave requests, and employee records in a clean visual system — concept interface for modern HR teams.',
    disclosure: 'Concept work — interface concept, not shipped for a client.',
    body: [
      'Attendance, leave requests, and employee records in a clean visual system — concept interface for modern HR teams.',
      'This is a concept exploration, not a shipped client engagement.'
    ]
  },
  {
    slug: 'festival-posters',
    cat: 'Poster Pack',
    title: 'Festival Season, Fully Designed',
    summary:
      'A complete set of offer posters, social creatives, and banners for a retail brand’s festival campaign.',
    disclosure: 'Sample work — illustrative example, not a client engagement.',
    body: [
      'A complete set of offer posters, social creatives, and banners for a retail brand’s festival campaign.',
      'Scope shown here is illustrative: offer posters, social creatives, and banners.'
    ]
  },
  {
    slug: 'seo-blog-system',
    cat: 'SEO Blog System',
    title: 'Content That Brings Customers',
    summary:
      'A search-optimized blog and content engine that turns everyday questions into a steady stream of new enquiries.',
    disclosure: 'Sample work — illustrative example, not a client engagement.',
    body: [
      'A search-optimized blog and content engine that turns everyday questions into a steady stream of new enquiries.',
      'Scope shown here is illustrative: a search-optimized blog and content setup.'
    ]
  },
  {
    slug: 'growth-campaign',
    cat: 'Growth Campaign',
    title: 'From Invisible to Booked Out',
    summary:
      'Social media creatives, WhatsApp follow-ups, and review engine — a full local growth loop for a service business.',
    disclosure: 'Sample work — illustrative example, not a client engagement.',
    body: [
      'Social media creatives, WhatsApp follow-ups, and review engine — a full local growth loop for a service business.',
      'Scope shown here is illustrative: social creatives, WhatsApp follow-ups, and review prompts.'
    ]
  }
];

export function getWork(slug: string): WorkEntry | undefined {
  return WORK.find((w) => w.slug === slug);
}
