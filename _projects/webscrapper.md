---
title: "Webscrapper"
date: 2019-12-25
layout: project
tech: "JavaScript"
---

# Web Scraper

A simple and modern web application that allows users to extract HTML content from any public webpage. Built with React, this tool provides a clean interface for scraping web pages and downloading the results as text files.

## Overview

Web Scraper is a lightweight React application designed to fetch and download HTML content from any publicly accessible URL. The application features a responsive design, dark/light mode toggle, and robust error handling to provide a smooth user experience.

## Tech Stack

The application is built using the following technologies:

- React 16.12 (Functional Components with Hooks)
- Axios for HTTP requests
- Bootstrap 4.4 for responsive UI components
- File-saver for client-side file downloads
- Zenscrape API for web scraping functionality
- CORS Anywhere proxy for API access

## Features

### Core Functionality
- URL-based web scraping with real-time feedback
- Automatic HTML content extraction from public web pages
- One-click download of scraped content as text files
- Smart file naming based on the scraped URL

### User Experience
- Clean and intuitive user interface
- Dark and light theme toggle with system preference detection
- Real-time loading indicators
- Comprehensive error handling and user feedback
- URL validation before submission
- Fully responsive design for all screen sizes

## Screenshots

### Light Mode
![Web Scraper Light Mode](https://github.com/user-attachments/assets/5a0af40a-0b93-4feb-adbc-9126835338b7)

### Dark Mode
![Web Scraper Dark Mode](https://github.com/user-attachments/assets/4eadb130-4b27-4333-8f67-7674758bcda5)

## Project Structure

The project follows a standard Create React App structure:

```
webscrapper/
├── public/
│   ├── index.html          # HTML template
│   ├── manifest.json       # PWA manifest
│   ├── favicon.ico         # Application icon
│   └── ...                 # Other static assets
├── src/
│   ├── App.js              # Main application component
│   ├── App.css             # Application styles
│   ├── index.js            # React entry point
│   ├── index.css           # Global styles
│   ├── serviceWorker.js    # Service worker for PWA
│   └── downloadjs/         # Legacy download utility (not in use)
├── package.json            # Dependencies and scripts
└── README.md              # This file
```

## Installation and Setup

### Prerequisites
- Node.js (version 12 or higher)
- npm or yarn package manager
- Git for version control

### Installation Steps

1. Clone the repository to your local machine:
```bash
git clone https://github.com/pappater/webscrapper.git
cd webscrapper
```

2. Install the required dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will automatically open in your default browser at `http://localhost:3000`.

## Usage Guide

### Basic Usage

1. Enter a valid URL in the input field (e.g., `https://example.com`)
2. Click the "Scrape" button to initiate the scraping process
3. Wait for the scraping to complete (loading indicator will be displayed)
4. Once complete, click the "Download" button to save the HTML content
5. The file will be downloaded with a name based on the URL

### Theme Toggle

Click the theme toggle button in the top-right corner to switch between dark and light modes. The application remembers your system's color scheme preference on first load.

### Error Handling

The application provides clear error messages for common issues:
- Empty URL field
- Invalid URL format
- Failed scraping attempts
- Network connectivity problems

## Available Scripts

In the project directory, you can run the following commands:

### `npm start`
Runs the application in development mode. Open [http://localhost:3000](http://localhost:3000) to view it in the browser. The page will reload automatically when you make changes.

### `npm run build`
Builds the application for production to the `build` folder. The build is optimized and minified for best performance.

### `npm test`
Launches the test runner in interactive watch mode.

### `npm run deploy`
Deploys the built application to GitHub Pages.

## Deployment

This application is configured for deployment to GitHub Pages.

### Deployment Steps

1. Ensure all changes are committed
2. Build and deploy the application:
```bash
npm run deploy
```

3. The application will be available at: `https://pappater.github.io/webscrapper`

The deployment process automatically builds the application and pushes it to the `gh-pages` branch.

### Live Demo

The application is ready for deployment. After merging this PR, run the following command to deploy:

```bash
npm run deploy
```

The application will then be available at: [https://pappater.github.io/webscrapper](https://pappater.github.io/webscrapper)

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md)

## API Configuration

The application uses the Zenscrape API for web scraping functionality. The current implementation includes a demo API key with limited usage.

### For Production Use

To use this application in production:
1. Obtain your own API key from [Zenscrape](https://www.zenscrape.com/)
2. Replace the API key in `src/App.js`
3. Consider implementing rate limiting and caching
4. Set up your own CORS proxy or configure appropriate CORS headers

### CORS Proxy Note

The application uses `cors-anywhere.herokuapp.com` as a CORS proxy for development. This service has rate limits and is not recommended for production use. Consider setting up your own proxy server for production deployments.

## Browser Compatibility

The application is compatible with modern browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

Mobile browsers are fully supported with responsive design.

## Contributing

Contributions are welcome! To contribute to this project:

1. Fork the repository
2. Create a new branch for your feature (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow the existing code style and structure
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed
- Keep commits focused and atomic

## Known Limitations

- The demo API key has usage limits
- CORS proxy may have rate limitations
- Some websites may block scraping attempts
- JavaScript-rendered content may not be captured
- Large pages may take longer to process

## Future Enhancements

Potential improvements for future versions:
- Custom API key configuration in UI
- Support for authenticated pages
- Content preview before download
- Multiple format options (JSON, XML, etc.)
- Batch URL processing
- Content filtering and parsing options
- Scraping history and favorites

## License

This project is licensed under the MIT License. See the LICENSE file for details.

### MIT License Summary

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software.

## Acknowledgments

- Built with Create React App
- UI components from Bootstrap
- HTTP requests handled by Axios
- File downloads powered by FileSaver.js
- Web scraping API provided by Zenscrape
- CORS proxy service by cors-anywhere

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Contact the maintainer through GitHub
- Check existing issues for solutions

## Version History

### Version 0.1.0 (Current)
- Initial release with core functionality
- React functional components with hooks
- Dark/light theme support
- Responsive design
- Basic error handling
- GitHub Pages deployment configuration

---

Built with care by the Web Scraper team. Happy scraping!



Source: [github.com/pappater/webscrapper](https://github.com/pappater/webscrapper)

Live: [http://excited-men.surge.sh/](http://excited-men.surge.sh/)
