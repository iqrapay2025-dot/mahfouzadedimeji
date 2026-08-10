# Prof. Mahfouz A. Adedimeji — Full Figma Make Design Prompt
## Public Site + Custom Admin Panel, with Realtime Sync, Scalability & Security

## Overview

Design a two-part system for **Prof. Mahfouz A. Adedimeji** — a Nigerian professor, Fulbright scholar, and public intellectual (Pragmatics/Applied Linguistics, former Vice Chancellor). This is a personal academic/public-intellectual brand platform, not a business site.

**Part A:** Public-facing website (what visitors see)
**Part B:** Custom admin panel (private, for him only) to upload/manage all content

Content uploaded via the admin panel must reflect on the public site **in real time** — no manual redeploy, no delay, no page refresh required for new content to appear to a visitor already browsing.

---

## PART A — Public Site

### Brand Feel
Scholarly, dignified, credible — not playful or trendy. Should feel like the digital presence of an academic authority and public intellectual.

- **Color palette:** Deep navy or maroon as primary, warm gold as accent, cream/off-white background — evokes academic gravitas and Islamic-scholarly tone without being overtly religious in styling
- **Typography:** A serious serif for headings (evoking print/publishing heritage), clean sans-serif for body text
- **Imagery:** Professional portrait photography, subtle academic/library motifs, avoid stock-photo stiffness

### Pages

**1. Home**
- Hero: name, title ("Professor of Pragmatics and Applied Linguistics, Fulbright Scholar, Public Intellectual"), short intro line
- Featured/recent posts grid, pulling dynamically from the latest content across categories
- Category showcase: Edupeace, Books Review, The Alma Mater, Renaissance, Give & Take, Islam
- Highlighted recent achievement or lecture (e.g. "Recently delivered the 3rd Anniversary Lecture at Thomas Adewumi University")

**2. Biography**
- Full professional biography — academic history, VC roles, fellowships, awards, affiliations (content already drafted separately)

**3. Publications**
- Three filterable sections: **Books**, **Book Chapters**, **Journal Articles**
- Each entry: title, co-authors/editors, publisher, year, page range — structured as data entries, not a wall of text
- Search/filter by year or keyword

**4. Blog / Articles**
- Filterable by category (Edupeace, Books Review, The Alma Mater, Renaissance, Give & Take, Islam)
- Each post: title, category tag, publish date, featured image, excerpt, full content page
- Pagination or infinite scroll for the growing archive (10+ years of content)

**5. Contact**
- Contact form, email, social links

### Realtime Behavior (Public Site)
- New posts, edited posts, and updated publications published from the admin panel must appear on the public site without requiring a manual rebuild or redeploy
- Use a live data subscription (e.g. Supabase Realtime or WebSocket-based updates) so that if a visitor is already on the Blog or Home page when new content is published, it can appear via a live "New post available" prompt or automatic insertion, without a hard refresh

---

## PART B — Admin Panel

### Design Approach
Completely separate visual system from the public site — utilitarian, dashboard-style, functional over decorative. Should feel like a clean internal tool, not a branded page.

### Screens

**1. Login**
- Email + password fields, "Forgot password" flow, no auto-filled sensitive info displayed in plain text
- Generic error messaging on failed login (no detail on whether email or password was wrong)

**2. Dashboard**
- Overview: total posts, total publications, recent activity feed, quick "Add New" buttons

**3. Post Editor (Add/Edit)**
- Title field, category selector (from the fixed category list), rich text body editor (bold, italics, links, images, quotes), featured image upload, Draft/Published toggle, "Publish" button
- Clear save-state feedback (saving.../saved/error)

**4. Publications Manager**
- Separate structured forms for Books, Book Chapters, and Journal Articles — each with its own relevant fields (authors, publisher, year, pages, journal name/volume where relevant) rather than one generic text field
- List view with edit/delete actions

**5. Media Library**
- Grid of uploaded images, upload button, delete/reuse existing images across posts

**6. Settings**
- Editable bio text, contact info, social links — so he can update these without needing a developer

### Realtime Behavior (Admin Panel)
- Publishing or editing a post/publication should write to the database and reflect on the public site within seconds
- Show a live "Published successfully — now live on site" confirmation after publish

---

## Scalability Requirements (Design/Component Level)

- Build all repeated UI (blog post cards, publication entries, category tags, admin list rows) as true reusable components with variants — this content will grow to hundreds of entries over years, so components must not be one-off duplicated frames
- Use auto layout throughout so cards/lists gracefully handle short or long titles, missing images, or long author lists
- Design the Blog and Publications pages to handle pagination or infinite scroll from day one — do not design for "a handful of items," design for hundreds
- Define spacing/type scale as shared variables/styles so future page additions (e.g. a "Media/Press" page) stay visually consistent without rework
- Admin panel list views (Posts, Publications, Media) must be designed assuming large volumes — include search/filter/sort controls in the design, not just a flat unpaginated list

## Security-Adjacent UI Patterns

*(Design-layer only — this does not replace real backend security work, which a developer must implement separately.)*

- Login screen: masked password field, no plaintext password display, generic (non-revealing) error messages on failed attempts
- Admin panel must be visually and structurally distinct from the public site, with no shared navigation path — a public visitor should never see a link to the admin panel
- Design a session-timeout notice/screen for the admin panel (e.g. "Your session has expired, please log in again")
- File upload UI (Media Library, featured image upload) should show file type/size constraints clearly (e.g. "JPG/PNG, max 5MB") to guide safe uploads
- Design a confirmation modal for destructive actions (deleting a post, publication, or media file) — "Are you sure? This cannot be undone."
- Do not design any screen that displays raw database IDs, API keys, or internal error stack traces to the admin user — errors should be human-readable only

## Out of Scope (flag separately — requires developer work, not design)

- Actual authentication implementation, database security rules, and realtime sync infrastructure (e.g. Supabase Row Level Security policies) must be built by a developer
- Server-side rate limiting, DDoS protection, and hosting-level scalability (CDN, caching) are backend/infra concerns, not design concerns
- Data backup and recovery strategy for 10+ years of content should be planned separately with whoever builds the backend

---

## Recommended Skill Workflow

1. **`design-brief-generator`** — confirm final scope with him (content migration plan, exact category list, whether books are sold or just listed) before generating screens
2. **`design-first-ui-prompting`** — convert each screen (public + admin) into a precise per-screen Figma-ready prompt before generating
3. Generate Part A (public site) and Part B (admin panel) as separate Figma Make projects/files, given their different visual systems
4. **`layout`** — run on each generated screen for spacing/grouping/density
5. **`responsive-breakpoint-check`** — public site must work on mobile (most visitors); admin panel should at minimum work on tablet/desktop, since he'll likely manage content from a laptop
6. **`accessibility-audit`** — especially important for the public site given the reading-heavy, academic audience
7. **`microcopy-generator`** — draft real button labels, save-state messages, empty states (e.g. "No posts yet" on a fresh Blog page), and error messages
8. **`improve-ui`** — scoped audit on the Home page and Post Editor screen (highest-traffic and highest-use surfaces)
9. **`design-crit`** — severity-ranked critique pass before finalizing either system
10. **`polish`** — final refinement pass once both systems are built and reviewed

## Next Step After Design

Once both Figma Make designs are approved, scaffold the real build as: React + Vite frontend (public site), a separate React admin app (or an admin route within the same app, access-gated), and Supabase as the backend (Postgres database + Auth + Storage + Realtime subscriptions) — Supabase's built-in Realtime feature is what will make admin uploads reflect on the public site instantly, satisfying the realtime requirement above without building custom WebSocket infrastructure from scratch.
