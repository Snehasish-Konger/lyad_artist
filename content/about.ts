/**
 * ============================================================================
 * ABOUT PAGE COPY — PLACEHOLDER
 * ============================================================================
 * Written in your voice as a starting point, but none of it is verified.
 * Rewrite freely. The layout adapts to however many paragraphs you leave here.
 * ============================================================================
 */

export const about = {
  /** Sits under the page title. One sentence. */
  lede: "I draw people — gods, strangers, grandparents, characters from films I have watched too many times.",

  /** The 2–3 line teaser used on the home page. */
  teaser:
    "I'm Snehasish. I work out of a small room in Gurugram, mostly in graphite and ink, and I take commissions one at a time so each one gets the attention it needs.",

  body: [
    "I started drawing the way most people do — copying comic panels in the back of a school notebook and getting the proportions wrong. The difference is I never really stopped. Somewhere between then and now it turned from a habit into the thing I do.",
    "Most of what I make is portraiture. Devotional work sits alongside pen-and-ink likenesses drawn from photographs people send me, and fan art of the films and manga I grew up inside. They feel like different bodies of work but they're the same problem every time: getting a face to look back at you.",
    "I work almost entirely in Procreate on an iPad, with brushes I've spent years tuning to behave like a 2B pencil on slightly toothy paper. For pen-and-ink pieces I still draw the underlying construction by hand first, on real paper, because I think faster with a pencil than with a stylus. The digital file is where it gets finished, not where it starts.",
    "What I'm actually after is the small thing that makes a specific person that person — the set of a jaw, the way someone's eyes go when they're about to laugh. It's why I ask for more reference photos than you'd expect, and why I'd rather take on fewer commissions and get them right.",
  ],

  /** Short factual list rendered as a definition table. */
  facts: [
    { label: "Based in", value: "Gurugram, India" },
    { label: "Tools", value: "Procreate on iPad Pro; graphite and pen on paper" },
    { label: "Works in", value: "Graphite, ink line, flat digital colour" },
    { label: "Turnaround", value: "Usually 1–3 weeks depending on the piece" },
    { label: "Ships", value: "Prints and originals across India" },
  ],
} as const;
