/**
 * Process content module (C3). UNCONFIRMED placeholder — steps describe a
 * generic engagement flow awaiting owner confirmation. Never present as fact.
 */
export interface ProcessStep {
  num: string;
  title: string;
  description: string;
}

/** UNCONFIRMED placeholder steps — confirm the real workflow with the owner. */
export const PROCESS: ProcessStep[] = [
  {
    num: '01',
    title: 'Tell us about your business',
    description:
      'UNCONFIRMED placeholder: share what you need and we recommend the right mix of services.'
  },
  {
    num: '02',
    title: 'Get a plan within 24 hours',
    description:
      'UNCONFIRMED placeholder: we reply with a scoped plan and timeline.'
  },
  {
    num: '03',
    title: 'We build and ship',
    description:
      'UNCONFIRMED placeholder: design, build and launch with your feedback along the way.'
  },
  {
    num: '04',
    title: 'Grow from there',
    description:
      'UNCONFIRMED placeholder: pick what you need now and add more services as you grow.'
  }
];
