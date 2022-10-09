---
slug: "/blog/google-home-church-bell"
date: "2022-09-16"
title: Make Google Home Ring Church Bells Every Hour
---

## Background

On a Friday night, I went roller skating at White Center. I am a beginner roller skater so I expected myself to fall here and there but I did not expect my watch to break when I fell. Luckily, the watch is repairable. Until the watch is repaired, I am living without a watch on my hand and I have no idea how to keep track of the time. This made me remember how people in past reminded themselves of time. It was the church bell every hour. So I wanted to hack my Google Home to do the same.


## Hacking Google Home
I was expecting Google Home to provide an SDK or an API to just send a notification but that seemed difficult. Google Home SDK allows devices to notify in the event of someone ringing a doorbell or object detected via a security camera and many more. But to send a notification, you must be a "device". I spent about 1 hour on how to make this work and I did not like this approach. I had to make and register a fake device that would send notifications hourly to google home. Registering a device was a pain so I looked for alternatives and I found one.

## Casting to Google Home
After looking at numerous Github projects, I found this project called, [go-chromecast](https://github.com/vishen/go-chromecast) that would enable anyone to cast an audio file to the google home within the same network with a simple CLI. This method was very doable and here are the steps:

- Setup Raspberry Pi with wifi.
- Install Go and go-Chromecast CLI in the Raspberry Pi.
- Setup a shell script that pulls in the church bell mp4 file via a public dropbox URL. 
- Create a CRON Job to run this command every hour from 6 AM - 11 AM.

And that was all I had to do to make my google home ring church sound every hour. 

This simple IoT project was very fun and hands-on so this would be a good project for anyone who wants to understand how to apply code in real life. 


#### Future Blogs Topic Idea
- State Machines & Workflow Engines
