'use strict';

function parseFrontmatter(md) {
  // Very small frontmatter parser: expects YAML between first two --- lines.
  if (!md.startsWith('---')) return { attributes: {}, body: md };

  const end = md.indexOf('\n---', 3);
  if (end === -1) return { attributes: {}, body: md };

  const raw = md.slice(3, end).trim();
  const body = md.slice(end + '\n---'.length).trimStart();

  const attributes = {};
  raw.split('\n').forEach((line) => {
    const idx = line.indexOf(':');
    if (idx === -1) return;
    const key = line.slice(0, idx).trim();
    let value = line.slice(idx + 1).trim();
    value = value.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
    if (key) attributes[key] = value;
  });

  return { attributes, body };
}

function formatDateLabel(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

async function loadArticle() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('slug');

  const titleEl = document.getElementById('articleTitle');
  const metaEl = document.getElementById('articleMeta');
  const bodyEl = document.getElementById('articleBody');

  const backBtn = document.getElementById('backToArticles');
  if (backBtn) backBtn.addEventListener('click', () => window.history.back());

  if (!slug) {
    titleEl.textContent = 'Missing article';
    bodyEl.textContent = 'No slug was provided.';
    return;
  }

  try {
    const res = await fetch(`/content/articles/${encodeURIComponent(slug)}.md`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`Failed to load article (${res.status})`);

    const md = await res.text();
    const { attributes, body } = parseFrontmatter(md);

    const title = attributes.title || slug;
    const dateLabel = formatDateLabel(attributes.date);

    // RTL support: if frontmatter has rtl: true (or direction: rtl / lang: ar),
    // render the article in right-to-left mode.
    const isRtl =
      String(attributes.rtl || '').toLowerCase() === 'true' ||
      String(attributes.direction || '').toLowerCase() === 'rtl' ||
      String(attributes.lang || '').toLowerCase().startsWith('ar');

    const articleEl = document.querySelector('article.blog-post');
    if (articleEl) {
      articleEl.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
      if (isRtl) {
        articleEl.classList.add('rtl-article');
      } else {
        articleEl.classList.remove('rtl-article');
      }
    }

    if (isRtl) {
      document.documentElement.setAttribute('dir', 'rtl');
      if (attributes.lang) {
        document.documentElement.setAttribute('lang', attributes.lang);
      } else {
        document.documentElement.setAttribute('lang', 'ar');
      }
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
    }

    document.title = `${title} | Article`;
    titleEl.textContent = title;
    metaEl.innerHTML = dateLabel ? `<time datetime="${attributes.date || ''}">${dateLabel}</time>` : '';

    // marked is loaded globally from CDN
    bodyEl.innerHTML = (window.marked ? window.marked.parse(body) : body);
  } catch (err) {
    titleEl.textContent = 'Couldn’t load article';
    bodyEl.textContent = 'Please check that the file exists under /content/articles/.';
    console.error(err);
  }
}

loadArticle();


