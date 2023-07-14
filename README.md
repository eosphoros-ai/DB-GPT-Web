This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, Config Server Url:
next.config.js
```javascript
    const nextConfig = {
        output: 'export',
        experimental: {
            esmExternals: 'loose'
        },
        typescript: {
            ignoreBuildErrors: true
        },
        env: {
            API_BASE_URL: process.env.API_BASE_URL || your server url
        },
        trailingSlash: true
    }
```

Second, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

### Use In DB-GPT
```bash
npm run dev compile

# copy compile file to DB-GPT static file dictory
cp -r -f /Db-GPT-Web/out/* /DB-GPT/pilot/server/static/*

```
