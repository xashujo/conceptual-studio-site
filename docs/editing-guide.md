# Editing the site

You change the site's words, images, projects and prices in **Pages CMS**, a free editor that works like filling in a form. You don't touch any code, and the design is locked, so nothing you do there can break the layout.

When you press **Save**, the change goes to GitHub and the site rebuilds itself. It's live a minute or two later.

## Set it up (once)

1. Go to **app.pagescms.org**.
2. Click **Sign in with GitHub** and allow it.
3. Pick **xashujo/conceptual-studio-site**.
4. At the top, check the branch says **main**. That's the live site.

In the menu on the left you'll see:

- **Projects**: everything on the Work page, the case studies, and what's featured on the home page.
- **Services and prices**: the three services and their pricing ladders.
- **Testimonials**: client quotes.
- **Clients**: the names under "Worked with".
- **Site settings**: the green availability dot, your email, reply time, social links and company number.

Never upload unpublished work or anything under an NDA. Everything you save is kept on GitHub.

## Change a price

1. Open **Services and prices** and pick the service.
2. Open the rung under **Pricing ladder**.
3. Change **Price**. Type it exactly as it should appear, e.g. `From £4,900`.
4. Save.

The first rung's price also shows on the Services page and the home page, so those update by themselves. The one exception is Social media editing, which has its own **Home page price** line ("From £200 per video"), so change that too if the single-edit price changes.

## Add a new project

1. Open **Projects** and click **Add an entry**.
2. Fill in:
   - **Title**, **Client** and **Year**.
   - **Web address**: the end of the page address, in lowercase with hyphens, e.g. `southbank-heat-maps`.
   - **Disciplines**: one per line, e.g. Data visualisation.
   - **Work page filters**: which filter buttons it shows under.
   - **Position on the Work page**: lower comes first. Projects go up in tens, so 15 puts it between the first and second.
   - **One-line description**: shown on the card.
3. **Cover image**: upload the photo, then fill in the description (what the image shows, in plain words) and the caption (the small line under it). Upload the biggest file you have; the site makes smaller sizes itself.
4. Save. It's now on the Work page as a card.

### Give it its own page (a case study)

On the same project:

1. Tick **Has its own case study page**.
2. Fill in **Outcome**, **The problem**, **What I did** and **What happened**. Leave an empty line between paragraphs.
3. Under **The work (image rows)**, add a row for each line of images. Choose the layout (one large, two, three or four), then add the images to it.
4. Add **Before** and **After** images if you have them.
5. Save. The page appears at conceptualstudio.co.uk/work/ followed by the web address.

## Change the selected work on the home page

1. Open **Projects** and open a project.
2. Tick **Show on the home page** and set **Home page position**:
   - 1 and 2 are the large cards.
   - 3 and 4 are the pair side by side.
3. Untick **Show on the home page** on any project you're replacing.
4. Save each project.

The New City College card also has **Charts under the card on the home page**. Any project can have up to three, and you can remove them there.

## Swap an image

Open the project, click the image, and upload a new one. Update its description and caption to match. If the crop looks wrong, fill in **Cover crop**: `50% 0%` keeps the top, `50% 100%` the bottom, `0% 50%` the left.

## Turn availability on or off

**Site settings** → **Taking new projects**. Off hides the green dot on the home page. **Availability text** changes its words.

## Check a change before it goes live

For bigger changes, edit a draft copy first.

1. On GitHub, open the repo, click the branch menu (it says **main**), type `draft`, and choose **Create branch: draft from main**.
2. In Pages CMS, switch the branch at the top to `draft` and make your edits.
3. In Cloudflare, open the site's **Deployments** page and click the `draft` preview.
4. If it looks right, on GitHub go to **Pull requests** → **New pull request**, choose `draft` into `main`, and click **Merge**. It goes live a minute or two later.

## If something goes wrong

- **It won't save.** A required field is empty, often an image description.
- **The site hasn't changed after five minutes.** The rebuild failed. In Cloudflare, open the latest deployment; the log names the file and the field. Or ask Claude.
- **You want to undo something.** Every save is kept on GitHub, so it can always be put back. Ask Claude.
- **You want to change the design, or add a new service page.** That's code, so ask Claude.
