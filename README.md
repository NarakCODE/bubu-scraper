# 🔍 Website Contact Info Scraper

[![Vercel Deploy Status](https://img.shields.io/vercel/deploy?label=vercel&style=flat-square&logo=vercel)](https://vercel.com)
[![Made with Next.js](https://img.shields.io/badge/Made%20with-Next.js-000?style=flat-square&logo=next.js)](https://nextjs.org)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](#license)

A full-stack web application that allows users to enter a website URL and automatically extracts public contact information like **emails**, **phone numbers**, **social media links**, and **logos** from the page.

> Built with **Next.js**, **Tailwind CSS**, **Cheerio**, and deployed on **Vercel**.

---

## 📺 Live Demo

<!-- 🔗 [https://your-vercel-link.vercel.app](https://your-vercel-link.vercel.app) -->

Soon

---

## 🧩 Features

-   ✅ Input any website URL
-   📨 Automatically extract email addresses
-   ☎️ Grab phone numbers using regex
-   🌐 Detect social links (Facebook, LinkedIn, Twitter, etc.)
-   🖼️ Pull logo or main image using meta tags
-   📋 Copy or export contact info
-   🧪 Validates and sanitizes user input
-   💡 Fully responsive, mobile-friendly UI

---

## 🛠 Tech Stack

| Layer          | Tech                                      |
| -------------- | ----------------------------------------- |
| **Frontend**   | Next.js (App Router), React, Tailwind CSS |
| **Backend**    | Next.js API Routes                        |
| **Scraping**   | Cheerio, Axios, Regex                     |
| **Deployment** | Vercel                                    |

---

## 📁 Project Structure (App Router)

/app
/page.tsx # Main UI page
/api/scrape/route.ts # API handler for scraping logic
/components
URLForm.tsx # Input form
ResultCard.tsx # Result display component
/lib
scraper.ts # Scraping and parsing logic

````

---

## 🚀 Getting Started

```bash
# Clone the repo
git clone https://github.com/narakcode/bubu-scraper.git

# Install dependencies
cd contact-scraper
npm install

# Run locally
npm run dev
````

> Environment variables are not required for basic scraping, but you can set custom proxy or user agents if needed.

---

## 📦 Future Improvements

-   🧠 Use Puppeteer for dynamic JavaScript scraping
-   📸 Generate screenshots or previews of the target site
-   🗃️ Add database to track scrape history per user
-   🧾 CSV/JSON export support
-   🔐 Add GitHub OAuth login

---

## 🧠 Skills Demonstrated

-   ✅ Full-stack web app development with React/Next.js
-   ✅ Web scraping and DOM parsing
-   ✅ Regex for data extraction (emails, phones)
-   ✅ Async APIs and error handling
-   ✅ Responsive frontend with Tailwind CSS
-   ✅ Clean code structure and component reusability
-   ✅ CI/CD and deployment via Vercel

---

## 📄 License

MIT — [NarakCODE](https://narakcode.vercel.com)

---

## 💬 Feedback

Feel free to open issues or PRs. You can also reach me at [channarakluy@gmail.com](mailto:channarakluy@gmail.com)

```

---

### ✅ What to do next:
- Replace demo link with your actual **Vercel deployment URL**
- Update `yourusername`, contact info, and license
- Push it to GitHub!

Let me know if you'd like a **GitHub repo name suggestion** or the initial code scaffolding next!
```
