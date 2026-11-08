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

To add the first demo site to your local database:

```sh
npm run seed
```

Then enter `tidepool.zz` in the address box. The API also exposes it at
`http://localhost:3001/sites/tidepool.zz`.

The web app runs at <http://localhost:3002>; the API runs at <http://localhost:3001>.
Make sure your local MongoDB service is running before starting the API. Copy `.env.example` to `.env`
if you need to change the connection string or ports.
