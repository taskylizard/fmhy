# Website for [FMHY](https://www.reddit.com/r/FREEMEDIAHECKYEAH/)

### Built using

- Nextjs
- Typescript
- Tailwindcss
- Mantine UI
- Nextjs api routes
- Planetscale
- Prisma
- Cheerio
- Plausible

### Features:

- Website:
  - Detailed Wiki Page
  - Search
  - Guides page
- Scraper
  - Base 64, Wiki scrapers

Migrated frontend from [React version](https://github.com/zeus-12/fmhy-ui), and backend from [Express Version](https://github.com/zeus-12/fmhy-server)

### What needs to be fixed

- reset scroll to zero upon changing wiki category: seems to be an open nextjs issue => try using the workarounds.
- add search for wiki page => checkout nextra docs
- fix seo and give better head-title for each page => use next-seo package
- make guides fitered by query params -> and add it to spotlight
- toc seems to break at times
- merge [Fmhy scraper](https://github.com/zeus-12/fmhy-scraper) to this repo
- hook the scrape script to vercel crons, be sure to set the `QUERY_BATCH_SIZE` env to vercel
