# Conceptual Studio website

This is the code behind conceptualstudio.co.uk. This guide covers the parts you'll actually use.

## What it's made of

The site is built with Astro, a tool that turns the text and images in this folder into a fast, plain website. The files live in a private GitHub repository called xashujo/conceptual-studio-site (a repository is a folder on GitHub that keeps every version of every file). Cloudflare Pages hosts the site and rebuilds it whenever something in the repository changes. You edit words, images and prices in Pages CMS, a website that saves your changes straight into the repository. The contact form sends messages through Web3Forms, so there's no server to look after.

## Editing with Pages CMS

Go to app.pagescms.org, sign in with GitHub and pick conceptual-studio-site. Every time you press Save, Pages CMS records the change on GitHub and Cloudflare rebuilds the site. The new version is usually live within a couple of minutes.

If a save has a problem, such as a missing image, the build fails and the previous version stays live. Failed builds show in Cloudflare under Deployments.

### Adding a project

1. Open Projects and add a new entry.
2. Fill in the title, the client and the year. The web address is made from the title when you first save, so "Fou Answer" becomes /work/fou-answer/.
3. Choose a category: brand, data or motion. Then list your disciplines, one per line (for example Brand identity, Infographics).
4. Write the one-line summary. It sits under the project on the homepage, so keep it short.
5. Upload a cover image and write its alt text. Alt text is a sentence describing the image for people who use screen readers, and search engines read it too. Describe what's actually in the picture, like "Three prospectus covers in purple and orange on a desk". "Cover image" tells nobody anything.
6. Fill in The problem, What I did and What happened. A paragraph or two each is plenty.
7. Under Gallery, add blocks in the order you want them on the page: one image (full, wide or narrow), two images side by side, a block of text, a big number, or a video. Every image needs its own alt text. Drag blocks to reorder them.
8. Near the top of the form there are three settings. Tick Show on homepage to feature the project, and use Homepage position to set where it goes (1 is first). Tick Archive to move an older project out of the main list.
9. Save.

Images can be JPG, PNG, WebP or AVIF. Upload your best export; Astro resizes and compresses them when the site builds.

### Changing prices on a service

Open Services, pick the service and scroll to Prices. Each package has a starting price in pounds. Type the number only, with no £ sign or commas, so 2400 rather than £2,400. Leave it empty if the package has no fixed starting price. The note that sits under the prices is in Site settings.

### Adding a testimonial

Open Testimonials and add a new entry. Paste the quote exactly as the client wrote it, including their spelling and punctuation. Don't correct or improve it, because it has to be what they actually said. If you want a shorter version for small spaces, put it in Short version, using only their words and marking any cuts with "…". Add their name, role and organisation, then save. To show a testimonial on a project, open the project and choose it under Testimonial. Only publish quotes the client is happy for you to share.

### Updating your availability

Open Site settings and find Availability. Available from takes the year and month written as YYYY-MM, so November 2026 is 2026-11. Untick Show availability to hide the line altogether.

The site works this line out at the moment it's built, so a small automatic job rebuilds it every Monday morning to keep it up to date. It's under the Actions tab on GitHub, where you can also run it by hand.

## What never goes in the repository

It's private, but anyone you add to it, and any app you give access, can read everything inside. Keep these out:

- client agreements, contracts and quotes
- anything under an NDA, and work that hasn't been released yet
- raw source files (Illustrator, Photoshop, After Effects, Houdini), which belong in your own backups
- passwords and private keys

The Web3Forms access key is the one exception. It's designed to sit in the page where anyone can see it.

## First-time setup on Cloudflare Pages

1. Log in to Cloudflare and go to Workers & Pages, then Create, then the Pages tab, then Connect to Git.
2. Connect your GitHub account. When GitHub asks which repositories Cloudflare can see, choose Only select repositories and pick conceptual-studio-site. Don't give it access to anything else.
3. Set the framework preset to Astro, the build command to `npm run build` and the build output directory to `dist`.
4. Under Environment variables, add `NODE_VERSION` with the value `22`. This tells Cloudflare which version of Node (the program that builds the site) to use.
5. Save and deploy. The first build takes a few minutes.
6. Cloudflare gives you an address ending in .pages.dev. Open it and check the site properly, on your phone and on your laptop.
7. In the project's Custom domains tab, add conceptualstudio.co.uk, then add www.conceptualstudio.co.uk as well. The main address only starts working once the domain's DNS is on Cloudflare (see Going live below).
8. In the project's settings, find Deploy hooks in the build section. Add one called "Weekly rebuild" for your main branch and copy the web address it gives you.
9. On GitHub, open the repository and go to Settings, then Secrets and variables, then Actions, then New repository secret. Name it `CF_PAGES_DEPLOY_HOOK` and paste the address. Treat it like a password, because anyone who has it can make the site rebuild.

## The contact form

Go to web3forms.com and create a free access key with joshua@conceptualstudio.co.uk, which is where messages will arrive. Paste the key into Site settings, in the Web3Forms access key box, and save. Until you do, the form opens an email instead.

## Optional settings

These are all in Site settings.

- Booking link: paste a Cal.com link if you want people to be able to book a call with you.
- Analytics token: from Cloudflare Web Analytics, which counts visits without cookies. Leave it empty if you don't want any analytics.
- Company number and registered office: UK law requires a limited company's website to show its company number and registered office address, along with the name and where it's registered (those two are already filled in). Add them before the site goes live.
- VAT number: add this if you're VAT registered.

## Going live

1. Keep the current GitHub Pages site running until you've checked the Cloudflare preview on your phone and on desktop.
2. Move the domain's DNS to Cloudflare. DNS is the address book that points conceptualstudio.co.uk at whichever server hosts it. Cloudflare walks you through it when you add the domain, and you'll change the nameservers at your domain registrar (the company you bought the domain from). It can take a few hours.
3. Visit https://conceptualstudio.co.uk and https://www.conceptualstudio.co.uk and check both load with the padlock showing. Then try a few old links, such as conceptualstudio.co.uk/fou-answer, and check they land on the new project pages.
4. Once all that works, switch off GitHub Pages on the old public repository (in its Settings, under Pages).

## Check your edits show as you

After your first edit in Pages CMS, open the repository on GitHub and look at the latest commit (the record of that change). It should show your name and picture. If it shows a bot or anyone else, switch to Sveltia CMS, which saves changes under your own GitHub account so the history only ever shows you.

## Security basics

Turn on two-factor sign-in, where you enter a code from your phone as well as your password, for GitHub, Cloudflare, your domain registrar and Web3Forms. Between them those four accounts control the whole site.
