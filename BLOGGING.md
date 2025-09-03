# Adding Blog Posts

This site uses Nuxt Content collections. Blog posts live under `content/blog/**` and automatically appear on `/blog`.

## 1) Create the file

- Add a new Markdown file in `content/blog/`:
  - Example: `content/blog/my-first-post.md`
- The file name becomes the URL slug: `/blog/my-first-post`.
- Use lowercase and hyphens for readability.

## 2) Front‑matter fields

At the top of each file, include YAML front‑matter. Required and optional fields:

- title: string (required)
- description: string (optional)
- date: YYYY-MM-DD (optional, used for sorting)
- cover: string (optional; image URL or path under `/public`)
- tags: string[] (optional)
- author: string | string[] (optional)
  - You can specify multiple authors either as a YAML array or as a single comma-separated string: `"Alice, Bob"` or `['Alice', 'Bob']`.
- draft: boolean (optional; when true, hides from the blog list)
- seo: { title?: string, description?: string } (optional overrides)

Example:

```yaml
---
title: Welcome to the CCBR Blog
description: Introducing our blog where we share updates, builds, and insights.
date: 2025-08-23
cover: /logos/ccbrlogo.webp
# tags:
#   - announcement
# author: Team CCBR
# Or multiple authors:
# author: "Alice Doe, Bob Smith"
# author:
#   - Alice Doe
#   - Bob Smith
# draft: false
# seo:
#   title: Custom SEO Title
#   description: Custom SEO description
---
```

Then write your Markdown content below the front‑matter.

## 3) Images

- Place local images in `public/images/` and reference them with `/images/<file>`.
- Remote image URLs also work.
- The `cover` field is used as the card image on `/blog`.

## 4) Drafts

- Set `draft: true` to prevent a post from appearing on the blog index.
- Omit the `draft` field or set it to `false` to publish.

## 5) Sorting & URLs

- Posts on `/blog` are sorted by `date` (newest first). Include a `date` to control order.
- The post URL is `/blog/<filename-without-ext>` unless you place it in nested folders (those become part of the path).

## 6) Preview locally

- Start the dev server and open `/blog` to see your post in the list.
- Click a post to view it at its permalink.

## 7) Publish

- Commit your changes (including any new images under `public/images/`).
- Push to your default branch. The site will pick up your new post on the next deploy.

Tips
- Keep titles concise; descriptions should be 1–2 sentences.
- Use headings (##), lists, and images to structure content.
- Use absolute links like `/blog/welcome` to link between posts.
