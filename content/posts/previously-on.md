---
type: concept
title: Previously On
description: A mobile app that catches you up on a physical book, spoiler-free, right to the page where you stopped.
date: 2026-11-08
tags: [Mobile app, Reading, AI]
---

## The problem

I put books down for weeks at a time (I'm a slow reader). When I pick one back up, I have no idea where I'm at. Who is this character again? Why is everyone angry at the brother? I end up flipping back through chapters I've already read, or I give up on the book.

E-readers have started to solve this. They know your exact position, and Kindle's X-Ray can tell you who a character is. Paper books get nothing, and I still like reading on paper because come on now, I gotta take a break from the screen at some point right?

## The idea

**Previously On** is a phone app that works like the "previously on…" recap at the start of a TV episode. You tell it which book you're reading and where you stopped, and it gives you a short catch-up of everything up to that point and nothing after it. You can do this with ai these days, but from my experience it's not perfect and you get spoilers all the time.

A recap would cover:

- **What's happened so far**, in a few short paragraphs, weighted toward the most recent chapters
- **Who's who**: the characters introduced so far, each with a line on who they are and how they connect to everyone else
- **Open threads**: questions the story has raised but not answered yet (this would be fun i think)

## How it might work

1. **Add the book.** Scan the barcode on the back cover, or search by title, or maybe even take a pic of the page you're on.
2. **Mark your place.** Enter a page or chapter number, or take a photo of the page you're on and let the app work out where that is.
3. **Read the recap.** Short by default, with a "tell me more" option for a longer version.
4. **Look someone up mid-chapter.** Type a name and get that character's story so far, stopping at your page.

## The one rule: no spoilers!! 

The whole app is worthless if it ruins the book. Everything it says has to come from the pages before your bookmark. That means it can't simply ask a model what it knows about the book, because that knowledge includes the ending. It needs the text itself, split up by chapter, so a recap can only draw on what you've already read.

## Open questions

- **Where does the text come from?** Publishers would need to license it, or readers would need to own a digital copy. This is the biggest unknown and probably decides whether the idea is viable at all.
- **Do page numbers line up?** Hardcover, paperback and other editions paginate differently. Chapters are more stable, and a photo of the page might be the most reliable option.
- **How much recap is the right amount?** Too little doesn't help, and too much retells the book.
- **Is it a series feature too?** Catching up on books one to three before book four comes out is the same problem at a bigger scale.

## What I'd build first

A throwaway prototype with one public domain novel, where I already have the full text. I'd split it into chapters, generate recaps that stop at a given chapter, and see whether they actually help me get back into the book. If they do, the next step is the harder part: getting real books in.
