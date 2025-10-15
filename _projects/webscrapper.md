---
title: "Webscrapper"
date: 2019-12-25
layout: project
tech: "JavaScript"
---


# WebScrapper React App

WebScrapper is a simple web application built with React that allows users to scrape the HTML content of any public web page and download the result as a text file. The app features a clean UI, dark/light mode toggle, and error handling for invalid or failed requests.

## Features

- **URL Scraping**: Enter any valid URL and fetch the HTML content using the Zenscrape API (with a demo API key).
- **Download Result**: Download the scraped HTML as a `.txt` file with a single click.
- **Dark/Light Mode**: Toggle between dark and light themes for better accessibility.
- **Responsive UI**: Built with Bootstrap for a responsive and modern look.
- **Error Handling**: User-friendly error messages for invalid URLs or failed requests.

## How It Works

1. Enter a URL in the input field and click the "scrap" button.
2. The app sends a request to the Zenscrape API (via a CORS proxy) to fetch the HTML content of the page.
3. If successful, a "download" button appears. Click it to download the HTML as a text file.
4. Toggle between dark and light mode using the button at the top right.

## Technologies Used

- React (Class Components)
- Axios (for HTTP requests)
- Bootstrap (for styling)
- Custom download.js utility (for file download)

## Project Structure

- `src/App.js` — Main React component with UI, state, and logic for scraping and downloading.
- `src/downloadjs/download.js` — Utility for cross-browser file downloads.
- `public/index.html` — HTML template, includes external scripts and icons.
- `src/App.css` — Custom styles for the app.

## Setup & Installation

1. **Clone the repository:**
	```bash
	git clone <repo-url>
	cd webscrapper
	```
2. **Install dependencies:**
	```bash
	npm install
	```
3. **Start the development server:**
	```bash
	npm start
	```
	The app will be available at [http://localhost:3000](http://localhost:3000).

## Usage

1. Enter a valid URL (e.g., `https://example.com`).
2. Click "scrap" to fetch the HTML content.
3. If successful, click "download" to save the HTML as a `.txt` file.
4. Use the dark/light mode toggle for your preferred theme.

## Notes

- The app uses a demo API key for Zenscrape. For production use, obtain your own API key from [zenscrape.com](https://www.zenscrape.com/).
- The CORS proxy (`https://cors-anywhere.herokuapp.com/`) is used for development/demo purposes and may have rate limits.
- The download functionality is powered by a custom `download.js` utility for maximum browser compatibility.

## Scripts

- `npm start` — Run the app in development mode.
- `npm run build` — Build the app for production.
- `npm test` — Run tests.
- `npm run eject` — Eject configuration (not recommended unless necessary).

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.


Source: [github.com/pappater/webscrapper](https://github.com/pappater/webscrapper)

Live: [http://excited-men.surge.sh/](http://excited-men.surge.sh/)
