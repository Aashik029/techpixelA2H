<script lang="ts">
  import '../lib/targo.css';
  import TargoNav from '$lib/components/TargoNav.svelte';
  import TargoHero from '$lib/components/TargoHero.svelte';
  import TargoAbout from '$lib/components/TargoAbout.svelte';
  import TargoServices from '$lib/components/TargoServices.svelte';
  import TargoWork from '$lib/components/TargoWork.svelte';
  import TargoProcess from '$lib/components/TargoProcess.svelte';
  import TargoAnswers from '$lib/components/TargoAnswers.svelte';
  import TargoContact from '$lib/components/TargoContact.svelte';
  import JsonLd from '$lib/components/JsonLd.svelte';
</script>

<svelte:head>
  <title>Tech Pixel A2H — Web Development & AI Automation in Trichy</title>
  <meta
    name="description"
    content="Tech Pixel A2H is a web development and AI automation company based in Trichy, Tamil Nadu. We build websites, automate workflows, design content and run marketing for growing businesses across India."
  />
  <link rel="canonical" href="https://tech-pixel-a2h.vercel.app/" />
  <meta name="robots" content="index, follow" />
  <meta name="theme-color" content="#12212e" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Tech Pixel A2H" />
  <meta property="og:title" content="Tech Pixel A2H — Web Development & AI Automation in Trichy" />
  <meta
    property="og:description"
    content="Tech Pixel A2H is a web development and AI automation company based in Trichy, Tamil Nadu. We build websites, automate workflows, design content and run marketing for growing businesses across India."
  />
  <meta property="og:url" content="https://tech-pixel-a2h.vercel.app/" />
  <meta property="og:image" content="https://tech-pixel-a2h.vercel.app/og/home.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Tech Pixel A2H — Web Development & AI Automation in Trichy" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Tech Pixel A2H — Web Development & AI Automation in Trichy" />
  <meta
    name="twitter:description"
    content="Tech Pixel A2H is a web development and AI automation company based in Trichy, Tamil Nadu. We build websites, automate workflows, design content and run marketing for growing businesses across India."
  />
  <meta name="twitter:image" content="https://tech-pixel-a2h.vercel.app/og/home.png" />
  <!-- LCP: hero paints its poster first; preload it so the first paint never waits on the 3MB mp4 -->
  <link rel="preload" as="image" fetchpriority="high" href="/videos/hero-poster.jpg" />
</svelte:head>

<JsonLd
  name="Tech Pixel A2H — Web Development & AI Automation in Trichy"
  description="Tech Pixel A2H is a web development and AI automation company based in Trichy, Tamil Nadu. We build websites, automate workflows, design content and run marketing for growing businesses across India."
  path="/"
/>

<TargoNav active="home" />
<main id="main" tabindex="-1">
  <TargoHero />
  <TargoAbout />
  <TargoServices />
  <TargoWork />
  <TargoProcess />
  <TargoAnswers />
  <TargoContact />
</main>
