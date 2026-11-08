# The Small Web

A small web browser for reading and publishing personal HTML pages stored in MongoDB.

## Stack

- Web: Next.js, React, TypeScript
- API: NestJS, TypeScript
- Database: MongoDB

## Requirements

- Node.js 20 or later and npm
- MongoDB running on the computer

Docker is not required. By default, the API connects to `mongodb://localhost:27017/small_web`.

## Setup

From the repository root, install dependencies:

```sh
npm install
```

If you need to change the MongoDB URL or API port, copy `.env.example` to `.env` and edit it.
Keep an existing `.env` if it already has your settings.

## Seed the demo data

With MongoDB running, seed ten sample sites, the browsing and publisher names, and their demo history:

```sh
npm run seed
```

Running the full seed again replaces the demo visit history with the sample trail. To update only the
sample pages while preserving history, run:

```sh
npm run seed:sites
```

## Run the app

Start each command in a separate terminal from the repository root:

```sh
npm run dev:api
```

```sh
npm run dev:web
```

Open <http://localhost:3002>. Enter an address such as `tidepool.zz`, search page text, view history,
or select **Publish** to add a page using a publisher name from the list.

- Web app: <http://localhost:3002>
- API: <http://localhost:3001>
- Example site API: <http://localhost:3001/sites/tidepool.zz>

## Open it from another device on Wi-Fi

Keep both servers running on your computer and connect the other device to the same Wi-Fi. Run
`ipconfig` on Windows and use your computer’s Wi-Fi IPv4 address in the browser, for example
`http://192.168.1.20:3002`. The web app connects to the API on the same address at port `3001`.
Allow Node.js or ports `3001` and `3002` through Windows Firewall for your private network if prompted.

## Frontend folders

- `apps/web/src/app`: Next.js routes; each route folder contains its `page.tsx`.
- `apps/web/src/components`: shared browser controls, forms, history, layout, site views, and UI.
- `apps/web/src/lib`: API helpers and configuration.
- `apps/web/src/types`: shared TypeScript data types.
