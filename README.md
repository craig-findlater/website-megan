# Megan Findlater — Home-Based Childcare Website

A simple, static HTML/CSS/JS website for **Megan Findlater**, a home-based childcare provider based in **Invercargill, New Zealand**, operating under the [Tiny Nation](https://www.tinynation.co.nz) network.

---

## Folder Structure

```
website-megan/
├── index.html          # Main (single-page) website
├── css/
│   └── styles.css      # All site styles
├── js/
│   └── main.js         # Nav toggle, EmailJS integration, gallery logic
├── images/             # Photos used throughout the site
│   └── .gitkeep        # Keeps the empty folder tracked by Git
├── .gitignore
└── README.md
```

---

## Sections (in page order)

| Section | Description |
|---|---|
| Nav | Fixed/sticky navigation with mobile hamburger |
| Hero | Full-width banner with headline and CTA |
| About | Megan's bio and connection to Tiny Nation |
| Services | Ages, hours, inclusions |
| Environment | Home space and outdoor area |
| Philosophy | Approach to learning and care |
| Testimonials | Parent quotes |
| Gallery | Responsive photo grid |
| Contact Form | Enquiry form (EmailJS powered) |
| Footer | Copyright, Tiny Nation link |

---

## Enabling GitHub Pages

1. Go to **Settings → Pages** in this repository.
2. Under *Build and deployment*, set **Source** to `Deploy from a branch`.
3. Select the **`main`** branch and `/ (root)` folder.
4. Click **Save**. GitHub will publish the site at:
   `https://<your-username>.github.io/<repo-name>/`

> Changes pushed to `main` are automatically redeployed within ~30 seconds.

---

## Phase 2 — EmailJS Setup (Contact Form)

The contact form will use [EmailJS](https://www.emailjs.com) so no server is needed.

Steps to configure (Phase 2):

1. Create a free EmailJS account and note your **Public Key**.
2. Add an **Email Service** (e.g. Gmail) and note the **Service ID**.
3. Create an **Email Template** and note the **Template ID**.
4. In `js/main.js`, initialise EmailJS with your Public Key and wire up the form's `submit` event to call `emailjs.sendForm()` with the Service ID and Template ID.
5. **Never commit secret keys** — store them as plain JS constants in `main.js` (they are client-side public keys, not secrets) or use environment variables if a build step is added later.

---

## Development

No build step required. Open `index.html` directly in a browser, or use a local dev server:

```bash
# Python 3
python -m http.server 8080

# Node (npx)
npx serve .
```

---

*Last updated: Phase 1 — initial repo structure*
