# Adding Gallery Items

Gallery items are configured in `content/gallery.yaml` similar to the hero carousel.

Each item supports the following fields:

- type: image | video (required)
- title: string (required)
- date: YYYY-MM-DD (required)
- src: string (required) — path under `/public` or a full URL
- description: string (optional)
- credits: string (optional)
- category: string (optional)
- tags: string[] (optional)
- alt: string (optional for images)
- poster, autoplay, loop, muted, controls (optional for videos)

The gallery page is available at `/gallery`. You can filter by category and tags, and sort by newest, oldest, or title. Clicking an item opens a detailed view with a smooth transition. Videos have controls and sound enabled in the detail view.

Place media in `/public` and reference them via absolute paths like `/blog-images/example.jpg`.