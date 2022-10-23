---
slug: "/blog/website-redesign-gatsby"
date: "2022-10-18"
title: Redesigning My Website
tags: ['Gatsby', 'Tailwind', 'React', 'GraphQL']
---
 
## Background
I remember my first site. I had just finished my first ever coding class, `CS-103: Intro To Programming In C++`. After learning C++, I figured building a website is an easy task. No, it's not. Building a website is a lot of effort. You need design mocks. Then you will need to write CSS. You will need HTML. You will need Javascript. You will need a domain. You will need a server. It is a lot of work. As a first step, I ended up writing a simple static website all in a single `index.html` file. I purchased `shravandhakal.com` from GoDaddy. I chose a free static hosting server. My site was live in 2016. It looked something like the following picture:

![2016](https://drive.google.com/uc?id=1dtJfYFnC1fjqNJXOdUn30FOvXj_vvZtM) 

As time progressed, I discovered more about web development. I learned about these bootstrap CSS that lets you make an incredible design with minimal effort. I stumbled upon, [w3schools](https://w3schools.com/). I figured I would apply this bootstrap CSS to my personal site. In 2018, I updated my site to look this:

![2018](https://drive.google.com/uc?id=16QjweTF9ddDNSQ4S3ZLH0n5YHjKUmvxP) 

The new site was fantastic. It had cool animation. It was responsive. It was all I could ask for. I ended up adding a “blog” feature a year later using Jekyll. This was working very well but it had one big flaw. Updating this site with new information was difficult. There was code duplication all over the place. Reading HTML files to make a simple update was not fun. In 2022, I decided I needed to revisit & redesign my website. Here is what my website looks like right now:

![2022](https://drive.google.com/uc?id=1rtua1pqCFEh2WWzWfFWTP7ekXyI1MqMi) 

# Redesign with React, Gatsby, & Tailwind
## Design
I wanted my website to remain minimal so I decided to go with a simple left-side nav bar and information on the right side. I tried utilizing [Figma](https://www.figma.com/) for all the mocks but after a few mocks, I felt confident in my design and did not want to spend any more time learning about Figma. Once I had a rough idea, I started my implementation. 

## Implementation

For this website, I wanted to focus fully on frontend and not use backend. For all content management, I wanted to save money on servers so I used Github Pages & Google Drive. For blogs, I utilize markdown files that sat alongside my compiled frontend code.

For frontend, I picked Gatsby framework along with React & Tailwind. My folder structure is similar to Gatsby starter project for Typescript. My `src` folder structure looks like this
```
src
├── components
│   ├── Icons
│   ├── Navbar
│   ├── Pages
│   ├── hooks
│   ├── seo.tsx
│   ├── socialLogos.tsx
│   └── tags.tsx
├── gatsby-types.d.ts
├── pages
│   ├── 404.tsx
│   ├── index.tsx
│   ├── md.css
│   └── {MarkdownRemark.frontmatter__slug}.tsx
├── posts
│   ├── 2021-01-30-Setup-Blog.md
│   ├── 2022-04-16-YAML2Dict.md
│   ├── 2022-09-06-Google-Home-Church-Bells.md
│   └── 2022-10-03-Gatsby-Website-Redesign.md
└── styles
    ├── global.css
    └── shared.tsx
```

I decided to break down as many components as I could so you will see Navbar, Pages, Icons, etc. Within `component/Pages`, you will see the main components per page.
```
component/Pages
.
├── blog.tsx
├── education.tsx
├── experience.tsx
├── inconstruction.tsx
└── intropage.tsx
```
I wanted to mention that I did not test any of these components as I felt a portfolio site is ok without automated tests. However, I did perform manual smoke tests before moving my code from the `dev` environment to `prod`. 


### SEO
One of the main reasons for using Gatsby was to utilize SEO. All search engines use crawlers to make your site searchable with their search engine. Adding SEO to your page was very simple using Gatsby. I simply had to use `siteMetadata` config, perform GraphQL to obtain the tag & attach it to the head of the page as `<meta>` tags. 


# Final Thoughts

In the end, redesigning my website has been a great experience. I got to learn 3 new tech, `Gatsby`, `Tailwind`, & `GraphQL`. I made my personal website searchable with the help of SEO `<meta>` tags. I made my personal site code more readable, maintainable & reusable in the long run. As for the future of this site, I will probably not go through another significant redesign unless there is a super fancy framework that is too good to miss out on. However, at some point, I do want to support different languages and themes so I look forward to working on that in the future.
