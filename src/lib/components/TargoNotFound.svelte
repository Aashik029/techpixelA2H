<script lang="ts">
  import { page } from '$app/state';
</script>

<div class="not-found-inner">
  <p class="targo-eyebrow">404</p>
  <h1 class="targo-title">This page <span class="t-accent">wandered off.</span></h1>
  <p class="targo-lead not-found-lead">
    The link you followed does not exist{#if page.status !== 200}
      (error {page.status}){/if}.
    Try the homepage or get in touch — we reply within 24 hours.
  </p>
  <div class="not-found-btns">
    <a class="targo-btn" href="/">Back to home →</a>
    <a class="targo-btn targo-btn-cyan" href="/#contact">Contact us</a>
  </div>
</div>

<style>
  .not-found-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 64px 24px 88px;
  }
  .not-found-lead {
    margin-top: 18px;
    max-width: 560px;
  }
  .not-found-btns {
    display: flex;
    flex-wrap: wrap;
    gap: 14px;
    margin-top: 30px;
  }
  .not-found-btns a {
    text-decoration: none;
  }
</style>
