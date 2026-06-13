// ===== Year =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== Theme toggle =====
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
const saved = localStorage.getItem('theme');
if (saved) root.setAttribute('data-theme', saved);
function syncIcon(){
  const dark = root.getAttribute('data-theme') !== 'light';
  themeToggle.innerHTML = dark ? '<i class="fa-solid fa-moon"></i>' : '<i class="fa-solid fa-sun"></i>';
}
syncIcon();
themeToggle.addEventListener('click', () => {
  const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  syncIcon();
});

// ===== Navbar scroll + progress =====
const navbar = document.getElementById('navbar');
const progress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (window.scrollY / h) * 100 + '%';
});

// ===== Mobile menu =====
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// ===== Active link on scroll =====
const sections = [...document.querySelectorAll('section[id]')];
const links = [...document.querySelectorAll('.nav-links a')];
window.addEventListener('scroll', () => {
  const pos = window.scrollY + 120;
  let current = sections[0]?.id;
  sections.forEach(s => { if (pos >= s.offsetTop) current = s.id; });
  links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current));
});

// ===== Typing effect =====
const phrases = ['Lead Generation', 'B2B Prospecting', 'LinkedIn Outreach', 'Data Mining', 'CRM Management'];
const typed = document.getElementById('typed');
let pi = 0, ci = 0, deleting = false;
function type(){
  const word = phrases[pi];
  typed.textContent = word.substring(0, ci);
  if (!deleting && ci < word.length){ ci++; setTimeout(type, 90); }
  else if (deleting && ci > 0){ ci--; setTimeout(type, 45); }
  else { deleting = !deleting; if(!deleting) pi = (pi + 1) % phrases.length; setTimeout(type, deleting ? 1400 : 300); }
}
type();

// ===== Reveal on scroll + counters + skill bars =====
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('show');
    e.target.querySelectorAll?.('.bar').forEach(b => b.classList.add('animate'));
    e.target.querySelectorAll?.('.counter').forEach(runCounter);
    io.unobserve(e.target);
  });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

function runCounter(el){
  const target = +el.dataset.target; const dur = 1600; const start = performance.now();
  function step(now){
    const p = Math.min((now - start) / dur, 1);
    el.textContent = Math.floor(p * target) + (p === 1 && target >= 90 ? '' : '+');
    if (p < 1) requestAnimationFrame(step); else el.textContent = target + (target >= 90 ? '' : '+');
  }
  requestAnimationFrame(step);
}

// ===== Contact form validation =====
const form = document.getElementById('contactForm');
const note = document.getElementById('formNote');
function setError(field, msg){ const f = field.closest('.field'); f.classList.toggle('invalid', !!msg); f.querySelector('small').textContent = msg || ''; }
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const { name, email, message } = form.elements;
  let ok = true;
  if (!name.value.trim()){ setError(name, 'Please enter your name'); ok = false; } else setError(name, '');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.value)){ setError(email, 'Enter a valid email'); ok = false; } else setError(email, '');
  if (message.value.trim().length < 10){ setError(message, 'Message must be at least 10 characters'); ok = false; } else setError(message, '');
  if (!ok){ note.style.color = '#ff6b6b'; note.textContent = 'Please fix the errors above.'; return; }
  note.style.color = ''; note.textContent = 'Thanks ' + name.value.trim() + '! Your message is ready. Opening your email app...';
  const body = encodeURIComponent(message.value + '\n\n— ' + name.value + ' (' + email.value + ')');
  window.location.href = 'mailto:sajib.ahmed.cu@gmail.com?subject=' + encodeURIComponent('Portfolio enquiry from ' + name.value) + '&body=' + body;
  form.reset();
});
