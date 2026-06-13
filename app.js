// ===== Lead Capture & Scoring Tool =====
const KEY = 'sa_leads_v1';
let leads = JSON.parse(localStorage.getItem(KEY) || '[]');

const $ = (s) => document.querySelector(s);
const form = $('#leadForm');
const listEl = $('#leadList');
const emptyEl = $('#empty');
const searchEl = $('#search');
const filterEl = $('#filter');
const sortEl = $('#sort');

// ----- Theme -----
const root = document.documentElement;
const tt = $('#themeToggle');
if (localStorage.getItem('theme')) root.setAttribute('data-theme', localStorage.getItem('theme'));
const icon = () => tt.innerHTML = root.getAttribute('data-theme') === 'light' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
icon();
tt.onclick = () => { const n = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'; root.setAttribute('data-theme', n); localStorage.setItem('theme', n); icon(); };

// ----- Scoring engine -----
function scoreLead(l){
  let s = 0;
  const title = (l.title || '').toLowerCase();
  if (/(chief|ceo|cto|cfo|cmo|founder|owner|president|vp|head)/.test(title)) s += 35;
  else if (/(director|manager|lead)/.test(title)) s += 22;
  else if (title) s += 10;
  const b = Number(l.budget) || 0;
  if (b >= 20000) s += 30; else if (b >= 10000) s += 22; else if (b >= 5000) s += 15; else if (b >= 1000) s += 8;
  const src = { 'Referral': 20, 'Event': 16, 'LinkedIn': 14, 'Website': 12, 'Cold Email': 6, 'Other': 4 };
  s += src[l.source] || 4;
  if (l.company) s += 8;
  if ((l.notes || '').length > 15) s += 5;
  return Math.min(100, s);
}
const tierOf = (s) => s >= 65 ? 'hot' : s >= 40 ? 'warm' : 'cold';
const initials = (n) => n.trim().split(/\s+/).slice(0,2).map(w => w[0]).join('').toUpperCase();
const save = () => localStorage.setItem(KEY, JSON.stringify(leads));

// ----- Toast -----
let toastTimer;
function toast(msg){ const t = $('#toast'); t.textContent = msg; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2400); }

// ----- Render -----
function render(){
  const q = searchEl.value.toLowerCase().trim();
  const f = filterEl.value;
  let view = leads.filter(l => {
    const hit = (l.name + l.email + (l.company||'') + (l.title||'')).toLowerCase().includes(q);
    const tier = f === 'all' || tierOf(l.score) === f;
    return hit && tier;
  });
  view.sort((a,b) => sortEl.value === 'name' ? a.name.localeCompare(b.name) : sortEl.value === 'date' ? b.id - a.id : b.score - a.score);

  emptyEl.classList.toggle('hide', leads.length > 0);
  listEl.innerHTML = view.map(l => {
    const t = tierOf(l.score);
    return `<div class="lead ${t}">
      <div class="avatar">${initials(l.name)}</div>
      <div class="info">
        <h3>${esc(l.name)} <span class="tier ${t}">${t}</span></h3>
        <p>${esc(l.title || 'No title')} ${l.company ? '· ' + esc(l.company) : ''} · ${esc(l.email)}</p>
        <p>Source: ${esc(l.source)}${l.budget ? ' · $' + Number(l.budget).toLocaleString() : ''}</p>
      </div>
      <div class="right">
        <div class="score"><b style="color:var(--${t})">${l.score}</b><span>score</span></div>
        <button class="del" data-id="${l.id}" aria-label="delete"><i class="fa-solid fa-xmark"></i></button>
      </div>
    </div>`;
  }).join('');

  listEl.querySelectorAll('.del').forEach(b => b.onclick = () => { leads = leads.filter(x => x.id != b.dataset.id); save(); render(); toast('Lead removed'); });
  updateStats();
}

function updateStats(){
  const total = leads.length;
  const hot = leads.filter(l => tierOf(l.score) === 'hot').length;
  const warm = leads.filter(l => tierOf(l.score) === 'warm').length;
  const cold = total - hot - warm;
  const avg = total ? Math.round(leads.reduce((a,l) => a + l.score, 0) / total) : 0;
  $('#stTotal').textContent = total; $('#stHot').textContent = hot;
  $('#stWarm').textContent = warm; $('#stCold').textContent = cold; $('#stAvg').textContent = avg;
}

function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

// ----- Add -----
form.onsubmit = (e) => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(form));
  const lead = { id: Date.now(), name: d.name.trim(), email: d.email.trim(), company: d.company.trim(), title: d.title.trim(), source: d.source, budget: d.budget, notes: d.notes.trim() };
  lead.score = scoreLead(lead);
  leads.unshift(lead); save(); form.reset(); render();
  toast(`${lead.name} added — ${tierOf(lead.score).toUpperCase()} (${lead.score})`);
};

// ----- Controls -----
searchEl.oninput = render; filterEl.onchange = render; sortEl.onchange = render;

$('#clearBtn').onclick = () => { if (leads.length && confirm('Delete ALL leads?')){ leads = []; save(); render(); toast('All leads cleared'); } };

$('#exportBtn').onclick = () => {
  if (!leads.length) return toast('No leads to export');
  const head = ['Name','Email','Company','Title','Source','Budget','Score','Tier','Notes'];
  const rows = leads.map(l => [l.name,l.email,l.company,l.title,l.source,l.budget,l.score,tierOf(l.score),l.notes].map(v => `"${String(v||'').replace(/"/g,'""')}"`).join(','));
  const csv = [head.join(','), ...rows].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a'); a.href = url; a.download = 'leads.csv'; a.click(); URL.revokeObjectURL(url);
  toast('Exported leads.csv');
};

$('#sampleBtn').onclick = () => {
  const samples = [
    { name: 'Jane Cooper', email: 'jane@acme.com', company: 'Acme Inc.', title: 'VP of Marketing', source: 'Referral', budget: 18000, notes: 'Wants Q3 outbound campaign, very keen.' },
    { name: 'Marcus Lee', email: 'marcus@nimbus.io', company: 'Nimbus', title: 'Founder & CEO', source: 'LinkedIn', budget: 25000, notes: 'Scaling sales team, needs leads fast.' },
    { name: 'Priya Patel', email: 'priya@brightlabs.co', company: 'Bright Labs', title: 'Marketing Manager', source: 'Website', budget: 6000, notes: 'Comparing vendors.' },
    { name: 'Tom Becker', email: 'tom@gmail.com', company: '', title: 'Student', source: 'Cold Email', budget: 0, notes: '' },
    { name: 'Sara Kim', email: 'sara@vertex.com', company: 'Vertex', title: 'Head of Growth', source: 'Event', budget: 12000, notes: 'Met at SaaS conference.' }
  ];
  samples.forEach(s => { s.id = Date.now() + Math.random(); s.score = scoreLead(s); leads.unshift(s); });
  save(); render(); toast('Sample leads loaded');
};

render();
