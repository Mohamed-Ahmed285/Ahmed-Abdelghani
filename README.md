# Ahmed-Abdelghani

## Demo : [Try it now](https://ahmed-abdelghany.pages.dev/)

## Articles (auto-updating list)

The site lists articles from `content/articles/index.json` (a required manifest for static hosting).

When you add/edit an article via Decap CMS (`/admin/`), a GitHub Action automatically regenerates that file from the markdown frontmatter in `content/articles/*.md`.

If you ever need to regenerate it locally:

```bash
node scripts/generate-articles-index.mjs
```