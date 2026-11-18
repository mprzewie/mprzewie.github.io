# mprzewie.github.io

Personal research homepage, built with Jekyll and hosted on GitHub Pages.
Pushing to `main` deploys it; there is no separate build step.

The homepage (`index.html`) is a single scrollable page: Research, Selected work (with a
collapsible list of all publications), Experience, News, Recognition and service, Contact.
`/news` holds the full news archive. All content lives in `_data/`, so routine updates
never touch HTML or CSS.

| File | What it holds |
| --- | --- |
| `_data/profile.yml` | Name, keywords, headline, affiliation, email, CV link, bio, research themes, contact text |
| `_data/papers.yml` | Publications |
| `_data/news.yml` | News items |
| `_data/experience.yml` | Experience timeline, education, grants and awards, community service |
| `_config.yml` | Site title and description, and how many news items the homepage shows |
| `marcin_przewiezlikowski.pdf` | CV, linked from the header and hero (path set by `cv` in `profile.yml`) |

## Add a publication

Add an entry to `_data/papers.yml`, keeping the file newest first:

```yaml
- id: my-paper                 # unique; featured papers get the anchor /#my-paper
  title: "My Paper: A Subtitle"
  authors: "First Author, Marcin Przewięźlikowski, Last Author"
  venue: CVPR                  # short name, shown as a badge
  venue_full: IEEE/CVF Conference on Computer Vision and Pattern Recognition
  year: 2027
  date: 2027-06-15             # optional, ISO format
  status: published            # published | accepted | preprint | under review
  summary: >-                  # optional; 1–2 sentences, shown on featured cards
    What the paper does, in plain words.
  image: my_paper.webp         # optional; file in assets/img/pub/
  paper_url: https://arxiv.org/abs/...   # arXiv if available, else the published version
  venue_url: https://doi.org/...         # published version; the venue badge links here
  code_url: https://github.com/...
  project_url: https://...
  poster_url: https://...
  dataset_url: https://...
  award: Best Paper Award      # optional badge
  award_url: https://...
  note: Also presented at ...  # optional, one short line
  extra_links:                 # optional, any other links
    - label: Slides
      url: https://...
```

Only `id`, `title`, `authors`, `venue` and `year` are required; leave out the rest.
Your name is highlighted automatically in every spelling listed under `name_variants` in
`_data/profile.yml`.

**Images.** Put a PNG, JPG or WebP into `assets/img/pub/`. It is shown letterboxed in a
16:9 frame, so wide figures work best. To shrink a large PNG:
`cwebp -q 88 -resize 1200 0 figure.png -o figure.webp`. Papers without an image get a
typographic placeholder.

## Feature or unfeature a publication

In `_data/papers.yml`:

```yaml
  featured: true
  featured_order: 2   # lower comes first
```

Featured papers appear as cards under "Selected work" on the homepage; three fill one row.
To unfeature a paper, delete both lines or set `featured: false`. Every paper stays in the
collapsible "All publications" list either way.

## Add a news item

Add an entry at the top of `_data/news.yml`:

```yaml
- date: 2027-03-01
  text: >-
    [My Paper](https://arxiv.org/abs/...) is accepted to *CVPR 2027*.
  url: https://...       # optional "More" link
  home: false            # optional; keeps the item off the homepage
```

`text` is Markdown. The homepage shows the newest `home_news_count` items (5); `/news`
shows all of them. Avoid starting `text` with a link whose title contains a colon followed
by a bracket, such as `[Beyond [CLS]: ...]`. Markdown would read it as a link definition, so
start with a word instead ("Our paper [...]").

## Update a job position

- **Hero line** ("AI researcher at GMUM, Jagiellonian University"): edit
  `role` and `affiliations` in `_data/profile.yml`.
- **Experience timeline**: add an entry at the top of `experience` in
  `_data/experience.yml`:

  ```yaml
  - period: Jan 2027 – now
    role: Research Scientist
    org: Some Lab
    url: https://...
    tag: Industry        # optional label
    text: One line on what you work on.
  ```

  Change the previous role's `period` end from `now` to a date. `show: false` hides an
  entry without deleting it.
- **Bio text**: edit `bio` in `_data/profile.yml`.
- **CV**: replace `marcin_przewiezlikowski.pdf` with the new file under the same name.

## Run the site locally

GitHub Pages builds with Ruby 3.3 and the `github-pages` gem. To match it on macOS:

```sh
brew install ruby@3.3
export PATH="/opt/homebrew/opt/ruby@3.3/bin:$PATH"
bundle config set --local path vendor/bundle
bundle install
bundle exec jekyll serve      # http://localhost:4000
```

Edits to `_data/` and pages reload automatically. Restart the server after editing
`_config.yml`. Run `bundle update github-pages` now and then to track GitHub's versions.

## Structure

- `index.html`: the single-page homepage. `news.html`: the news archive.
- `_layouts/`: `default` (page shell) and `page` (simple pages with a title and intro).
- `_includes/`: header, footer, paper card, author list, timeline, news list and icons.
- `assets/css/site.css`: all styling. Colours and fonts are variables at the top, with a
  second set for dark mode.
- `assets/js/theme.js`: the light/dark toggle (the only JavaScript on the site).
- Old URLs (`/publications`, `/cv`, `/contact`, `/teaching`) are small redirect pages
  that point to the matching homepage section.
