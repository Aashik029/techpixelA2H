<script lang="ts">
  import type { Graph } from 'schema-dts';
  import { EMAIL, PHONE_DISPLAY, SITE_URL } from '$lib/content/site';
  import { SERVICES } from '$lib/content/services';

  interface Crumb {
    name: string;
    path: string;
  }

  let {
    name,
    description,
    path,
    crumbs = []
  }: { name: string; description: string; path: string; crumbs?: Crumb[] } = $props();

  const pageUrl = $derived(`${SITE_URL}${path}`);
  const orgId = `${SITE_URL}#org`;
  const siteId = `${SITE_URL}#site`;
  const pageId = $derived(`${pageUrl}#page`);
  const breadcrumbId = $derived(`${pageUrl}#breadcrumb`);

  const trail = $derived<Crumb[]>([{ name: 'Home', path: '/' }, ...crumbs]);

  const jsonLd = $derived<Graph>({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: 'Tech Pixel A2H',
        url: SITE_URL,
        logo: `${SITE_URL}/images/logo.png`,
        email: EMAIL,
        telephone: PHONE_DISPLAY,
        address: { '@type': 'PostalAddress', addressCountry: 'IN' }
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${SITE_URL}#service`,
        name: 'Tech Pixel A2H',
        url: SITE_URL,
        telephone: PHONE_DISPLAY,
        email: EMAIL,
        areaServed: { '@type': 'Country', name: 'India' },
        address: { '@type': 'PostalAddress', addressCountry: 'IN' },
        parentOrganization: { '@id': orgId },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Tech Pixel A2H services',
          itemListElement: SERVICES.map((s) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: s.title,
              description: s.description,
              url: `${SITE_URL}/services/${s.slug}`,
              provider: { '@id': orgId }
            }
          }))
        }
      },
      {
        '@type': 'WebSite',
        '@id': siteId,
        name: 'Tech Pixel A2H',
        url: SITE_URL,
        publisher: { '@id': orgId }
      },
      {
        '@type': 'WebPage',
        '@id': pageId,
        name,
        description,
        url: pageUrl,
        isPartOf: { '@id': siteId },
        breadcrumb: { '@id': breadcrumbId }
      },
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
  });

  const payload = $derived(JSON.stringify(jsonLd).replace(/</g, '\\u003c'));
</script>

{@html `<script type="application/ld+json">${payload}</scr` + `ipt>`}
