/**
 * ============================================================================
 * ABOUT PAGE COPY
 * ============================================================================
 * `intro` opens the page (the first paragraph is set large), `sections` are
 * the headed chapters below it, and `closing` is the pull quote + sign-off.
 * The layout adapts to however many sections and paragraphs you leave here.
 * ============================================================================
 */

export const about = {
  /** Sits under the page title. One sentence. */
  lede: "I draw people. Gods, strangers, grandparents, and characters from films I've watched far too many times.",

  /** The 2–3 line teaser used on the home page. */
  teaser:
    "S. Konger Arts is the studio and practice of artist Snehasish Konger. I work out of a small room in Gurugram, mostly in graphite and ink, and I take commissions one at a time so each one gets the attention it needs.",

  intro: [
    "Some faces arrive from memory, some from a photograph sent late at night, and some from stories I've carried around for years. However they reach the page, I want them to leave it feeling like someone you know.",
    "I'm Snehasish Konger, and S. Konger Arts is where that happens: a small studio in Gurugram, India, making devotional portraits, pen-and-ink likenesses and digital illustration. The work lives somewhere between looking very, very carefully and the plain, stubborn joy of putting a pencil to paper.",
  ],

  sections: [
    {
      id: "notebook",
      heading: "It started in a school notebook",
      body: [
        "Like a lot of people, I began by copying comic panels into the back pages of school notebooks. Heads too big, eyes too far apart, hands tucked into pockets because hands were hard. The notebooks filled up. I found more. Slowly, the proportions stopped being wrong.",
        "Somewhere along the way, drawing stopped being how I passed the time and became how I paid attention: to people, to stories, to the small details most of us walk straight past.",
        "I never really stopped. I just ran out of back pages.",
      ],
    },
    {
      id: "faces",
      heading: "Different faces, the same obsession",
      body: [
        "A deity. A grandmother from a faded photograph. A footballer mid-celebration. A character from a film whose credits rolled years ago. Side by side they could pass for the work of four different people, but they're the same question asked four ways: how do you make a drawing feel alive?",
        "The answer is never just proportion. A portrait can get every measurement right and still look like a stranger wearing your face. What makes it work is the tilt of a head, the line of a jaw, the way someone's eyes change half a second before they laugh. That last, stubborn detail, the one that makes the person suddenly arrive on the page, is the part I chase.",
      ],
    },
    {
      id: "process",
      heading: "Pencil first. Pixels later.",
      body: [
        "Most of my finished work happens in Procreate on an iPad, with brushes I've spent years tuning until they drag like a 2B pencil across slightly toothy paper.",
        "Pen-and-ink portraits still begin on real paper, though. I rough out the structure by hand first, the skull under the face and the angle of the shoulders, because I think faster with graphite than with glass. Only once the character of the face is settled does it move onto the screen for the fine work.",
        "To me the iPad is just another pencil. It doesn't replace the hand. It follows it.",
      ],
    },
    {
      id: "stories",
      heading: "Every face has its own story",
      body: [
        "Portraits ask for patience. Often the whole likeness hangs on one tiny correction: a line nudged by a millimetre, a shadow softened, and suddenly the drawing tips over from close to them.",
        "That's why I ask for more than one photograph when you commission a portrait. One catches the smile, another shows how the eyes sit, a third shows where the light falls. Together they let me draw the person, not just the picture.",
        "It's also why I take on fewer commissions than I could. I'd rather give each face the time it needs than rush through a queue of them.",
      ],
    },
  ],

  closing: {
    quote:
      "The goal was never to draw someone who looks like you. It's to draw someone who feels like you.",
    signoff:
      "Whether it's someone you love, a figure of devotion, or a character you can't let go of, every piece starts in the same place: a face worth drawing. Welcome to S. Konger Arts.",
  },

  /** Short factual list rendered as a definition table. */
  facts: [
    { label: "Based in", value: "Gurugram, India" },
    { label: "Tools", value: "Procreate on iPad; graphite and pen on paper" },
    { label: "Styles", value: "Graphite portraits, ink linework, flat-colour digital illustration" },
    { label: "Turnaround", value: "Usually 1–3 weeks, depending on the piece" },
    { label: "Ships", value: "Prints and originals across India" },
  ],
} as const;
