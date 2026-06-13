# Sajib Ahmed — Lead Generation Portfolio

A professional, fully responsive portfolio website plus a real, interactive **Lead Capture & Scoring Tool**. Built with pure HTML, CSS and JavaScript — no frameworks, no build step — so it deploys free on GitHub Pages or GitLab Pages.

## 🚀 Live

- **Portfolio:** `index.html`
- **Live App:** `projects/lead-tool/index.html`

## ✨ Features

### Portfolio
- Sticky navbar with active-section highlighting and scroll progress bar
- Hero with animated typing effect and animated stat counters
- Dark / light theme toggle (saved to `localStorage`)
- Scroll-reveal animations, animated skill bars, hover effects
- About, Services, Skills, Portfolio, Testimonials and Contact sections
- Contact form with live validation that opens a pre-filled email
- Fully responsive (mobile menu included)

### Lead Capture & Scoring Tool (`projects/lead-tool/`)
A genuinely useful single-page app:
- Add leads with name, email, company, title, source, budget and notes
- **Automatic lead scoring** (0–100) based on job title, budget and source
- Auto-classifies each lead as **Hot / Warm / Cold**
- Live search, filter by tier, and sort by score / name / date
- Dashboard stats (total, hot, warm, cold, average score)
- **Export to CSV** and one-click sample data
- Data persists in the browser via `localStorage`

## 🛠️ Tech

- HTML5, CSS3 (custom properties, grid, flexbox)
- Vanilla JavaScript (ES6+), IntersectionObserver, localStorage
- Font Awesome icons, Google Fonts

## 📁 Structure

```
.
├── index.html              # Portfolio
├── css/style.css
├── js/main.js
└── projects/
    └── lead-tool/          # Interactive Lead Manager app
        ├── index.html
        ├── app.css
        └── app.js
```

## ▶️ Run locally

Just open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## 🌐 Deploy

- **GitHub Pages:** push to GitHub, then enable Pages on the `main` branch (root).
- **GitLab Pages:** the included `.gitlab-ci.yml` publishes the site automatically.

## 📬 Contact

**Sajib Ahmed** — Lead Generation Specialist
- Email: sajib.ahmed.cu@gmail.com
- LinkedIn: https://www.linkedin.com/in/sajibahmedsuvro/
- GitHub: https://github.com/sajibahmedcu-a11y/lead-gen-portfolio
