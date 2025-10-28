---
title: "Gypsyaxiomui"
date: 2020-04-27
layout: project
tech: "CSS"
---

# Gypsy Axiom - Minimalist Quotes Application

A minimalist, responsive web application that displays inspirational quotes with a clean black and white theme.

![App Screenshot](https://github.com/user-attachments/assets/a93311f6-754f-4317-9d92-a6fa871d944a)

## Features

- **Minimalist Design**: Clean, distraction-free interface with black and white theme
- **Quote Navigation**: Browse through quotes using arrow navigation buttons
- **Responsive Layout**: Fully mobile-friendly and works across all device sizes
- **Reader-Friendly**: Optimized typography for comfortable reading
- **Configurable**: Quote source URL is configurable for easy updates

## Live Demo

Visit the live application at: [https://pappater.github.io/gypsyaxiomui](https://pappater.github.io/gypsyaxiomui)

## Configuration

The quotes URL can be configured by editing the `src/config.js` file:

```javascript
const config = {
  quotesUrl: 'https://raw.githubusercontent.com/pappater/niche/9cfe6bd0691cfd2fe109f6a1cf597e5cf11102cf/public/quotes.json'
};
```

## Development

### Prerequisites

- Node.js 16 or higher
- npm

### Installation

```bash
npm install
```

### Running Locally

```bash
npm start
```

The application will open at [http://localhost:3000/gypsyaxiomui](http://localhost:3000/gypsyaxiomui)

### Building for Production

```bash
npm run build
```

For older Node versions, you may need to use:

```bash
NODE_OPTIONS=--openssl-legacy-provider npm run build
```

## Deployment

The application is automatically deployed to GitHub Pages when changes are pushed to the `main` branch. The deployment workflow is configured in `.github/workflows/deploy.yml`.

## Technology Stack

- React 16.13.1
- Create React App
- GitHub Pages for hosting

## UI Design

- **Layout**: Centered quote display with author attribution at bottom right
- **Navigation**: Two slim arrow buttons (← →) positioned at bottom right
- **Theme**: Monochrome (black text on white background)
- **Typography**: System fonts for optimal readability
- **Responsive**: Adapts seamlessly from mobile to desktop screens

## License

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


Source: [github.com/pappater/gypsyaxiomui](https://github.com/pappater/gypsyaxiomui)

Live: [https://gypsyaxiom.surge.sh](https://gypsyaxiom.surge.sh)
