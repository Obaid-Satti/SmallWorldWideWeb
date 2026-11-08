# The Small Web

A small web browser prototype, built for the full-stack assessment.

## Stack

- Web: Next.js, React, TypeScript
- API: NestJS, TypeScript
- Database: MongoDB

## First run

Requirements: Node.js 20+, npm, and MongoDB running on your laptop. The default connection is
`mongodb://localhost:27017/small_web`, which matches a standard local MongoDB installation.

```sh
npm install
```

In separate terminals:

```sh
npm run dev:api
npm run dev:web
```

Seed the ten demo sites, publisher/browsing names, and sample browsing history:

```sh
npm run seed
```

To update just the demo site pages without resetting browsing history:

```sh
npm run seed:sites
```

Open the app at <http://localhost:3002>. Enter `tidepool.zz` in the address box,
or use **Publish** in the header to add a page under one of the available publisher names.
The API exposes sites at `http://localhost:3001/sites/:address`.

The web app runs at <http://localhost:3002>; the API runs at <http://localhost:3001>.
Make sure your local MongoDB service is running before starting the API. Copy `.env.example` to `.env`
if you need to change the connection string or ports.

## Frontend folders

- `apps/web/src/app`: Next.js routes. Each route folder contains the page for that URL.
- `apps/web/src/components`: Shared layout, browser controls, forms, and page components, grouped by purpose.
- `apps/web/src/lib`: API helpers and shared configuration.
- `apps/web/src/types`: Shared TypeScript data types.
