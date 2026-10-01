<script lang="ts">
  import TargoNav from '$lib/components/TargoNav.svelte';
  import JsonLd from '$lib/components/JsonLd.svelte';
</script>

<svelte:head>
  <title>Terms of Service — Tech Pixel A2H</title>
  <meta
    name="description"
    content="The terms governing Tech Pixel A2H's web development, automation, design, content and marketing services."
  />
  <link rel="canonical" href="https://techpixela2h.com/terms" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#12212e" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Tech Pixel A2H" />
  <meta property="og:title" content="Terms of Service — Tech Pixel A2H" />
  <meta
    property="og:description"
    content="The terms governing Tech Pixel A2H's web development, automation, design, content and marketing services."
  />
  <meta property="og:url" content="https://techpixela2h.com/terms" />
  <meta property="og:image" content="https://techpixela2h.com/og/terms.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Terms of Service — Tech Pixel A2H" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Terms of Service — Tech Pixel A2H" />
  <meta
    name="twitter:description"
    content="The terms governing Tech Pixel A2H's web development, automation, design, content and marketing services."
  />
  <meta name="twitter:image" content="https://techpixela2h.com/og/terms.png" />
</svelte:head>

<JsonLd
  name="Terms of Service — Tech Pixel A2H"
  description="The terms governing Tech Pixel A2H's web development, automation, design, content and marketing services."
  path="/terms"
  crumbs={[{ name: 'Terms of Service', path: '/terms' }]}
/>

<TargoNav active="terms" />

<main id="main" tabindex="-1">
  <section class="targo-band-white px-6 py-24 md:py-32" aria-label="Terms of service">
    <div class="mx-auto max-w-6xl">
      <p class="targo-eyebrow">Legal</p>
      <h1 class="targo-title mt-4">Terms of<br /><span class="t-accent">Service</span></h1>
      <p class="targo-lead mt-6 max-w-2xl">
        Last updated: 29 September 2026. These terms govern quotations, delivery
        and use of services provided by Tech Pixel A2H, India.
      </p>

      <div class="targo-card mt-12 p-8 md:p-12">
        <div class="targo-prose max-w-none">
          <h2>1. Services</h2>
          <p>
            We provide web development, AI automation, poster design, content
            creation and digital marketing services. The exact scope, deliverables
            and timeline for each engagement are set out in the written
            quotation or proposal accepted by you — that document prevails over
            any general description on this website.
          </p>
          <h2>2. Quotations &amp; payments</h2>
          <p>
            Quotes are valid for {'{{PLACEHOLDER_QUOTE_VALIDITY_DAYS}}'} days unless
            stated otherwise. Payment schedule, accepted modes (UPI / bank
            transfer / {'{{PLACEHOLDER_PAYMENT_MODES}}'}) and tax treatment (GST
            charged at {'{{PLACEHOLDER_GST_TREATMENT}}'}) are specified in each
            quotation. Late payments may attract interest of
            {'{{PLACEHOLDER_LATE_FEE_TERMS}}'}. GSTIN: {'{{PLACEHOLDER_GSTIN}}'}.
          </p>
          <h2>3. Client responsibilities</h2>
          <p>
            You agree to provide timely content, credentials, feedback and
            approvals reasonably needed for delivery. Delays in client inputs
            extend timelines correspondingly. You confirm you own (or are
            licensed to use) all materials you supply, including text, images,
            trademarks and data.
          </p>
          <h2>4. Intellectual property</h2>
          <p>
            On full payment, ownership of final client-specific deliverables
            transfers to you, except for our pre-existing tools, libraries,
            templates and know-how, which remain ours under a perpetual licence
            for use within the delivered work. We may showcase anonymised or
            non-confidential work in our portfolio unless you opt out in writing.
          </p>
          <h2>5. Warranties &amp; acceptance</h2>
          <p>
            We warrant services will be performed with reasonable professional
            skill and care. Please report defects within
            {'{{PLACEHOLDER_DEFECT_REPORT_DAYS}}'} days of delivery and we will
            remedy covered defects free of charge. Third-party platforms, ad
            accounts, app stores and search rankings are outside our control and
            carry no guarantee.
          </p>
          <h2>6. Limitation of liability</h2>
          <p>
            To the maximum extent permitted by Indian law, our aggregate liability
            for any engagement is limited to the fees paid for that engagement.
            We are not liable for indirect, incidental or consequential losses,
            including loss of profit, revenue or data.
          </p>
          <h2>7. Termination</h2>
          <p>
            Either party may terminate with {'{{PLACEHOLDER_TERMINATION_NOTICE}}'}
            written notice. Work completed up to termination, plus committed
            third-party costs, remains payable. Sections 4, 6 and 8 survive
            termination.
          </p>
          <h2>8. Governing law &amp; jurisdiction</h2>
          <p>
            These terms are governed by the laws of India. Disputes are subject
            to the exclusive jurisdiction of the courts at
            {'{{PLACEHOLDER_JURISDICTION_CITY}}'}, India. Nothing here limits your
            statutory rights, including under the Digital Personal Data
            Protection Act, 2023 and the Consumer Protection Act, 2019.
          </p>
          <h2>9. Contact</h2>
          <p>
            Tech Pixel A2H, {'{{PLACEHOLDER_REGISTERED_ADDRESS}}'}.
            {'{{PLACEHOLDER_BUSINESS_EMAIL}}'}, {'{{PLACEHOLDER_BUSINESS_PHONE}}'}.
            CIN: {'{{PLACEHOLDER_CIN}}'}.
          </p>
        </div>
      </div>
    </div>
  </section>
</main>
