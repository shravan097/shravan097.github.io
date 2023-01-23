---
slug: "/blog/trying-nextjs"
date: "2023-01-22"
title: Trying NextJS
tags: ['NextJS']
---

## Summary
I have been exploring latest JS framework and NextJS caught my eye. I will be blogging my experience as I try this framework to build a simple blog application.


## Diving into NextJS
I am a visual learner & I learn faster when I have examples. I love that NextJS provides [a large list of examples](https://github.com/vercel/next.js/tree/canary/examples) with variety of use cases. This is a new approach to showcase your framework capability. I wish more framework developers did this as it truly showcases the power of the framework.

Before I deep dive into an example, I want to take some time reading [core concept of NextJS which is provided here](https://beta.nextjs.org/docs/routing/fundamentals). 

>Note: I will be using with latest NextJS 13 which has major changes from older NextJS versions. 

I think the fundamentals described by NextJS gives a good detailed overview so I will defer writing about it & directly jump into an example app.

Start by performing `npx create-next-app@latest --typescript test-next-js`. This will create a bootstrap app inside `test-next-js` folder  with the following:
```
.
├── README.md
├── next-env.d.ts
├── next.config.js
├── package-lock.json
├── package.json
├── src
│   ├── app
│   │   ├── globals.css
│   │   ├── head.tsx
│   │   ├── layout.tsx
│   │   ├── page.module.css
│   │   └── page.tsx
│   └── pages
│       └── api
└── tsconfig.json
```
You can start your app by running `yarn dev`. This will start your application in development mode. You should see yor page in [http://localhost:3000/](http://localhost:3000/). You can also checkout api by visiting [http://localhost:3000/api/hello](http://localhost:3000/api/hello).
> Observe that NextJS automatically creates route based on folder structure including API routes. 

With NextJS 13, adding loading page or error page is very simple. For example, if you add custom error page, you should do the following & see the result after reloading root [homepage]((http://localhost:3000/))
```ts
// app/page.tsx
export default function Home() {
  throw new Error('some error') // <-- throw error when rendering
  ...
}

// app/error.tsx
'use client'; // <--- Error can only be rendered in Client so this is required
export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div>
      <h1>Error Occurred & I am showing custom page in NextJS 13!</h1>
    </div>
  )
}
``` 
You can learn more about [error handling here](https://beta.nextjs.org/docs/routing/error-handling).

## Vendor Lock In Concern
NextJS is developed & maintained by [Vercel](https://vercel.com/). Vercel makes it very easy to deploy & host your NextJS application but this can be problematic if you are trying to deploy NextJS app somewhere else. For example, say you want to deploy NextJS in Kubernetes with multi-region deployment for high availability. The minute you start reading into how to deploy outside of Vercel, you start loosing few feature from NextJS such as [Incremental Site Rendering](https://nextjs.org/docs/basic-features/data-fetching/incremental-static-regeneration). Although they mention that NextJS can be deployed outside of Vercel but that is not the case & I understand that Vercel will want to put their priority first before making NextJS easily deployable elsewhere. 

## Final Thoughts
NextJS is redefining how web development is done. Despite my concern in deploying NextJS outside of Vercel, I still believe that this is a great framework. [High trafficked complex](https://nextjs.org/showcase) website such as TikTok, Hulu, HBO Max & many more website use NextJS so surely NextJS is doing something amazing that most companies are adopting it as their main framework. As for me, I think I will revisit this website again next year & try out NextJS & ditch Gatsby 🤠 😄.