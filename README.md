This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).


## Devlop Mode
### Getting Started

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

## Learn More
To learn more about Next.js, take a look at the following resources:

Next.js Documentation - learn about Next.js features and API.
Learn Next.js - an interactive Next.js tutorial.
You can check out the Next.js GitHub repository - your feedback and contributions are welcome!

## Deploy on Vercel
The easiest way to deploy your Next.js app is to use the Vercel Platform from the creators of Next.js.

Check out our Next.js deployment documentation for more details.

## Product Mode
### Use In DB-GPT
```bash
npm run compile

# copy compile file to DB-GPT static file dictory
cp -r -f /Db-GPT-Web/out/* /DB-GPT/pilot/server/static/

```
