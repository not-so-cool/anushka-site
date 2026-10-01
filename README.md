# For Anushka — 15 years

A small scroll-driven letter and memory capsule.
React + Vite + Tailwind + GSAP (ScrollTrigger) + Lenis. Nothing else.

## Run it

    npm install
    npm run dev

Open the local URL Vite prints (it is also exposed on your network, so you can
check it on your phone). Build with `npm run build`, preview with `npm run preview`.
Node 18 or newer.

## Add the photos

Drop the files into `public/images/` with these exact names:

- anushka-01.jpg … anushka-06.jpg
- memory-01.jpg … memory-08.jpg
- paris-01.jpg … paris-06.jpg

Any file that is missing shows a paper-toned placeholder reading
"REPLACE → /public/images/<name>.jpg", so you can see exactly what goes where.

Tips: use JPGs around 1600px on the long edge. If a face gets cropped badly, edit
that photo's `focal` value in `src/data/anushkaData.js` (for example "50% 20%"
keeps the top of the frame), and write a real `alt` description while you are there.

## Edit the words

Everything lives in `src/data/anushkaData.js`:

- The letter: `letter.text`. Blank lines separate paragraphs. Replace
  `[YOUR NAME]` in the sign-off. Short paragraphs read best.
- Captions: the `caption` field on each photo. Use an empty string for none.
- "Things I remember" lines: `remember.lines`. `from` can be left, right, up or down.
- India → Paris: `journey` (labels, coordinates, dateline, closing line).
- Ending: `ending.lines`. `hold` is how many seconds a line stays before the next.
- The cursor label: `cursor.label`.

## Reduced motion

If the visitor's system asks for reduced motion, smooth scrolling, pinning and
scrubbed movement are turned off, and everything is simply revealed with fades.
