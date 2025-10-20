---
title: "Niche"
date: 2024-09-16
layout: project
tech: "TypeScript"
---

# Niche: Next.js Quote Gallery

Niche is a web application built with Next.js 14 and TypeScript. It displays a collection of quotes in a modern, responsive grid layout. The app uses Tailwind CSS for styling and supports light/dark theme toggling. Quotes are loaded from a JSON file and rendered as cards.

## Features

- Next.js 14 App Router architecture
- TypeScript for type safety
- Tailwind CSS for utility-first styling
- Responsive grid layout for quotes
- Theme toggle (light/dark mode)
- Quotes loaded from a static JSON file

## Project Structure

- `src/app/` — Main Next.js app directory (routing, layout, global styles)
- `src/components/` — Reusable React components (quote card, grid, theme toggle)
- `public/quotes.json` — Static data source for quotes
- `tailwind.config.ts` — Tailwind CSS configuration
- `.github/workflows/deploy.yml` — GitHub Actions workflow for deployment

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment to GitHub Pages

This project is configured to deploy automatically to GitHub Pages using GitHub Actions. On every push to the `main` branch, the workflow will:

1. Install dependencies
2. Build the Next.js app
3. Export the static site to the `out` directory
4. Deploy the contents of `out` to the `gh-pages` branch using the `peaceiris/actions-gh-pages` action

### Notes

- The app uses `npm run export` to generate a static site. Ensure all routes and assets are compatible with static export.
- The base path is set dynamically for GitHub Pages deployment.
- The published site will be available at `https://<your-username>.github.io/<repository-name>/`.

## Customization

- Add or edit quotes in `public/quotes.json`.
- Modify components in `src/components/` for custom layouts or features.

## Technologies Used

- [Next.js](https://nextjs.org/)
- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

## License

MIT


Source: [github.com/pappater/niche](https://github.com/pappater/niche)

Live: [https://niche-psi.vercel.app](https://niche-psi.vercel.app)
