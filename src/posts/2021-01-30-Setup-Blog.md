---
slug: "/blog/my-first-post"
date: "2021-01-30"
title: "My first blog post"
tags: ['HTML', 'Github', 'Jekyll']
---

### *Step 1: Setup your github website*

[Here](https://pages.github.com/) is an official instruction on how to setup github site. 

### *Step 2: Setup blog*

1. Clone https://github.com/barryclark/jekyll-now 
2. Edit `_config.yaml` and `about.md` file and fill in the necessary informations.
3. Rename the blog's `index.html` to `blog.html`.

### *Step 3: Integrate your homepage and blog*

1. Go to your github site directory.
2. Copy your blog directory files to your github site directory
3. Go to your github site's `index.html` and to include your blog's hyperlink, just include `href=./blog`. 

**Note** : Reference should be `./blog` and **NOT* `./blog.html`. 

Go to `_posts/` directory and edit/add new blog page. You are all set! Happy blogging. 
