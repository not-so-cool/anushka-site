/**
 * ALL editable content lives here.
 * Photo objects share one shape: { id, src, alt, focal, caption }
 *  - src:     path inside /public (so "/images/x.jpg" = public/images/x.jpg)
 *  - alt:     meaningful description for screen readers
 *  - focal:   CSS object-position, e.g. "50% 30%" (keeps faces in frame when cropped)
 *  - caption: tiny handwritten note ('' for none)
 */

const anushkaData = {
  meta: {
    title: 'For Anushka — 15 years',
    recipient: 'Anushka',
    author: 'Akul',
    yearsKnown: 15,
  },

  cursor: {
    label: 'view memory',
  },

  /* 1 — OPENING */
  opening: {
    title: 'ANUSHKA',
    subtitle: '15 years of knowing you.',
    tagline: "and somehow, we're still here.",
    hint: 'scroll to begin ↓',
  },

  /* 2 — 15 YEARS */
  years: {
    number: '15',
    word: 'years',
    line: "That's roughly half our lives. Which is honestly a little insane.",
    photos: [
      {
        id: 'years-1',
        src: '/images/anushka-01.jpg',
        alt: 'Anushka and me as kids, early photo. Replace with a real description.',
        focal: '50% 35%',
        caption: '',
      },
      {
        id: 'years-2',
        src: '/images/anushka-02.jpg',
        alt: 'Anushka and me a few years later. Replace with a real description.',
        focal: '50% 40%',
        caption: '',
      },
      {
        id: 'years-3',
        src: '/images/anushka-03.jpg',
        alt: 'Anushka and me as teenagers. Replace with a real description.',
        focal: '50% 30%',
        caption: '',
      },
    ],
  },

  /* 3 — MEMORY WALL (exactly one horizontal sequence: `horizontal`) */
  memoryWall: {
    scatter: [
      {
        id: 'wall-1',
        src: '/images/memory-01.jpg',
        alt: 'A childhood memory of us together. Replace with a real description.',
        focal: '50% 40%',
        caption: 'somewhere along the way',
      },
      {
        id: 'wall-2',
        src: '/images/memory-02.jpg',
        alt: 'Us looking very pleased with ourselves. Replace with a real description.',
        focal: '50% 35%',
        caption: '',
      },
      {
        id: 'wall-3',
        src: '/images/anushka-04.jpg',
        alt: 'Anushka mid-laugh. Replace with a real description.',
        focal: '50% 30%',
        caption: 'we were very cool',
      },
      {
        id: 'wall-4',
        src: '/images/anushka-05.jpg',
        alt: 'A quiet moment with Anushka. Replace with a real description.',
        focal: '50% 45%',
        caption: 'Lol',
      },
    ],
    stack: [
      {
        id: 'stack-1',
        src: '/images/anushka-06.jpg',
        alt: 'Anushka and me at a school event. Replace with a real description.',
        focal: '50% 35%',
        caption: '',
      },
      {
        id: 'stack-2',
        src: '/images/memory-03.jpg',
        alt: 'A group memory. Replace with a real description.',
        focal: '50% 40%',
        caption: '',
      },
      {
        id: 'stack-3',
        src: '/images/memory-04.jpg',
        alt: 'A more recent photo of us. Replace with a real description.',
        focal: '50% 35%',
        caption: '23! You are getting old',
      },
    ],
    horizontal: [
      {
        id: 'strip-1',
        src: '/images/memory-05.jpg',
        alt: 'Strip photo one. Replace with a real description.',
        focal: '50% 40%',
        caption: '',
      },
      {
        id: 'strip-2',
        src: '/images/memory-06.jpg',
        alt: 'Strip photo two. Replace with a real description.',
        focal: '50% 40%',
        caption: '',
      },
      {
        id: 'strip-3',
        src: '/images/memory-07.jpg',
        alt: 'Strip photo three. Replace with a real description.',
        focal: '50% 40%',
        caption: '',
      },
      {
        id: 'strip-4',
        src: '/images/memory-08.jpg',
        alt: 'Strip photo four. Replace with a real description.',
        focal: '50% 40%',
        caption: '',
      },
    ],
  },

  /* 4 — THINGS I REMEMBER (`from`: left | right | up | down) */
  remember: {
    heading: 'Things I wont forget, ever',
    lines: [
      { text: 'the stupid conversations', from: 'left' },
      { text: 'the ups and downs', from: 'right' },
      { text: "laughing at things that weren't even funny", from: 'up' },
      { text: 'somehow always having something to talk about', from: 'left' },
      { text: 'watching life change around us', from: 'down' },
      { text: 'growing up without really noticing', from: 'right' },
    ],
  },

      screen: {
    heading: 'Creed Anushka.',
    title: 'Birthday scene from your favourite show',
    videoSrc: '/videos/birthday.mp4',
    poster: '',
    note: 'happy birthday, the way it should be done',
  },

  /* 5 — A SMALL LETTER
   * Replace `text` freely. Blank lines separate paragraphs; the section
   * reveals it line by line. Keep the sign-off as the last paragraph. */
  letter: {
    heading: 'A small letter.',
    text: `Dear "Formula",

15 years is a strange amount of time.

It's long enough to remember completely different versions of ourselves, and somehow short enough to wonder where all that time went.

From being kids to whatever we're supposed to call ourselves now...

and now you're in France, long way from home.

There's something really cool about watching someone you've known for half your life start an entirely new chapter.

So this isn't really a goodbye.

It's just a reminder that no matter how far away life takes us, there will always be a version of us somewhere back there, laughing at something stupid, and growing up together.

Hopefully, our next meet happens in Europe, cant wait for that!

(PS: Dont forget about our secret mission "Baguette Breakout")

Here's to the next chapter.

— God of Thunder`,
  },
// Updated website content
  /* 6 — INDIA → PARIS */
  journey: {
    intro: 'And then you moved.',
    route: 'Pune → Rouen',
    from: { label: 'Pune', coords: '20.59° N, 78.96° E' },
    to: { label: 'Rouen', coords: '49.44° N 1.09° E' },
    reveal: {
      title: 'Rouen',
      dateline: 'Rouen, 2026',
      photo: {
        id: 'paris-hero',
        src: '/images/paris-01.jpg',
        alt: 'A wide view of Paris. Replace with a real description.',
        focal: '50% 50%',
        caption: '',
      },
      line: 'Different city. Different chapter. Same Anushka.',
    },
  },

  /* 7 — HER NEW CHAPTER */
  chapter: {
    photos: [
      {
        id: 'chapter-street',
        src: '/images/paris-02.jpg',
        alt: 'A Paris street. Replace with a real description.',
        focal: '50% 50%',
        caption: 'new city',
      },
      {
        id: 'chapter-university',
        src: '/images/paris-03.jpg',
        alt: 'Her university in Paris. Replace with a real description.',
        focal: '50% 40%',
        caption: '',
      },
      {
        id: 'chapter-cafe',
        src: '/images/paris-04.jpg',
        alt: 'A café in Paris. Replace with a real description.',
        focal: '50% 50%',
        caption: 'still not over this view btw',
      },
      {
        id: 'chapter-architecture',
        src: '/images/paris-05.jpg',
        alt: 'Paris architecture. Replace with a real description.',
        focal: '50% 30%',
        caption: '',
      },
      {
        id: 'chapter-night',
        src: '/images/paris-06.jpg',
        alt: 'A night walk in Paris. Replace with a real description.',
        focal: '50% 60%',
        caption: '',
      },
    ],
    closing: 'Go make the place yours.',
  },

  /* 8 — ENDING (`hold` = seconds each line stays before the next arrives) */
  ending: {
    lines: [
      { text: '15 years down.', hold: 1.1 },
      { text: 'Who knows how many to go.', hold: 2.0 },
      { text: 'The next time we meet, it’ll be somewhere in Europe.', hold: 2.0 },
      { text: 'Not goodbye. Just until then.', hold: 1.4, small: true },
    ],
    heart: '♥',
    candle: { hint: 'make a wish', after: 'Happy birthday, Anushka.' },
  },
}

export default anushkaData
