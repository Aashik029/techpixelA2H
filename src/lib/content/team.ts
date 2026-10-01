/**
 * Team content module (C3). UNCONFIRMED placeholder — every entry below is
 * invented structure awaiting owner input. Never present as fact.
 */
export interface TeamMember {
  slug: string;
  name: string;
  role: string;
  bio: string;
}

/** UNCONFIRMED placeholder roster — replace with owner-confirmed members. */
export const TEAM: TeamMember[] = [
  {
    slug: 'founder',
    name: 'UNCONFIRMED — Founder name',
    role: 'UNCONFIRMED — Founder',
    bio: 'UNCONFIRMED placeholder: short founder bio to be confirmed by the owner.'
  },
  {
    slug: 'design-lead',
    name: 'UNCONFIRMED — Design lead name',
    role: 'UNCONFIRMED — Design',
    bio: 'UNCONFIRMED placeholder: short design-lead bio to be confirmed by the owner.'
  },
  {
    slug: 'engineering-lead',
    name: 'UNCONFIRMED — Engineering lead name',
    role: 'UNCONFIRMED — Engineering',
    bio: 'UNCONFIRMED placeholder: short engineering-lead bio to be confirmed by the owner.'
  }
];
