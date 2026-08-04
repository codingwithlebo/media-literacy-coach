// Content for the Learn hub. Lessons are short read cards; challenges are
// interactive "spot the red flag" questions that teach *why*, not just score.

export interface Lesson {
  title: string;
  minutes: number;
  blurb: string;
  tag: string;
}

export interface Challenge {
  prompt: string; // the headline / post / claim shown to the learner
  kind: string; // where it "appeared"
  options: string[];
  answer: number; // index of the best answer
  explain: string; // teaches the red flag after they answer
}

export const LESSONS: Lesson[] = [
  {
    title: "Read past the headline",
    minutes: 3,
    blurb: "Headlines are written to make you click. Learn to check whether the story actually backs up the claim.",
    tag: "Foundations",
  },
  {
    title: "Trace the source",
    minutes: 4,
    blurb: "Who published this, and how would you know if they're trustworthy? A quick routine for checking origin.",
    tag: "Sourcing",
  },
  {
    title: "Emotional language is a signal",
    minutes: 3,
    blurb: "Outrage and fear spread fastest. Spot the words designed to make you react before you think.",
    tag: "Manipulation",
  },
  {
    title: "Tells of AI-generated text & images",
    minutes: 5,
    blurb: "Too-smooth writing, invented sources, warped hands and text. What to look for, and what tools help.",
    tag: "AI content",
  },
  {
    title: "Reverse-search an image",
    minutes: 4,
    blurb: "That 'breaking' photo may be years old or from another country. How to check where an image really came from.",
    tag: "Verification",
  },
  {
    title: "Lateral reading",
    minutes: 4,
    blurb: "Don't dig deeper into one page — open new tabs and see what others say about it. The pro fact-checker move.",
    tag: "Technique",
  },
];

export const CHALLENGES: Challenge[] = [
  {
    prompt: "SHOCKING: Doctors HATE this one kitchen ingredient that melts belly fat overnight!!",
    kind: "Shared on WhatsApp",
    options: ["Reliable", "Needs checking", "Likely misleading"],
    answer: 2,
    explain:
      "Multiple red flags at once: all-caps shouting, an emotional hook ('SHOCKING'), a vague enemy ('Doctors HATE'), and a result that's too good to be true with no source or study named. Health claims promising overnight miracles almost never survive a cross-check.",
  },
  {
    prompt: "City council votes 6–3 to approve new bus routes, effective March. — Local Herald, with meeting minutes linked",
    kind: "Local news site",
    options: ["Reliable", "Needs checking", "Likely misleading"],
    answer: 0,
    explain:
      "Specific, checkable, and unemotional: a named outlet, an exact vote count, a date, and a link to primary evidence (the minutes). You could confirm every part independently. That's what solid reporting looks like.",
  },
  {
    prompt: "Photo of massive crowds captioned 'Protests in our capital TODAY' — but the image has old fashion and foreign signage.",
    kind: "Viral on X",
    options: ["Reliable", "Needs checking", "Likely misleading"],
    answer: 2,
    explain:
      "The caption claims 'today' and 'our capital', but the visual details (dated clothing, foreign-language signs) don't match. Recycled images with new captions are one of the most common misinformation tactics. A reverse image search would reveal the real origin.",
  },
  {
    prompt: "A study in the journal Nature finds urban trees lower nearby temperatures by 2–4°C. Author and DOI provided.",
    kind: "Science newsletter",
    options: ["Reliable", "Needs checking", "Likely misleading"],
    answer: 0,
    explain:
      "Named peer-reviewed journal, a specific measurable finding, and a DOI you can follow to the original paper. It invites verification instead of demanding belief. Still worth clicking through — but every signal here points to credible.",
  },
  {
    prompt: "BREAKING: Government to ban all private cars next year, insider reveals. Share before they delete this!",
    kind: "Facebook group",
    options: ["Reliable", "Needs checking", "Likely misleading"],
    answer: 2,
    explain:
      "'BREAKING', an anonymous 'insider', an extreme claim, and urgency to share before it's 'deleted' — that urgency is engineered to stop you from checking. Extraordinary policy claims would be covered by many named outlets. The absence of any is the tell.",
  },
];