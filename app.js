// ===== Email List Validator =====
const $ = (s) => document.querySelector(s);
let results = [];

// theme
const root = document.documentElement, tt = $('#themeToggle');
if (localStorage.getItem('theme')) root.setAttribute('data-theme', localStorage.getItem('theme'));
const icon = () => tt.innerHTML = root.getAttribute('data-theme') === 'light' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
icon();
tt.onclick = () => { const n = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light'; root.setAttribute('data-theme', n); localStorage.setItem('theme', n); icon(); };

// data
const DISPOSABLE = ['mailinator.com','tempmail.com','10minutemail.com','guerrillamail.com','trashmail.com','yopmail.com','throwawaymail.com','getnada.com','sharklasers.com'];
const ROLE = ['info','admin','support','sales','contact','help','office','team','hello','noreply','no-reply','billing','hr','marketing'];
const RE = /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/i;

function classify(raw){
  const email = raw.trim().toLowerCase();
  if (!email) return null;
  if (!RE.test(email)) return { email, status: 'invalid', reason: 'Invalid syntax' };
  const domain = email.split('@')[1];
  const local = email.split('@')[0];
  if (DISPOSABLE.includes(domain)) return { email, status: 'risky', reason: 'Disposable domain' };
  if (ROLE.includes(local)) return { email, status: 'risky', reason: 'Role-based address' };
  if (!/\.[a-z]{2,}$/i.test(domain)) return { email, status: 'invalid', reason: 'Bad domain' };
  return { email, status: 'valid', reason: 'Looks good' };
}

function esc(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
let toastTimer; function toast(m){ const t = $('#toast'); t.textContent = m; t.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2400); }

function validate(){
  const lines = $('#input').value.split(/[\n,;\s]+/).map(s => s.trim()).filter(Boolean);
  const seen = new Set(); let dupes = 0;
  results = [];
  lines.forEach(line => {
    const r = classify(line); if (!r) return;
    if (seen.has(r.email)) { dupes++; return; }
    seen.add(r.email); results.push(r);
  });
  results._dupes = dupes;
  render();
  toast(`Validated ${results.length} unique emails`);
}

function render(){
  const f = $('#filter').value;
  const view = results.filter(r => f === 'all' || r.status === f);
  $('#empty').classList.toggle('hide', results.length > 0);
  $('#results').innerHTML = view.map(r => {
    const ic = r.status === 'valid' ? 'fa-circle-check' : r.status === 'risky' ? 'fa-triangle-exclamation' : 'fa-circle-xmark';
    return `<div class="row ${r.status}"><i class="fa-solid ${ic} status"></i><span class="email">${esc(r.email)}</span><span class="reason">${r.reason}</span></div>`;
  }).join('');
  const v = results.filter(r => r.status === 'valid').length;
  const inv = results.filter(r => r.status === 'invalid').length;
  const rk = results.filter(r => r.status === 'risky').length;
  $('#stTotal').textContent = results.length; $('#stValid').textContent = v;
  $('#stInvalid').textContent = inv; $('#stRisky').textContent = rk; $('#stDupes').textContent = results._dupes || 0;
}

$('#validateBtn').onclick = validate;
$('#filter').onchange = render;
$('#clearBtn').onclick = () => { $('#input').value = ''; results = []; render(); };
$('#sampleBtn').onclick = () => {
  $('#input').value = ['jane.cooper@acme.com','marcus@nimbus.io','info@brightlabs.co','test@mailinator.com','broken-email@','sara@vertex.com','admin@startup.com','jane.cooper@acme.com','tom@@bad.com','priya@growthlab.co'].join('\n');
  validate();
};
$('#copyBtn').onclick = () => {
  const valid = results.filter(r => r.status === 'valid').map(r => r.email).join('\n');
  if (!valid) return toast('No valid emails');
  navigator.clipboard.writeText(valid).then(() => toast('Copied valid emails'));
};
$('#exportBtn').onclick = () => {
  if (!results.length) return toast('Nothing to export');
  const csv = ['Email,Status,Reason', ...results.map(r => `"${r.email}",${r.status},"${r.reason}"`)].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
  const a = document.createElement('a'); a.href = url; a.download = 'validated-emails.csv'; a.click(); URL.revokeObjectURL(url);
  toast('Exported CSV');
};
render();
