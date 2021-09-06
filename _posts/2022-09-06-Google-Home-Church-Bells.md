---
layout: post
title: Make Google Home Ring Church Bells Every Hour
---

## Background

On a Friday night, I went roller skating at White Center. I am a beginner roller skater so I expected myself to fall here and there but I did not expect my watch to break when I fell. Luckily, the watch is repair-able. Until the watch is repaired, I am living without a watch on my hand and I have no idea how to keep track of the time. This made me remember the how people in past reminded themselves of time. It was the church bell every hour. So I wanted to hack my Google Home to do the same.


## Hacking Google Home
I was expecting Google Home to provide SDK or API to just send a notification but that seemed difficult. Google Home SDK allows devices to notify in the event of someone ringing a doorbell or object detected via security camera and many more. But in order to send a notification, you must be a "device". I spent about 1 hour on how to make this work and I did not like this approach. I had to make and register a fake device that would send notification hourly to google home. Registering a device had a lot of security challenge and I was not familiar with Google Cloud and Google Home SDK Authentication procedure so I looked for alternatives and I found one.

## Casting to Google Home
After looking at numerous github project, I found this project called, [go-chromecast](https://github.com/vishen/go-chromecast) that would enable anyone to cast a audio file to the google home within the same network with a simple CLI. This method was very doable and here is what I did:

- Setup Raspberry PI with my home wifi.
- Installed Go and go-chromecast CLI in PI.
- Setup a simple shell script that pulled in the church bell mp4 file via my dropbox URL. 
- Created a CRON Job to run this command every hour from 6 AM - 11 AM.

And that as all I had to do to make my google home ring church sound every hour. 

This simple IoT project was very fun and hands on so this would be a good project for anyone who wants to understand how to apply coding in real life. 


#### Future Blogs Topic Idea
- State Machines & Workflow Engines
