<script lang="ts">
  import type { Graph } from 'schema-dts';
  import { EMAIL, PHONE_DISPLAY, SITE_URL } from '$lib/content/site';
  import { SERVICES, type Service } from '$lib/content/services';
  import type { WorkEntry } from '$lib/content/work';
  import type { Faq } from '$lib/content/faq';

  interface Crumb {
    name: string;
    path: string;
  }

  type PageType = 'WebPage' | 'AboutPage' | 'CollectionPage' | 'FAQPage' | 'ItemPage';

  let {
    name,
    description,
    path,
    pageType = 'WebPage',
    crumbs = [],
    service,
    work,
    faqs,
    services,
    works
  }: {
    name: string;
    description: string;
    path: string;
    pageType?: PageType;
    crumbs?: Crumb[];
    service?: Service;
    work?: WorkEntry;
    faqs?: Faq[];
    services?: Service[];
    works?: WorkEntry[];
  } = $props();

  const pageUrl = $derived(`${SITE_URL}${path}`);
  const orgId = `${SITE_URL}/#organization`;
  const siteId = `${SITE_URL}/#website`;
  const logoId = `${SITE_URL}/#logo`;
  const founderId = `${SITE_URL}/about#ajay-a`;
  const ctoId = `${SITE_URL}/about#hanush-s`;
  const pageId = $derived(`${pageUrl}#page`);
  const breadcrumbId = $derived(`${pageUrl}#breadcrumb`);
  const serviceNodeId = $derived(`${pageUrl}#service`);
  const workNodeId = $derived(`${pageUrl}#work`);
  const serviceListId = $derived(`${pageUrl}#services`);
  const workListId = $derived(`${pageUrl}#work-list`);

  const trail = $derived<Crumb[]>([{ name: 'Home', path: '/' }, ...crumbs]);
  const hasBreadcrumb = $derived(trail.length > 1);

  const COMPANY_DESCRIPTION =
    'Tech Pixel A2H is a team in India that helps small and growing businesses get online, automate routine work, and attract customers through web development, AI automation, poster design, content creation, and digital marketing.';

  const KNOWS_ABOUT = [
    'Web development',
    'AI automation',
    'Poster design',
    'Content creation',
    'Digital marketing',
    'Search engine optimization',
    'E-commerce',
    'WhatsApp automation'
  ];

  const people = [
    {
      '@type': 'Person',
      '@id': founderId,
      name: 'Ajay A',
      jobTitle: 'Founder & CEO',
      description:
        'Ajay founded Tech Pixel A2H to give small businesses enterprise-grade digital work without the agency overhead. He leads strategy and client relationships.',
      image: `${SITE_URL}/images/ajay-ceo.jpg`,
      url: `${SITE_URL}/about#ajay-a`,
      worksFor: { '@id': orgId }
    },
    {
      '@type': 'Person',
      '@id': ctoId,
      name: 'Hanush S',
      jobTitle: 'CTO',
      description:
        'Hanush leads technology at Tech Pixel A2H - architecture, engineering quality and delivery.',
      url: `${SITE_URL}/about#hanush-s`,
      worksFor: { '@id': orgId }
    }
  ];

  const serviceCatalog = SERVICES.map((s) => ({
    '@type': 'Offer',
    itemOffered: {
      '@type': 'Service',
      name: s.title,
      description: s.description,
      serviceType: s.title,
      url: `${SITE_URL}/services/${s.slug}`,
      provider: { '@id': orgId }
    }
  }));

  const serviceNode = $derived(
    service
      ? {
          '@type': 'Service',
          '@id': serviceNodeId,
          name: service.title,
          description: service.detail || service.description,
          serviceType: service.title,
          url: pageUrl,
          mainEntityOfPage: { '@id': pageId },
          provider: { '@id': orgId },
          areaServed: { '@type': 'Country', name: 'India' },
          audience: { '@type': 'BusinessAudience', name: 'Small and growing businesses' },
          hasOfferCatalog: {
            '@type': 'OfferCatalog',
            name: `${service.title} deliverables`,
            itemListElement: service.deliverables.map((d) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: d }
            }))
          }
        }
      : null
  );

  const workNode = $derived(
    work
      ? {
          '@type': 'CreativeWork',
          '@id': workNodeId,
          name: work.title,
          description: work.summary,
          abstract: work.summary,
          text: work.body.join('\n\n'),
          genre: work.cat,
          url: pageUrl,
          mainEntityOfPage: { '@id': pageId },
          creator: { '@id': orgId },
          disambiguatingDescription: work.disclosure
        }
      : null
  );

  const faqQuestions = $derived(
    (faqs ?? []).map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer }
    }))
  );

  const itemListNode = $derived(
    services && services.length > 0
      ? {
          '@type': 'ItemList',
          '@id': serviceListId,
          name: 'Tech Pixel A2H services',
          numberOfItems: services.length,
          itemListElement: services.map((s, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
              '@type': 'Service',
              name: s.title,
              description: s.description,
              url: `${SITE_URL}/services/${s.slug}`
            }
          }))
        }
      : works && works.length > 0
        ? {
            '@type': 'ItemList',
            '@id': workListId,
            name: 'Tech Pixel A2H work',
            numberOfItems: works.length,
            itemListElement: works.map((w, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              item: {
                '@type': 'CreativeWork',
                name: w.title,
                description: w.summary,
                url: `${SITE_URL}/work/${w.slug}`
              }
            }))
          }
        : null
  );

  const mainEntity = $derived(
    service
      ? { '@id': serviceNodeId }
      : work
        ? { '@id': workNodeId }
        : faqs && faqs.length > 0
          ? faqQuestions
          : services && services.length > 0
            ? { '@id': serviceListId }
            : works && works.length > 0
              ? { '@id': workListId }
              : pageType === 'AboutPage'
                ? [{ '@id': founderId }, { '@id': ctoId }]
                : { '@id': orgId }
  );

  const pageAbout = $derived(
    service
      ? { '@id': serviceNodeId }
      : work
        ? { '@id': workNodeId }
        : pageType === 'AboutPage'
          ? [{ '@id': founderId }, { '@id': ctoId }]
          : { '@id': orgId }
  );

  const jsonLd = $derived({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': ['Organization', 'ProfessionalService'],
        '@id': orgId,
        name: 'Tech Pixel A2H',
        url: SITE_URL,
        logo: {
          '@type': 'ImageObject',
          '@id': logoId,
          url: `${SITE_URL}/images/logo.png`,
          width: '360',
          height: '160',
          caption: 'Tech Pixel A2H logo'
        },
        image: { '@id': logoId },
        description: COMPANY_DESCRIPTION,
        slogan: 'Innovate. Develop. Elevate.',
        email: EMAIL,
        telephone: PHONE_DISPLAY,
        address: { '@type': 'PostalAddress', addressCountry: 'IN' },
        areaServed: { '@type': 'Country', name: 'India' },
        founder: { '@id': founderId },
        employee: [{ '@id': ctoId }],
        knowsAbout: KNOWS_ABOUT,
        contactPoint: [
          {
            '@type': 'ContactPoint',
            contactType: 'customer service',
            telephone: PHONE_DISPLAY,
            email: EMAIL,
            areaServed: { '@type': 'Country', name: 'India' },
            availableLanguage: { '@type': 'Language', name: 'English' },
            url: `${SITE_URL}/#contact`
          }
        ],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Tech Pixel A2H services',
          itemListElement: serviceCatalog
        }
      },
      ...people,
      {
        '@type': 'WebSite',
        '@id': siteId,
        name: 'Tech Pixel A2H',
        url: SITE_URL,
        description: COMPANY_DESCRIPTION,
        inLanguage: 'en',
        publisher: { '@id': orgId }
      },
      {
        '@type': pageType,
        '@id': pageId,
        name,
        description,
        url: pageUrl,
        isPartOf: { '@id': siteId },
        inLanguage: 'en',
        publisher: { '@id': orgId },
        about: pageAbout,
        ...(hasBreadcrumb ? { breadcrumb: { '@id': breadcrumbId } } : {}),
        ...(mainEntity ? { mainEntity } : {})
      },
      ...(serviceNode ? [serviceNode] : []),
      ...(workNode ? [workNode] : []),
      ...(itemListNode ? [itemListNode] : []),
      ...(hasBreadcrumb
        ? [
            {
              '@type': 'BreadcrumbList',
              '@id': breadcrumbId,
              itemListElement: trail.map((c, i) => ({
                '@type': 'ListItem',
                position: i + 1,
                name: c.name,
                item: `${SITE_URL}${c.path}`
              }))
            }
          ]
        : [])
    ]
  } as unknown as Graph);

  const payload = $derived(JSON.stringify(jsonLd).replace(/</g, '\\u003c'));
</script>

{@html `<script type="application/ld+json">${payload}</scr` + `ipt>`}
