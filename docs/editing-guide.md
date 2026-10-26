# Editing the site

You edit the site's content in Pages CMS. The design can't be changed there, so nothing you do in it can break the layout. When you save, Pages CMS commits the change to GitHub, and Cloudflare rebuilds the site. This usually takes a minute or two.

[TBC: screenshots of each step, added once Pages CMS is connected]

## Before you start

1. Go to app.pagescms.org and sign in with your GitHub account.
2. Open **xashujo/conceptual-studio-site**.
3. Check which branch you're on. The branch name is shown in Pages CMS. Two branches matter:
   - **main** is the live site. Anything you save on main goes live.
   - **Any other branch** is a draft. Cloudflare gives it its own preview address and the live site doesn't change (see "Check a preview before it goes live" below).

What's in the CMS:

- **Projects**: your case studies.
- **Services**: the three services and their pricing ladders.
- **Testimonials**: quotes from clients, word for word.
- **Clients**: client names, and whether each one appears in "Worked with".
- **Site settings**: availability, your email, reply time and company details.

Never upload unpublished work or anything under an NDA. Everything you save is stored on GitHub. [TBC: confirm the repo is private. If it's public, anyone can see drafts there too.]

## Add a case study

1. If the client is new, add them first. Go to **Clients**, add a new entry and fill in the name. Tick "Show in Trusted by" only if you want them in the "Worked with" line.
2. Go to **Projects** and add a new entry.
3. Fill in the top fields:
   - **Title**: the project name, e.g. Strategic Intent.
   - **Web address**: the end of the page's address, in lowercase with hyphens, e.g. `new-city-college-strategic-intent`. Don't change it once the project is live, or old links will break.
   - **Client**, **Year**, **Disciplines** and **Sector**: pick from the lists.
   - **Outcome line**: one sentence on where the work was used. It appears on the project card.
4. **Cover image**: upload the photo and fill in **Alt text**. Alt text is a plain description of what the photo shows, written for people who can't see it. You can't save without it.
   - Use a photo of the work in use (signage, print, a screen), not a logo on a flat colour.
   - Upload a large file. The site makes the smaller sizes itself.
5. **Cover plate caption**: the two lines under the image.
   - Line 1 is the title, client and year, e.g. "Strategic Intent, New City College London, 2025".
   - Line 2 is the medium or what it is, e.g. "Map and timeline of the college mergers, 1990 to 2024".
6. **The problem**, **What I did** and **What happened**: a short paragraph each.
7. **Page sections**: build the rest of the page from these blocks, in the order you want:
   - Text
   - Full-width image
   - Two images side by side
   - Video
   - Big number
   - Quote
   - Chart image
   - Before and after

   Every image needs alt text and a plate caption.
8. For video:
   - A short loop under 25 MB can be uploaded directly.
   - A longer film goes on media.conceptualstudio.co.uk, and you paste its link instead. [TBC: that storage isn't set up yet]
9. Optional fields:
   - **Testimonial** links a quote you've already added under Testimonials.
   - **Next project** picks the case study linked at the bottom of the page.
10. Leave **Show on the home page** off unless you want the project featured. To hide a project from All work without deleting it, tick **Archive**.
11. Save.

## Change availability

1. Go to **Site settings**.
2. Choose what to change:
   - **Taking new projects** on or off shows or hides the green availability pill.
   - **Availability text** is the words in the pill. It currently says "Taking new projects".
3. Save.

## Reorder featured work

The home page shows up to three projects: one large card, then a pair.

1. Go to **Projects** and open each project you want on the home page.
2. Turn on **Show on the home page**.
3. Set **Home page position**: 1 is the large card, 2 and 3 are the pair.
4. To take a project off the home page, turn **Show on the home page** off.
5. Save each project.

If two projects share a number, they go in alphabetical order. Only the first three are shown, so turn off "Show on the home page" for any project that drops out.

## Check a preview before it goes live

To see a change before anyone else does, save it on a draft branch instead of main.

1. Create a draft branch on GitHub:
   - Open the repo.
   - Click the branch menu (it says **main**).
   - Type a name, e.g. `draft`.
   - Choose **Create branch: draft from main**.
2. In Pages CMS, switch to the `draft` branch and make your edits there.
3. Wait a minute or two, then open the preview at `https://draft.[TBC: Cloudflare project name].pages.dev`. Cloudflare also lists every preview address under the project's **Deployments** page.
4. If it looks right, put it live:
   - On GitHub, open **Pull requests** and choose **New pull request**, from `draft` into `main`.
   - Click **Merge**.

   The live site updates a minute or two later.
5. If it doesn't look right, fix it on the draft branch, or just never merge it.

Saving straight on main is fine for small things, like a typo or the availability pill.

## If something goes wrong

- **Pages CMS won't save.** A required field is empty. Fields marked as required must be filled before it will save.
- **The site hasn't changed after a few minutes.** Check the latest deployment in Cloudflare. If the build failed, its log names the file and field, usually a missing image or alt text.
- **You want to undo a change.** Every save is a commit on GitHub. Ask Claude to revert it, or find it in the repo's commit history.
- **You want to change the design.** That's not editable here on purpose. Ask Claude.
