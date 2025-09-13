# Portfolio Jekyll Site

This is a Jekyll-based portfolio site. Below are the basic setup instructions, configuration details, and commands to run the site locally.

## Project Structure

- `_config.yml`: Main configuration file (site title, baseurl, etc.)
- `Gemfile`: Specifies Jekyll and plugins.
- `index.html`: Main page, uses Liquid templating.
- `_layouts/`, `_projects/`, `assets/`: Folders for layouts, project posts, CSS, images.

## Installation

Run these commands in your project directory:

```bash
# Install Bundler if not installed
gem install bundler

# Install project dependencies
bundle install
```

## Running Locally

```bash
bundle exec jekyll serve
```
This will build and serve your site locally at `http://localhost:4000`.

## Configuration

- Edit `_config.yml` to change site settings (title, description, baseurl, etc.).
- Add/edit pages in `_projects/` for portfolio items.
- Customize layout in `_layouts/project.html` and CSS in `assets/css/style.css`.

## Deployment

For GitHub Pages, push your code to a GitHub repository and set the repository settings to use GitHub Pages.
