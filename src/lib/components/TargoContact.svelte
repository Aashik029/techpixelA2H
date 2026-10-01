<script lang="ts">
  import { BASIN_ENDPOINT } from '$lib/content/site';
  import { SERVICES } from '$lib/content/services';

  const WHATSAPP_BASE = 'https://wa.me/919597796186';
  const EMAIL = 'techpixela2h@gmail.com';

  // Service dropdown source (C5): titles come from the C3 services module.
  const services = SERVICES.map((s) => s.title).concat('Not sure yet');

  type Q = {
    id: string;
    label: string;
    type: 'single' | 'multi' | 'text';
    options?: string[];
    placeholder?: string;
    optional?: boolean;
  };

  const followUps: Record<string, Q[]> = {
    'Web Development': [
      {
        id: 'site_type',
        label: 'What kind of website do you need? (pick all that apply)',
        type: 'multi',
        options: ['Business website', 'Portfolio', 'E-commerce store', 'Landing page']
      },
      {
        id: 'pages',
        label: 'Roughly how many pages?',
        type: 'single',
        options: ['1–3 pages', '4–8 pages', '9+ pages', 'Not sure']
      },
      {
        id: 'content',
        label: 'Do you have a logo and content ready?',
        type: 'single',
        options: ['Yes, all ready', 'Partially', 'No — need help']
      }
    ],
    'AI Automation': [
      {
        id: 'tasks',
        label: 'Which tasks should automation handle? (pick all that apply)',
        type: 'multi',
        options: ['Lead follow-up', 'WhatsApp replies', 'Business reports', 'Data entry']
      },
      {
        id: 'tools',
        label: 'Which tools / apps do you use today?',
        type: 'text',
        placeholder: 'e.g. WhatsApp, Excel, Tally…',
        optional: true
      },
      {
        id: 'team',
        label: 'How big is your team?',
        type: 'single',
        options: ['Just me', '2–10 people', '10+ people']
      }
    ],
    'Poster Design': [
      {
        id: 'poster_need',
        label: 'What do you need designed? (pick all that apply)',
        type: 'multi',
        options: ['Festival offers', 'Social creatives', 'Event flyers', 'Brand kit']
      },
      {
        id: 'quantity',
        label: 'Roughly how many designs?',
        type: 'single',
        options: ['1–5', '6–15', '16+', 'Monthly pack']
      },
      {
        id: 'sizes',
        label: 'Which sizes will you need?',
        type: 'single',
        options: ['Social square', 'Story / status', 'Print (A4 / flex)', 'Not sure']
      }
    ],
    'Content Creation': [
      {
        id: 'content_type',
        label: 'What should we create? (pick all that apply)',
        type: 'multi',
        options: ['Product videos', 'Reels / shorts', 'Presentation deck', 'Business profile']
      },
      {
        id: 'platforms',
        label: 'Where will it be used? (pick all that apply)',
        type: 'multi',
        options: ['Instagram', 'YouTube', 'Website', 'WhatsApp']
      },
      {
        id: 'raw',
        label: 'Do you have raw photos or videos we can use?',
        type: 'single',
        options: ['Yes', 'No — shoot/create fresh']
      }
    ],
    'Digital Marketing': [
      {
        id: 'goal',
        label: 'What is the main goal?',
        type: 'single',
        options: ['More enquiries', 'More sales', 'Brand awareness']
      },
      {
        id: 'ads_before',
        label: 'Have you run ads before?',
        type: 'single',
        options: ['Yes', 'No — first time']
      },
      {
        id: 'ad_budget',
        label: 'Monthly ad budget?',
        type: 'single',
        options: ['Under ₹5k', '₹5k–₹15k', '₹15k+', 'Advise me']
      }
    ],
    'Not sure yet': [
      {
        id: 'goal_text',
        label: 'Describe your goal in a few words',
        type: 'text',
        placeholder: 'e.g. I run a textile shop and want more customers from Instagram…'
      }
    ]
  };

  const budgets = [
    '₹5k–₹10k · Starter',
    '₹10k–₹25k · Growth',
    '₹25k–₹50k · Scale',
    '₹50k+ · Enterprise'
  ];

  const timelines = ['Urgent (~1 week)', '2–4 weeks', 'Flexible'];

  const TOTAL = 4;

  let step = $state(1);
  let service = $state('');
  let answers = $state<Record<string, string | string[]>>({});
  let budget = $state('');
  let timeline = $state('');
  let name = $state('');
  let phone = $state('');
  let errors = $state<string[]>([]);
  let sent = $state(false);
  let mailLink = $state('');
  let whatsappLink = $state('');
  let copied = $state(false);
  // C5 hosted capture: honeypot (bots fill it, humans never see it).
  let honeypot = $state('');
  let submitting = $state(false);
  let basinSent = $state(false);
  let basinFailed = $state(false);

  async function copyEmail() {
    copied = false;
    try {
      await navigator.clipboard.writeText(EMAIL);
      copied = true;
    } catch {
      const ta = document.createElement('textarea');
      ta.value = EMAIL;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        copied = true;
      } catch {
        copied = false;
      }
      document.body.removeChild(ta);
    }
  }

  function questions(): Q[] {
    return followUps[service] ?? [];
  }

  function pickService(s: string) {
    if (service !== s) {
      service = s;
      answers = {};
    }
    errors = [];
  }

  function pickSingle(qid: string, opt: string) {
    answers[qid] = opt;
    errors = [];
  }

  function toggleMulti(qid: string, opt: string) {
    const cur = answers[qid];
    const arr = Array.isArray(cur) ? cur : [];
    answers[qid] = arr.includes(opt) ? arr.filter((o) => o !== opt) : [...arr, opt];
    errors = [];
  }

  function validate(s: number): string[] {
    const e: string[] = [];
    if (s === 1 && !service) e.push('Please choose a service to continue.');
    if (s === 2) {
      for (const q of questions()) {
        const v = answers[q.id];
        if (q.type === 'multi' && (!Array.isArray(v) || v.length === 0)) {
          e.push(`Please answer: ${q.label.replace(/ \(pick all that apply\)/i, '')}.`);
        } else if (q.type === 'single' && (typeof v !== 'string' || !v)) {
          e.push(`Please answer: ${q.label}.`);
        } else if (q.type === 'text' && !q.optional && (typeof v !== 'string' || !v.trim())) {
          e.push(`Please answer: ${q.label}.`);
        }
      }
    }
    if (s === 3) {
      if (!budget) e.push('Please choose a budget range.');
      if (!timeline) e.push('Please choose a timeline.');
    }
    if (s === 4) {
      const cleanName = name.trim();
      const digits = phone.replace(/\D/g, '');
      if (!cleanName) e.push('Please enter your name.');
      if (!digits || digits.length < 10)
        e.push('Please enter a valid phone number (at least 10 digits).');
    }
    return e;
  }

  function composeMessage(): { subject: string; body: string } {
    const lines = [
      `Name: ${name.trim()}`,
      `Phone: ${phone.trim()}`,
      `Service: ${service}`
    ];
    for (const q of questions()) {
      const v = answers[q.id];
      const shown = Array.isArray(v) ? v.join(', ') : (v ?? '').toString().trim() || '—';
      lines.push(`${q.label}: ${shown}`);
    }
    lines.push(`Budget: ${budget}`, `Timeline: ${timeline}`);
    return {
      subject: `Project enquiry from ${name.trim()} — ${service}`,
      body: lines.join('\n')
    };
  }

  async function next() {
    const e = validate(step);
    errors = e;
    if (e.length) return;
    if (step < TOTAL) {
      step += 1;
      errors = [];
    } else {
      const { subject, body } = composeMessage();
      mailLink = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      whatsappLink = `${WHATSAPP_BASE}?text=${encodeURIComponent(`Hi Tech Pixel A2H! ${subject}\n${body}`)}`;
      basinSent = false;
      basinFailed = false;
      if (honeypot.trim()) {
        // Bot trap triggered: pretend success without sending anything.
        sent = true;
        return;
      }
      submitting = true;
      try {
        const res = await fetch(BASIN_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim(),
            service,
            answers,
            budget,
            timeline,
            subject,
            message: body
          })
        });
        if (!res.ok) throw new Error(`Basin responded ${res.status}`);
        basinSent = true;
      } catch {
        // Hosted capture failed: fall back to the mailto/WhatsApp path below
        // with the composed message intact.
        basinFailed = true;
      } finally {
        submitting = false;
      }
      sent = true;
    }
  }

  function back() {
    if (step > 1) {
      step -= 1;
      errors = [];
    }
  }

  function startOver() {
    step = 1;
    sent = false;
    errors = [];
    service = '';
    answers = {};
    budget = '';
    timeline = '';
    name = '';
    phone = '';
    mailLink = '';
    whatsappLink = '';
    honeypot = '';
    submitting = false;
    basinSent = false;
    basinFailed = false;
  }
</script>

<section id="contact" class="targo-band px-6 py-24 md:py-32" aria-label="Start a project">
  <div class="mx-auto max-w-6xl">
    <p class="targo-eyebrow">Start a project</p>
    <h2 class="targo-title mt-4">
      Let's<br /><span class="t-accent">Talk</span>
    </h2>
    <p class="targo-lead mt-6 max-w-2xl">
      Tell us about your project — we'll reply within 24 hours with next steps.
    </p>

    <div class="mt-12 grid gap-5 lg:grid-cols-5">
      <!-- form card -->
      <div class="targo-card p-8 md:p-10 lg:col-span-3">
        {#if !sent}
          <!-- progress -->
          <div class="mb-7">
            <div class="flex items-center justify-between">
              <span class="targo-quant text-[11px] font-bold uppercase tracking-[0.22em] text-[#3d4653]">
                Step {step} of {TOTAL}
              </span>
              <span class="targo-quant text-[11px] font-bold uppercase tracking-[0.22em] text-[#0a6f8c]">
                {Math.round((step / TOTAL) * 100)}%
              </span>
            </div>
            <div
              class="mt-2.5 h-1.5 overflow-hidden bg-[#12212e]/10"
              role="progressbar"
              aria-valuenow={step}
              aria-valuemin={1}
              aria-valuemax={TOTAL}
              aria-label="Questionnaire progress"
            >
              <div
                class="h-full bg-[#15bcdf] transition-all duration-300"
                style="width: {(step / TOTAL) * 100}%"
              ></div>
            </div>
          </div>

          {#if errors.length}
            <div
              class="mb-6 border border-red-400/50 bg-red-50 px-4 py-3"
              role="alert"
              aria-live="assertive"
            >
              {#each errors as err (err)}
                <p class="targo-quant text-[13px] font-bold text-red-600">• {err}</p>
              {/each}
            </div>
          {/if}

          <!-- STEP 1: service -->
          {#if step === 1}
            <div>
              <span class="targo-field-label" id="tc-svc-label">What do you need? *</span>
              <div class="grid gap-2.5 sm:grid-cols-2" role="group" aria-labelledby="tc-svc-label">
                {#each services as s (s)}
                  <button
                    type="button"
                    onclick={() => pickService(s)}
                    aria-pressed={service === s}
                    class="targo-quant flex min-h-[52px] items-center gap-2.5 px-4 py-3 text-left text-[13px] font-bold uppercase tracking-[0.06em] transition-all {service === s
                      ? 'bg-[#12212e] text-white'
                      : 'bg-[#f2f1f0] text-[#3d4653] hover:bg-[#15bcdf]/15 hover:text-[#12212e]'}"
                  >
                    <span
                      class="flex h-5 w-5 shrink-0 items-center justify-center text-[11px] {service === s
                        ? 'bg-[#15bcdf] text-white'
                        : 'bg-[#12212e]/10'}"
                      aria-hidden="true"
                    >
                      {#if service === s}✓{/if}
                    </span>
                    {s}
                  </button>
                {/each}
              </div>
              <div class="mt-5">
                <label for="tc-service-select" class="targo-field-label">Or pick from the list</label>
                <select
                  id="tc-service-select"
                  data-testid="tc-service-select"
                  class="targo-field"
                  value={service}
                  onchange={(e) => pickService((e.target as HTMLSelectElement).value)}
                >
                  <option value="" disabled>Select a service…</option>
                  {#each services as s (s)}
                    <option value={s}>{s}</option>
                  {/each}
                </select>
              </div>
            </div>
          {/if}

          <!-- STEP 2: service-specific questions -->
          {#if step === 2}
            <div class="grid gap-6">
              <p class="targo-quant text-[11px] font-bold uppercase tracking-[0.22em] text-[#0a6f8c]">
                {service} — a few quick questions
              </p>
              {#each questions() as q (q.id)}
                <div>
                  <span class="targo-field-label" id="tc-q-{q.id}">
                    {q.label}{#if q.type === 'text' && q.optional}
                      <span class="font-normal normal-case tracking-normal text-[#3d4653]"> (optional)</span>
                    {/if}
                  </span>
                  {#if q.type === 'text'}
                    <textarea
                      id="tc-q-{q.id}"
                      class="targo-field min-h-[110px] resize-y"
                      value={typeof answers[q.id] === 'string' ? answers[q.id] : ''}
                      oninput={(e) => {
                        answers[q.id] = (e.target as HTMLTextAreaElement).value;
                        errors = [];
                      }}
                      placeholder={q.placeholder ?? ''}
                      aria-labelledby="tc-q-{q.id}"
                    ></textarea>
                  {:else}
                    <div class="flex flex-wrap gap-2.5" role="group" aria-labelledby="tc-q-{q.id}">
                      {#each q.options ?? [] as opt (opt)}
                        {@const selected =
                          q.type === 'multi'
                            ? Array.isArray(answers[q.id]) && (answers[q.id] as string[]).includes(opt)
                            : answers[q.id] === opt}
                        <button
                          type="button"
                          onclick={() =>
                            q.type === 'multi' ? toggleMulti(q.id, opt) : pickSingle(q.id, opt)}
                          aria-pressed={selected}
                          class="targo-quant flex min-h-[44px] items-center gap-2 px-4 py-2.5 text-left text-[12px] font-bold uppercase tracking-[0.06em] transition-all {selected
                            ? 'bg-[#12212e] text-white'
                            : 'bg-[#f2f1f0] text-[#3d4653] hover:bg-[#15bcdf]/15 hover:text-[#12212e]'}"
                        >
                          <span
                            class="flex h-4 w-4 shrink-0 items-center justify-center text-[10px] {selected
                              ? 'bg-[#15bcdf] text-white'
                              : 'bg-[#12212e]/10'}"
                            aria-hidden="true"
                          >
                            {#if selected}✓{/if}
                          </span>
                          {opt}
                        </button>
                      {/each}
                    </div>
                  {/if}
                </div>
              {/each}
            </div>
          {/if}

          <!-- STEP 3: budget + timeline -->
          {#if step === 3}
            <div class="grid gap-6">
              <div>
                <span class="targo-field-label" id="tc-budget-label">Budget range *</span>
                <div class="grid gap-2.5 sm:grid-cols-2" role="group" aria-labelledby="tc-budget-label">
                  {#each budgets as b (b)}
                    <button
                      type="button"
                      onclick={() => {
                        budget = b;
                        errors = [];
                      }}
                      aria-pressed={budget === b}
                      class="targo-quant flex min-h-[52px] items-center gap-2.5 px-4 py-3 text-left text-[13px] font-bold uppercase tracking-[0.06em] transition-all {budget === b
                        ? 'bg-[#12212e] text-white'
                        : 'bg-[#f2f1f0] text-[#3d4653] hover:bg-[#15bcdf]/15 hover:text-[#12212e]'}"
                    >
                      <span
                        class="flex h-5 w-5 shrink-0 items-center justify-center text-[11px] {budget === b
                          ? 'bg-[#15bcdf] text-white'
                          : 'bg-[#12212e]/10'}"
                        aria-hidden="true"
                      >
                        {#if budget === b}✓{/if}
                      </span>
                      {b}
                    </button>
                  {/each}
                </div>
              </div>
              <div>
                <span class="targo-field-label" id="tc-timeline-label">Timeline *</span>
                <div class="flex flex-wrap gap-2.5" role="group" aria-labelledby="tc-timeline-label">
                  {#each timelines as t (t)}
                    <button
                      type="button"
                      onclick={() => {
                        timeline = t;
                        errors = [];
                      }}
                      aria-pressed={timeline === t}
                      class="targo-quant flex min-h-[44px] items-center gap-2 px-4 py-2.5 text-left text-[12px] font-bold uppercase tracking-[0.06em] transition-all {timeline === t
                        ? 'bg-[#12212e] text-white'
                        : 'bg-[#f2f1f0] text-[#3d4653] hover:bg-[#15bcdf]/15 hover:text-[#12212e]'}"
                    >
                      <span
                        class="flex h-4 w-4 shrink-0 items-center justify-center text-[10px] {timeline === t
                          ? 'bg-[#15bcdf] text-white'
                          : 'bg-[#12212e]/10'}"
                        aria-hidden="true"
                      >
                        {#if timeline === t}✓{/if}
                      </span>
                      {t}
                    </button>
                  {/each}
                </div>
              </div>
            </div>
          {/if}

          <!-- STEP 4: details -->
          {#if step === 4}
            <div class="grid gap-5 sm:grid-cols-2">
              <div>
                <label for="tc-name" class="targo-field-label">Your name *</label>
                <input
                  id="tc-name"
                  type="text"
                  class="targo-field"
                  bind:value={name}
                  placeholder="e.g. Priya Sharma"
                  autocomplete="name"
                  required
                  minlength={2}
                  maxlength={80}
                  oninput={() => {
                    errors = [];
                  }}
                />
              </div>
              <div>
                <label for="tc-phone" class="targo-field-label">Phone *</label>
                <input
                  id="tc-phone"
                  type="tel"
                  class="targo-field"
                  bind:value={phone}
                  placeholder="+91 …"
                  autocomplete="tel"
                  required
                  inputmode="tel"
                  pattern={'[+0-9()\\s-]{10,18}'}
                  minlength={10}
                  maxlength={18}
                  title="Enter at least 10 digits"
                  oninput={() => {
                    errors = [];
                  }}
                />
              </div>
            </div>
            <p class="targo-lead mt-5 text-[14px]">
              {service} · {budget} · {timeline} — tap Continue and we'll send your brief
              online, or by email if that fails.
            </p>
            <div class="mt-4" aria-hidden="true" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;">
              <label for="tc-website" tabindex="-1">Website (leave blank)</label>
              <input
                id="tc-website"
                data-testid="tc-honeypot"
                type="text"
                name="company_website"
                bind:value={honeypot}
                tabindex="-1"
                autocomplete="off"
              />
            </div>
          {/if}

          <!-- nav -->
          <div class="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
            {#if step > 1}
              <button
                type="button"
                onclick={back}
                class="targo-quant min-h-[44px] text-[12px] font-bold uppercase tracking-[0.16em] text-[#3d4653] underline underline-offset-4 hover:text-[#15bcdf]"
              >
                ← Back
              </button>
            {:else}
              <span></span>
            {/if}
            <button
              type="button"
              onclick={next}
              class="targo-btn"
              disabled={submitting}
              data-testid="tc-continue"
            >
              {submitting ? 'Sending…' : step === TOTAL ? 'Continue' : 'Next'} <span aria-hidden="true">→</span>
            </button>
          </div>
        {:else}
          <div class="py-6 text-center" role="status" data-testid="tc-success">
            <p class="targo-num text-[20px]">✓</p>
            <h3 class="targo-quant mt-4 text-[26px] font-bold uppercase text-[#12212e]">
              Thanks — request received
            </h3>
            {#if basinSent}
              <p class="targo-lead mx-auto mt-3 max-w-md text-[15px]" data-testid="tc-submit-status">
                We've received your brief{name.trim() ? `, ${name.trim()}` : ''} — we'll reply
                within 24 hours. A copy of your details is below if you'd like to email us too.
              </p>
            {:else}
              <p class="targo-lead mx-auto mt-3 max-w-md text-[15px]" data-testid="tc-submit-status">
                Our online form didn't go through — tap below to send your details to us by
                email{ name.trim() ? `, ${name.trim()}` : '' } instead. We'll reply within
                24 hours.
              </p>
            {/if}
            <div data-testid="tc-fallback">
              <a href={mailLink} class="targo-btn targo-btn-cyan mt-7" data-testid="tc-send-email">
                Send via Email <span aria-hidden="true">→</span>
              </a>
              <div>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener"
                  class="targo-quant mt-4 inline-block min-h-[44px] text-[12px] font-bold uppercase tracking-[0.16em] text-[#3d4653] underline underline-offset-4 hover:text-[#15bcdf]"
                  data-testid="tc-whatsapp-fallback"
                >
                  Or send via WhatsApp →
                </a>
              </div>
            </div>
            <p class="targo-quant mx-auto mt-5 max-w-md text-[12px] font-bold uppercase tracking-[0.08em] text-[#3d4653]/70">
              If your mail app didn't open, copy our email instead:
            </p>
            <div class="mx-auto mt-2 flex max-w-md flex-col items-center gap-2">
              <button
                type="button"
                onclick={copyEmail}
                class="targo-quant min-h-[44px] border border-[#12212e]/15 bg-[#f2f1f0] px-4 py-2.5 text-[13px] font-bold tracking-[0.04em] text-[#12212e] transition-colors hover:bg-[#15bcdf]/15"
                aria-live="polite"
              >
                {copied ? '✓ Copied!' : `Copy ${EMAIL}`}
              </button>
              {#if copied}
                <p class="targo-quant text-[12px] font-bold text-[#0a6f8c]" role="status">
                  Email copied — paste it into your mail app.
                </p>
              {/if}
            </div>
            <div>
              <button
                type="button"
                onclick={startOver}
                class="targo-quant mt-5 text-[12px] font-bold uppercase tracking-[0.16em] text-[#3d4653] underline underline-offset-4 hover:text-[#15bcdf]"
              >
                Start over
              </button>
            </div>
          </div>
        {/if}
      </div>

      <!-- direct contact card -->
      <div
        class="targo-card flex flex-col justify-between bg-white p-8 md:p-10 lg:col-span-2"
      >
        <div>
          <p class="targo-eyebrow">Prefer to reach out directly?</p>
          <ul class="mt-7 space-y-5">
            <li>
              <p class="targo-quant text-[11px] font-bold uppercase tracking-[0.22em] text-[#3d4653]">Phone</p>
              <a href="tel:+919597796186" class="targo-quant mt-1 block text-[20px] font-bold text-[#12212e] transition-colors hover:text-[#15bcdf]">
                +91 95977 96186
              </a>
            </li>
            <li>
              <p class="targo-quant text-[11px] font-bold uppercase tracking-[0.22em] text-[#3d4653]">Email</p>
              <a href="mailto:techpixela2h@gmail.com" class="targo-quant mt-1 block break-all text-[18px] font-bold text-[#12212e] transition-colors hover:text-[#15bcdf]">
                techpixela2h@gmail.com
              </a>
            </li>
            <li>
              <p class="targo-quant text-[11px] font-bold uppercase tracking-[0.22em] text-[#3d4653]">Location</p>
              <p class="targo-quant mt-1 text-[18px] font-bold text-[#12212e]">India</p>
            </li>
          </ul>
        </div>
        <a
          href="{WHATSAPP_BASE}?text={encodeURIComponent('Hi Tech Pixel A2H! I have a project in mind.')}"
          target="_blank"
          rel="noopener"
          class="targo-btn targo-btn-cyan mt-9"
        >
          Chat on WhatsApp <span aria-hidden="true">→</span>
        </a>
      </div>
    </div>
  </div>
</section>
