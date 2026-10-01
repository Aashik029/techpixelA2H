/**
 * FAQ content module (C3). UNCONFIRMED placeholder — answers are generic
 * drafts awaiting owner confirmation. Never present as fact.
 */
export interface Faq {
  question: string;
  answer: string;
}

/** UNCONFIRMED placeholder FAQs — confirm every answer with the owner. */
export const FAQS: Faq[] = [
  {
    question: 'How fast do you reply?',
    answer:
      'UNCONFIRMED placeholder: we aim to reply within 24 hours. Confirm with the owner.'
  },
  {
    question: 'Can I start with one service and add more later?',
    answer:
      'UNCONFIRMED placeholder: yes — pick what you need now and add more as you grow. Confirm with the owner.'
  },
  {
    question: 'How do we start?',
    answer:
      'UNCONFIRMED placeholder: tell us about your business via the contact section and we recommend the right mix. Confirm with the owner.'
  },
  {
    question: 'Do you work with small businesses?',
    answer:
      'UNCONFIRMED placeholder: yes — services are scoped for growing businesses. Confirm with the owner.'
  }
];
