# rtl.no

The Hugo source for [rtl.no](https://rtl.no), Rune T. Larsen's personal publication and archive.

The site is intentionally static: editorial content is Markdown, Hugo renders the pages, and GitHub Actions publishes the result to GitHub Pages.

## Current status

The first implementation slice includes:

- English and Norwegian route-based content
- Shared design tokens and responsive site shell
- Editorial homepage
- Technology, Projects, EV & Mobility, Trance, Notes, About and Now layouts
- Markdown archetypes for articles, projects, notes and trance entries
- A lightweight language-specific static search index
- RSS, canonical URLs, alternate-language metadata and a custom 404 page
- GitHub Pages build/deployment workflow

The files in `design_handoff_rtl_no/` are the high-fidelity Claude Design reference. They are not production templates and their prototype JavaScript is not shipped.

## Requirements

- [Hugo Extended 0.164.0](https://github.com/gohugoio/hugo/releases/tag/v0.164.0)

Check the installed version:

```powershell
hugo version
```

## Local development

Preview published content:

```powershell
hugo server
```

Preview drafts as well:

```powershell
hugo server --buildDrafts
```

Create a production build:

```powershell
hugo --gc --minify --cleanDestinationDir --panicOnWarning
```

Generated files are written to `public/` and are not committed.

## Authoring

Create an English article:

```powershell
hugo new content articles/my-article.en.md
```

Create the Norwegian translation with the same `translationKey`:

```powershell
hugo new content articles/my-article.no.md
```

Equivalent archetypes exist for `projects`, `notes` and `trance`. New content is a draft by default. Remove `draft: true` only after the copy, links and media have been reviewed.

## Deployment

Pull requests run a production build. Merges to `main` upload and deploy the static artifact with the official GitHub Pages actions.

Repository settings must use **GitHub Actions** as the Pages source. The custom domain is `rtl.no`; DNS and HTTPS enforcement remain external repository settings.
