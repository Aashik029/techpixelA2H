const res = await fetch('http://localhost:4173/about');
const t = await res.text();
console.log('HTTP', res.status, 'len', t.length);
for (const m of ['Ajay A', 'Founder', 'Leadership', 'What we stand for', 'Have a project', 'ajay-ceo.jpg', 'Learn more', '/about']) {
  console.log(JSON.stringify(m), '=>', t.includes(m) ? 'PRESENT' : 'MISSING');
}
// homepage: LEARN MORE + nav About now point to /about
const home = await (await fetch('http://localhost:4173/')).text();
console.log('home LEARN /about =>', home.includes('href="/about">Learn more') ? 'PRESENT' : 'MISSING');
console.log('home nav About /about =>', (home.match(/href="\/about">About/g) || []).length, 'link(s)');
