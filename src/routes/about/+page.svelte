<script lang="ts">
  import '$lib/targo.css';
  import TargoNav from '$lib/components/TargoNav.svelte';
  import JsonLd from '$lib/components/JsonLd.svelte';

  const stats = [
    { value: '25+', label: 'Projects delivered' },
    { value: '15+', label: 'Happy clients' },
    { value: '5', label: 'Core services' },
    { value: '100%', label: 'Support after launch' }
  ];

  const values = [
    {
      n: '01',
      t: 'Problem-first thinking',
      d: 'We start with your business problem, not with technology. Every solution is designed around what you actually need.'
    },
    {
      n: '02',
      t: 'Fast, focused delivery',
      d: 'Small team, no bureaucracy. Websites in 2–3 weeks, automation set up in days, designs turned around fast.'
    },
    {
      n: '03',
      t: 'Support that stays',
      d: 'We don’t disappear after delivery. Training, documentation, and ongoing support come standard with every project.'
    }
  ];
</script>

<svelte:head>
  <title>About Us — Tech Pixel A2H</title>
  <meta name="description" content="Meet Tech Pixel A2H — a focused team building websites, AI automation, design and marketing for growing businesses. Led by founder & CEO Ajay A." />
  <link rel="canonical" href="https://tech-pixel-a2h.vercel.app/about" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#12212e" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Tech Pixel A2H" />
  <meta property="og:title" content="About Us — Tech Pixel A2H" />
  <meta property="og:description" content="Meet Tech Pixel A2H — a focused team building websites, AI automation, design and marketing for growing businesses. Led by founder & CEO Ajay A." />
  <meta property="og:url" content="https://tech-pixel-a2h.vercel.app/about" />
  <meta property="og:image" content="https://tech-pixel-a2h.vercel.app/og/about.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="About Tech Pixel A2H — the team behind the work" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="About Us — Tech Pixel A2H" />
  <meta name="twitter:description" content="Meet Tech Pixel A2H — a focused team building websites, AI automation, design and marketing for growing businesses. Led by founder & CEO Ajay A." />
  <meta name="twitter:image" content="https://tech-pixel-a2h.vercel.app/og/about.png" />
</svelte:head>

<JsonLd
  name="About Us — Tech Pixel A2H"
  description="Meet Tech Pixel A2H — a focused team building websites, AI automation, design and marketing for growing businesses. Led by founder & CEO Ajay A."
  path="/about"
  crumbs={[{ name: 'About', path: '/about' }]}
/>

<div class="about-page">
  <TargoNav active="about" />

  <main id="main" tabindex="-1">
  <!-- STORY -->
  <section class="targo-band about-hero" aria-label="Our story">
    <div class="about-inner">
      <p class="targo-eyebrow">About us</p>
      <h1 class="targo-title">The team<br />behind <span class="t-accent">the work.</span></h1>
      <p class="targo-lead about-story">
        Tech Pixel A2H started with a simple observation: small businesses don’t need bigger
        agencies — they need someone who listens, builds fast, and stays around after launch.
        We handle design, development, automation, and marketing under one roof, so you never
        have to coordinate between five different freelancers again. No jargon. No
        over-promising. Just work that makes a difference.
      </p>
      <div class="about-stats">
        {#each stats as s (s.label)}
          <div class="targo-card about-stat">
            <p class="targo-num about-stat-num">{s.value}</p>
            <p class="about-stat-label">{s.label}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- LEADERSHIP -->
  <section class="targo-band-white about-section" aria-label="Leadership">
    <div class="about-inner">
      <p class="targo-eyebrow">Leadership</p>
      <h2 class="targo-title about-h2">Led by people<br />who <span class="t-accent">build.</span></h2>
      <div class="about-leaders">
        <article class="targo-card leader-card">
          <div class="leader-photo leader-photo-empty" aria-hidden="true">
            <span>A</span>
          </div>
          <p class="targo-num leader-role">Founder &amp; CEO</p>
          <h3 class="leader-name">Ajay A</h3>
          <p class="leader-bio">
            Ajay founded Tech Pixel A2H to give small businesses enterprise-grade digital
            work without the agency overhead. He leads strategy and client relationships —
            every project ships only when it solves the client’s real problem.
          </p>
        </article>
        <article class="targo-card leader-card">
          <div class="leader-photo leader-photo-empty" aria-hidden="true">
            <span>H</span>
          </div>
          <p class="targo-num leader-role">CTO</p>
          <h3 class="leader-name">Hanush S</h3>
          <p class="leader-bio">
            Hanush leads technology at Tech Pixel A2H — architecture, engineering quality
            and delivery. He turns client goals into fast, reliable systems that scale.
          </p>
        </article>
      </div>
    </div>
  </section>

  <!-- VALUES -->
  <section class="targo-band about-section" aria-label="Our values">
    <div class="about-inner">
      <p class="targo-eyebrow">What we stand for</p>
      <h2 class="targo-title about-h2">How we <span class="t-accent">work.</span></h2>
      <div class="about-values">
        {#each values as v (v.n)}
          <div class="targo-card value-card">
            <p class="targo-num value-num">{v.n}</p>
            <h3 class="value-name">{v.t}</h3>
            <p class="value-desc">{v.d}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="targo-band-white about-section about-cta" aria-label="Work with us">
    <div class="about-inner about-cta-inner">
      <h2 class="targo-title about-h2">Have a project<br />in <span class="t-accent">mind?</span></h2>
      <p class="targo-lead">Tell us about it — we’ll reply within 24 hours with next steps.</p>
      <div class="about-cta-btns">
        <a class="targo-btn" href="/#contact">Start a Project →</a>
        <a
          class="targo-btn targo-btn-cyan"
          href="https://wa.me/919597796186?text=Hi%20Tech%20Pixel%20A2H!%20I%20have%20a%20project%20in%20mind."
          target="_blank"
          rel="noopener"
        >Talk on WhatsApp</a>
      </div>
    </div>
  </section>
  </main>
</div>

<style>
  .about-page {
    background: #f2f1f0;
    overflow-x: clip;
  }
  .about-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 64px 24px 88px;
  }
  .about-hero .about-inner {
    padding-top: 56px;
  }
  .about-section {
    border-top: 1px solid rgba(18, 33, 46, 0.08);
  }
  .about-hero h1,
  .about-h2 {
    margin: 18px 0 0;
  }
  .about-h2 {
    font-size: clamp(34px, 5vw, 64px);
  }
  .about-story {
    max-width: 820px;
    margin-top: 26px;
  }
  .about-stats {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-top: 44px;
  }
  .about-stat {
    padding: 26px 22px;
  }
  .about-stat-num {
    font-size: clamp(30px, 3.4vw, 44px);
    line-height: 1;
  }
  .about-stat-label {
    font-family: 'Quantico', sans-serif;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #3d4653;
    margin-top: 10px;
  }
  .about-leaders {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 44px;
  }
  .about-leaders-single {
    grid-template-columns: minmax(0, 560px);
    justify-content: start;
  }
  .leader-card {
    padding: 34px 30px;
  }
  .leader-photo {
    width: 148px;
    height: 148px;
    overflow: hidden;
    clip-path: polygon(18px 0, 100% 0, 100% calc(100% - 18px), calc(100% - 18px) 100%, 0 100%, 0 18px);
    background: #f2f1f0;
  }
  .leader-photo img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
  .leader-photo-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px dashed rgba(21, 188, 223, 0.5);
  }
  .leader-photo-empty span {
    font-family: 'Quantico', sans-serif;
    font-size: 56px;
    font-weight: 700;
    color: #15bcdf;
  }
  .leader-role {
    font-size: 13px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-top: 22px;
  }
  .leader-name {
    font-family: 'Quantico', sans-serif;
    font-size: clamp(26px, 3vw, 34px);
    font-weight: 700;
    color: #12212e;
    text-transform: uppercase;
    margin-top: 6px;
  }
  .leader-bio {
    font-family: 'Quantico', sans-serif;
    font-size: 15px;
    line-height: 1.75;
    color: #3d4653;
    margin-top: 12px;
  }
  .about-values {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 44px;
  }
  .value-card {
    padding: 32px 28px;
  }
  .value-num {
    font-size: 15px;
    letter-spacing: 0.1em;
  }
  .value-name {
    font-family: 'Quantico', sans-serif;
    font-size: 21px;
    font-weight: 700;
    color: #12212e;
    margin-top: 12px;
  }
  .value-desc {
    font-family: 'Quantico', sans-serif;
    font-size: 14px;
    line-height: 1.7;
    color: #3d4653;
    margin-top: 10px;
  }
  .about-cta-inner {
    text-align: left;
  }
  .about-cta-inner .targo-lead {
    margin-top: 18px;
    max-width: 560px;
  }
  .about-cta-btns {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 30px;
  }
  .about-cta-btns a {
    text-decoration: none;
  }
  @media (max-width: 860px) {
    .about-stats {
      grid-template-columns: repeat(2, 1fr);
    }
    .about-leaders {
      grid-template-columns: 1fr;
    }
    .about-values {
      grid-template-columns: 1fr;
    }
  }
</style>
